# Online Internship Portal

A platform that connects students with companies for internship opportunities. It enables rich student profiles, employer dashboards, internship listings, application tracking, resume uploads, and status updates.

## Features

- User authentication with JWT and social OAuth
- Internship listings and detailed views
- Student profiles and resume uploads
- Employer dashboards to manage postings and applicants
- Real-time notifications via WebSocket
- Application tracking with stages and status updates

## Tech Stack

- Frontend: React + Vite
- Backend: Java Spring Boot (Maven)
- Database: MySQL
- Storage/Media: Cloudinary and Firebase Storage

## Getting Started

### Prerequisites

- Node.js 18+
- Java 17+
- Maven (or use the provided Maven Wrapper)
- MySQL database instance

### Clone

```bash
git clone https://github.com/tushaar29/Internship-Portal-CDAC.git
cd Internship-Portal-CDAC
```

### Environment Variables

Create an `.env` file for the backend (in `intersify/`), referenced by `application.properties`. At minimum:

- DB_URL, DB_USERNAME, DB_PASSWORD
- JWT_SECRET
- CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
- FIREBASE_SERVICE_ACCOUNT_PATH, FIREBASE_STORAGE_BUCKET, FIREBASE_STORAGE_BASE_URL
- GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
- FACEBOOK_CLIENT_ID, FACEBOOK_CLIENT_SECRET
- MAIL_USERNAME, MAIL_PASSWORD

Do not commit secrets. The repository’s `.gitignore` prevents common env files from being tracked.

### Install and Run

#### Frontend (React + Vite)

```bash
cd intersify-frontend
npm install
npm run dev
```

The dev server prints a local URL (typically http://localhost:5173).

#### Backend (Spring Boot)

Using Maven Wrapper on Windows:

```bash
cd intersify
.\mvnw.cmd spring-boot:run
```

Or with Maven:

```bash
mvn spring-boot:run
```

By default the backend runs on http://localhost:8080.

## Folder Structure

```text
Internship-Portal-CDAC/
├─ intersify-frontend/            # Frontend (React + Vite)
│  ├─ src/
│  ├─ public/
│  ├─ package.json
│  ├─ vite.config.js
│  └─ dist/                       # Build output (ignored)
├─ intersify/                     # Backend (Spring Boot)
│  ├─ src/
│  │  ├─ main/java/com/intersify/...
│  │  └─ main/resources/application.properties
│  ├─ pom.xml
│  └─ target/                     # Build output (ignored)
├─ .gitignore
└─ README.md
```

## Development Notes

- Frontend uses `axios` for API calls and `react-router-dom` for routing.
- Backend uses Spring Security with JWT and social login integrations.
- MySQL connection is configured via environment variables.
- File uploads and media are handled via Cloudinary/Firebase.

## Scripts Reference

- Frontend:
  - `npm run dev`: Start Vite dev server
  - `npm run build`: Production build
  - `npm run preview`: Preview production build
  - `npm run lint`: Lint code
- Backend:
  - `mvn spring-boot:run`: Run the application
  - `mvn test`: Run tests (if configured)

## Contributing

- Fork and create feature branches from `main`.
- Open PRs with clear descriptions and screenshots where relevant.

## License

This project is proprietary to the owner of this repository. Update this section if a specific license is chosen.
