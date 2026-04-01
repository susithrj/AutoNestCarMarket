package com.autonest.service;

import com.autonest.model.enums.FuelType;
import com.autonest.model.enums.Transmission;
import java.math.BigDecimal;

public class CarSearchCriteria {
  private String q;
  private String brand;
  private String model;
  private BigDecimal minPrice;
  private BigDecimal maxPrice;
  private FuelType fuelType;
  private Transmission transmission;
  private Integer minYear;
  private Integer maxYear;
  private Integer maxMileage;
  private String location;

  public String getQ() {
    return q;
  }

  public void setQ(String q) {
    this.q = q;
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

  public BigDecimal getMinPrice() {
    return minPrice;
  }

  public void setMinPrice(BigDecimal minPrice) {
    this.minPrice = minPrice;
  }

  public BigDecimal getMaxPrice() {
    return maxPrice;
  }

  public void setMaxPrice(BigDecimal maxPrice) {
    this.maxPrice = maxPrice;
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

  public Integer getMinYear() {
    return minYear;
  }

  public void setMinYear(Integer minYear) {
    this.minYear = minYear;
  }

  public Integer getMaxYear() {
    return maxYear;
  }

  public void setMaxYear(Integer maxYear) {
    this.maxYear = maxYear;
  }

  public Integer getMaxMileage() {
    return maxMileage;
  }

  public void setMaxMileage(Integer maxMileage) {
    this.maxMileage = maxMileage;
  }

  public String getLocation() {
    return location;
  }

  public void setLocation(String location) {
    this.location = location;
  }
}

