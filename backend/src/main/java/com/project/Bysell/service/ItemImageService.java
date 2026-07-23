package com.project.Bysell.service;

import com.project.Bysell.model.Item;
import com.project.Bysell.model.ItemImage;
import com.project.Bysell.repository.ItemImageRepository;
import com.project.Bysell.repository.ItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.net.URI;
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
    private static final int MIN_IMAGES = 1;
    private static final int MAX_IMAGES = 8;

    private final ItemImageRepository itemImageRepository;
    private final ItemRepository itemRepository;
    private final RestClient restClient = RestClient.create();

    @Value("${app.supabase.url}")
    private String supabaseUrl;

    @Value("${app.supabase.bucket}")
    private String bucket;

    @Value("${app.supabase.service-key}")
    private String serviceKey;

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

        if (itemImageRepository.findByItemIdOrderByIdAsc(itemId).size() >= MAX_IMAGES) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A maximum of " + MAX_IMAGES + " images is allowed");
        }

        return storeImage(item, file);
    }

    public void validateImageTypes(List<MultipartFile> files) {
        for (MultipartFile file : files) {
            if (!ALLOWED_IMAGE_TYPES.containsKey(file.getContentType())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Only JPEG, PNG, GIF, or WebP images are allowed");
            }
        }
    }

    public List<ItemImage> storeImagesForNewItem(Item item, List<MultipartFile> files) {
        return files.stream().map(file -> storeImage(item, file)).toList();
    }

    private ItemImage storeImage(Item item, MultipartFile file) {
        String extension = ALLOWED_IMAGE_TYPES.get(file.getContentType());
        if (extension == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Only JPEG, PNG, GIF, or WebP images are allowed");
        }

        String filename = UUID.randomUUID() + extension;

        try {
            restClient.post()
                    .uri(URI.create(supabaseUrl + "/storage/v1/object/" + bucket + "/" + filename))
                    .header("Authorization", "Bearer " + serviceKey)
                    .header("apikey", serviceKey)
                    .contentType(MediaType.parseMediaType(file.getContentType()))
                    .body(file.getBytes())
                    .retrieve()
                    .toBodilessEntity();
        } catch (IOException | RestClientException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to store image", e);
        }

        String imageUrl = supabaseUrl + "/storage/v1/object/public/" + bucket + "/" + filename;

        ItemImage image = ItemImage.builder()
                .item(item)
                .imageUrl(imageUrl)
                .build();

        return itemImageRepository.save(image);
    }

    public List<ItemImage> getImagesForItem(Long itemId) {
        return itemImageRepository.findByItemIdOrderByIdAsc(itemId);
    }

    public String getMainImageUrl(Long itemId) {
        return itemImageRepository.findFirstByItemIdOrderByIdAsc(itemId)
                .map(ItemImage::getImageUrl)
                .orElse(null);
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

        if (itemImageRepository.findByItemIdOrderByIdAsc(itemId).size() <= MIN_IMAGES) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "An item must have at least one image");
        }

        try {
            deleteFromStorage(image.getImageUrl());
        } catch (RestClientException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to delete image file", e);
        }

        itemImageRepository.delete(image);
    }

    public void deleteImagesForItem(Long itemId) {
        List<ItemImage> images = itemImageRepository.findByItemIdOrderByIdAsc(itemId);

        for (ItemImage image : images) {
            try {
                deleteFromStorage(image.getImageUrl());
            } catch (RestClientException ignored) {
                // best-effort: a stray object we can't remove shouldn't block deleting the item's records
            }
        }

        itemImageRepository.deleteAll(images);
    }

    private void deleteFromStorage(String imageUrl) {
        String filename = imageUrl.substring(imageUrl.lastIndexOf('/') + 1);

        restClient.delete()
                .uri(URI.create(supabaseUrl + "/storage/v1/object/" + bucket + "/" + filename))
                .header("Authorization", "Bearer " + serviceKey)
                .header("apikey", serviceKey)
                .retrieve()
                .toBodilessEntity();
    }
}
