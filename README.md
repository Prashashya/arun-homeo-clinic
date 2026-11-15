# Arun Homeo Clinic

React patient portal with a Spring Boot API for patient accounts and appointment history.

## Local development

Requires Node.js 22 and Java 17 with Maven.

- npm install
- npm run dev
- In another terminal: cd backend
- Run: mvn spring-boot:run

The Vite development server runs on port 5173 and proxies API calls to Spring Boot on port 8080. H2 stores local account and appointment data under backend/data.

## Patient and admin accounts

Patients can register with their name, email, contact number, and password, request appointment dates, and view their appointment history. Admins can review requests and update their status.

Set CLINIC_ADMIN_EMAIL and CLINIC_ADMIN_PASSWORD before the first backend launch to create the initial admin. Use a dedicated email and a unique password of at least 12 characters. Public registration always creates patient accounts.

## Hosting

The React frontend is published to GitHub Pages by .github/workflows/deploy-pages.yml. The Spring Boot API and persistent PostgreSQL database run on Render using render.yaml.

After the Render API is created, set the GitHub repository Actions variable VITE_API_BASE_URL to its public URL. Enable GitHub Pages with GitHub Actions as the publishing source. The Pages address is https://prashashya.github.io/arun-homeo-clinic/.

Render's currently listed minimum plans for an always-on web service and persistent PostgreSQL are about $7/month and $6/month respectively, roughly $13/month before usage-based bandwidth or taxes. Free Render PostgreSQL expires after 30 days, so the deployment config uses a paid database plan.

Set CLINIC_JWT_SECRET to a unique random secret of at least 32 bytes if you deploy outside the Render Blueprint. Never use the development secret in production. Before using real accounts, configure backups, rate limiting, and a privacy and data-retention policy. The portal does not collect symptom or diagnosis details. Replace the clinic address, hours, and phone placeholders before publishing.

