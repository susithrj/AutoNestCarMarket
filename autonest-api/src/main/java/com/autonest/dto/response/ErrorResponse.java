package com.autonest.dto.response;

import java.time.Instant;
import java.util.List;

public class ErrorResponse {
  private int status;
  private String message;
  private Instant timestamp;
  private List<FieldError> errors;

  public record FieldError(String field, String message) {}

  public static ErrorResponse of(int status, String message) {
    ErrorResponse r = new ErrorResponse();
    r.setStatus(status);
    r.setMessage(message);
    r.setTimestamp(Instant.now());
    return r;
  }

  public int getStatus() {
    return status;
  }

  public void setStatus(int status) {
    this.status = status;
  }

  public String getMessage() {
    return message;
  }

  public void setMessage(String message) {
    this.message = message;
  }

  public Instant getTimestamp() {
    return timestamp;
  }

  public void setTimestamp(Instant timestamp) {
    this.timestamp = timestamp;
  }

  public List<FieldError> getErrors() {
    return errors;
  }

  public void setErrors(List<FieldError> errors) {
    this.errors = errors;
  }
}

