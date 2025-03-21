"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./community.module.css";

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  club: string;
  isAdminEditable: boolean;
}

export default function CommunityPage() {
  const [events, setEvents] = useState<Event[]>([
    {
      id: 1,
      title: "Hackathon 2025",
      description: "Join us for a 24-hour coding spree!",
      date: "April 10, 2025",
      club: "Code Club",
      isAdminEditable: true,
    },
    {
      id: 2,
      title: "Art Exhibition",
      description: "Showcase your creativity.",
      date: "March 25, 2025",
      club: "Art Society",
      isAdminEditable: true,
    },
  ]);

  const [isAdmin, setIsAdmin] = useState(true); // Toggle this based on auth later
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    club: "",
  });

  const handleAddEvent = () => {
    if (newEvent.title && newEvent.date && newEvent.club) {
      setEvents([
        ...events,
        { ...newEvent, id: events.length + 1, isAdminEditable: true },
      ]);
      setNewEvent({ title: "", description: "", date: "", club: "" });
    }
  };

  const handleDeleteEvent = (id: number) => {
    setEvents(events.filter((event) => event.id !== id));
  };

  return (
    <div className={styles.wrapper}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2 className={styles.sidebarTitle}>Navigation</h2>
        </div>
        <nav className={styles.sidebarNav}>
          <Link href="/dashboard" className={styles.sidebarLink}>
            Dashboard
          </Link>
          <Link href="/community" className={styles.sidebarLinkActive}>
            Community
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        <div className={styles.container}>
          <h1 className={styles.title}>Campus Community Hub</h1>

          {/* Admin Event Creation */}
          {isAdmin && (
            <div className={styles.adminSection}>
              <h2 className={styles.sectionTitle}>Add New Event</h2>
              <div className={styles.formGrid}>
                <input
                  type="text"
                  placeholder="Event Title"
                  value={newEvent.title}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, title: e.target.value })
                  }
                  className={styles.input}
                />
                <input
                  type="text"
                  placeholder="Description"
                  value={newEvent.description}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, description: e.target.value })
                  }
                  className={styles.input}
                />
                <input
                  type="text"
                  placeholder="Date (e.g., April 10, 2025)"
                  value={newEvent.date}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, date: e.target.value })
                  }
                  className={styles.input}
                />
                <input
                  type="text"
                  placeholder="Club Name"
                  value={newEvent.club}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, club: e.target.value })
                  }
                  className={styles.input}
                />
              </div>
              <button onClick={handleAddEvent} className={styles.addButton}>
                Add Event
              </button>
            </div>
          )}

          {/* Events List */}
          <div className={styles.eventsGrid}>
            {events.map((event) => (
              <div key={event.id} className={styles.eventCard}>
                <h3 className={styles.eventTitle}>{event.title}</h3>
                <p className={styles.eventDescription}>{event.description}</p>
                <p className={styles.eventMeta}>Date: {event.date}</p>
                <p className={styles.eventMeta}>Club: {event.club}</p>
                {isAdmin && event.isAdminEditable && (
                  <button
                    onClick={() => handleDeleteEvent(event.id)}
                    className={styles.deleteButton}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}