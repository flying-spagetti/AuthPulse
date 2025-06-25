###🔐 AuthFlow Documentation
Project Overview
This project is a dual-backend authentication system using a React (Vite + TS) frontend with Node.js (Express) and Go backends. It aims to provide a secure, modular, and scalable authentication mechanism that can switch between backend services and display real-time system status to the user.

⚙️ Stack Summary
Layer	Tech Stack
Frontend	React + TypeScript (Vite)
Backend	Node.js (Express), Go (net/http)
Auth	JWT (httpOnly cookies), Argon2/Bcrypt
Misc	ULID, Helmet, CORS, Rate-Limit

🔁 Auth Flow
1. Login Attempt
User enters credentials into the login form.

A POST request is sent to /api/login on the first available backend (3000 for Node, 8080 for Go).

If credentials match (username + password), a JWT is generated and sent as an httpOnly cookie.

2. JWT Cookie Handling
JWTs are stored in httpOnly cookies to protect against XSS.

Cookies include:

secure (true in production)

sameSite: 'lax'

maxAge: 3600 (1 hour)

3. Auto-Login / Protected Routes
On mount, the frontend pings /api/protected on both backends.

If a valid token is present, the user is redirected to /page1.

If not, the user remains on the login page.

4. Status Bar
Frontend pings both ports and checks which backend is responding.

Shows the active service and backend info (language, framework, port, hash algo, jwt method, ULID usage, environment).

🔐 Security Measures
Measure	Implemented In	Description
Argon2id Hashing	Node (argon2)	Passwords hashed using Argon2id before comparison
Plain comparison	Go	Go backend uses dummy plaintext (can be replaced with Argon2id/Bcrypt)
JWT with Expiry	Both	Token expires in 1 hour
Secure httpOnly Cookie	Both	Prevents client-side JS access to the token
Helmet + CORS + Rate Limit	Node	Prevents common attacks (headers + spam + CSRF resilience)
CORS + credentials	Both	Allows cookie-based auth from the frontend (port 5173)

📁 Directory Structure
pgsql
Copy
Edit
project-root/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── StatusBar.tsx
│   │   ├── pages/
│   │   │   └── Login.tsx
│   │   └── main.tsx, App.tsx, etc.
│   └── public/
├── backend-node/
│   └── server.ts
├── backend-go/
│   └── server.go
└── authflow.md
🧠 Design Philosophy
Redundancy: Two backend services offer failover or hybrid deployment.

Transparency: Real-time info shown to users via StatusBar.

Scalability: Directory structure and modular code allow service expansion.

Security-first: Uses industry best practices for password hashing, cookie flags, rate limiting, and content security.

🚀 Planned Features (Future Work)
✅ Token refresh and expiration handling

✅ Dynamic backend selection based on health

✅ Database integration for real user registration/login

⬜ OAuth (Google/GitHub/Apple)

⬜ User roles and permissions

⬜ Password reset and email verification

⬜ Admin panel for service observability