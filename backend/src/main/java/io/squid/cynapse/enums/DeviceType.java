package io.squid.cynapse.enums;


import io.squid.cynapse.entities.Alert;
import io.squid.cynapse.entities.Room;

public enum DeviceType {

    THERMOMETER(true) {
        @Override
        public Alert tryCreateAlert(Room room, double currentValue) {
            if (currentValue < 15) {
                return new Alert(room, AlertSeverity.MEDIUM, "Temperature is too low: " + currentValue + "°C", null);
            } else if (currentValue > 30) {
                return new Alert(room, AlertSeverity.MEDIUM, "Temperature is too high: " + currentValue + "°C", null);
            }
            return null;
        }
    },
    HUMIDITY_SENSOR(true) {
        @Override
        public Alert tryCreateAlert(Room room, double currentValue) {
            if (currentValue < 30) {
                return new Alert(room, AlertSeverity.LOW, "Humidity is too low: " + currentValue + "%", null);
            } else if (currentValue > 70) {
                return new Alert(room, AlertSeverity.LOW, "Humidity is too high: " + currentValue + "%", null);
            }
            return null;
        }
    },
    CO2_SENSOR(true) {
        @Override
        public Alert tryCreateAlert(Room room, double currentValue) {
            if (currentValue > 1000) {
                return new Alert(room, AlertSeverity.HIGH, "CO2 level is too high: " + currentValue + " ppm", null);
            }
            return null;
        }
    },
    PEOPLE_COUNTER(true) {
        @Override
        public Alert tryCreateAlert(Room room, double currentValue) {
            if (currentValue > room.getCapacity()) {
                return new Alert(room, AlertSeverity.HIGH, "Room occupancy exceeded: " + currentValue + "/" + room.getCapacity(), null);
            }
            return null;
        }
    },


    SMART_LIGHT(false),
    HEATER(false);

    private final boolean sensor;

    DeviceType(boolean sensor) {
        this.sensor = sensor;
    }

    public Alert tryCreateAlert(Room room, double currentValue) {
        return null;
    }

    public boolean isSensor() {
        return sensor;
    }



}

