package com.intersify.config;


import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Expose the physical 'uploads' folder to the URL path '/uploads/'
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:uploads/");
    }
}
