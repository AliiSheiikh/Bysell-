package com.project.Bysell.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;

@Data
@Builder
@AllArgsConstructor
public class LoginResponse {

    private String token;
    private Long userId;
    private String firstName;
    private String email;
}
