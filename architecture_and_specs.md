# AutoAid System Architecture & Specifications

## 1. System Architecture

The AutoAid ecosystem is built on a Microservices-ready Monolith architecture to ensure low latency for real-time tracking while maintaining ease of development.

```ascii
[Customer App (RN)]      [Mechanic App (RN)]      [Admin Panel (React)]
        |                        |                        |
        +-----------+------------+                        |
                    | (HTTPS / WSS)                       | (HTTPS)
                    v                                     v
            [ Load Balancer / API Gateway (Nginx) ]
                            |
        +-------------------+-------------------+
        |                                       |
  [ API Server (Node/Express) ]       [ Socket.IO Server ]
  - Auth & RBAC                       - Real-time Location
  - Booking Logic                     - SOS Broadcasting
  - Payment Processing                - Job Status Updates
        |                                       |
        +-------------------+-------------------+
                            |
            +---------------+---------------+
            |                               |
    [ MongoDB Cluster ]              [ Redis Cache ]
    - Users (GeoJSON)                - Active Driver Locs
    - Bookings                       - Session Store
    - Transanctions

External Services:
- Google Maps API (Geocoding, Directions, Distance Matrix)
- Firebase FCM (Push Notifications)
- Razorpay / Paytm (Payment Gateways)
- Twilio (SMS OTP)
```

**Data Flow - SOS Request:**
1.  **Trigger:** Customer hits "SOS" in App.
2.  **API:** POST `/api/bookings/sos` sent with User Location.
3.  **Server:**
    *   Creates Booking record (Status: SEARCHING).
    *   Queries MongoDB `MechanicProfile` for `location` using `$near` operator.
4.  **Socket:** Server emits `sos_alert` event to specific socket IDs of nearby mechanics.
5.  **Mechanic App:** Receives alert, shows ringing screen.
6.  **Acceptance:** Mechanic accepts. Server updates Booking -> ASSIGNED.
7.  **Response:** Customer receives `mechanic_assigned` event via Socket.

---

## 2. Project Structure (Monorepo)

```text
autoaid-monorepo/
├── package.json
├── turbo.json (Turborepo config)
├── apps/
│   ├── customer-mobile/   # React Native (Expo)
│   ├── mechanic-mobile/   # React Native (Expo)
│   ├── admin-web/         # React (Vite) - THIS RUNTIME
│   └── backend-api/       # Node.js Express
├── packages/
│   ├── shared-types/      # TypeScript interfaces shared across all apps
│   ├── ui-kit/            # Shared React components
│   └── eslint-config/     # Shared linting rules
```

## 3. API Specification (Key Endpoints)

**Base URL:** `/api/v1`

| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| **Auth** | | | |
| POST | `/auth/send-otp` | Public | Send SMS OTP to phone number. |
| POST | `/auth/verify-otp` | Public | Verify OTP and return JWT. |
| **Bookings** | | | |
| POST | `/bookings/sos` | Customer | Emergency request. Payload: `{ lat, lng, type }` |
| POST | `/bookings/schedule`| Customer | Standard repair booking. |
| PUT | `/bookings/:id/status`| Mechanic | Update status (EN_ROUTE, ARRIVED, COMPLETED). |
| **Mechanics** | | | |
| PATCH | `/mechanics/location`| Mechanic | Heartbeat location update. Payload: `{ lat, lng }` |
| PUT | `/mechanics/availability`| Mechanic | Toggle Online/Offline. |
```