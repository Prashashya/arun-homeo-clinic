package com.arunclinic;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
@RestController @RequestMapping("/api/patient")
public class PatientController {
    private final UserAccountRepository users;
    private final AppointmentRepository appointments;
    public PatientController(UserAccountRepository users, AppointmentRepository appointments) { this.users=users; this.appointments=appointments; }
    @GetMapping("/appointments")
    public List<PatientAppointmentView> history(Authentication auth) {
        UserAccount patient = currentPatient(auth);
        return appointments.findByPatientIdOrderByAppointmentDateDesc(patient.getId()).stream().map(PatientAppointmentView::from).toList();
    }
    @PostMapping("/appointments") @ResponseStatus(HttpStatus.CREATED)
    public PatientAppointmentView request(@Valid @RequestBody CreateAppointmentRequest request, Authentication auth) {
        return PatientAppointmentView.from(appointments.save(new Appointment(currentPatient(auth), request.appointmentDate())));
    }
    private UserAccount currentPatient(Authentication auth) {
        return users.findByEmailIgnoreCase(auth.getName())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Please sign in again."));
    }
}

