package com.autonest.service;

import java.io.IOException;
import java.io.InputStream;

public interface ImageStorageService {
  StoredImage store(long carId, String originalFilename, InputStream content) throws IOException;

  record StoredImage(String relativeUrl, String storedFilename) {}
}

