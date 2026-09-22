package com.flight.booking.controller

import com.flight.booking.model.Booking
import com.flight.booking.service.BookingService
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/bookings")
class BookingController(private val service: BookingService) {

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun createBooking(@RequestBody booking: Booking): Booking {
        return service.createBooking(booking)
    }

    @GetMapping("/{id}")
    fun getBooking(@PathVariable id: Long): Booking {
        return service.getBookingById(id)
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun cancelBooking(@PathVariable id: Long) {
        service.cancelBooking(id)
    }
}
