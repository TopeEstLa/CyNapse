package io.squid.cynapse.enums;


public enum DeviceType {

    THERMOMETER(true, 0.0),
    HUMIDITY_SENSOR(true, 0.0),
    CO2_SENSOR(true, 0.0),
    PEOPLE_COUNTER(true, 0.0),


    SMART_LIGHT(false, 10.0),
    HEATER(false, 50.0);

    private final boolean sensor;
    private final double electricityConsumption; //in kW

    DeviceType(boolean sensor, double electricityConsumption) {
        this.sensor = sensor;
        this.electricityConsumption = electricityConsumption;
    }

    public boolean isSensor() {
        return sensor;
    }

    public double getElectricityConsumption() {
        return electricityConsumption;
    }
}

