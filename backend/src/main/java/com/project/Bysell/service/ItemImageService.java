package com.project.Bysell.service;

import com.project.Bysell.model.Item;
import com.project.Bysell.model.ItemImage;
import com.project.Bysell.repository.ItemImageRepository;
import com.project.Bysell.repository.ItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class ItemImageService {

    private static final Map<String, String> ALLOWED_IMAGE_TYPES = Map.of(
            "image/jpeg", ".jpg",
            "image/png", ".png",
            "image/gif", ".gif",
            "image/webp", ".webp");

    private final ItemImageRepository itemImageRepository;
    private final ItemRepository itemRepository;

    @Value("${app.upload-dir}")
    private String uploadDir;

    @Autowired
    public ItemImageService(ItemImageRepository itemImageRepository, ItemRepository itemRepository) {
        this.itemImageRepository = itemImageRepository;
        this.itemRepository = itemRepository;
    }

    public ItemImage uploadImage(Long itemId, MultipartFile file, Long requesterId) {
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Item not found with id: " + itemId));

        if (!item.getOwner().getId().equals(requesterId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only the owner can upload images for this item");
        }

        String extension = ALLOWED_IMAGE_TYPES.get(file.getContentType());
        if (extension == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Only JPEG, PNG, GIF, or WebP images are allowed");
        }

        try {
            Path uploadPath = Path.of(uploadDir);
            Files.createDirectories(uploadPath);

            String filename = UUID.randomUUID() + extension;

            Files.copy(file.getInputStream(), uploadPath.resolve(filename));

            ItemImage image = ItemImage.builder()
                    .item(item)
                    .imageUrl("/images/" + filename)
                    .build();

            return itemImageRepository.save(image);
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to store image", e);
        }
    }

    public List<ItemImage> getImagesForItem(Long itemId) {
        return itemImageRepository.findByItemId(itemId);
    }

    public void deleteImage(Long itemId, Long imageId, Long requesterId) {
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Item not found with id: " + itemId));

        if (!item.getOwner().getId().equals(requesterId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only the owner can delete this item's images");
        }

        ItemImage image = itemImageRepository.findById(imageId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Image not found with id: " + imageId));

        if (!image.getItem().getId().equals(itemId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Image not found for this item");
        }

        String filename = image.getImageUrl().replace("/images/", "");
        try {
            Files.deleteIfExists(Path.of(uploadDir, filename));
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to delete image file", e);
        }

        itemImageRepository.delete(image);
    }

    public void deleteImagesForItem(Long itemId) {
        List<ItemImage> images = itemImageRepository.findByItemId(itemId);

        for (ItemImage image : images) {
            String filename = image.getImageUrl().replace("/images/", "");
            try {
                Files.deleteIfExists(Path.of(uploadDir, filename));
            } catch (IOException ignored) {
                // best-effort: a stray file we can't remove shouldn't block deleting the item's records
            }
        }

        itemImageRepository.deleteAll(images);
    }
}
