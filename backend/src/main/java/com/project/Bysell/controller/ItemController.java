package com.project.Bysell.controller;

import com.project.Bysell.dto.ItemRequest;
import com.project.Bysell.dto.ItemResponse;
import com.project.Bysell.dto.ItemUpdateRequest;
import com.project.Bysell.model.Item;
import com.project.Bysell.model.ItemCategory;
import com.project.Bysell.service.ItemService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/items")
public class ItemController {

    private final ItemService itemService;

    @Autowired
    public ItemController(ItemService itemService) {
        this.itemService = itemService;
    }

    @PostMapping
    public ResponseEntity<ItemResponse> createItem(@Valid @RequestBody ItemRequest request,
                                                     @AuthenticationPrincipal Long ownerId) {
        Item item = Item.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .price(request.getPrice())
                .category(request.getCategory())
                .build();

        Item savedItem = itemService.createItem(item, ownerId);

        ItemResponse response = ItemResponse.builder()
                .id(savedItem.getId())
                .title(savedItem.getTitle())
                .description(savedItem.getDescription())
                .price(savedItem.getPrice())
                .status(savedItem.getStatus())
                .category(savedItem.getCategory())
                .ownerId(savedItem.getOwner().getId())
                .createdAt(savedItem.getCreatedAt())
                .build();

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public List<ItemResponse> searchItems(@RequestParam(required = false) String keyword,
                                           @RequestParam(required = false) ItemCategory category,
                                           @RequestParam(required = false) BigDecimal minPrice,
                                           @RequestParam(required = false) BigDecimal maxPrice) {
        return itemService.searchItems(keyword, category, minPrice, maxPrice).stream()
                .map(item -> ItemResponse.builder()
                        .id(item.getId())
                        .title(item.getTitle())
                        .description(item.getDescription())
                        .price(item.getPrice())
                        .status(item.getStatus())
                        .category(item.getCategory())
                        .ownerId(item.getOwner().getId())
                        .createdAt(item.getCreatedAt())
                        .build())
                .toList();
    }

    @GetMapping("/{id}")
    public ItemResponse getItem(@PathVariable Long id) {
        Item item = itemService.getItemById(id);

        return ItemResponse.builder()
                .id(item.getId())
                .title(item.getTitle())
                .description(item.getDescription())
                .price(item.getPrice())
                .status(item.getStatus())
                .category(item.getCategory())
                .ownerId(item.getOwner().getId())
                .createdAt(item.getCreatedAt())
                .build();
    }

    @PatchMapping("/{id}")
    public ItemResponse updateItem(@PathVariable Long id, @Valid @RequestBody ItemUpdateRequest request,
                                    @AuthenticationPrincipal Long requesterId) {
        Item item = itemService.updateItem(
                id,
                requesterId,
                request.getTitle(),
                request.getDescription(),
                request.getPrice(),
                request.getCategory());

        return ItemResponse.builder()
                .id(item.getId())
                .title(item.getTitle())
                .description(item.getDescription())
                .price(item.getPrice())
                .status(item.getStatus())
                .category(item.getCategory())
                .ownerId(item.getOwner().getId())
                .createdAt(item.getCreatedAt())
                .build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long id, @AuthenticationPrincipal Long requesterId) {
        itemService.deleteItem(id, requesterId);
        return ResponseEntity.noContent().build();
    }
}
