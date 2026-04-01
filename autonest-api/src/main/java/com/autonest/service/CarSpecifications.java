package com.autonest.service;

import com.autonest.model.CarListing;
import com.autonest.model.enums.FuelType;
import com.autonest.model.enums.Transmission;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Predicate;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import org.springframework.data.jpa.domain.Specification;

public final class CarSpecifications {
  private CarSpecifications() {}

  public static Specification<CarListing> byCriteria(CarSearchCriteria criteria) {
    return (root, query, cb) -> {
      List<Predicate> predicates = new ArrayList<>();

      if (criteria == null) {
        return cb.and(predicates.toArray(new Predicate[0]));
      }

      if (criteria.getBrand() != null && !criteria.getBrand().isBlank()) {
        String brandNorm = criteria.getBrand().trim().toLowerCase();
        predicates.add(cb.equal(cb.lower(cb.trim(root.get("brand"))), brandNorm));
      }

      if (criteria.getModel() != null && !criteria.getModel().isBlank()) {
        String modelNorm = criteria.getModel().trim().toLowerCase();
        predicates.add(cb.equal(cb.lower(cb.trim(root.get("model"))), modelNorm));
      }

      if (criteria.getFuelType() != null) {
        predicates.add(cb.equal(root.get("fuelType"), criteria.getFuelType()));
      }

      if (criteria.getTransmission() != null) {
        predicates.add(cb.equal(root.get("transmission"), criteria.getTransmission()));
      }

      if (criteria.getMinYear() != null) {
        predicates.add(cb.greaterThanOrEqualTo(root.get("year"), criteria.getMinYear()));
      }

      if (criteria.getMaxYear() != null) {
        predicates.add(cb.lessThanOrEqualTo(root.get("year"), criteria.getMaxYear()));
      }

      if (criteria.getMaxMileage() != null) {
        predicates.add(cb.lessThanOrEqualTo(root.get("mileage"), criteria.getMaxMileage()));
      }

      if (criteria.getLocation() != null && !criteria.getLocation().isBlank()) {
        predicates.add(cb.like(cb.lower(root.get("location")), "%" + criteria.getLocation().trim().toLowerCase() + "%"));
      }

      Expression<BigDecimal> finalPriceExpr = cb.diff(
          cb.sum(root.get("basePrice"), root.get("additionalCharges")),
          root.get("discountAmount")
      );

      if (criteria.getMinPrice() != null) {
        predicates.add(cb.greaterThanOrEqualTo(finalPriceExpr, criteria.getMinPrice()));
      }

      if (criteria.getMaxPrice() != null) {
        predicates.add(cb.lessThanOrEqualTo(finalPriceExpr, criteria.getMaxPrice()));
      }

      if (criteria.getQ() != null && !criteria.getQ().isBlank()) {
        String like = "%" + criteria.getQ().trim().toLowerCase() + "%";
        predicates.add(cb.or(
            cb.like(cb.lower(cb.trim(root.get("brand"))), like),
            cb.like(cb.lower(cb.trim(root.get("model"))), like),
            cb.like(cb.lower(root.get("location")), like),
            cb.like(cb.lower(root.get("title")), like)
        ));
      }

      return cb.and(predicates.toArray(new Predicate[0]));
    };
  }
}

