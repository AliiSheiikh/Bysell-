package com.project.Bysell.service;

import com.project.Bysell.model.User;
import com.project.Bysell.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public User createUser(User user) {

        return userRepository.save(user);
    }
}
