export const Role = {
    USER: 'USER',
    ADVANCED: 'ADVANCED',
    EXPERT: 'EXPERT',
    ADMIN: 'ADMIN',
};

export const DeviceType = {
    THERMOMETER: 'THERMOMETER',
    HUMIDITY_SENSOR: 'HUMIDITY_SENSOR',
    CO2_SENSOR: 'CO2_SENSOR',
    PEOPLE_COUNTER: 'PEOPLE_COUNTER',
    SMART_LIGHT: 'SMART_LIGHT',
    HEATER: 'HEATER',
};

export const SENSOR_TYPES = [
    DeviceType.THERMOMETER,
    DeviceType.HUMIDITY_SENSOR,
    DeviceType.CO2_SENSOR,
    DeviceType.PEOPLE_COUNTER
];

export const ACTUATOR_TYPES = [
    DeviceType.SMART_LIGHT,
    DeviceType.HEATER
];

export const MemberType = {
    STUDENT: 'STUDENT',
    TEACHER: 'TEACHER',
    RESEARCHER: 'RESEARCHER',
    STAFF: 'STAFF',
    DIRECTOR: 'DIRECTOR',
};

export const RoomStatus = {
    FREE: 'FREE',
    OCCUPIED: 'OCCUPIED',
};
