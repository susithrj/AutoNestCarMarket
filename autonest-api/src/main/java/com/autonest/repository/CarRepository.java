package com.autonest.repository;

import com.autonest.model.CarListing;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

public interface CarRepository extends JpaRepository<CarListing, Long>, JpaSpecificationExecutor<CarListing> {

  @Query(value = "SELECT * FROM car_listings WHERE id = :id", nativeQuery = true)
  CarListing findByIdIncludingDeleted(@Param("id") Long id);

  @Query(value = "SELECT * FROM car_listings ORDER BY created_at DESC", nativeQuery = true)
  List<CarListing> findAllIncludingDeleted();

  @Query(
      value = "SELECT * FROM car_listings ORDER BY created_at DESC",
      countQuery = "SELECT COUNT(*) FROM car_listings",
      nativeQuery = true
  )
  Page<CarListing> findPageIncludingDeleted(Pageable pageable);

  @Modifying(clearAutomatically = true, flushAutomatically = true)
  @Transactional
  @Query(value = "UPDATE car_listings SET deleted_at = NULL WHERE id = :id", nativeQuery = true)
  int restoreById(@Param("id") Long id);

  @Query("select distinct c.brand from CarListing c order by c.brand")
  List<String> findDistinctBrands();
}

