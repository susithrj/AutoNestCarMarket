package com.autonest.service;

import com.autonest.dto.response.CarImageResponse;
import com.autonest.model.CarImage;
import com.autonest.model.CarListing;
import com.autonest.repository.CarImageRepository;
import com.autonest.repository.CarRepository;
import com.autonest.service.mapper.CarImageMapper;
import java.time.Instant;
import java.util.Comparator;
import java.util.List;
import java.util.NoSuchElementException;
import java.net.URI;
import java.net.URISyntaxException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ImageService {
  private final CarRepository carRepository;
  private final CarImageRepository carImageRepository;

  public ImageService(
      CarRepository carRepository,
      CarImageRepository carImageRepository
  ) {
    this.carRepository = carRepository;
    this.carImageRepository = carImageRepository;
  }

  @Transactional
  public List<CarImageResponse> addUrls(long carId, List<String> urls) {
    CarListing listing = carRepository.findById(carId).orElseThrow(NoSuchElementException::new);

    List<CarImage> existing = carImageRepository.findByCarIdOrderBySortOrderAsc(carId);
    int nextSort = existing.stream().map(CarImage::getSortOrder).max(Comparator.naturalOrder()).orElse(0) + 1;
    boolean hasPrimary = existing.stream().anyMatch(CarImage::isPrimary);

    for (String raw : urls) {
      String url = raw == null ? "" : raw.trim();
      if (url.isBlank()) continue;
      if (!isAllowedImageUrl(url)) {
        throw new IllegalArgumentException("Invalid image URL: " + url);
      }

      CarImage image = new CarImage();
      image.setCar(listing);
      image.setImageUrl(url);
      image.setSortOrder(nextSort++);
      image.setPrimary(!hasPrimary);
      image.setUploadedAt(Instant.now());
      carImageRepository.save(image);
      hasPrimary = true;
    }

    return carImageRepository.findByCarIdOrderBySortOrderAsc(carId).stream().map(CarImageMapper::toDto).toList();
  }

  @Transactional
  public void delete(long carId, long imageId) {
    CarImage image = carImageRepository.findById(imageId).orElseThrow(NoSuchElementException::new);
    if (image.getCar() == null || image.getCar().getId() == null || image.getCar().getId() != carId) {
      throw new NoSuchElementException();
    }
    boolean wasPrimary = image.isPrimary();
    carImageRepository.delete(image);

    if (wasPrimary) {
      List<CarImage> remaining = carImageRepository.findByCarIdOrderBySortOrderAsc(carId);
      if (!remaining.isEmpty()) {
        // Ensure only one primary remains.
        for (int i = 0; i < remaining.size(); i++) {
          CarImage img = remaining.get(i);
          boolean shouldBePrimary = i == 0;
          if (img.isPrimary() != shouldBePrimary) {
            img.setPrimary(shouldBePrimary);
            carImageRepository.save(img);
          }
        }
      }
    }
  }

  private boolean isAllowedImageUrl(String url) {
    if (url == null) return false;
    String u = url.trim();
    if (u.isEmpty()) return false;
    if (u.startsWith("/uploads/") || u.startsWith("/resources/")) return true;
    try {
      URI uri = new URI(u);
      String scheme = uri.getScheme();
      return "http".equalsIgnoreCase(scheme) || "https".equalsIgnoreCase(scheme);
    } catch (URISyntaxException e) {
      return false;
    }
  }
}

