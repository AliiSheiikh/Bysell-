package com.project.Bysell.service;

import com.project.Bysell.model.User;
import com.project.Bysell.repository.ItemRepository;
import com.project.Bysell.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final ItemRepository itemRepository;
    private final PasswordEncoder passwordEncoder;
    private final LoginRateLimiter loginRateLimiter;

    @Autowired
    public UserService(UserRepository userRepository, ItemRepository itemRepository, PasswordEncoder passwordEncoder,
                        LoginRateLimiter loginRateLimiter) {
        this.userRepository = userRepository;
        this.itemRepository = itemRepository;
        this.passwordEncoder = passwordEncoder;
        this.loginRateLimiter = loginRateLimiter;
    }

    public User createUser(User user, String rawPassword) {
        user.setPasswordHash(passwordEncoder.encode(rawPassword));
        return userRepository.save(user);
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found with id: " + id));
    }

    public User updateUser(Long id, Long requesterId, String firstName, String lastName, String phoneNumber) {
        User user = getUserById(id);

        if (!id.equals(requesterId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only edit your own profile");
        }

        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setPhoneNumber(phoneNumber);

        return userRepository.save(user);
    }

    public void changePassword(Long id, Long requesterId, String currentPassword, String newPassword) {
        User user = getUserById(id);

        if (!id.equals(requesterId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only change your own password");
        }

        if (!passwordEncoder.matches(currentPassword, user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Current password is incorrect");
        }

        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    public void deleteUser(Long id, Long requesterId) {
        User user = getUserById(id);

        if (!id.equals(requesterId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only delete your own profile");
        }

        if (itemRepository.existsByOwnerId(id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Cannot delete a user who still has listed items");
        }

        userRepository.delete(user);
    }

    public User login(String email, String rawPassword) {
        loginRateLimiter.checkAllowed(email);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> {
                    loginRateLimiter.recordFailure(email);
                    return new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
                });

        if (!passwordEncoder.matches(rawPassword, user.getPasswordHash())) {
            loginRateLimiter.recordFailure(email);
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }

        loginRateLimiter.recordSuccess(email);
        return user;
    }
}
