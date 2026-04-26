package io.squid.cynapse.dto;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

public class TransportDTO {

    public static class NextDeparturesResponse {
        private String station;
        private String line;
        private Instant generatedAt;
        private String source;
        private boolean degraded;
        private String message;
        private List<Departure> departures = new ArrayList<>();

        public String getStation() {
            return station;
        }

        public void setStation(String station) {
            this.station = station;
        }

        public String getLine() {
            return line;
        }

        public void setLine(String line) {
            this.line = line;
        }

        public Instant getGeneratedAt() {
            return generatedAt;
        }

        public void setGeneratedAt(Instant generatedAt) {
            this.generatedAt = generatedAt;
        }

        public String getSource() {
            return source;
        }

        public void setSource(String source) {
            this.source = source;
        }

        public boolean isDegraded() {
            return degraded;
        }

        public void setDegraded(boolean degraded) {
            this.degraded = degraded;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }

        public List<Departure> getDepartures() {
            return departures;
        }

        public void setDepartures(List<Departure> departures) {
            this.departures = departures;
        }
    }

    public static class Departure {
        private String destination;
        private String expectedDepartureTime;
        private Long minutesUntilDeparture;
        private String platform;

        public String getDestination() {
            return destination;
        }

        public void setDestination(String destination) {
            this.destination = destination;
        }

        public String getExpectedDepartureTime() {
            return expectedDepartureTime;
        }

        public void setExpectedDepartureTime(String expectedDepartureTime) {
            this.expectedDepartureTime = expectedDepartureTime;
        }

        public Long getMinutesUntilDeparture() {
            return minutesUntilDeparture;
        }

        public void setMinutesUntilDeparture(Long minutesUntilDeparture) {
            this.minutesUntilDeparture = minutesUntilDeparture;
        }

        public String getPlatform() {
            return platform;
        }

        public void setPlatform(String platform) {
            this.platform = platform;
        }
    }
}

