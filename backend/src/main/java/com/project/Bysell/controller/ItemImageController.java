package com.project.Bysell.controller;

import com.project.Bysell.dto.ItemImageResponse;
import com.project.Bysell.model.ItemImage;
import com.project.Bysell.service.ItemImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/items/{itemId}/images")
public class ItemImageController {

    private final ItemImageService itemImageService;

    @Autowired
    public ItemImageController(ItemImageService itemImageService) {
        this.itemImageService = itemImageService;
    }

    @PostMapping
    public ResponseEntity<ItemImageResponse> uploadImage(@PathVariable Long itemId, @RequestParam("file") MultipartFile file) {
        ItemImage image = itemImageService.uploadImage(itemId, file);

        ItemImageResponse response = ItemImageResponse.builder()
                .id(image.getId())
                .imageUrl(image.getImageUrl())
                .uploadedAt(image.getUploadedAt())
                .build();

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public List<ItemImageResponse> getImages(@PathVariable Long itemId) {
        return itemImageService.getImagesForItem(itemId).stream()
                .map(image -> ItemImageResponse.builder()
                        .id(image.getId())
                        .imageUrl(image.getImageUrl())
                        .uploadedAt(image.getUploadedAt())
                        .build())
                .toList();
    }

    @DeleteMapping("/{imageId}")
    public ResponseEntity<Void> deleteImage(@PathVariable Long itemId, @PathVariable Long imageId, @RequestParam Long requesterId) {
        itemImageService.deleteImage(itemId, imageId, requesterId);
        return ResponseEntity.noContent().build();
    }
}
