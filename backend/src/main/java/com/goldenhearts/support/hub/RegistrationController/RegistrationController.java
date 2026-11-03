
package com.goldenhearts.support.hub.RegistrationController;

import com.goldenhearts.support.hub.RegistrationModel.RegistrationModel;
import com.goldenhearts.support.hub.RegistrationRepo.RegistrationRepo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class RegistrationController {

    @Autowired
    private RegistrationRepo registrationRepo;

    // Create Registration
    @PostMapping("/CreateRegistration")
    public ResponseEntity<?> createRegistration(
            @ModelAttribute RegistrationModel registration) {

        registration.setStatus("PENDING");

        RegistrationModel saved =
                registrationRepo.save(registration);

        return ResponseEntity.ok(saved);
    }

    // Get All Registrations
    @GetMapping("/GetAllRegistrations")
    public List<RegistrationModel> getAllRegistrations() {

        return registrationRepo.findAll();
    }

    // Get Registration By ID
    @GetMapping("/GetRegistration/{id}")
    public ResponseEntity<?> getRegistration(
            @PathVariable Long id) {

        return registrationRepo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Update Registration Details
    @PutMapping("/UpdateRegistration/{id}")
    public ResponseEntity<?> updateRegistration(
            @PathVariable Long id,
            @RequestBody RegistrationModel updatedData) {

        return registrationRepo.findById(id)
                .map(registration -> {

                    registration.setApplicantName(
                            updatedData.getApplicantName());

                    registration.setAge(
                            updatedData.getAge());

                    registration.setAddress(
                            updatedData.getAddress());

                    registration.setPhoneNumber(
                            updatedData.getPhoneNumber());

                    registration.setGuardianName(
                            updatedData.getGuardianName());

                    registration.setGuardianRelationship(
                            updatedData.getGuardianRelationship());

                    registration.setGuardianPhoneNumber(
                            updatedData.getGuardianPhoneNumber());

                    registration.setSecondContactName(
                            updatedData.getSecondContactName());

                    registration.setSecondContactRelationship(
                            updatedData.getSecondContactRelationship());

                    registration.setSecondContactPhoneNumber(
                            updatedData.getSecondContactPhoneNumber());

                    registration.setSupportRequired(
                            updatedData.getSupportRequired());

                    return ResponseEntity.ok(
                            registrationRepo.save(registration));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Update Registration Status
    @PutMapping("/UpdateRegistrationStatus/{id}")
    public ResponseEntity<?> updateRegistrationStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        return registrationRepo.findById(id)
                .map(registration -> {

                    registration.setStatus(status);

                    return ResponseEntity.ok(
                            registrationRepo.save(registration));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Delete Registration
    @DeleteMapping("/DeleteRegistration/{id}")
    public ResponseEntity<?> deleteRegistration(
            @PathVariable Long id) {

        if (!registrationRepo.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        registrationRepo.deleteById(id);

        return ResponseEntity.ok(
                "Registration deleted successfully");
    }
}
