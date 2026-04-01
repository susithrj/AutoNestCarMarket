package com.autonest.service.pricing;

import java.math.BigDecimal;

public final class Pricing {
  private Pricing() {}

  public static BigDecimal finalPrice(BigDecimal basePrice, BigDecimal additionalCharges, BigDecimal discountAmount) {
    BigDecimal base = basePrice == null ? BigDecimal.ZERO : basePrice;
    BigDecimal charges = additionalCharges == null ? BigDecimal.ZERO : additionalCharges;
    BigDecimal discount = discountAmount == null ? BigDecimal.ZERO : discountAmount;
    return base.add(charges).subtract(discount);
  }
}

