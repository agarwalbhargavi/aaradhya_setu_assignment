<div align="center">

<img src="assets/banner.svg" alt="PujaFlow banner with marigold garland and glowing diyas" width="100%"/>

<br/>

<a href="https://git.io/typing-svg"><img src="https://readme-typing-svg.demolab.com?font=Georgia&weight=600&size=22&duration=3000&pause=900&color=E85D04&center=true&vCenter=true&width=700&lines=Booking+Confirmed+%E2%86%92+Puja+Started;Puja+Started+%E2%86%92+Puja+Completed;Puja+Completed+%E2%86%92+Video+Available;Every+status+change+notifies+the+devotee" alt="Typing animation of the workflow"/></a>

<br/>

![React](https://img.shields.io/badge/React-Vite-ff9f1c?style=for-the-badge&logo=react&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-e85d04?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Node](https://img.shields.io/badge/Node.js-Express-2d8a4e?style=for-the-badge&logo=nodedotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-7a1b12?style=for-the-badge&logo=mongodb&logoColor=white)
![Status](https://img.shields.io/badge/status-in%20progress-ffbf00?style=for-the-badge)

</div>

<img src="assets/divider.svg" width="100%" alt=""/>

## 🪔 About

**PujaFlow** is a full-stack workflow system for managing puja bookings. An admin moves each booking through four stages, and every transition automatically generates a **WhatsApp-style notification** for the devotee, built from a template and saved to a history log.

> WhatsApp messages are **mocked**. No real messaging API is needed.

<img src="assets/divider.svg" width="100%" alt=""/>

## 🌼 Features

| | Feature | Details |
|---|---|---|
| 🛕 | **Admin dashboard** | View all bookings and move any booking to its next stage with one click |
| 🔁 | **Guided workflow** | Strict, ordered status flow, with no skipping and no going backwards |
| 💬 | **Auto notifications** | Every status change instantly creates a notification message |
| 🧾 | **Dynamic templates** | Messages filled with the devotee name, Puja name and booking ID |
| 📜 | **Notification history** | Every message is saved in MongoDB and shown in the UI |
| 🎭 | **Mock WhatsApp** | Messages are logged and displayed like chat bubbles, with no external API |

<img src="assets/divider.svg" width="100%" alt=""/>

## 🔄 Workflow

```
 ┌──────────────────┐    ┌───────────────┐    ┌─────────────────┐    ┌─────────────────┐
 │ Booking Confirmed│ ─► │ Puja Started  │ ─► │ Puja Completed  │ ─► │ Video Available │
 └──────────────────┘    └───────────────┘    └─────────────────┘    └─────────────────┘
          │                      │                     │                      │
          ▼                      ▼                     ▼                      ▼
     notification           notification          notification           notification
```

### 💌 Notification templates

| Status | Template |
|---|---|
| `BOOKING_CONFIRMED` | 🙏 Namaste **{{devoteeName}}**, your booking **#{{bookingId}}** for **{{pujaName}}** is confirmed. |
| `PUJA_STARTED` | 🪔 **{{devoteeName}}**, the **{{pujaName}}** (Booking **#{{bookingId}}**) has begun. |
| `PUJA_COMPLETED` | 🌸 **{{devoteeName}}**, your **{{pujaName}}** (Booking **#{{bookingId}}**) is complete. Blessings to you and your family. |
| `VIDEO_AVAILABLE` | 🎥 **{{devoteeName}}**, the video of your **{{pujaName}}** (Booking **#{{bookingId}}**) is now available. |

<img src="assets/divider.svg" width="100%" alt=""/>

## 🏛️ Architecture

```mermaid
flowchart TD
    A([👤 Admin]) --> B[⚛️ React Frontend]
    B -- HTTP Requests --> C[🟢 Express Backend]
    C --> D[🔁 Workflow Service]
    C --> E[💬 Notification Service]
    D --> F[(🍃 MongoDB)]
    E --> F
```

<details>
<summary>ASCII version</summary>

```
                ADMIN
                  |
                  v
         +------------------+
         |  React Frontend  |
         +------------------+
                  |
                  | HTTP Requests
                  v
         +------------------+
         |  Express Backend |
         +------------------+
                  |
         +--------+--------+
         |                 |
         v                 v
  +-------------+   +----------------+
  |  Workflow   |   | Notification   |
  |  Service    |   | Service        |
  +-------------+   +----------------+
         |                 |
         +--------+--------+
                  |
                  v
         +------------------+
         |     MongoDB      |
         +------------------+
```

</details>

<img src="assets/divider.svg" width="100%" alt=""/>

## 🧰 Tech Stack

| Component | Technology | Purpose |
|---|---|---|
| Frontend | React + Vite | Build the admin interface |
| Styling | Tailwind CSS | Create a responsive, professional UI |
| Backend | Node.js | Run JavaScript on the server |
| Framework | Express.js | Build REST APIs |
| Database | MongoDB | Store bookings and notifications |
| ODM | Mongoose | Define schemas and interact with MongoDB |
| API testing | Postman | Test backend endpoints |
| Version control | Git + GitHub | Track changes and share the project |

<img src="assets/divider.svg" width="100%" alt=""/>

## 🗂️ Project Structure

```
PujaFlow/
├── client/                    # React + Vite admin UI
│   └── src/
│       ├── components/        # BookingTable, StatusButton, NotificationList
│       ├── pages/             # Dashboard, BookingDetails
│       └── api/               # Axios helpers
├── server/
│   ├── config/                # DB connection
│   ├── models/                # Booking.js, Notification.js
│   ├── services/
│   │   ├── workflowService.js       # status transitions + validation
│   │   └── notificationService.js   # templates + mock WhatsApp
│   ├── controllers/
│   ├── routes/
│   └── server.js
└── README.md
```

<img src="assets/divider.svg" width="100%" alt=""/>

## 🗃️ Data Models

**Booking**

```js
{
  devoteeName: String,
  phone: String,
  pujaName: String,
  status: {
    type: String,
    enum: ["BOOKING_CONFIRMED", "PUJA_STARTED", "PUJA_COMPLETED", "VIDEO_AVAILABLE"],
    default: "BOOKING_CONFIRMED"
  },
  createdAt: Date
}
```

**Notification**

```js
{
  booking: { type: ObjectId, ref: "Booking" },
  status: String,
  message: String,
  channel: { type: String, default: "WHATSAPP_MOCK" },
  sentAt: Date
}
```

<img src="assets/divider.svg" width="100%" alt=""/>

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/bookings` | Create a booking (starts at *Booking Confirmed*) |
| `GET` | `/api/bookings` | List all bookings |
| `GET` | `/api/bookings/:id` | Get a single booking |
| `PATCH` | `/api/bookings/:id/status` | Move to the next status and trigger a notification |
| `GET` | `/api/notifications` | Full notification history |
| `GET` | `/api/notifications/booking/:id` | Notifications for one booking |

<img src="assets/divider.svg" width="100%" alt=""/>

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Git

### 1. Clone

```bash
git clone https://github.com/agarwalbhargavi/pujaflow.git
cd pujaflow
```

### 2. Backend

```bash
cd server
npm install
cp .env.example .env     # add your MongoDB URI
npm run dev
```

`.env`

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/pujaflow
```

### 3. Frontend

```bash
cd client
npm install
npm run dev
```

Open **http://localhost:5173** 🎉

<img src="assets/divider.svg" width="100%" alt=""/>

## 🧪 Testing with Postman

1. `POST /api/bookings` with a devotee name, phone and Puja name
2. `PATCH /api/bookings/:id/status` four times, once per stage
3. `GET /api/notifications/booking/:id` to see the generated messages

<img src="assets/divider.svg" width="100%" alt=""/>

## 🗺️ Roadmap

- [x] Booking model and REST APIs
- [x] Sequential workflow service
- [x] Template-based notifications
- [x] Notification history
- [ ] Admin dashboard UI polish
- [ ] Filters and search on bookings
- [ ] Real WhatsApp integration (optional)
- [ ] Devotee-facing booking page

<img src="assets/divider.svg" width="100%" alt=""/>

## 👩‍💻 Author

**Bhargavi**

[![GitHub](https://img.shields.io/badge/GitHub-agarwalbhargavi-181717?style=for-the-badge&logo=github)](https://github.com/agarwalbhargavi)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Bhargavi-0A66C2?style=for-the-badge&logo=linkedin)](https://linkedin.com/in/bhargavi-agarwal-345675270)
[![Portfolio](https://img.shields.io/badge/Portfolio-Visit-e85d04?style=for-the-badge&logo=vercel)](https://bhargavi-portfolio-one.vercel.app)

<br/>

<img src="assets/footer.svg" width="100%" alt="Row of glowing diyas"/>

<div align="center">

⭐ If you liked this project, give it a star.

</div>
