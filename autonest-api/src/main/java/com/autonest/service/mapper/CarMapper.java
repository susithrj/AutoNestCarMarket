package com.autonest.service.mapper;

import com.autonest.dto.response.CarDetailResponse;
import com.autonest.dto.response.CarImageResponse;
import com.autonest.dto.response.CarListItemResponse;
import com.autonest.model.CarListing;
import java.math.BigDecimal;
import java.util.List;

public final class CarMapper {
  private CarMapper() {}

  public static CarDetailResponse toDetail(CarListing listing, List<CarImageResponse> images, BigDecimal finalPrice) {
    CarDetailResponse dto = new CarDetailResponse();
    dto.setId(listing.getId());
    dto.setTitle(listing.getTitle());
    dto.setBrand(listing.getBrand());
    dto.setModel(listing.getModel());
    dto.setYear(listing.getYear());
    dto.setMileage(listing.getMileage());
    dto.setFuelType(listing.getFuelType());
    dto.setTransmission(listing.getTransmission());
    dto.setBasePrice(listing.getBasePrice());
    dto.setAdditionalCharges(listing.getAdditionalCharges());
    dto.setDiscountAmount(listing.getDiscountAmount());
    dto.setFinalPrice(finalPrice);
    dto.setNegotiable(listing.isNegotiable());
    dto.setLocation(listing.getLocation());
    dto.setContactPhone(listing.getContactPhone());
    dto.setContactEmail(listing.getContactEmail());
    dto.setDescription(listing.getDescription());
    dto.setStatus(listing.getStatus());
    dto.setCreatedAt(listing.getCreatedAt());
    dto.setUpdatedAt(listing.getUpdatedAt());
    dto.setImages(images);
    return dto;
  }

  public static CarListItemResponse toListItem(CarListing listing, String primaryImageUrl, BigDecimal finalPrice) {
    CarListItemResponse dto = new CarListItemResponse();
    dto.setId(listing.getId());
    dto.setTitle(listing.getTitle());
    dto.setBrand(listing.getBrand());
    dto.setModel(listing.getModel());
    dto.setPrimaryImageUrl(primaryImageUrl);
    dto.setYear(listing.getYear());
    dto.setMileage(listing.getMileage());
    dto.setFuelType(listing.getFuelType());
    dto.setTransmission(listing.getTransmission());
    dto.setBasePrice(listing.getBasePrice());
    dto.setAdditionalCharges(listing.getAdditionalCharges());
    dto.setDiscountAmount(listing.getDiscountAmount());
    dto.setFinalPrice(finalPrice);
    dto.setNegotiable(listing.isNegotiable());
    dto.setLocation(listing.getLocation());
    dto.setStatus(listing.getStatus());
    dto.setDeletedAt(listing.getDeletedAt());
    dto.setCreatedAt(listing.getCreatedAt());
    dto.setUpdatedAt(listing.getUpdatedAt());
    return dto;
  }
}

