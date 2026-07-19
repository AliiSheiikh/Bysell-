package com.project.Bysell.service;

import com.project.Bysell.model.User;
import com.project.Bysell.repository.ItemRepository;
import com.project.Bysell.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final ItemRepository itemRepository;

    @Autowired
    public UserService(UserRepository userRepository, ItemRepository itemRepository) {
        this.userRepository = userRepository;
        this.itemRepository = itemRepository;
    }

    public User createUser(User user) {
        return userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found with id: " + id));
    }

    public User updateUser(Long id, Long requesterId, String firstName, String lastName, String email, String phoneNumber) {
        User user = getUserById(id);

        if (!id.equals(requesterId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only edit your own profile");
        }

        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setEmail(email);
        user.setPhoneNumber(phoneNumber);

        return userRepository.save(user);
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
}
