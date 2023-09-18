package com.transtu.transtu.Service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.FileSystemUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Date;

@Service
public class StoregeService {
    Logger log = LoggerFactory.getLogger(this.getClass().getName());
    private final Path rootLocation = Paths.get("transtu/storage");
    private final Path abspath = rootLocation.toAbsolutePath();
    public String CreateNameImage(MultipartFile file){
        try {
            if (file != null && !file.isEmpty()) {
                int i = (int) new Date().getTime();
                String ch = Integer.toString(i);
                String fileName = ch.substring(0, ch.length() - 1);
                String ext = file.getOriginalFilename().substring(file.getOriginalFilename().indexOf('.'), file.getOriginalFilename().length());
                String name = file.getOriginalFilename().substring(0, file.getOriginalFilename().indexOf('.'));
                String original = name + fileName + ext;
                System.out.println(abspath);
                return original;
            } else {
                return "NofileNameHere.png";
            }
        }
            catch (Exception e) {
            throw new RuntimeException("FAIL!");
        }

    }

    public void store(MultipartFile file,String original) {
        try {
            if(!Files.exists(rootLocation)){
                init();
                log.info("File created: "+rootLocation);
            }
            Files.copy(file.getInputStream(), this.rootLocation.resolve(original));

        } catch (Exception e) {
            throw new RuntimeException("FAILED to store image :"+abspath);
        }
    }

    public Resource loadFile(String filename) {
        try {
            Path file = rootLocation.resolve(filename);
            Resource resource = new UrlResource(file.toUri());
            if (resource.exists() || resource.isReadable()) {
                return resource;
            } else {
                throw new RuntimeException("Failed to find ressource!");
            }
        } catch (MalformedURLException e) {
            throw new RuntimeException("ressource Malformed, check the absolute url!");
        }
    }

    public void deleteAll() {
        FileSystemUtils.deleteRecursively(rootLocation.toFile());
    }

    //@EventListener(ApplicationReadyEvent.class)
    public void init() {
        try {
            Files.createDirectory(rootLocation);
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize storage!");
        }
    }
}
