package com.arunclinic;
import jakarta.validation.constraints.*;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;
record CreateAppointmentRequest(@NotNull @FutureOrPresent LocalDate appointmentDate) {}
record UpdateAppointmentStatusRequest(@NotNull AppointmentStatus status) {}
record PatientAppointmentView(UUID id,LocalDate appointmentDate,String status,Instant createdAt) {
    static PatientAppointmentView from(Appointment a){return new PatientAppointmentView(a.getId(),a.getAppointmentDate(),a.getStatus().name(),a.getCreatedAt());}
}
record AdminAppointmentView(UUID id,LocalDate appointmentDate,String status,Instant createdAt,String patientName,String patientEmail,String patientPhone) {
    static AdminAppointmentView from(Appointment a){UserAccount p=a.getPatient();return new AdminAppointmentView(a.getId(),a.getAppointmentDate(),a.getStatus().name(),a.getCreatedAt(),p.getName(),p.getEmail(),p.getPhone());}
}

