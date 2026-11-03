
package com.goldenhearts.support.hub.RegistrationRepo;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.goldenhearts.support.hub.RegistrationModel.RegistrationModel;

public interface RegistrationRepo extends JpaRepository<RegistrationModel, Long> {

    List<RegistrationModel> findByHomeId(Long homeId);

    List<RegistrationModel> findByOwnerEmailIgnoreCase(String ownerEmail);
}
