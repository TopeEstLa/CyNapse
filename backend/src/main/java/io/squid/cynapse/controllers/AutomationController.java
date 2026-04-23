package io.squid.cynapse.controllers;

import io.squid.cynapse.dto.AutomationDTO;
import io.squid.cynapse.services.AutomationRuleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * @author TopeEstLa
 * Read-only endpoints for frontend to view automation rules
 */
@RestController
@RequestMapping("/api/automation")
public class AutomationController {

    @Autowired
    private AutomationRuleService automationRuleService;

    /**
     * Get all automation rules or rules for a specific actuator device
     *
     * @param actuatorDeviceId optional actuator device ID to filter rules
     * @return List of automation rules
     */
    @GetMapping("/list")
    public ResponseEntity<List<AutomationDTO.RuleResponse>> listRules(
            @RequestParam(value = "actuatorDeviceId", required = false) Long actuatorDeviceId) {
        return ResponseEntity.ok(this.automationRuleService.findAll(actuatorDeviceId));
    }

    /**
     * Get a specific automation rule
     *
     * @param ruleId the ID of the automation rule
     * @return Rule details or error if not found
     */
    @GetMapping("/get")
    public ResponseEntity<?> getRule(@RequestParam("id") long ruleId) {
        AutomationDTO.RuleResponse rule = this.automationRuleService.findById(ruleId);
        if (rule == null) {
            return ResponseEntity.badRequest().body("Rule not found");
        }
        return ResponseEntity.ok(rule);
    }
}
