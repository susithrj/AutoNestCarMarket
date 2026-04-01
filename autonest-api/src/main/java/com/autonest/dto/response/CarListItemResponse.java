package com.autonest.dto.response;

import com.autonest.model.enums.FuelType;
import com.autonest.model.enums.ListingStatus;
import com.autonest.model.enums.Transmission;
import java.math.BigDecimal;
import java.time.Instant;

public class CarListItemResponse {
  private Long id;
  private String title;
  private String brand;
  private String model;
  private String primaryImageUrl;
  private int year;
  private int mileage;
  private FuelType fuelType;
  private Transmission transmission;
  private BigDecimal basePrice;
  private BigDecimal additionalCharges;
  private BigDecimal discountAmount;
  private BigDecimal finalPrice;
  private boolean negotiable;
  private String location;
  private ListingStatus status;
  private Instant deletedAt;
  private Instant createdAt;
  private Instant updatedAt;

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public String getBrand() {
    return brand;
  }

  public void setBrand(String brand) {
    this.brand = brand;
  }

  public String getModel() {
    return model;
  }

  public void setModel(String model) {
    this.model = model;
  }

  public String getPrimaryImageUrl() {
    return primaryImageUrl;
  }

  public void setPrimaryImageUrl(String primaryImageUrl) {
    this.primaryImageUrl = primaryImageUrl;
  }

  public int getYear() {
    return year;
  }

  public void setYear(int year) {
    this.year = year;
  }

  public int getMileage() {
    return mileage;
  }

  public void setMileage(int mileage) {
    this.mileage = mileage;
  }

  public FuelType getFuelType() {
    return fuelType;
  }

  public void setFuelType(FuelType fuelType) {
    this.fuelType = fuelType;
  }

  public Transmission getTransmission() {
    return transmission;
  }

  public void setTransmission(Transmission transmission) {
    this.transmission = transmission;
  }

  public BigDecimal getBasePrice() {
    return basePrice;
  }

  public void setBasePrice(BigDecimal basePrice) {
    this.basePrice = basePrice;
  }

  public BigDecimal getAdditionalCharges() {
    return additionalCharges;
  }

  public void setAdditionalCharges(BigDecimal additionalCharges) {
    this.additionalCharges = additionalCharges;
  }

  public BigDecimal getDiscountAmount() {
    return discountAmount;
  }

  public void setDiscountAmount(BigDecimal discountAmount) {
    this.discountAmount = discountAmount;
  }

  public BigDecimal getFinalPrice() {
    return finalPrice;
  }

  public void setFinalPrice(BigDecimal finalPrice) {
    this.finalPrice = finalPrice;
  }

  public boolean isNegotiable() {
    return negotiable;
  }

  public void setNegotiable(boolean negotiable) {
    this.negotiable = negotiable;
  }

  public String getLocation() {
    return location;
  }

  public void setLocation(String location) {
    this.location = location;
  }

  public ListingStatus getStatus() {
    return status;
  }

  public void setStatus(ListingStatus status) {
    this.status = status;
  }

  public Instant getDeletedAt() {
    return deletedAt;
  }

  public void setDeletedAt(Instant deletedAt) {
    this.deletedAt = deletedAt;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(Instant createdAt) {
    this.createdAt = createdAt;
  }

  public Instant getUpdatedAt() {
    return updatedAt;
  }

  public void setUpdatedAt(Instant updatedAt) {
    this.updatedAt = updatedAt;
  }
}

