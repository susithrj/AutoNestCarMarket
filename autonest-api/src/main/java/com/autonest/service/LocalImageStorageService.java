package com.autonest.service;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.Locale;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class LocalImageStorageService implements ImageStorageService {

  private final Path uploadRoot;

  public LocalImageStorageService(@Value("${autonest.upload-dir:uploads}") String uploadDir) {
    this.uploadRoot = Path.of(uploadDir).toAbsolutePath().normalize();
  }

  @Override
  public StoredImage store(long carId, String originalFilename, InputStream content) throws IOException {
    String safeName = sanitizeFilename(originalFilename);
    String storedName = UUID.randomUUID() + "-" + safeName;

    Path carDir = uploadRoot.resolve("cars").resolve(Long.toString(carId));
    Files.createDirectories(carDir);

    Path dest = carDir.resolve(storedName);
    Files.copy(content, dest, StandardCopyOption.REPLACE_EXISTING);

    String relativeUrl = "/uploads/cars/" + carId + "/" + storedName;
    return new StoredImage(relativeUrl, storedName);
  }

  private String sanitizeFilename(String name) {
    if (name == null || name.isBlank()) {
      return "image";
    }
    String cleaned = name.replace("\\\\", "/");
    cleaned = cleaned.substring(cleaned.lastIndexOf('/') + 1);
    cleaned = cleaned.replaceAll("[^A-Za-z0-9._-]", "_");
    if (cleaned.isBlank()) {
      cleaned = "image";
    }
    return cleaned.toLowerCase(Locale.ROOT);
  }
}

