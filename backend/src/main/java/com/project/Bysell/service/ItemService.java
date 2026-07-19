package com.project.Bysell.service;

import com.project.Bysell.model.Item;
import com.project.Bysell.model.ItemStatus;
import com.project.Bysell.model.User;
import com.project.Bysell.repository.ItemRepository;
import com.project.Bysell.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class ItemService {

    private final ItemRepository itemRepository;
    private final UserRepository userRepository;

    @Autowired
    public ItemService(ItemRepository itemRepository, UserRepository userRepository) {
        this.itemRepository = itemRepository;
        this.userRepository = userRepository;
    }

    public Item createItem(Item item, Long ownerId) {
        User owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found with id: " + ownerId));

        item.setOwner(owner);
        return itemRepository.save(item);
    }

    public List<Item> getAvailableItems() {
        return itemRepository.findByStatus(ItemStatus.AVAILABLE);
    }

    public Item getItemById(Long id) {
        return itemRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Item not found with id: " + id));
    }
}
