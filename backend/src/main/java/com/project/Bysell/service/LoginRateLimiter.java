package com.project.Bysell.service;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

import java.time.Duration;
import java.time.Instant;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class LoginRateLimiter {

    private static final int MAX_ATTEMPTS = 5;
    private static final Duration WINDOW = Duration.ofMinutes(15);

    private final ConcurrentHashMap<String, AttemptRecord> attemptsByEmail = new ConcurrentHashMap<>();

    public void checkAllowed(String email) {
        AttemptRecord record = attemptsByEmail.get(email);
        if (record == null) {
            return;
        }

        Instant windowExpiry = record.windowStart().plus(WINDOW);
        if (Instant.now().isAfter(windowExpiry)) {
            attemptsByEmail.remove(email);
            return;
        }

        if (record.failureCount() >= MAX_ATTEMPTS) {
            long minutesLeft = Duration.between(Instant.now(), windowExpiry).toMinutes() + 1;
            throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS,
                    "Too many failed login attempts. Try again in " + minutesLeft + " minute(s).");
        }
    }

    public void recordFailure(String email) {
        attemptsByEmail.compute(email, (key, existing) -> {
            if (existing == null || Instant.now().isAfter(existing.windowStart().plus(WINDOW))) {
                return new AttemptRecord(1, Instant.now());
            }
            return new AttemptRecord(existing.failureCount() + 1, existing.windowStart());
        });
    }

    public void recordSuccess(String email) {
        attemptsByEmail.remove(email);
    }

    private record AttemptRecord(int failureCount, Instant windowStart) {
    }
}
