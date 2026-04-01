package com.autonest.dto.request;

import com.autonest.model.enums.FuelType;
import com.autonest.model.enums.ListingStatus;
import com.autonest.model.enums.Transmission;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public class CarRequest {
  @NotBlank
  private String title;

  @NotBlank
  private String brand;

  @NotBlank
  private String model;

  @Min(1950)
  @Max(2100)
  private int year;

  @Min(0)
  private int mileage;

  @NotNull
  private FuelType fuelType;

  @NotNull
  private Transmission transmission;

  @NotNull
  @DecimalMin("0.0")
  private BigDecimal basePrice;

  @NotNull
  @DecimalMin("0.0")
  private BigDecimal additionalCharges = BigDecimal.ZERO;

  @NotNull
  @DecimalMin("0.0")
  private BigDecimal discountAmount = BigDecimal.ZERO;

  private boolean negotiable;

  @NotBlank
  private String location;

  @NotBlank
  @Size(max = 32)
  private String contactPhone;

  @NotBlank
  @Email
  @Size(max = 255)
  private String contactEmail;

  private String description;

  @NotNull
  private ListingStatus status;

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
}

