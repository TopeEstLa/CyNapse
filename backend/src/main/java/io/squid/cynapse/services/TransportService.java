package io.squid.cynapse.services;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.squid.cynapse.dto.TransportDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
public class TransportService {

    private final RestClient restClient;
    private final ObjectMapper objectMapper;

    @Value("${cynapse.transport.api-key:aaaaaaa}")
    private String apiKey;

    public TransportService() {
        this.objectMapper = new ObjectMapper();

        this.restClient = RestClient.builder()
                .build();
    }

    public TransportDTO.NextDeparturesResponse getNextRerA() {
        try {
            String responseBody = this.restClient.get()
                    .uri(buildStopMonitoringUri())
                    .header("apikey", this.apiKey)
                    .retrieve()
                    .body(String.class);

            return parseApiResponse(responseBody);
        } catch (Exception exception) {
            return null;
        }
    }



    public URI buildStopMonitoringUri() {
        UriComponentsBuilder builder = UriComponentsBuilder
                .fromUriString("https://prim.iledefrance-mobilites.fr/marketplace/stop-monitoring")
                .queryParam("MonitoringRef", "STIF:StopArea:SP:474151:")
                .queryParam("LineRef", "STIF:Line::C01742:");

        return builder.build(true).toUri();
    }

    TransportDTO.NextDeparturesResponse parseApiResponse(String responseBody) throws Exception {
        JsonNode root = objectMapper.readTree(responseBody == null ? "{}" : responseBody);

        TransportDTO.NextDeparturesResponse response = new TransportDTO.NextDeparturesResponse();
        response.setStation("Chatelet-Les Halles");
        response.setLine("RER A");
        response.setSource("idfm-prim");
        response.setGeneratedAt(Instant.now());
        response.setDegraded(false);
        response.setMessage("ok");

        List<TransportDTO.Departure> departures = extractDepartures(root);
        response.setDepartures(departures);

        if (departures.isEmpty()) {
            response.setMessage("Aucun depart trouve dans la reponse IDFM.");
        }

        return response;
    }

    List<TransportDTO.Departure> extractDepartures(JsonNode root) {
        List<TransportDTO.Departure> departures = new ArrayList<>();

        JsonNode deliveries = root.path("Siri").path("ServiceDelivery").path("StopMonitoringDelivery");
        if (!deliveries.isArray()) {
            return departures;
        }

        for (JsonNode delivery : deliveries) {
            JsonNode visits = delivery.path("MonitoredStopVisit");
            if (!visits.isArray()) {
                continue;
            }

            for (JsonNode visit : visits) {
                JsonNode journey = visit.path("MonitoredVehicleJourney");
                JsonNode monitoredCall = journey.path("MonitoredCall");

                String expectedTime = firstNonBlank(
                        monitoredCall.path("ExpectedDepartureTime").asText(),
                        monitoredCall.path("AimedDepartureTime").asText()
                );
                if (isBlank(expectedTime)) {
                    continue;
                }

                TransportDTO.Departure departure = new TransportDTO.Departure();
                departure.setDestination(extractTextValue(journey.path("DestinationName")));
                departure.setExpectedDepartureTime(expectedTime);
                departure.setPlatform(extractTextValue(monitoredCall.path("ArrivalPlatformName")));
                departure.setMinutesUntilDeparture(computeMinutesUntil(expectedTime));

                departures.add(departure);
            }
        }

        departures.sort(Comparator.comparing(TransportDTO.Departure::getExpectedDepartureTime, Comparator.nullsLast(String::compareTo)));
        return departures;
    }

    private Long computeMinutesUntil(String expectedTime) {
        try {
            Instant departureInstant = Instant.parse(expectedTime);
            long minutes = ChronoUnit.MINUTES.between(Instant.now(), departureInstant);
            return Math.max(0, minutes);
        } catch (Exception ignored) {
            return null;
        }
    }

    private String extractTextValue(JsonNode node) {
        if (node == null || node.isMissingNode() || node.isNull()) {
            return null;
        }

        if (node.isTextual()) {
            return node.asText();
        }

        if (node.isObject() && node.has("value")) {
            return node.path("value").asText();
        }

        if (node.isArray() && !node.isEmpty()) {
            JsonNode first = node.get(0);
            if (first != null && first.has("value")) {
                return first.path("value").asText();
            }
            if (first != null && first.isTextual()) {
                return first.asText();
            }
        }

        return null;
    }

    private String firstNonBlank(String... values) {
        for (String value : values) {
            if (!isBlank(value)) {
                return value;
            }
        }
        return null;
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

    private record CachedResponse(TransportDTO.NextDeparturesResponse response, Instant cachedAt) {
    }
}
