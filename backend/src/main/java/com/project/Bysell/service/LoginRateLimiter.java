package com.project.Bysell.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

import java.time.Duration;
import java.util.concurrent.TimeUnit;

@Component
public class LoginRateLimiter {

    private static final int MAX_ATTEMPTS = 5;
    private static final Duration WINDOW = Duration.ofMinutes(15);
    private static final String KEY_PREFIX = "rate-limit:login:";

    private final StringRedisTemplate redisTemplate;

    @Autowired
    public LoginRateLimiter(StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public void checkAllowed(String email) {
        String value = redisTemplate.opsForValue().get(KEY_PREFIX + email);
        if (value == null) {
            return;
        }

        int failureCount = Integer.parseInt(value);
        if (failureCount >= MAX_ATTEMPTS) {
            Long secondsLeft = redisTemplate.getExpire(KEY_PREFIX + email, TimeUnit.SECONDS);
            long minutesLeft = (secondsLeft == null || secondsLeft < 0 ? WINDOW.toSeconds() : secondsLeft) / 60 + 1;
            throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS,
                    "Too many failed login attempts. Try again in " + minutesLeft + " minute(s).");
        }
    }

    public void recordFailure(String email) {
        String key = KEY_PREFIX + email;
        Long failureCount = redisTemplate.opsForValue().increment(key);
        if (failureCount != null && failureCount == 1L) {
            redisTemplate.expire(key, WINDOW);
        }
    }

    public void recordSuccess(String email) {
        redisTemplate.delete(KEY_PREFIX + email);
    }
}
