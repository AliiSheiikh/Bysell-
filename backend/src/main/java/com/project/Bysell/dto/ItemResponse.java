package com.project.Bysell.dto;

import com.project.Bysell.model.ItemCategory;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor
public class ItemResponse {

    private Long id;
    private String title;
    private String description;
    private BigDecimal price;
    private ItemCategory category;
    private String mainImageUrl;
    private Long ownerId;
    private LocalDateTime createdAt;
}
