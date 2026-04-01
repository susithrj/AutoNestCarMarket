package com.autonest.model;

import com.autonest.model.enums.FuelType;
import com.autonest.model.enums.ListingStatus;
import com.autonest.model.enums.Transmission;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.Instant;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

@Entity
@Table(
    name = "car_listings",
    indexes = {
        @Index(name = "idx_car_brand", columnList = "brand"),
        @Index(name = "idx_car_model", columnList = "model"),
        @Index(name = "idx_car_location", columnList = "location"),
        @Index(name = "idx_car_year", columnList = "year"),
        @Index(name = "idx_car_mileage", columnList = "mileage"),
        @Index(name = "idx_car_base_price", columnList = "base_price"),
        @Index(name = "idx_car_status", columnList = "status"),
        @Index(name = "idx_car_deleted_at", columnList = "deleted_at")
    }
)
@SQLDelete(sql = "UPDATE car_listings SET deleted_at = NOW() WHERE id = ?")
@Where(clause = "deleted_at IS NULL")
public class CarListing {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "created_by_user_id", nullable = false)
  private User createdBy;

  @Column(nullable = false, length = 255)
  private String title;

  @Column(nullable = false, length = 100)
  private String brand;

  @Column(nullable = false, length = 100)
  private String model;

  @Column(nullable = false)
  private int year;

  @Column(nullable = false)
  private int mileage;

  @Enumerated(EnumType.STRING)
  @Column(name = "fuel_type", nullable = false, length = 20)
  private FuelType fuelType;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 20)
  private Transmission transmission;

  @Column(name = "base_price", nullable = false, precision = 12, scale = 2)
  private BigDecimal basePrice;

  @Column(name = "additional_charges", nullable = false, precision = 12, scale = 2)
  private BigDecimal additionalCharges = BigDecimal.ZERO;

  @Column(name = "discount_amount", nullable = false, precision = 12, scale = 2)
  private BigDecimal discountAmount = BigDecimal.ZERO;

  @Column(nullable = false)
  private boolean negotiable;

  @Column(nullable = false, length = 255)
  private String location;

  @Column(name = "contact_phone", length = 32)
  private String contactPhone;

  @Column(name = "contact_email", length = 255)
  private String contactEmail;

  @Column(columnDefinition = "TEXT")
  private String description;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 20)
  private ListingStatus status = ListingStatus.AVAILABLE;

  @Column(name = "deleted_at")
  private Instant deletedAt;

  @Column(name = "created_at", nullable = false)
  private Instant createdAt = Instant.now();

  @Column(name = "updated_at", nullable = false)
  private Instant updatedAt = Instant.now();

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public User getCreatedBy() {
    return createdBy;
  }

  public void setCreatedBy(User createdBy) {
    this.createdBy = createdBy;
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

