package com.autonest.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;

import com.autonest.model.CarListing;
import com.autonest.repository.CarImageRepository;
import com.autonest.repository.CarRepository;
import com.autonest.repository.UserRepository;
import java.math.BigDecimal;
import org.junit.jupiter.api.Test;

class CarServiceTest {

  @Test
  void finalPrice_defaultsNullsToZero() {
    CarRepository carRepository = mock(CarRepository.class);
    CarImageRepository carImageRepository = mock(CarImageRepository.class);
    UserRepository userRepository = mock(UserRepository.class);
    CarService service = new CarService(carRepository, carImageRepository, userRepository);

    CarListing listing = new CarListing();
    listing.setBasePrice(null);
    listing.setAdditionalCharges(null);
    listing.setDiscountAmount(null);

    assertEquals(new BigDecimal("0"), service.finalPrice(listing));
  }

  @Test
  void finalPrice_calculatesBasePlusChargesMinusDiscount() {
    CarRepository carRepository = mock(CarRepository.class);
    CarImageRepository carImageRepository = mock(CarImageRepository.class);
    UserRepository userRepository = mock(UserRepository.class);
    CarService service = new CarService(carRepository, carImageRepository, userRepository);

    CarListing listing = new CarListing();
    listing.setBasePrice(new BigDecimal("100.00"));
    listing.setAdditionalCharges(new BigDecimal("10.00"));
    listing.setDiscountAmount(new BigDecimal("5.00"));

    assertEquals(new BigDecimal("105.00"), service.finalPrice(listing));
  }
}

