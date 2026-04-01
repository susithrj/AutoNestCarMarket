/*
 * Copyright 2015-2023 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.nio.channels.Channels;
import java.nio.channels.ReadableByteChannel;
import java.util.Properties;

public class MavenWrapperDownloader {
  private static final String WRAPPER_VERSION = "3.2.0";
  private static final String DEFAULT_DOWNLOAD_URL =
      "https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/"
          + WRAPPER_VERSION
          + "/maven-wrapper-"
          + WRAPPER_VERSION
          + ".jar";

  private static final String MAVEN_WRAPPER_PROPERTIES_PATH =
      ".mvn/wrapper/maven-wrapper.properties";

  private static final String MAVEN_WRAPPER_JAR_PATH = ".mvn/wrapper/maven-wrapper.jar";

  public static void main(String[] args) {
    System.out.println("- Downloader started");
    File baseDirectory = new File(args.length > 0 ? args[0] : ".");
    System.out.println("- Using base directory: " + baseDirectory.getAbsolutePath());

    File mavenWrapperPropertyFile = new File(baseDirectory, MAVEN_WRAPPER_PROPERTIES_PATH);
    String downloadUrl = DEFAULT_DOWNLOAD_URL;

    if (mavenWrapperPropertyFile.exists()) {
      Properties mavenWrapperProperties = new Properties();
      try (InputStream is = java.nio.file.Files.newInputStream(mavenWrapperPropertyFile.toPath())) {
        mavenWrapperProperties.load(is);
        String wrapperUrl = mavenWrapperProperties.getProperty("wrapperUrl");
        if (wrapperUrl != null && !wrapperUrl.isBlank()) {
          downloadUrl = wrapperUrl;
        }
      } catch (IOException e) {
        System.out.println("- ERROR loading " + MAVEN_WRAPPER_PROPERTIES_PATH);
      }
    }

    System.out.println("- Downloading from: " + downloadUrl);

    File outputFile = new File(baseDirectory, MAVEN_WRAPPER_JAR_PATH);
    File outputDirectory = outputFile.getParentFile();
    if (!outputDirectory.exists() && !outputDirectory.mkdirs()) {
      System.out.println("- ERROR creating output directory " + outputDirectory.getAbsolutePath());
      return;
    }

    try {
      downloadFileFromURL(downloadUrl, outputFile);
      System.out.println("Done");
    } catch (Exception e) {
      System.out.println("- Error downloading");
      e.printStackTrace();
    }
  }

  private static void downloadFileFromURL(String urlString, File destination) throws Exception {
    URL website = new URL(urlString);
    try (InputStream in = website.openStream();
         ReadableByteChannel rbc = Channels.newChannel(in);
         FileOutputStream fos = new FileOutputStream(destination)) {
      fos.getChannel().transferFrom(rbc, 0, Long.MAX_VALUE);
    }
  }
}

