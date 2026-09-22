package com.flight.booking.service

import com.flight.booking.model.Booking
import com.flight.booking.repository.BookingRepository
import org.springframework.cache.annotation.CacheEvict
import org.springframework.cache.annotation.Cacheable
import org.springframework.stereotype.Service

@Service
class BookingService(private val repository: BookingRepository) {

    fun createBooking(booking: Booking): Booking {
        return repository.save(booking)
    }

    @Cacheable(value = ["bookings"], key = "#id")
    fun getBookingById(id: Long): Booking {
        return repository.findById(id).orElseThrow { RuntimeException("Booking not found") }
    }

    @CacheEvict(value = ["bookings"], key = "#id")
    fun cancelBooking(id: Long) {
        val booking = getBookingById(id)
        booking.status = "CANCELLED"
        repository.save(booking)
    }
}