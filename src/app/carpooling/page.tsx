"use client";

import { useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import styles from "./Carpooling.module.css";

interface CarpoolPost {
  id: string;
  driver: { name: string; email: string };
  vehicle: { type: string; capacity: number };
  route: { start: string; end: string; stops: string[] };
  schedule: { date: string; time: string };
  cost: number;
  preferences: string;
  passengers: { name: string; email: string }[];
  createdAt: string;
  updatedAt: string;
}

interface Message {
  id: string;
  sender: { name: string; email: string };
  recipient: { name: string; email: string };
  content: string;
  timestamp: string;
}

export default function Carpooling() {
  // Hardcoded user (replace with real auth later)
  const currentUser = {
    name: "Current User",
    email: "user@example.com",
    isDriver: true, // Toggle this to test driver/passenger views
  };

  // State for carpool posts
  const [posts, setPosts] = useState<CarpoolPost[]>([
    {
      id: "1",
      driver: { name: "John Doe", email: "john@example.com" },
      vehicle: { type: "Sedan", capacity: 4 },
      route: { start: "Campus", end: "Downtown", stops: ["Library"] },
      schedule: { date: "2025-03-21", time: "09:00" },
      cost: 5,
      preferences: "No smoking, please be on time",
      passengers: [],
      createdAt: "2025-03-20T18:26:16.475Z",
      updatedAt: "2025-03-20T18:26:16.475Z",
    },
  ]);

  // State for the form
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [formData, setFormData] = useState({
    id: "",
    vehicleType: "",
    capacity: 0,
    start: "",
    end: "",
    stops: "",
    date: "",
    time: "",
    cost: 0,
    preferences: "",
  });

  // State for modals
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<CarpoolPost | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  // State for passenger's joined rides
  const [myRides, setMyRides] = useState<CarpoolPost[]>([]);

  // Form handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddPost = (e: React.FormEvent) => {
    e.preventDefault();
    const newPost: CarpoolPost = {
      id: String(posts.length + 1),
      driver: { name: currentUser.name, email: currentUser.email },
      vehicle: { type: formData.vehicleType, capacity: Number(formData.capacity) },
      route: {
        start: formData.start,
        end: formData.end,
        stops: formData.stops.split(",").map((s) => s.trim()),
      },
      schedule: { date: formData.date, time: formData.time },
      cost: Number(formData.cost),
      preferences: formData.preferences,
      passengers: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setPosts([...posts, newPost]);
    resetForm();
  };

  const handleEditPost = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedPosts = posts.map((post) =>
      post.id === formData.id
        ? {
            ...post,
            vehicle: { type: formData.vehicleType, capacity: Number(formData.capacity) },
            route: {
              start: formData.start,
              end: formData.end,
              stops: formData.stops.split(",").map((s) => s.trim()),
            },
            schedule: { date: formData.date, time: formData.time },
            cost: Number(formData.cost),
            preferences: formData.preferences,
            updatedAt: new Date().toISOString(),
          }
        : post
    );
    setPosts(updatedPosts);
    resetForm();
  };

  const handleDeletePost = (id: string) => {
    if (confirm("Are you sure you want to delete this post?")) {
      setPosts(posts.filter((post) => post.id !== id));
      setMyRides(myRides.filter((ride) => ride.id !== id));
    }
  };

  const openAddForm = () => {
    setFormMode("add");
    setFormData({
      id: "",
      vehicleType: "",
      capacity: 0,
      start: "",
      end: "",
      stops: "",
      date: "",
      time: "",
      cost: 0,
      preferences: "",
    });
    setIsFormOpen(true);
  };

  const openEditForm = (post: CarpoolPost) => {
    setFormMode("edit");
    setFormData({
      id: post.id,
      vehicleType: post.vehicle.type,
      capacity: post.vehicle.capacity,
      start: post.route.start,
      end: post.route.end,
      stops: post.route.stops.join(", "),
      date: post.schedule.date,
      time: post.schedule.time,
      cost: post.cost,
      preferences: post.preferences,
    });
    setIsFormOpen(true);
  };

  const resetForm = () => {
    setFormData({
      id: "",
      vehicleType: "",
      capacity: 0,
      start: "",
      end: "",
      stops: "",
      date: "",
      time: "",
      cost: 0,
      preferences: "",
    });
    setIsFormOpen(false);
  };

  // Modal handlers
  const openRequestModal = (post: CarpoolPost) => {
    setSelectedPost(post);
    setIsRequestModalOpen(true);
  };

  const handleRequestRide = () => {
    if (selectedPost) {
      const updatedPosts = posts.map((post) =>
        post.id === selectedPost.id
          ? {
              ...post,
              passengers: [...post.passengers, { name: currentUser.name, email: currentUser.email }],
            }
          : post
      );
      setPosts(updatedPosts);
      setMyRides([...myRides, { ...selectedPost, passengers: [...selectedPost.passengers, { name: currentUser.name, email: currentUser.email }] }]);
      setIsRequestModalOpen(false);
    }
  };

  const openChatModal = (post: CarpoolPost) => {
    setSelectedPost(post);
    setIsChatModalOpen(true);
  };

  const handleSendMessage = (content: string) => {
    if (selectedPost) {
      const newMessage: Message = {
        id: String(messages.length + 1),
        sender: { name: currentUser.name, email: currentUser.email },
        recipient: { name: selectedPost.driver.name, email: selectedPost.driver.email },
        content,
        timestamp: new Date().toISOString(),
      };
      setMessages([...messages, newMessage]);
    }
  };

  return (
    <div className={styles.container}>
      {/* Breadcrumb Navigation */}
      <Breadcrumb>
        <BreadcrumbItem>
          <Link href="/dashboard" className="hover:text-primary">
            Dashboard
          </Link>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>Carpooling</BreadcrumbItem>
      </Breadcrumb>

      {/* Header */}
      <header className={styles.header}>
        <h1 className={styles.headerTitle}>Carpooling</h1>
        <p className={styles.headerSubtitle}>
          Connect with drivers and passengers for campus rides
        </p>
      </header>

      {/* Driver Controls */}
      {currentUser.isDriver && (
        <section className={styles.driverControls}>
          <button onClick={openAddForm} className={styles.addButton}>
            Create Carpool Post
          </button>
        </section>
      )}

      {/* Form for Creating/Editing Posts */}
      {currentUser.isDriver && isFormOpen && (
        <section className={`${styles.formSection} ${styles.fadeIn}`}>
          <form
            onSubmit={formMode === "add" ? handleAddPost : handleEditPost}
            className={styles.form}
          >
            <h2 className={styles.formTitle}>
              {formMode === "add" ? "Create Carpool Post" : "Edit Carpool Post"}
            </h2>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Vehicle Type</label>
              <input
                type="text"
                name="vehicleType"
                value={formData.vehicleType}
                onChange={handleInputChange}
                className={styles.formInput}
                placeholder="e.g., Sedan"
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Capacity</label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleInputChange}
                className={styles.formInput}
                min="1"
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Start Location</label>
              <input
                type="text"
                name="start"
                value={formData.start}
                onChange={handleInputChange}
                className={styles.formInput}
                placeholder="e.g., Campus"
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>End Location</label>
              <input
                type="text"
                name="end"
                value={formData.end}
                onChange={handleInputChange}
                className={styles.formInput}
                placeholder="e.g., Downtown"
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Stops (comma-separated)</label>
              <input
                type="text"
                name="stops"
                value={formData.stops}
                onChange={handleInputChange}
                className={styles.formInput}
                placeholder="e.g., Library, Mall"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className={styles.formInput}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Time</label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                className={styles.formInput}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Cost ($)</label>
              <input
                type="number"
                name="cost"
                value={formData.cost}
                onChange={handleInputChange}
                className={styles.formInput}
                min="0"
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Preferences</label>
              <textarea
                name="preferences"
                value={formData.preferences}
                onChange={handleInputChange}
                className={styles.formInput}
                placeholder="e.g., No smoking, please be on time"
              />
            </div>
            <div className={styles.formActions}>
              <button type="submit" className={styles.submitButton}>
                {formMode === "add" ? "Create Post" : "Update Post"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className={styles.cancelButton}
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Carpool Posts */}
      <section className={styles.postsSection}>
        <h2 className={styles.sectionTitle}>Available Rides</h2>
        {posts.length === 0 ? (
          <div className={`${styles.emptyState} ${styles.fadeIn}`}>
            <p className={styles.emptyStateText}>No carpool posts available yet.</p>
            {currentUser.isDriver && (
              <p className={styles.emptyStateHint}>
                Create a new post using the button above.
              </p>
            )}
          </div>
        ) : (
          <div>
            {posts.map((post, index) => (
              <div
                key={post.id}
                className={`${styles.postCard} ${styles.fadeIn}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={styles.postHeader}>
                  <h3 className={styles.postTitle}>
                    {post.route.start} to {post.route.end}
                  </h3>
                  <div className={styles.postActions}>
                    {currentUser.email === post.driver.email ? (
                      <>
                        <button
                          onClick={() => openEditForm(post)}
                          className={styles.editButton}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className={styles.deleteButton}
                        >
                          Delete
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => openRequestModal(post)}
                          className={styles.requestButton}
                          disabled={post.passengers.some((p) => p.email === currentUser.email)}
                        >
                          {post.passengers.some((p) => p.email === currentUser.email)
                            ? "Joined"
                            : "Request Ride"}
                        </button>
                        <button
                          onClick={() => openChatModal(post)}
                          className={styles.chatButton}
                        >
                          Contact Driver
                        </button>
                      </>
                    )}
                  </div>
                </div>
                <div className={styles.detailsGrid}>
                  <div>
                    <div className={styles.detailItem}>
                      <p className={styles.detailLabel}>Driver</p>
                      <p className={styles.detailValue}>{post.driver.name}</p>
                    </div>
                    <div className={styles.detailItem}>
                      <p className={styles.detailLabel}>Vehicle</p>
                      <p className={styles.detailValue}>
                        {post.vehicle.type} (Capacity: {post.vehicle.capacity})
                      </p>
                    </div>
                    <div className={styles.detailItem}>
                      <p className={styles.detailLabel}>Route</p>
                      <p className={styles.detailValue}>
                        {post.route.start} → {post.route.stops.join(" → ")} → {post.route.end}
                      </p>
                    </div>
                    <div className={styles.detailItem}>
                      <p className={styles.detailLabel}>Schedule</p>
                      <p className={styles.detailValue}>
                        {post.schedule.date} at {post.schedule.time}
                      </p>
                    </div>
                  </div>
                  <div>
                    <div className={styles.detailItem}>
                      <p className={styles.detailLabel}>Cost</p>
                      <p className={styles.detailValue}>${post.cost}</p>
                    </div>
                    <div className={styles.detailItem}>
                      <p className={styles.detailLabel}>Preferences</p>
                      <p className={styles.detailValue}>{post.preferences || "None"}</p>
                    </div>
                    <div className={styles.detailItem}>
                      <p className={styles.detailLabel}>Passengers</p>
                      <p className={styles.detailValue}>
                        {post.passengers.length > 0
                          ? post.passengers.map((p) => p.name).join(", ")
                          : "None"}
                      </p>
                    </div>
                    <div className={styles.detailItem}>
                      <p className={styles.detailLabel}>Posted On</p>
                      <p className={styles.detailValue}>
                        {new Date(post.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* My Rides Section */}
      {!currentUser.isDriver && myRides.length > 0 && (
        <section className={styles.myRidesSection}>
          <h2 className={styles.sectionTitle}>My Rides</h2>
          {myRides.map((ride, index) => (
            <div
              key={ride.id}
              className={`${styles.postCard} ${styles.fadeIn}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={styles.postHeader}>
                <h3 className={styles.postTitle}>
                  {ride.route.start} to {ride.route.end}
                </h3>
                <div className={styles.postActions}>
                  <button
                    onClick={() => openChatModal(ride)}
                    className={styles.chatButton}
                  >
                    Contact Driver
                  </button>
                </div>
              </div>
              <div className={styles.detailsGrid}>
                <div>
                  <div className={styles.detailItem}>
                    <p className={styles.detailLabel}>Driver</p>
                    <p className={styles.detailValue}>{ride.driver.name}</p>
                  </div>
                  <div className={styles.detailItem}>
                    <p className={styles.detailLabel}>Route</p>
                    <p className={styles.detailValue}>
                      {ride.route.start} → {ride.route.stops.join(" → ")} → {ride.route.end}
                    </p>
                  </div>
                  <div className={styles.detailItem}>
                    <p className={styles.detailLabel}>Schedule</p>
                    <p className={styles.detailValue}>
                      {ride.schedule.date} at {ride.schedule.time}
                    </p>
                  </div>
                </div>
                <div>
                  <div className={styles.detailItem}>
                    <p className={styles.detailLabel}>Cost</p>
                    <p className={styles.detailValue}>${ride.cost}</p>
                  </div>
                  <div className={styles.detailItem}>
                    <p className={styles.detailLabel}>Preferences</p>
                    <p className={styles.detailValue}>{ride.preferences || "None"}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Request Ride Modal */}
      {isRequestModalOpen && selectedPost && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.modal} ${styles.fadeIn}`}>
            <h2 className={styles.modalTitle}>Request to Join Ride</h2>
            <p>
              You are requesting to join the ride from <strong>{selectedPost.route.start}</strong> to{" "}
              <strong>{selectedPost.route.end}</strong> on <strong>{selectedPost.schedule.date}</strong> at{" "}
              <strong>{selectedPost.schedule.time}</strong>.
            </p>
            <p>Driver: <strong>{selectedPost.driver.name}</strong></p>
            <p>Cost: <strong>${selectedPost.cost}</strong></p>
            <div className={styles.modalActions}>
              <button onClick={handleRequestRide} className={styles.submitButton}>
                Confirm Request
              </button>
              <button
                onClick={() => setIsRequestModalOpen(false)}
                className={styles.cancelButton}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Modal */}
      {isChatModalOpen && selectedPost && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.modal} ${styles.fadeIn}`}>
            <h2 className={styles.modalTitle}>Chat with {selectedPost.driver.name}</h2>
            <div className={styles.chatMessages}>
              {messages
                .filter(
                  (msg) =>
                    (msg.sender.email === currentUser.email &&
                      msg.recipient.email === selectedPost.driver.email) ||
                    (msg.sender.email === selectedPost.driver.email &&
                      msg.recipient.email === currentUser.email)
                )
                .map((msg) => (
                  <div
                    key={msg.id}
                    className={
                      msg.sender.email === currentUser.email
                        ? styles.messageSent
                        : styles.messageReceived
                    }
                  >
                    <p>{msg.content}</p>
                    <span className={styles.messageTimestamp}>
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const content = (e.target as any).message.value;
                if (content) {
                  handleSendMessage(content);
                  (e.target as any).message.value = "";
                }
              }}
              className={styles.chatForm}
            >
              <input
                type="text"
                name="message"
                placeholder="Type your message..."
                className={styles.chatInput}
              />
              <button type="submit" className={styles.submitButton}>
                Send
              </button>
            </form>
            <button
              onClick={() => setIsChatModalOpen(false)}
              className={styles.cancelButton}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}