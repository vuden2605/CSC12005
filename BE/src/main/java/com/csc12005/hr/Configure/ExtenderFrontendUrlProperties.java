package com.csc12005.hr.Configure;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.util.ArrayList;
import java.util.List;

@Data
@Configuration
@ConfigurationProperties(prefix = "app.frontend-url")
public class ExtenderFrontendUrlProperties {
	List<String> urls = new ArrayList<>();
}
