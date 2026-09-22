package com.flight.booking.model

import jakarta.persistence.*
import java.io.Serializable
import java.time.LocalDateTime

@Entity
@Table(name = "bookings")
data class Booking(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,
    val passengerName: String = "",
    val flightNumber: String = "",
    val seatNumber: String = "",
    var status: String = "CONFIRMED",
    val createdAt: LocalDateTime = LocalDateTime.now()
) : Serializable