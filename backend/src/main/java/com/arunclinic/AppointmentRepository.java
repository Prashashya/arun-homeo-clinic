package com.arunclinic;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
public interface AppointmentRepository extends JpaRepository<Appointment, UUID> {
    List<Appointment> findByPatientIdOrderByAppointmentDateDesc(UUID patientId);
    @EntityGraph(attributePaths = "patient") List<Appointment> findAllByOrderByAppointmentDateDesc();
    @Override @EntityGraph(attributePaths = "patient") Optional<Appointment> findById(UUID id);
}

