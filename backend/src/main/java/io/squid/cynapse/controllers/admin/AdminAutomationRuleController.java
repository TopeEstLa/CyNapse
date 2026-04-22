package io.squid.cynapse.controllers.admin;

import io.squid.cynapse.dto.AutomationDTO;
import io.squid.cynapse.services.AutomationRuleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/automation")
@PreAuthorize("@authService.hasRequiredRole('ADMIN')")
public class AdminAutomationRuleController {

    @Autowired
    private AutomationRuleService automationRuleService;

    @GetMapping("/list")
    public ResponseEntity<List<AutomationDTO.RuleResponse>> listRules(@RequestParam(value = "actuatorDeviceId", required = false) Long actuatorDeviceId) {
        return ResponseEntity.ok(this.automationRuleService.findAll(actuatorDeviceId));
    }

    @GetMapping("/get")
    public ResponseEntity<?> getRule(@RequestParam("id") long ruleId) {
        AutomationDTO.RuleResponse rule = this.automationRuleService.findById(ruleId);
        if (rule == null) {
            return ResponseEntity.badRequest().body("Rule not found");
        }

        return ResponseEntity.ok(rule);
    }

    @PostMapping("/create")
    public ResponseEntity<?> createRule(@RequestBody AutomationDTO.RulePayload payload) {
        AutomationDTO.RuleResponse createdRule = this.automationRuleService.create(payload);
        if (createdRule == null) {
            return ResponseEntity.badRequest().body("Invalid payload or actuator not found");
        }

        return ResponseEntity.ok(createdRule);
    }

    @PostMapping("/update")
    public ResponseEntity<?> updateRule(@RequestBody AutomationDTO.RulePayload payload) {
        AutomationDTO.RuleResponse updatedRule = this.automationRuleService.update(payload);
        if (updatedRule == null) {
            return ResponseEntity.badRequest().body("Invalid payload or rule not found");
        }

        return ResponseEntity.ok(updatedRule);
    }

    @PostMapping("/evaluate-now")
    public ResponseEntity<?> evaluateNow(@RequestParam("id") Long ruleId) {
        AutomationDTO.RuleResponse updatedRule = this.automationRuleService.evaluateNow(ruleId);
        if (updatedRule == null) {
            return ResponseEntity.badRequest().body("Rule not found");
        }

        return ResponseEntity.ok(updatedRule);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteRule(@RequestParam("id") Long ruleId) {
        if (!this.automationRuleService.delete(ruleId)) {
            return ResponseEntity.badRequest().body("Rule not found");
        }

        return ResponseEntity.ok("Rule deleted");
    }
}

