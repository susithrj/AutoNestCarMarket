package com.autonest.dto.response;

import com.autonest.model.enums.FuelType;
import com.autonest.model.enums.ListingStatus;
import com.autonest.model.enums.Transmission;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public class CarDetailResponse {
  private Long id;
  private String title;
  private String brand;
  private String model;
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
  private String contactPhone;
  private String contactEmail;
  private String description;
  private ListingStatus status;
  private Instant createdAt;
  private Instant updatedAt;
  private List<CarImageResponse> images;

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

  public String getContactPhone() {
    return contactPhone;
  }

  public void setContactPhone(String contactPhone) {
    this.contactPhone = contactPhone;
  }

  public String getContactEmail() {
    return contactEmail;
  }

  public void setContactEmail(String contactEmail) {
    this.contactEmail = contactEmail;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public ListingStatus getStatus() {
    return status;
  }

  public void setStatus(ListingStatus status) {
    this.status = status;
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

  public List<CarImageResponse> getImages() {
    return images;
  }

  public void setImages(List<CarImageResponse> images) {
    this.images = images;
  }
}

