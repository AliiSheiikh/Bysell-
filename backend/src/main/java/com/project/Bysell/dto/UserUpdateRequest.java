package com.project.Bysell.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserUpdateRequest {

    @NotBlank
    private String firstName;

    @NotBlank
    private String lastName;

    private String phoneNumber;
}
