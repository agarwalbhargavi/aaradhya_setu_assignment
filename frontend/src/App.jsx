import { useEffect, useState } from "react";

import {
  LayoutDashboard,
  CalendarDays,
  Plus,
  Search,
  Bell,
  CheckCircle2,
  Clock3,
  PlayCircle,
  Video,
  ArrowRight,
  X,
  Menu,
  RefreshCw,
  MessageCircle,
  Flower2,
  ChevronRight,
  AlertCircle,
  Sparkles,
  Heart,
  Inbox,
} from "lucide-react";

import { bookingAPI } from "./services/api";

import "./App.css";

// ==========================================
// WORKFLOW CONFIGURATION
// ==========================================

const WORKFLOW = [
  {
    status: "BOOKING_CONFIRMED",
    label: "Booking Confirmed",
    shortLabel: "Confirmed",
    action: "Start Puja",
    icon: CheckCircle2,
  },
  {
    status: "PUJA_STARTED",
    label: "Puja Started",
    shortLabel: "In Progress",
    action: "Complete Puja",
    icon: PlayCircle,
  },
  {
    status: "PUJA_COMPLETED",
    label: "Puja Completed",
    shortLabel: "Completed",
    action: "Make Video Available",
    icon: Heart,
  },
  {
    status: "VIDEO_AVAILABLE",
    label: "Video Available",
    shortLabel: "Video Ready",
    action: null,
    icon: Video,
  },
];

const getStageIndex = (status) =>
  WORKFLOW.findIndex((stage) => stage.status === status);

const formatDate = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatDateTime = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
};

// ==========================================
// SIDEBAR
// ==========================================

function Sidebar({ activePage, setActivePage, open, setOpen }) {
  const navigation = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    page: "dashboard",
  },
  {
    label: "All Bookings",
    icon: CalendarDays,
    page: "bookings",
  },
  {
    label: "WhatsApp Notifications",
    icon: MessageCircle,
    page: "notifications",
  },
];

  return (
    <>
      {open && (
        <div
          className="sidebar-overlay"
          onClick={() => setOpen(false)}
        />
      )}

      <aside className={`sidebar ${open ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-icon">
            <Flower2 size={26} />
          </div>

          <div>
            <h1>PujaFlow</h1>
            <p>by Aaradhya Setu</p>
          </div>
        </div>

        <div className="sidebar-section-label">WORKSPACE</div>

        <nav className="sidebar-nav">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.page}
                className={`nav-item ${
                  activePage === item.page ? "active" : ""
                }`}
                onClick={() => {
                  setActivePage(item.page);
                  setOpen(false);
                }}
              >
                <Icon size={19} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-blessing">
            <Flower2 size={22} />
            <p>
              Every prayer,
              <br />
              thoughtfully managed.
            </p>
          </div>

          <div className="admin-profile">
            <div className="admin-avatar">A</div>

            <div>
              <strong>Administrator</strong>
              <span>Puja Management</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

// ==========================================
// STATISTICS CARD
// ==========================================

function StatCard({ title, value, icon: Icon, variant }) {
  return (
    <div className={`stat-card stat-${variant}`}>
      <div className="stat-top">
        <span>{title}</span>

        <div className="stat-icon">
          <Icon size={21} />
        </div>
      </div>

      <h2>{value}</h2>

      <div className="stat-footer">
        <span className="stat-dot" />
        Live booking data
      </div>
    </div>
  );
}

// ==========================================
// STATUS BADGE
// ==========================================

function StatusBadge({ status }) {
  const stage = WORKFLOW.find((item) => item.status === status);

  return (
    <span className={`status-badge status-${status}`}>
      <span className="badge-dot" />
      {stage?.shortLabel || status}
    </span>
  );
}

// ==========================================
// CREATE BOOKING MODAL
// ==========================================

function CreateBookingModal({ onClose, onCreate, saving }) {
  const [form, setForm] = useState({
    bookingId: "",
    devoteeName: "",
    pujaName: "",
  });

  const [error, setError] = useState("");

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !form.bookingId.trim() ||
      !form.devoteeName.trim() ||
      !form.pujaName.trim()
    ) {
      setError("Please fill in all fields.");
      return;
    }

    setError("");

    try {
      await onCreate({
        bookingId: form.bookingId.trim(),
        devoteeName: form.devoteeName.trim(),
        pujaName: form.pujaName.trim(),
      });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div
        className="modal-card"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <div className="eyebrow">NEW BOOKING</div>
            <h2>Create Puja Booking</h2>
            <p>Begin a new devotional journey.</p>
          </div>

          <button
            className="icon-button"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="booking-form">
          <label>
            Booking ID
            <input
              name="bookingId"
              placeholder="e.g. AS1003"
              value={form.bookingId}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Devotee Name
            <input
              name="devoteeName"
              placeholder="Enter devotee's full name"
              value={form.devoteeName}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Puja Name
            <input
              name="pujaName"
              placeholder="e.g. Rudrabhishek Puja"
              value={form.pujaName}
              onChange={handleChange}
              required
            />
          </label>

          {error && (
            <div className="form-error">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <div className="modal-actions">
            <button
              type="button"
              className="button-secondary"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="button-primary"
              disabled={saving}
            >
              {saving ? "Creating..." : "Create Booking"}
              {!saving && <ArrowRight size={17} />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ==========================================
// NOTIFICATION HISTORY
// ==========================================

function NotificationHistory({ notifications, loading }) {
  if (loading) {
    return (
      <div className="empty-notifications">
        Loading notifications...
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="empty-notifications">
        <Inbox size={30} />
        <p>No notifications generated yet.</p>
      </div>
    );
  }

  return (
    <div className="notification-list">
      {notifications.map((notification) => (
        <div
          className="notification-item"
          key={notification._id}
        >
          <div className="notification-icon">
            <MessageCircle size={18} />
          </div>

          <div className="notification-content">
            <div className="notification-top">
              <strong>
                {WORKFLOW.find(
                  (item) => item.status === notification.status
                )?.label || notification.status}
              </strong>

              <span>
                {formatDateTime(notification.createdAt)}
              </span>
            </div>

            <div className="whatsapp-message">
              {notification.message}
            </div>

            <div className="notification-meta">
              <span className="whatsapp-label">
                <MessageCircle size={13} />
                WhatsApp Mock
              </span>

              <span className="mocked-label">
                {notification.deliveryStatus}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ==========================================
// WHATSAPP NOTIFICATIONS PAGE
// ==========================================

function WhatsAppNotificationsPage({ bookings }) {
  const [allNotifications, setAllNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");

  const loadAllNotifications = async () => {
    try {
      setLoading(true);
      setError("");

      // Fetch notification histories for all bookings
      const results = await Promise.allSettled(
        bookings.map(async (booking) => {
          const response = await bookingAPI.getNotifications(
            booking.bookingId
          );

          return (response.data || []).map((notification) => ({
            ...notification,
            devoteeName: booking.devoteeName,
            pujaName: booking.pujaName,
          }));
        })
      );

      const notifications = results
        .filter((result) => result.status === "fulfilled")
        .flatMap((result) => result.value);

      const failedCount = results.filter(
        (result) => result.status === "rejected"
      ).length;

      if (failedCount > 0) {
        setError(
          `Could not load notifications for ${failedCount} booking(s).`
        );
      }

      // Newest notifications first
      notifications.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      );

      setAllNotifications(notifications);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllNotifications();
  }, [bookings]);

  const filteredNotifications = allNotifications.filter(
    (notification) => {
      const query = search.toLowerCase();

      const matchesSearch =
        notification.bookingId?.toLowerCase().includes(query) ||
        notification.devoteeName?.toLowerCase().includes(query) ||
        notification.pujaName?.toLowerCase().includes(query) ||
        notification.message?.toLowerCase().includes(query);

      const matchesFilter =
        filter === "ALL" || notification.status === filter;

      return matchesSearch && matchesFilter;
    }
  );

  return (
    <section className="whatsapp-page">
      <div className="whatsapp-page-header">
        <div>
          <div className="eyebrow">
            <MessageCircle size={15} />
            COMMUNICATION CENTER
          </div>

          <h2>WhatsApp Notifications</h2>

          <p>
            View every personalized notification generated
            throughout the puja booking journey.
          </p>
        </div>

        <button
          className="refresh-button"
          onClick={loadAllNotifications}
          disabled={loading}
        >
          <RefreshCw
            size={16}
            className={loading ? "spin" : ""}
          />
          Refresh
        </button>
      </div>

      <div className="whatsapp-summary">
        <div className="whatsapp-summary-icon">
          <MessageCircle size={24} />
        </div>

        <div>
          <span>Total Generated Messages</span>
          <strong>{allNotifications.length}</strong>
        </div>

        <span className="whatsapp-mode-badge">
          SIMULATED DELIVERY
        </span>
      </div>

      <div className="whatsapp-controls">
        <div className="search-box">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search booking, devotee or message..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="whatsapp-filters">
          {[
            { label: "All", value: "ALL" },
            { label: "Confirmed", value: "BOOKING_CONFIRMED" },
            { label: "Started", value: "PUJA_STARTED" },
            { label: "Completed", value: "PUJA_COMPLETED" },
            { label: "Video Ready", value: "VIDEO_AVAILABLE" },
          ].map((item) => (
            <button
              key={item.value}
              className={`filter-button ${
                filter === item.value ? "selected" : ""
              }`}
              onClick={() => setFilter(item.value)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="error-banner">
          <AlertCircle size={17} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="whatsapp-empty">
          Loading WhatsApp notifications...
        </div>
      ) : filteredNotifications.length === 0 ? (
        <div className="whatsapp-empty">
          <Inbox size={34} />
          <h3>No notifications found</h3>
          <p>
            Notifications will appear here when bookings
            are created or their statuses change.
          </p>
        </div>
      ) : (
        <div className="whatsapp-grid">
          {filteredNotifications.map((notification) => (
            <article
              className="whatsapp-card"
              key={notification._id}
            >
              <div className="whatsapp-card-header">
                <div className="whatsapp-card-icon">
                  <MessageCircle size={19} />
                </div>

                <div>
                  <h3>
                    {WORKFLOW.find(
                      (stage) =>
                        stage.status === notification.status
                    )?.label || notification.status}
                  </h3>

                  <span>
                    {formatDateTime(notification.createdAt)}
                  </span>
                </div>

                <span className="whatsapp-card-status">
                  {notification.deliveryStatus}
                </span>
              </div>

              <div className="whatsapp-booking-info">
                <div>
                  <span>BOOKING</span>
                  <strong>{notification.bookingId}</strong>
                </div>

                <div>
                  <span>DEVOTEE</span>
                  <strong>{notification.devoteeName}</strong>
                </div>

                <div>
                  <span>PUJA</span>
                  <strong>{notification.pujaName}</strong>
                </div>
              </div>

              <div className="whatsapp-chat-background">
                <div className="whatsapp-chat-bubble">
                  {notification.message}
                </div>
              </div>

              <div className="whatsapp-card-footer">
                <span>
                  <MessageCircle size={14} />
                  WhatsApp Mock
                </span>

                <span>
                  Generated · Not actually sent
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

// ==========================================
// BOOKING DETAILS DRAWER
// ==========================================

function BookingDetails({
  booking,
  notifications,
  notificationsLoading,
  onClose,
  onAdvance,
  advancing,
}) {
  const currentIndex = getStageIndex(booking.status);

  const nextStage = WORKFLOW[currentIndex + 1];

  return (
    <div className="drawer-backdrop" onMouseDown={onClose}>
      <aside
        className="details-drawer"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="drawer-header">
          <div>
            <div className="eyebrow">BOOKING DETAILS</div>
            <h2>{booking.bookingId}</h2>
          </div>

          <button
            className="icon-button"
            onClick={onClose}
            aria-label="Close details"
          >
            <X size={20} />
          </button>
        </div>

        <div className="drawer-scroll">
          <div className="devotee-card">
            <div className="devotee-avatar">
              {booking.devoteeName?.charAt(0).toUpperCase()}
            </div>

            <div>
              <span>DEVOTEE</span>
              <h3>{booking.devoteeName}</h3>
              <p>{booking.pujaName}</p>
            </div>
          </div>

          <div className="detail-meta">
            <div>
              <span>Booking Date</span>
              <strong>{formatDate(booking.createdAt)}</strong>
            </div>

            <div>
              <span>Current Status</span>
              <StatusBadge status={booking.status} />
            </div>
          </div>

          <div className="section-heading">
            <h3>Puja Journey</h3>
            <span>
              Step {currentIndex + 1} of {WORKFLOW.length}
            </span>
          </div>

          <div className="workflow-timeline">
            {WORKFLOW.map((stage, index) => {
              const Icon = stage.icon;
              const completed = index <= currentIndex;
              const current = index === currentIndex;

              return (
                <div
                  key={stage.status}
                  className={`timeline-step ${
                    completed ? "completed" : ""
                  } ${current ? "current" : ""}`}
                >
                  <div className="timeline-marker">
                    <Icon size={18} />
                  </div>

                  <div className="timeline-text">
                    <strong>{stage.label}</strong>

                    <span>
                      {current
                        ? "Current stage"
                        : completed
                        ? "Completed"
                        : "Upcoming"}
                    </span>
                  </div>

                  {completed && (
                    <CheckCircle2
                      className="timeline-check"
                      size={17}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {nextStage ? (
            <button
              className="button-primary advance-button"
              disabled={advancing}
              onClick={() => onAdvance(booking, nextStage.status)}
            >
              {advancing ? "Updating..." : WORKFLOW[currentIndex].action}

              {!advancing && <ArrowRight size={18} />}
            </button>
          ) : (
            <div className="workflow-complete">
              <CheckCircle2 size={20} />
              All stages completed successfully.
            </div>
          )}

          <div className="notifications-section">
            <div className="section-heading">
              <div>
                <h3>Notification History</h3>
                <p>Automatically generated WhatsApp messages</p>
              </div>

              <span className="notification-count">
                {notifications.length}
              </span>
            </div>

            <NotificationHistory
              notifications={notifications}
              loading={notificationsLoading}
            />
          </div>
        </div>
      </aside>
    </div>
  );
}

// ==========================================
// MAIN APP
// ==========================================

function App() {
  const [bookings, setBookings] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [activePage, setActivePage] = useState("dashboard");

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [createModalOpen, setCreateModalOpen] = useState(false);

  const [saving, setSaving] = useState(false);

  const [selectedBooking, setSelectedBooking] = useState(null);

  const [notifications, setNotifications] = useState([]);

  const [notificationsLoading, setNotificationsLoading] =
    useState(false);

  const [advancing, setAdvancing] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");

  // ==========================================
  // LOAD BOOKINGS
  // ==========================================

  const loadBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await bookingAPI.getAll();

      setBookings(response.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  // ==========================================
  // LOAD NOTIFICATIONS
  // ==========================================

  const loadNotifications = async (bookingId) => {
    try {
      setNotificationsLoading(true);

      const response = await bookingAPI.getNotifications(bookingId);

      setNotifications(response.data || []);
    } catch (err) {
      setError(err.message);
      setNotifications([]);
    } finally {
      setNotificationsLoading(false);
    }
  };

  // ==========================================
  // OPEN BOOKING
  // ==========================================

  const openBooking = async (booking) => {
    setSelectedBooking(booking);
    setNotifications([]);
    await loadNotifications(booking.bookingId);
  };

  // ==========================================
  // CREATE BOOKING
  // ==========================================

  const handleCreateBooking = async (bookingData) => {
    try {
      setSaving(true);

      await bookingAPI.create(bookingData);

      setCreateModalOpen(false);

      setSuccessMessage("Booking created successfully!");

      await loadBookings();

      setTimeout(() => setSuccessMessage(""), 4000);
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // ADVANCE WORKFLOW
  // ==========================================

  const handleAdvanceBooking = async (booking, nextStatus) => {
    try {
      setAdvancing(true);
      setError("");

      const response = await bookingAPI.updateStatus(
        booking.bookingId,
        nextStatus
      );

      setSelectedBooking(response.data);

      setSuccessMessage("Booking status updated successfully!");

      await Promise.all([
        loadBookings(),
        loadNotifications(booking.bookingId),
      ]);

      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err) {
      setError(err.message);
    } finally {
      setAdvancing(false);
    }
  };

  // ==========================================
  // DASHBOARD STATISTICS
  // ==========================================

  const stats = {
    total: bookings.length,

    confirmed: bookings.filter(
      (booking) => booking.status === "BOOKING_CONFIRMED"
    ).length,

    started: bookings.filter(
      (booking) => booking.status === "PUJA_STARTED"
    ).length,

    completed: bookings.filter(
      (booking) => booking.status === "PUJA_COMPLETED"
    ).length,

    videos: bookings.filter(
      (booking) => booking.status === "VIDEO_AVAILABLE"
    ).length,
  };

  // ==========================================
  // SEARCH FILTER
  // ==========================================

  const filteredBookings = bookings.filter((booking) => {
    const query = search.toLowerCase();

    return (
      booking.bookingId?.toLowerCase().includes(query) ||
      booking.devoteeName?.toLowerCase().includes(query) ||
      booking.pujaName?.toLowerCase().includes(query)
    );
  });

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="app-shell">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        open={sidebarOpen}
        setOpen={setSidebarOpen}
      />

      <main className="main-content">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="mobile-menu icon-button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>

            <div className="breadcrumb">
              Workspace
              <ChevronRight size={15} />
              <strong>
                {activePage === "dashboard"
                  ? "Dashboard"
                  : "All Bookings"}
              </strong>
            </div>
          </div>

          <div className="topbar-right">
            <span className="live-indicator">
              <span />
              Live Dashboard
            </span>

            <div className="topbar-avatar">A</div>
          </div>
        </header>

        <div className="page-content">
          {successMessage && (
            <div className="toast-success">
              <CheckCircle2 size={18} />
              {successMessage}
            </div>
          )}

          {error && (
            <div className="error-banner">
              <AlertCircle size={18} />
              <span>{error}</span>

              <button
                onClick={() => setError("")}
                aria-label="Dismiss error"
              >
                <X size={16} />
              </button>
            </div>
          )}

          <div className="page-heading">
            <div>
              <div className="eyebrow">
                <Sparkles size={14} />
                AARADHYA SETU
              </div>

             <h1>
  {activePage === "dashboard"
    ? "Puja Management Dashboard"
    : activePage === "bookings"
    ? "All Puja Bookings"
    : "Communication Center"}
</h1>

              <p>
                Manage every sacred journey with care and clarity.
              </p>
            </div>

            <button
              className="button-primary"
              onClick={() => setCreateModalOpen(true)}
            >
              <Plus size={19} />
              New Booking
            </button>
          </div>

          {activePage === "dashboard" && (
            <>
              <div className="welcome-banner">
                <div>
                  <span className="welcome-eyebrow">
                    ॐ शुभं भवतु
                  </span>

                  <h2>
                    Bringing devotion and
                    <br />
                    technology together.
                  </h2>

                  <p>
                    A seamless journey from booking confirmation
                    to divine blessings.
                  </p>
                </div>

                <div className="welcome-decoration">
                  <Flower2 size={118} strokeWidth={0.8} />
                </div>
              </div>

              <div className="stats-grid">
                <StatCard
                  title="Total Bookings"
                  value={stats.total}
                  icon={CalendarDays}
                  variant="total"
                />

                <StatCard
                  title="Confirmed"
                  value={stats.confirmed}
                  icon={CheckCircle2}
                  variant="confirmed"
                />

                <StatCard
                  title="In Progress"
                  value={stats.started}
                  icon={Clock3}
                  variant="progress"
                />

                <StatCard
                  title="Completed"
                  value={stats.completed}
                  icon={Heart}
                  variant="completed"
                />

                <StatCard
                  title="Videos Ready"
                  value={stats.videos}
                  icon={Video}
                  variant="video"
                />
              </div>
            </>
          )}
          {activePage === "notifications" && (
  <WhatsAppNotificationsPage bookings={bookings} />
)}

{activePage !== "notifications" && (
          <section className="bookings-section">
            <div className="section-header">
              <div>
                <h2>
                  {activePage === "dashboard"
                    ? "Recent Bookings"
                    : "Booking Management"}
                </h2>

                <p>
                  Track and manage puja bookings through every stage.
                </p>
              </div>

              <button
                className="refresh-button"
                onClick={loadBookings}
                disabled={loading}
              >
                <RefreshCw
                  size={16}
                  className={loading ? "spin" : ""}
                />
                Refresh
              </button>
            </div>

            <div className="table-toolbar">
              <div className="search-box">
                <Search size={18} />

                <input
                  type="text"
                  placeholder="Search by booking ID, devotee or puja..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>

              <div className="results-count">
                {filteredBookings.length} bookings
              </div>
            </div>

            <div className="table-wrapper">
              <table className="bookings-table">
                <thead>
                  <tr>
                    <th>BOOKING ID</th>
                    <th>DEVOTEE</th>
                    <th>PUJA</th>
                    <th>DATE</th>
                    <th>STATUS</th>
                    <th>ACTION</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="table-empty">
                        Loading bookings...
                      </td>
                    </tr>
                  ) : filteredBookings.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="table-empty">
                        <Inbox size={32} />
                        <p>No bookings found.</p>
                        <span>
                          Create a new booking to get started.
                        </span>
                      </td>
                    </tr>
                  ) : (
                    filteredBookings.map((booking) => (
                      <tr key={booking._id || booking.bookingId}>
                        <td>
                          <span className="booking-id">
                            {booking.bookingId}
                          </span>
                        </td>

                        <td>
                          <div className="table-devotee">
                            <div className="table-avatar">
                              {booking.devoteeName
                                ?.charAt(0)
                                .toUpperCase()}
                            </div>

                            <strong>{booking.devoteeName}</strong>
                          </div>
                        </td>

                        <td>{booking.pujaName}</td>

                        <td className="date-cell">
                          {formatDate(booking.createdAt)}
                        </td>

                        <td>
                          <StatusBadge status={booking.status} />
                        </td>

                        <td>
                          <button
                            className="view-button"
                            onClick={() => openBooking(booking)}
                          >
                            Manage
                            <ArrowRight size={15} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
)}
          <footer className="app-footer">
            <span>
              © 2026 PujaFlow · Built for Aaradhya Setu
            </span>

            <span>
              Made with devotion <Heart size={13} />
            </span>
          </footer>
        </div>
      </main>

      {createModalOpen && (
        <CreateBookingModal
          onClose={() => setCreateModalOpen(false)}
          onCreate={handleCreateBooking}
          saving={saving}
        />
      )}

      {selectedBooking && (
        <BookingDetails
          booking={selectedBooking}
          notifications={notifications}
          notificationsLoading={notificationsLoading}
          onClose={() => setSelectedBooking(null)}
          onAdvance={handleAdvanceBooking}
          advancing={advancing}
        />
      )}
    </div>
  );
}

export default App;