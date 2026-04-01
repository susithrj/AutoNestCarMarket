package com.autonest.controller;

import com.autonest.dto.response.CarDetailResponse;
import com.autonest.dto.response.CarListItemResponse;
import com.autonest.model.enums.FuelType;
import com.autonest.model.enums.Transmission;
import com.autonest.service.CarSearchCriteria;
import com.autonest.service.CarService;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CarController {
  private final CarService carService;

  public CarController(CarService carService) {
    this.carService = carService;
  }

  @GetMapping("/api/cars")
  public Page<CarListItemResponse> listCars(
      @RequestParam(required = false) String q,
      @RequestParam(required = false) String brand,
      @RequestParam(required = false) String model,
      @RequestParam(required = false) BigDecimal minPrice,
      @RequestParam(required = false) BigDecimal maxPrice,
      @RequestParam(required = false) FuelType fuelType,
      @RequestParam(required = false) Transmission transmission,
      @RequestParam(required = false) Integer minYear,
      @RequestParam(required = false) Integer maxYear,
      @RequestParam(required = false) Integer maxMileage,
      @RequestParam(required = false) String location,
      @RequestParam(required = false, defaultValue = "createdAt,desc") String sort,
      @RequestParam(required = false, defaultValue = "0") int page,
      @RequestParam(required = false, defaultValue = "12") int size
  ) {
    CarSearchCriteria criteria = new CarSearchCriteria();
    criteria.setQ(q);
    criteria.setBrand(brand);
    criteria.setModel(model);
    criteria.setMinPrice(minPrice);
    criteria.setMaxPrice(maxPrice);
    criteria.setFuelType(fuelType);
    criteria.setTransmission(transmission);
    criteria.setMinYear(minYear);
    criteria.setMaxYear(maxYear);
    criteria.setMaxMileage(maxMileage);
    criteria.setLocation(location);

    Pageable pageable = PageRequest.of(page, size, parseSort(sort));
    return carService.search(criteria, pageable);
  }

  @GetMapping("/api/cars/{id}")
  public CarDetailResponse getCar(@PathVariable Long id) {
    return carService.getDetail(id);
  }

  @GetMapping("/api/cars/brands")
  public List<String> brands() {
    return carService.getDistinctBrands();
  }

  private Sort parseSort(String sort) {
    if (sort == null || sort.isBlank()) {
      return Sort.by(Sort.Direction.DESC, "createdAt");
    }

    String[] parts = sort.split(",");
    String key = parts[0].trim();
    Sort.Direction direction = Sort.Direction.DESC;
    if (parts.length > 1) {
      direction = Sort.Direction.fromOptionalString(parts[1].trim()).orElse(Sort.Direction.DESC);
    }

    String property = switch (key) {
      case "price" -> "basePrice";
      case "year" -> "year";
      case "mileage" -> "mileage";
      case "createdAt" -> "createdAt";
      default -> key;
    };

    return Sort.by(direction, property);
  }
}

