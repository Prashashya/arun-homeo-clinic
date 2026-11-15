# Arun Homeo Clinic

Responsive React patient portal and Spring Boot API for patient accounts and appointment history.

## Frontend

Requires Node.js 20.19+ or 22.12+ for Vite 8.

- npm install
- npm run dev

Vite runs on port 5173 and proxies \`/api\` requests to Spring Boot on port 8080.

## Backend

Requires Java 17+ and Maven.

- cd backend
- mvn spring-boot:run

H2 stores patient accounts and appointment records under \`backend/data\`. Patients can register, sign in, request appointment dates, and see their own history. An admin can review all appointment requests and update their status.

## Initial admin account

Set CLINIC_ADMIN_EMAIL and CLINIC_ADMIN_PASSWORD before the first backend launch. Use a unique password of at least 12 characters. The admin account is created once if the email does not already exist; public registration always creates patient accounts.

Set CLINIC_JWT_SECRET to a unique random secret of at least 32 bytes and CLINIC_FRONTEND_ORIGIN to the exact frontend origin before deployment. The development JWT secret is not suitable for production.

Before using real accounts, configure HTTPS, a production database, rate limiting, backups, and a privacy and data-retention policy. The portal intentionally does not collect symptom or diagnosis details. Appointment requests remain pending until the clinic confirms them. Replace the clinic address, hours, and phone placeholders before publishing.

