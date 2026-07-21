package com.project.Bysell.service;

import com.project.Bysell.model.Item;
import com.project.Bysell.model.ItemCategory;
import com.project.Bysell.model.ItemStatus;
import com.project.Bysell.model.User;
import com.project.Bysell.repository.ItemRepository;
import com.project.Bysell.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;

@Service
public class ItemService {

    private final ItemRepository itemRepository;
    private final UserRepository userRepository;
    private final ItemImageService itemImageService;

    @Autowired
    public ItemService(ItemRepository itemRepository, UserRepository userRepository, ItemImageService itemImageService) {
        this.itemRepository = itemRepository;
        this.userRepository = userRepository;
        this.itemImageService = itemImageService;
    }

    public Item createItem(Item item, Long ownerId) {
        User owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found with id: " + ownerId));

        item.setOwner(owner);
        return itemRepository.save(item);
    }

    public List<Item> searchItems(String keyword, ItemCategory category, BigDecimal minPrice, BigDecimal maxPrice) {
        return itemRepository.search(keyword, category, minPrice, maxPrice);
    }

    public Item getItemById(Long id) {
        return itemRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Item not found with id: " + id));
    }

    public Item updateItem(Long id, Long requesterId, String title, String description, BigDecimal price, ItemCategory category) {
        Item item = getItemById(id);

        if (!item.getOwner().getId().equals(requesterId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only the owner can edit this item");
        }

        item.setTitle(title);
        item.setDescription(description);
        item.setPrice(price);
        item.setCategory(category);

        return itemRepository.save(item);
    }

    @Transactional
    public void deleteItem(Long id, Long requesterId) {
        Item item = getItemById(id);

        if (!item.getOwner().getId().equals(requesterId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only the owner can delete this item");
        }

        itemImageService.deleteImagesForItem(id);
        itemRepository.delete(item);
    }
}
