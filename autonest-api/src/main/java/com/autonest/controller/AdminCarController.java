package com.autonest.controller;

import com.autonest.dto.request.CarRequest;
import com.autonest.dto.request.CarImageUrlsRequest;
import com.autonest.dto.response.CarDetailResponse;
import com.autonest.dto.response.CarImageResponse;
import com.autonest.dto.response.CarListItemResponse;
import com.autonest.service.CarService;
import com.autonest.service.ImageService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@SecurityRequirement(name = "bearerAuth")
public class AdminCarController {
  private final CarService carService;
  private final ImageService imageService;

  public AdminCarController(CarService carService, ImageService imageService) {
    this.carService = carService;
    this.imageService = imageService;
  }

  @GetMapping("/api/admin/cars")
  public List<CarListItemResponse> listAll() {
    return carService.adminListAllIncludingDeleted();
  }

  @GetMapping("/api/admin/cars/page")
  public Page<CarListItemResponse> page(
      @RequestParam(required = false, defaultValue = "createdAt,desc") String sort,
      @RequestParam(required = false, defaultValue = "0") int page,
      @RequestParam(required = false, defaultValue = "25") int size
  ) {
    Pageable pageable = PageRequest.of(page, size, parseSort(sort));
    return carService.adminPageIncludingDeleted(pageable);
  }

  @GetMapping("/api/admin/cars/{id}")
  public CarDetailResponse get(@PathVariable Long id) {
    return carService.adminGetDetailIncludingDeleted(id);
  }

  @PostMapping("/api/admin/cars")
  @ResponseStatus(HttpStatus.CREATED)
  public CarDetailResponse create(@Valid @org.springframework.web.bind.annotation.RequestBody CarRequest request) {
    // Auth/RBAC will be enforced in later phases; for now we create under the first ADMIN user (seeded).
    return carService.adminCreate(request);
  }

  @PutMapping("/api/admin/cars/{id}")
  public CarDetailResponse update(@PathVariable Long id, @Valid @org.springframework.web.bind.annotation.RequestBody CarRequest request) {
    return carService.adminUpdate(id, request);
  }

  @DeleteMapping("/api/admin/cars/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void delete(@PathVariable Long id) {
    carService.adminSoftDelete(id);
  }

  @PostMapping("/api/admin/cars/{id}/restore")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void restore(@PathVariable Long id) {
    carService.adminRestore(id);
  }

  @PostMapping("/api/admin/cars/{id}/images/urls")
  public List<CarImageResponse> addImageUrls(@PathVariable long id, @Valid @RequestBody CarImageUrlsRequest request) {
    return imageService.addUrls(id, request.getUrls());
  }

  @DeleteMapping("/api/admin/cars/{id}/images/{imgId}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void deleteImage(@PathVariable long id, @PathVariable long imgId) {
    imageService.delete(id, imgId);
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

