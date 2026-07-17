package com.project.Bysell.repository;

import com.project.Bysell.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}
