package com.project.Bysell.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.extern.jackson.Jacksonized;

import java.time.LocalDateTime;

@Data
@Builder
@Jacksonized
@AllArgsConstructor
public class ItemImageResponse {

    private Long id;
    private String imageUrl;
    private LocalDateTime uploadedAt;
}
