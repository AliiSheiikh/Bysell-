package com.project.Bysell.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
public class ItemImageResponse {

    private Long id;
    private String imageUrl;
    private LocalDateTime uploadedAt;
}
