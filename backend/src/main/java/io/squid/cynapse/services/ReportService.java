package io.squid.cynapse.services;

import io.squid.cynapse.entities.ActuatorDevice;
import io.squid.cynapse.entities.ActuatorHistory;
import io.squid.cynapse.entities.Room;
import io.squid.cynapse.entities.SensorDevice;
import io.squid.cynapse.entities.SensorReading;
import io.squid.cynapse.enums.DeviceType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@SuppressWarnings("unused")
public class ReportService {

    private static final DateTimeFormatter DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    private final RoomService roomService;
    private final DeviceService deviceService;
    private final ActuatorDeviceService actuatorDeviceService;

    public ReportService(RoomService roomService,
                         DeviceService deviceService,
                         ActuatorDeviceService actuatorDeviceService) {
        this.roomService = roomService;
        this.deviceService = deviceService;
        this.actuatorDeviceService = actuatorDeviceService;
    }

    @Transactional(readOnly = true)
    public String buildSensorReport(Long sensorId) {
        SensorDevice sensor = this.deviceService.findById(sensorId);
        if (sensor == null) {
            return null;
        }

        List<SensorReading> readings = this.deviceService.getLastReadings(sensorId);
        StringBuilder report = new StringBuilder();

        report.append("SENSOR REPORT\n");
        report.append("==============\n\n");
        report.append("ID: ").append(sensor.getId()).append('\n');
        report.append("Name: ").append(sensor.getName()).append('\n');
        report.append("Type: ").append(sensor.getType()).append('\n');
        report.append("Status: ").append(sensor.getStatus()).append('\n');
        report.append("Room: ").append(sensor.getRoom() != null ? sensor.getRoom().getName() : "N/A").append('\n');
        report.append("Last seen: ").append(formatDate(sensor.getLastSeenAt())).append('\n');
        report.append("Readings analyzed: ").append(readings.size()).append('\n');

        if (readings.isEmpty()) {
            report.append("\nNo data is available for the last 200 readings.\n");
            report.append("Ideas: make sure the sensor is sending data and that the simulation or integration is active.\n");
            return report.toString();
        }

        Statistics statistics = this.computeStatistics(readings);
        report.append("Covered period: ")
                .append(formatDate(statistics.oldestTimestamp()))
                .append(" -> ")
                .append(formatDate(statistics.newestTimestamp()))
                .append('\n');
        report.append("Most frequent value: ")
                .append(formatValue(statistics.modeValue()))
                .append(" (")
                .append(statistics.modeCount())
                .append(" occurrence(s))\n");
        report.append("Average: ").append(formatValue(statistics.average())).append('\n');
        report.append("Minimum: ").append(formatValue(statistics.min())).append('\n');
        report.append("Maximum: ").append(formatValue(statistics.max())).append('\n');

        report.append("\nIdeas / interpretation:\n");
        for (String idea : this.buildSensorIdeas(sensor, statistics)) {
            report.append("- ").append(idea).append('\n');
        }

        return report.toString();
    }

    @Transactional(readOnly = true)
    public String buildActuatorReport(Long actuatorId) {
        ActuatorDevice actuator = this.actuatorDeviceService.findById(actuatorId);
        if (actuator == null) {
            return null;
        }

        List<ActuatorHistory> history = this.actuatorDeviceService.getLastHistory(actuatorId);
        List<ActuatorHistory> timeline = new ArrayList<>(history);
        timeline.sort(Comparator.comparing(ActuatorHistory::getCreatedAt));
        StringBuilder report = new StringBuilder();

        report.append("ACTUATOR REPORT\n");
        report.append("================\n\n");
        report.append("ID: ").append(actuator.getId()).append('\n');
        report.append("Name: ").append(actuator.getName()).append('\n');
        report.append("Type: ").append(actuator.getType()).append('\n');
        report.append("Status: ").append(actuator.getStatus()).append('\n');
        report.append("Room: ").append(actuator.getRoom() != null ? actuator.getRoom().getName() : "N/A").append('\n');
        report.append("Current state: ").append(Objects.toString(actuator.getCurrentState(), "N/A")).append('\n');
        report.append("History analyzed: ").append(history.size()).append(" change(s)\n");

        if (history.isEmpty()) {
            report.append("\nNo history is available for the last 200 actions.\n");
            report.append("Ideas: make sure automation or manual actions are properly recording state changes.\n");
            return report.toString();
        }

        report.append("Covered period: ")
                .append(formatDate(history.getLast().getCreatedAt()))
                .append(" -> ")
                .append(formatDate(history.getFirst().getCreatedAt()))
                .append('\n');

        Map<String, Long> stateCounts = history.stream()
                .collect(Collectors.groupingBy(ActuatorHistory::getValue, Collectors.counting()));

        Map<Integer, Long> changeByHour = history.stream()
                .collect(Collectors.groupingBy(entry -> entry.getCreatedAt().getHour(), Collectors.counting()));

        Map.Entry<String, Long> mostUsedState = stateCounts.entrySet().stream()
                .max(Comparator.comparingLong(Map.Entry::getValue))
                .orElse(null);

        report.append("Most used state: ");
        if (mostUsedState != null) {
            report.append(mostUsedState.getKey())
                    .append(" (")
                    .append(mostUsedState.getValue())
                    .append(" occurrence(s))\n");
        } else {
            report.append("N/A\n");
        }

        report.append("\nState distribution:\n");
        stateCounts.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .forEach(entry -> report.append("- ")
                        .append(entry.getKey())
                        .append(": ")
                        .append(entry.getValue())
                        .append(" times\n"));

        report.append("\nHours when state changes the most:\n");
        this.topHours(changeByHour).forEach(hourStat -> report.append("- ")
                .append(String.format(Locale.US, "%02dh00", hourStat.hour()))
                .append(": ")
                .append(hourStat.count())
                .append(" change(s)\n"));

        EnergyUsage energyUsage = this.computeActuatorEnergyUsage(actuator, timeline);
        report.append("\nEnergy usage estimate:\n");
        report.append("- Nominal consumption: ")
                .append(formatValue(actuator.getElectricityConsumption()))
                .append(" kW when state is ON\n");
        report.append("- Time spent ON (from history): ")
                .append(formatDuration(energyUsage.timeOn()))
                .append('\n');
        report.append("- Estimated energy: ")
                .append(formatValue(energyUsage.energyKwh()))
                .append(" kWh\n");
        report.append("\nEnergy analysis:\n");
        report.append("- Observation window is based on the last ")
                .append(history.size())
                .append(" state changes only; older periods are not included.\n");
        if (energyUsage.timeOn().isZero()) {
            report.append("- The actuator was not ON during the analyzed timeline, so energy use is near zero.\n");
        } else if (energyUsage.onRatio() >= 0.70d) {
            report.append("- The actuator stays ON most of the time; this can drive energy costs up.\n");
        } else if (energyUsage.onRatio() >= 0.30d) {
            report.append("- The actuator has moderate ON usage; consider schedule tuning if needed.\n");
        } else {
            report.append("- The actuator is ON for short periods; current behavior is energy-efficient.\n");
        }

        return report.toString();
    }

    private EnergyUsage computeActuatorEnergyUsage(ActuatorDevice actuator, List<ActuatorHistory> timeline) {
        if (timeline.isEmpty()) {
            return new EnergyUsage(Duration.ZERO, 0.0, 0.0);
        }

        Duration timeOn = Duration.ZERO;
        Duration totalWindow = Duration.ZERO;

        for (int i = 0; i < timeline.size() - 1; i++) {
            ActuatorHistory current = timeline.get(i);
            ActuatorHistory next = timeline.get(i + 1);
            Duration segment = Duration.between(current.getCreatedAt(), next.getCreatedAt());
            if (!segment.isNegative()) {
                totalWindow = totalWindow.plus(segment);
                if (isOnState(current.getValue())) {
                    timeOn = timeOn.plus(segment);
                }
            }
        }

        ActuatorHistory last = timeline.getLast();
        Duration tailSegment = Duration.between(last.getCreatedAt(), LocalDateTime.now());
        if (!tailSegment.isNegative()) {
            totalWindow = totalWindow.plus(tailSegment);
            if (isOnState(last.getValue())) {
                timeOn = timeOn.plus(tailSegment);
            }
        }

        double onHours = timeOn.toMillis() / 3_600_000.0;
        double energyKwh = onHours * actuator.getElectricityConsumption();
        double onRatio = totalWindow.isZero() ? 0.0 : (double) timeOn.toMillis() / (double) totalWindow.toMillis();
        return new EnergyUsage(timeOn, energyKwh, onRatio);
    }

    private boolean isOnState(String state) {
        return state != null && "ON".equalsIgnoreCase(state.trim());
    }

    private String formatDuration(Duration duration) {
        long totalMinutes = Math.max(duration.toMinutes(), 0);
        long hours = totalMinutes / 60;
        long minutes = totalMinutes % 60;
        return hours + "h " + String.format(Locale.US, "%02dm", minutes);
    }

    @Transactional(readOnly = true)
    public String buildRoomReport(Long roomId) {
        Room room = this.roomService.findById(roomId);
        if (room == null) {
            return null;
        }

        List<SensorDevice> sensors = this.deviceService.findByRoomId(roomId);
        List<ActuatorDevice> actuators = this.actuatorDeviceService.findByRoomId(roomId);
        List<SensorDevice> populationSensors = sensors.stream()
                .filter(sensor -> sensor.getType() == DeviceType.PEOPLE_COUNTER)
                .toList();

        List<SensorReading> populationReadings = new ArrayList<>();
        for (SensorDevice sensor : populationSensors) {
            populationReadings.addAll(this.deviceService.getLastReadings(sensor.getId()));
        }
        populationReadings.sort(Comparator.comparing(SensorReading::getCapturedAt));

        StringBuilder report = new StringBuilder();
        report.append("ROOM REPORT\n");
        report.append("===========\n\n");
        report.append("ID: ").append(room.getId()).append('\n');
        report.append("Name: ").append(room.getName()).append('\n');
        report.append("Floor: ").append(room.getFloorNumber()).append('\n');
        report.append("Capacity: ").append(room.getCapacity()).append('\n');
        report.append("Status: ").append(room.getStatus()).append('\n');
        report.append("Sensor count: ").append(sensors.size()).append('\n');
        report.append("Actuator count: ").append(actuators.size()).append('\n');
        report.append("Population sensors: ").append(populationSensors.size()).append('\n');

        if (populationReadings.isEmpty()) {
            report.append("\nNo population data is available for this room.\n");
            report.append("Ideas: make sure at least one PEOPLE_COUNTER sensor is sending readings so occupancy can be calculated.\n");
            return report.toString();
        }

        double averagePeople = populationReadings.stream().mapToDouble(SensorReading::getValue).average().orElse(0.0);
        long occupiedReadings = populationReadings.stream().filter(reading -> reading.getValue() > 0).count();
        double occupancyRate = (occupiedReadings * 100.0) / populationReadings.size();

        report.append("\nPopulation data analyzed: ").append(populationReadings.size()).append(" reading(s)\n");
        report.append("Covered period: ")
                .append(formatDate(populationReadings.getLast().getCapturedAt()))
                .append(" -> ")
                .append(formatDate(populationReadings.getFirst().getCapturedAt()))
                .append('\n');
        report.append("Occupancy rate: ").append(formatValue(occupancyRate)).append("%\n");
        report.append("Average number of people: ").append(formatValue(averagePeople)).append('\n');

        report.append("\nPeak hours:\n");
        this.topHoursFromReadings(populationReadings).forEach(hourStat -> report.append("- ")
                .append(String.format(Locale.US, "%02dh00", hourStat.hour()))
                .append(": average of ")
                .append(formatValue(hourStat.average()))
                .append(" person(s) over ")
                .append(hourStat.count())
                .append(" reading(s)\n"));

        report.append("\nIdeas / interpretation:\n");
        if (occupancyRate >= 70) {
            report.append("- The room is heavily used: consider scheduling slots or adjusting capacity.\n");
        } else if (occupancyRate >= 40) {
            report.append("- Usage is moderate: monitor the busiest time slots.\n");
        } else {
            report.append("- The room is lightly occupied: automation can prioritize energy savings.\n");
        }
        if (averagePeople > room.getCapacity()) {
            report.append("- The average number of people exceeds capacity: beware of overcrowding.\n");
        } else if (averagePeople > room.getCapacity() * 0.8) {
            report.append("- Average occupancy is approaching capacity: plan ahead for demand.\n");
        }

        return report.toString();
    }

    private Statistics computeStatistics(List<SensorReading> readings) {
        List<SensorReading> ordered = new ArrayList<>(readings);
        ordered.sort(Comparator.comparing(SensorReading::getCapturedAt));

        double min = ordered.stream().mapToDouble(SensorReading::getValue).min().orElse(0.0);
        double max = ordered.stream().mapToDouble(SensorReading::getValue).max().orElse(0.0);
        double average = ordered.stream().mapToDouble(SensorReading::getValue).average().orElse(0.0);

        Map<Double, Long> frequency = ordered.stream()
                .collect(Collectors.groupingBy(SensorReading::getValue, Collectors.counting()));
        Map.Entry<Double, Long> mostFrequent = frequency.entrySet().stream()
                .max(Comparator.<Map.Entry<Double, Long>>comparingLong(Map.Entry::getValue)
                        .thenComparingDouble(Map.Entry::getKey))
                .orElse(null);

        LocalDateTime oldestTimestamp = ordered.getFirst().getCapturedAt();
        LocalDateTime newestTimestamp = ordered.getLast().getCapturedAt();
        double modeValue = mostFrequent == null ? 0.0 : mostFrequent.getKey();
        long modeCount = mostFrequent == null ? 0 : mostFrequent.getValue();

        return new Statistics(min, max, average, modeValue, modeCount, oldestTimestamp, newestTimestamp, frequency);
    }

    private List<String> buildSensorIdeas(SensorDevice sensor, Statistics statistics) {
        List<String> ideas = new ArrayList<>();
        DeviceType type = sensor.getType();
        double average = statistics.average();
        double min = statistics.min();
        double max = statistics.max();

        switch (type) {
            case THERMOMETER -> {
                if (average > 28 || max > 30) {
                    ideas.add("High temperature: consider cooling or better ventilation.");
                } else if (average < 18 || min < 15) {
                    ideas.add("Low temperature: check heating or room insulation.");
                } else {
                    ideas.add("Temperature is generally stable: the current setup looks good.");
                }
            }
            case HUMIDITY_SENSOR -> {
                if (average < 30 || min < 30) {
                    ideas.add("Low humidity: consider a humidifier or ventilation adjustment.");
                } else if (average > 70 || max > 70) {
                    ideas.add("High humidity: reduce ambient moisture to avoid discomfort.");
                } else {
                    ideas.add("Humidity is generally fine: no major adjustment is needed.");
                }
            }
            case CO2_SENSOR -> {
                if (average > 1000 || max > 1000) {
                    ideas.add("High CO2: improve the room ventilation.");
                } else {
                    ideas.add("Air quality looks good: keep an eye on possible spikes.");
                }
            }
            case PEOPLE_COUNTER -> {
                Room room = sensor.getRoom();
                if (room != null && average > room.getCapacity() * 0.8) {
                    ideas.add("Occupancy is close to capacity: consider stricter flow management.");
                } else if (average <= 0) {
                    ideas.add("No presence detected during the period: the room appears empty.");
                } else {
                    ideas.add("Moderate presence: automation can remain in standard mode.");
                }
            }
            default -> ideas.add("No specific recommendation is defined for this sensor type.");
        }

        ideas.add("Most frequent observed value: " + formatValue(statistics.modeValue()) + ".");
        return ideas;
    }

    private List<HourStat> topHours(Map<Integer, Long> values) {
        return values.entrySet().stream()
                .map(entry -> new HourStat(entry.getKey(), entry.getValue(), entry.getValue()))
                .sorted(Comparator.comparingLong(HourStat::count).reversed())
                .limit(3)
                .toList();
    }

    private List<HourStat> topHoursFromReadings(List<SensorReading> readings) {
        Map<Integer, List<Double>> valuesByHour = new HashMap<>();
        for (SensorReading reading : readings) {
            valuesByHour.computeIfAbsent(reading.getCapturedAt().getHour(), ignored -> new ArrayList<>()).add(reading.getValue());
        }

        return valuesByHour.entrySet().stream()
                .map(entry -> new HourStat(entry.getKey(), entry.getValue().stream().mapToDouble(Double::doubleValue).average().orElse(0.0), entry.getValue().size()))
                .sorted(Comparator.comparingDouble(HourStat::average).reversed()
                        .thenComparing(Comparator.comparingLong(HourStat::count).reversed()))
                .limit(3)
                .toList();
    }

    private String formatDate(LocalDateTime dateTime) {
        return dateTime == null ? "N/A" : DATE_TIME_FORMATTER.format(dateTime);
    }

    private String formatValue(double value) {
        if (Double.isNaN(value) || Double.isInfinite(value)) {
            return "N/A";
        }

        double rounded = Math.rint(value);
        if (Math.abs(value - rounded) < 0.0001d) {
            return String.valueOf((long) rounded);
        }

        return String.format(Locale.US, "%.2f", value);
    }

    private record Statistics(double min,
                              double max,
                              double average,
                              double modeValue,
                              long modeCount,
                              LocalDateTime oldestTimestamp,
                              LocalDateTime newestTimestamp,
                              Map<Double, Long> frequency) {
    }

    private record HourStat(int hour, double average, long count) {
    }

    private record EnergyUsage(Duration timeOn, double energyKwh, double onRatio) {
    }
}



