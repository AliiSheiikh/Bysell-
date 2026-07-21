package com.project.Bysell.dto;

import com.project.Bysell.model.ItemCategory;
import com.project.Bysell.model.ItemStatus;
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
    private ItemStatus status;
    private ItemCategory category;
    private Long ownerId;
    private LocalDateTime createdAt;
}
