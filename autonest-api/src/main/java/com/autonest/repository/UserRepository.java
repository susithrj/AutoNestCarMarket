package com.autonest.repository;

import com.autonest.model.User;
import com.autonest.model.enums.Role;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
  Optional<User> findByEmail(String email);

  Optional<User> findByUsername(String username);

  Optional<User> findFirstByRole(Role role);

  boolean existsByEmail(String email);

  boolean existsByUsername(String username);
}

