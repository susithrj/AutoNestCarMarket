package com.autonest.service;

import com.autonest.dto.request.CarRequest;
import com.autonest.dto.response.CarDetailResponse;
import com.autonest.dto.response.CarImageResponse;
import com.autonest.dto.response.CarListItemResponse;
import com.autonest.model.CarImage;
import com.autonest.model.CarListing;
import com.autonest.model.User;
import com.autonest.model.enums.Role;
import com.autonest.repository.CarImageRepository;
import com.autonest.repository.CarRepository;
import com.autonest.repository.UserRepository;
import com.autonest.service.mapper.CarImageMapper;
import com.autonest.service.mapper.CarMapper;
import com.autonest.service.pricing.Pricing;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CarService {
  private final CarRepository carRepository;
  private final CarImageRepository carImageRepository;
  private final UserRepository userRepository;

  public CarService(CarRepository carRepository, CarImageRepository carImageRepository, UserRepository userRepository) {
    this.carRepository = carRepository;
    this.carImageRepository = carImageRepository;
    this.userRepository = userRepository;
  }

  @Transactional(readOnly = true)
  public Page<CarListItemResponse> search(CarSearchCriteria criteria, Pageable pageable) {
    Specification<CarListing> spec = CarSpecifications.byCriteria(criteria);
    Page<CarListing> page = carRepository.findAll(spec, pageable);
    Map<Long, String> primaryByCarId = primaryImageUrlByCarId(page.getContent());
    return page.map(listing -> toListItem(listing, primaryByCarId.get(listing.getId())));
  }

  @Transactional(readOnly = true)
  public CarDetailResponse getDetail(Long id) {
    CarListing listing = carRepository.findById(id).orElseThrow(NoSuchElementException::new);
    List<CarImageResponse> images =
        carImageRepository.findByCarIdOrderBySortOrderAsc(id).stream()
            .map(CarImageMapper::toDto)
            .collect(Collectors.toList());

    BigDecimal finalPrice = Pricing.finalPrice(listing.getBasePrice(), listing.getAdditionalCharges(), listing.getDiscountAmount());
    return CarMapper.toDetail(listing, images, finalPrice);
  }

  @Transactional(readOnly = true)
  public CarDetailResponse adminGetDetailIncludingDeleted(Long id) {
    CarListing listing = carRepository.findByIdIncludingDeleted(id);
    if (listing == null) {
      throw new NoSuchElementException();
    }
    List<CarImageResponse> images =
        carImageRepository.findByCarIdOrderBySortOrderAsc(id).stream()
            .map(CarImageMapper::toDto)
            .collect(Collectors.toList());

    BigDecimal finalPrice = Pricing.finalPrice(listing.getBasePrice(), listing.getAdditionalCharges(), listing.getDiscountAmount());
    return CarMapper.toDetail(listing, images, finalPrice);
  }

  @Transactional(readOnly = true)
  public List<String> getDistinctBrands() {
    return carRepository.findDistinctBrands();
  }

  @Transactional(readOnly = true)
  public List<CarListItemResponse> adminListAllIncludingDeleted() {
    List<CarListing> listings = carRepository.findAllIncludingDeleted();
    Map<Long, String> primaryByCarId = primaryImageUrlByCarId(listings);
    return listings.stream()
        .map(l -> CarMapper.toListItem(l, primaryByCarId.get(l.getId()),
            Pricing.finalPrice(l.getBasePrice(), l.getAdditionalCharges(), l.getDiscountAmount())))
        .toList();
  }

  @Transactional(readOnly = true)
  public Page<CarListItemResponse> adminPageIncludingDeleted(Pageable pageable) {
    Page<CarListing> page = carRepository.findPageIncludingDeleted(pageable);
    Map<Long, String> primaryByCarId = primaryImageUrlByCarId(page.getContent());
    return page.map(l -> CarMapper.toListItem(l, primaryByCarId.get(l.getId()),
        Pricing.finalPrice(l.getBasePrice(), l.getAdditionalCharges(), l.getDiscountAmount())));
  }

  @Transactional
  public CarDetailResponse adminCreate(CarRequest request) {
    User adminUser = userRepository.findFirstByRole(Role.ADMIN).orElseThrow(NoSuchElementException::new);
    CarListing listing = new CarListing();
    listing.setCreatedBy(adminUser);
    applyRequest(listing, request);
    listing.setCreatedAt(Instant.now());
    listing.setUpdatedAt(Instant.now());
    CarListing saved = carRepository.save(listing);
    return getDetail(saved.getId());
  }

  @Transactional
  public CarDetailResponse adminUpdate(Long id, CarRequest request) {
    CarListing listing = carRepository.findById(id).orElseThrow(NoSuchElementException::new);
    applyRequest(listing, request);
    listing.setUpdatedAt(Instant.now());
    carRepository.saveAndFlush(listing);
    return getDetail(id);
  }

  @Transactional
  public void adminSoftDelete(Long id) {
    CarListing listing = carRepository.findById(id).orElseThrow(NoSuchElementException::new);
    carRepository.delete(listing);
  }

  @Transactional
  public void adminRestore(Long id) {
    int updated = carRepository.restoreById(id);
    if (updated == 0) {
      throw new NoSuchElementException();
    }
  }

  /** Kept for backwards compatibility with tests and callers. */
  public BigDecimal finalPrice(CarListing listing) {
    return Pricing.finalPrice(
        listing == null ? null : listing.getBasePrice(),
        listing == null ? null : listing.getAdditionalCharges(),
        listing == null ? null : listing.getDiscountAmount()
    );
  }

  private void applyRequest(CarListing listing, CarRequest request) {
    listing.setTitle(request.getTitle());
    listing.setBrand(request.getBrand());
    listing.setModel(request.getModel());
    listing.setYear(request.getYear());
    listing.setMileage(request.getMileage());
    listing.setFuelType(request.getFuelType());
    listing.setTransmission(request.getTransmission());
    listing.setBasePrice(request.getBasePrice());
    listing.setAdditionalCharges(request.getAdditionalCharges());
    listing.setDiscountAmount(request.getDiscountAmount());
    listing.setNegotiable(request.isNegotiable());
    listing.setLocation(request.getLocation());
    listing.setContactPhone(request.getContactPhone());
    listing.setContactEmail(request.getContactEmail());
    listing.setDescription(request.getDescription());
    listing.setStatus(request.getStatus());
  }

  private CarListItemResponse toListItem(CarListing listing, String primaryImageUrl) {
    return CarMapper.toListItem(listing, primaryImageUrl,
        Pricing.finalPrice(listing.getBasePrice(), listing.getAdditionalCharges(), listing.getDiscountAmount()));
  }

  /** List thumbnail: first image by {@code sort_order} (first added), not {@code is_primary}. */
  private Map<Long, String> primaryImageUrlByCarId(List<CarListing> listings) {
    if (listings == null || listings.isEmpty()) {
      return Map.of();
    }

    List<Long> ids = listings.stream().map(CarListing::getId).toList();
    List<CarImage> images = carImageRepository.findByCarIdInOrderByCarIdAscSortOrderAsc(ids);

    Map<Long, String> byCar = new HashMap<>();
    for (CarImage img : images) {
      if (img == null || img.getCar() == null || img.getCar().getId() == null) continue;
      Long carId = img.getCar().getId();
      if (byCar.containsKey(carId)) continue;
      byCar.put(carId, img.getImageUrl());
    }

    return byCar;
  }
}

