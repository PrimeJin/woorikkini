package com.ssafy.kkini.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.AsyncConfigurer;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.concurrent.Executor;

@Configuration
@EnableAsync
public class AsyncConfig implements AsyncConfigurer {

    @Bean(name = "sendEmailTaskExecutor")
    public ThreadPoolTaskExecutor sendEmailTaskExecutor() {
        ThreadPoolTaskExecutor taskExecutor = new ThreadPoolTaskExecutor();
        taskExecutor.setCorePoolSize(5);
        taskExecutor.setMaxPoolSize(30);
        taskExecutor.setQueueCapacity(100);  //Queue 사이즈
        taskExecutor.setThreadNamePrefix("Executor");
        taskExecutor.initialize();
        return taskExecutor;
    }

    @Bean(name = "passwordFindTaskExecutor")
    public ThreadPoolTaskExecutor passwordFindTaskExecutor() {
        ThreadPoolTaskExecutor taskExecutor = new ThreadPoolTaskExecutor();
        taskExecutor.setCorePoolSize(5);
        taskExecutor.setMaxPoolSize(30);
        taskExecutor.setQueueCapacity(100);  //Queue 사이즈
        taskExecutor.setThreadNamePrefix("Executor2");
        taskExecutor.initialize();
        return taskExecutor;
    }

    @Bean(name = "emailCheckTaskExecutor")
    public ThreadPoolTaskExecutor emailCheckTaskExecutor() {
        ThreadPoolTaskExecutor taskExecutor = new ThreadPoolTaskExecutor();
        taskExecutor.setCorePoolSize(5);
        taskExecutor.setMaxPoolSize(30);
        taskExecutor.setQueueCapacity(100);  //Queue 사이즈
        taskExecutor.setThreadNamePrefix("Executor3");
        taskExecutor.initialize();
        return taskExecutor;
    }
}
