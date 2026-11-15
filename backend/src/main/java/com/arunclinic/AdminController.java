package com.arunclinic;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
@RestController @RequestMapping("/api/admin") @PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    private final AppointmentRepository appointments;
    public AdminController(AppointmentRepository appointments) { this.appointments=appointments; }
    @GetMapping("/appointments")
    public List<AdminAppointmentView> all() {
        return appointments.findAllByOrderByAppointmentDateDesc().stream().map(AdminAppointmentView::from).toList();
    }
    @PutMapping("/appointments/{id}/status")
    public AdminAppointmentView update(@PathVariable UUID id, @Valid @RequestBody UpdateAppointmentStatusRequest request) {
        Appointment appointment = appointments.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Appointment not found."));
        appointment.setStatus(request.status());
        return AdminAppointmentView.from(appointments.save(appointment));
    }
}

