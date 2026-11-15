package com.arunclinic;
import jakarta.persistence.*;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;
@Entity @Table(name = "appointments")
public class Appointment {
    @Id @GeneratedValue(strategy = GenerationType.UUID) private UUID id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "patient_id", nullable = false) private UserAccount patient;
    @Column(nullable = false) private LocalDate appointmentDate;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 16) private AppointmentStatus status = AppointmentStatus.PENDING;
    @Column(nullable = false, updatable = false) private Instant createdAt;
    protected Appointment() {}
    public Appointment(UserAccount patient, LocalDate date){this.patient=patient;this.appointmentDate=date;}
    @PrePersist void onCreate(){if(createdAt==null)createdAt=Instant.now();if(status==null)status=AppointmentStatus.PENDING;}
    public UUID getId(){return id;} public UserAccount getPatient(){return patient;} public LocalDate getAppointmentDate(){return appointmentDate;}
    public AppointmentStatus getStatus(){return status;} public Instant getCreatedAt(){return createdAt;} public void setStatus(AppointmentStatus value){status=value;}
}

