
package com.goldenhearts.support.hub.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.goldenhearts.support.hub.model.GoldModel;

public interface GoldenRepo extends JpaRepository<GoldModel, Long> {

    List<GoldModel> findByVerificationStatusIgnoreCase(String status);

    List<GoldModel> findByOwnerEmailIgnoreCase(String ownerEmail);
}