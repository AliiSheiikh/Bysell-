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
import java.util.UUID;

@Service
public class ItemImageService {

    private final ItemImageRepository itemImageRepository;
    private final ItemRepository itemRepository;

    @Value("${app.upload-dir}")
    private String uploadDir;

    @Autowired
    public ItemImageService(ItemImageRepository itemImageRepository, ItemRepository itemRepository) {
        this.itemImageRepository = itemImageRepository;
        this.itemRepository = itemRepository;
    }

    public ItemImage uploadImage(Long itemId, MultipartFile file) {
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Item not found with id: " + itemId));

        try {
            Path uploadPath = Path.of(uploadDir);
            Files.createDirectories(uploadPath);

            String extension = "";
            String originalFilename = file.getOriginalFilename();
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf('.'));
            }
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
}
