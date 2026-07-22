package com.project.Bysell.service;

import com.project.Bysell.model.Item;
import com.project.Bysell.model.ItemCategory;
import com.project.Bysell.model.ItemStatus;
import com.project.Bysell.model.User;
import com.project.Bysell.repository.ItemRepository;
import com.project.Bysell.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;

@Service
public class ItemService {

    private static final int MIN_IMAGES = 1;
    private static final int MAX_IMAGES = 8;

    private final ItemRepository itemRepository;
    private final UserRepository userRepository;
    private final ItemImageService itemImageService;

    @Autowired
    public ItemService(ItemRepository itemRepository, UserRepository userRepository, ItemImageService itemImageService) {
        this.itemRepository = itemRepository;
        this.userRepository = userRepository;
        this.itemImageService = itemImageService;
    }

    public Item createItem(Item item, Long ownerId, List<MultipartFile> images) {
        if (images == null || images.size() < MIN_IMAGES) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "At least one image is required");
        }
        if (images.size() > MAX_IMAGES) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A maximum of " + MAX_IMAGES + " images is allowed");
        }
        itemImageService.validateImageTypes(images);

        User owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found with id: " + ownerId));

        item.setOwner(owner);
        Item savedItem = itemRepository.save(item);

        itemImageService.storeImagesForNewItem(savedItem, images);

        return savedItem;
    }

    public Page<Item> searchItems(String keyword, ItemCategory category, BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable) {
        return itemRepository.search(keyword, category, minPrice, maxPrice, pageable);
    }

    public Page<Item> getItemsByOwner(Long ownerId, Pageable pageable) {
        return itemRepository.findByOwnerId(ownerId, pageable);
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
