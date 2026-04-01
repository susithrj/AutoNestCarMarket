package com.autonest.dto.request;

import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public class CarImageUrlsRequest {
  @NotEmpty
  private List<String> urls;

  public List<String> getUrls() {
    return urls;
  }

  public void setUrls(List<String> urls) {
    this.urls = urls;
  }
}

