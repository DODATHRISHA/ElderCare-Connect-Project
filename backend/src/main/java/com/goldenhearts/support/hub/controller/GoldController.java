
package com.goldenhearts.support.hub.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.goldenhearts.support.hub.model.GoldModel;
import com.goldenhearts.support.hub.repo.GoldenRepo;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class GoldController {

    @Autowired
    private GoldenRepo goldenRepo;

    @PostMapping("/CreateHome")
    public GoldModel createHome(@RequestBody GoldModel home) {
        if (home.getVerificationStatus() == null) {
            home.setVerificationStatus("PENDING");
        }
        return goldenRepo.save(home);
    }

    @GetMapping("/GetAllHome")
    public List<GoldModel> getAllHome() {
        return goldenRepo.findAll();
    }

    @GetMapping("/GetVerifiedHomes")
    public List<GoldModel> getVerifiedHomes() {
        return goldenRepo.findByVerificationStatusIgnoreCase("APPROVED");
    }

    @GetMapping("/GetHome/{id}")
    public GoldModel getHome(@PathVariable Long id) {
        return goldenRepo.findById(id).orElse(null);
    }

    @PutMapping("/UpdateHome/{id}")
    public GoldModel updateHome(
            @PathVariable Long id,
            @RequestBody GoldModel home) {

        if (!goldenRepo.existsById(id)) {
            return null;
        }

        home.setId(id);
        return goldenRepo.save(home);
    }

    @PutMapping("/ApproveHome/{id}")
    public GoldModel approveHome(@PathVariable Long id) {
        GoldModel home = goldenRepo.findById(id).orElse(null);

        if (home == null) {
            return null;
        }

        home.setVerificationStatus("APPROVED");
        return goldenRepo.save(home);
    }

    @DeleteMapping("/DeleteHome/{id}")
    public String deleteHome(@PathVariable Long id) {
        if (!goldenRepo.existsById(id)) {
            return "Home not found";
        }

        goldenRepo.deleteById(id);
        return "Home deleted successfully";
    }
}
