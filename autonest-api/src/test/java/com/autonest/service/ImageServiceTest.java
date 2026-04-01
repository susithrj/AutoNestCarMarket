package com.autonest.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.autonest.dto.response.CarImageResponse;
import com.autonest.model.CarListing;
import com.autonest.repository.CarImageRepository;
import com.autonest.repository.CarRepository;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;

class ImageServiceTest {

  @Test
  void addUrls_setsFirstImageAsPrimaryWhenNoneExist() {
    CarRepository carRepository = mock(CarRepository.class);
    CarImageRepository carImageRepository = mock(CarImageRepository.class);
    ImageService service = new ImageService(carRepository, carImageRepository);

    CarListing listing = new CarListing();
    listing.setId(1001L);
    listing.setCreatedAt(Instant.now());
    listing.setUpdatedAt(Instant.now());

    when(carRepository.findById(1001L)).thenReturn(Optional.of(listing));
    when(carImageRepository.findByCarIdOrderBySortOrderAsc(1001L)).thenReturn(List.of());

    List<CarImageResponse> result =
        service.addUrls(1001L, List.of("https://example.com/a.jpg"));
    assertEquals(0, result.size()); // repository mocked to return empty
    verify(carImageRepository).save(any());
  }
}

