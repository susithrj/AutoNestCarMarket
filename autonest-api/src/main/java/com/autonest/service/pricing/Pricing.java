package com.autonest.service.pricing;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public final class Pricing {

    @Value("${autonest.tax.vat}")
    private static BigDecimal tax = BigDecimal.ZERO;
    private int threshold;
    private Pricing() {}

  public static BigDecimal finalPrice(BigDecimal basePrice, BigDecimal additionalCharges, BigDecimal discountAmount) {

    BigDecimal base = basePrice == null ? BigDecimal.ZERO : basePrice;
    BigDecimal charges = additionalCharges == null ? BigDecimal.ZERO : additionalCharges;
    BigDecimal taxValue = base.multiply(tax);
    BigDecimal discount = discountAmount == null ? BigDecimal.ZERO : discountAmount;
    return base.add(charges).add(taxValue).subtract(discount);
  }
}

