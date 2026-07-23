package com.project.Bysell.dto;

import com.project.Bysell.model.ItemCategory;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.extern.jackson.Jacksonized;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
@Jacksonized
@AllArgsConstructor
public class ItemDetailResponse {

    private Long id;
    private String title;
    private String description;
    private BigDecimal price;
    private ItemCategory category;
    private List<ItemImageResponse> images;
    private Long ownerId;
    private String sellerName;
    private String sellerEmail;
    private LocalDateTime createdAt;
}
