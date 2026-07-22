package com.project.Bysell.dto;

import com.project.Bysell.model.ItemCategory;
import com.project.Bysell.model.ItemStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
@AllArgsConstructor
public class ItemDetailResponse {

    private Long id;
    private String title;
    private String description;
    private BigDecimal price;
    private ItemStatus status;
    private ItemCategory category;
    private List<ItemImageResponse> images;
    private Long ownerId;
    private String sellerName;
    private String sellerEmail;
    private LocalDateTime createdAt;
}
