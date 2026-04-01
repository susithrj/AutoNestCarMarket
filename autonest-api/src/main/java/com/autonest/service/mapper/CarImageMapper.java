package com.autonest.service.mapper;

import com.autonest.dto.response.CarImageResponse;
import com.autonest.model.CarImage;

public final class CarImageMapper {
  private CarImageMapper() {}

  public static CarImageResponse toDto(CarImage image) {
    CarImageResponse dto = new CarImageResponse();
    dto.setId(image.getId());
    dto.setImageUrl(image.getImageUrl());
    dto.setPrimary(image.isPrimary());
    dto.setSortOrder(image.getSortOrder());
    dto.setUploadedAt(image.getUploadedAt());
    return dto;
  }
}

