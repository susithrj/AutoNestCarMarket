package com.autonest.repository;

import com.autonest.model.CarImage;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CarImageRepository extends JpaRepository<CarImage, Long> {
  List<CarImage> findByCarIdOrderBySortOrderAsc(Long carId);

  List<CarImage> findByCarIdInOrderByCarIdAscSortOrderAsc(List<Long> carIds);
}

