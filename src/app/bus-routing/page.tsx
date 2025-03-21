"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./BusRouting.module.css";

interface BusRoute {
  id: string;
  title: string;
  routeData: { stops: string[]; times: string[] };
  admin: { name: string };
  createdAt: string;
  updatedAt: string;
}

export default function BusRouting() {
  const [routes, setRoutes] = useState<BusRoute[]>([
    {
      id: "1",
      title: "Route A: Campus to Downtown",
      routeData: { stops: ["Campus", "Downtown"], times: ["08:00", "08:15"] },
      admin: { name: "Admin User" },
      createdAt: "2025-03-20T18:26:16.475Z",
      updatedAt: "2025-03-20T18:26:16.475Z",
    },
  ]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "update">("add");
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    stops: "",
    times: "",
  });

  const isAdmin = true;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddRoute = (e: React.FormEvent) => {
    e.preventDefault();
    const newRoute: BusRoute = {
      id: String(routes.length + 1),
      title: formData.title,
      routeData: {
        stops: formData.stops.split(",").map((s) => s.trim()),
        times: formData.times.split(",").map((t) => t.trim()),
      },
      admin: { name: "Admin User" },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setRoutes([...routes, newRoute]);
    resetForm();
  };

  const handleUpdateRoute = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedRoutes = routes.map((route) =>
      route.id === formData.id
        ? {
            ...route,
            title: formData.title,
            routeData: {
              stops: formData.stops.split(",").map((s) => s.trim()),
              times: formData.times.split(",").map((t) => t.trim()),
            },
            updatedAt: new Date().toISOString(),
          }
        : route
    );
    setRoutes(updatedRoutes);
    resetForm();
  };

  const handleDeleteRoute = (id: string) => {
    if (confirm("Are you sure you want to delete this route?")) {
      const updatedRoutes = routes.filter((route) => route.id !== id);
      setRoutes(updatedRoutes);
    }
  };

  const openAddForm = () => {
    setFormMode("add");
    setFormData({ id: "", title: "", stops: "", times: "" });
    setIsFormOpen(true);
  };

  const openUpdateForm = (route: BusRoute) => {
    setFormMode("update");
    setFormData({
      id: route.id,
      title: route.title,
      stops: route.routeData.stops.join(", "),
      times: route.routeData.times.join(", "),
    });
    setIsFormOpen(true);
  };

  const resetForm = () => {
    setFormData({ id: "", title: "", stops: "", times: "" });
    setIsFormOpen(false);
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
          <Link href="/bus-routing" className={styles.sidebarLinkActive}>
            Bus Routing
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        <div className={styles.container}>
          <header className={styles.header}>
            <h1 className={styles.headerTitle}>Bus Routes</h1>
            <p className={styles.headerSubtitle}>
              Explore campus bus schedules with ease
            </p>
          </header>

          {/* Admin Controls */}
          {isAdmin && (
            <section className={styles.adminControls}>
              <button onClick={openAddForm} className={styles.addButton}>
                Add New Route
              </button>
            </section>
          )}

          {/* Form for Adding/Updating Routes */}
          {isAdmin && isFormOpen && (
            <section className={styles.formSection}>
              <form
                onSubmit={formMode === "add" ? handleAddRoute : handleUpdateRoute}
                className={styles.form}
              >
                <h2 className={styles.formTitle}>
                  {formMode === "add" ? "Add New Route" : "Update Route"}
                </h2>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Route Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className={styles.formInput}
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
                    placeholder="e.g., Campus, Downtown"
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Times (comma-separated)</label>
                  <input
                    type="text"
                    name="times"
                    value={formData.times}
                    onChange={handleInputChange}
                    className={styles.formInput}
                    placeholder="e.g., 08:00, 08:15"
                    required
                  />
                </div>
                <div className={styles.formActions}>
                  <button type="submit" className={styles.submitButton}>
                    {formMode === "add" ? "Add Route" : "Update Route"}
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

          {/* Routes List */}
          <section className={styles.routesSection}>
            {routes.length === 0 ? (
              <div className={styles.emptyState}>
                <p className={styles.emptyStateText}>No routes available yet.</p>
                {isAdmin && (
                  <p className={styles.emptyStateHint}>
                    Add a new route using the button above.
                  </p>
                )}
              </div>
            ) : (
              <div>
                {routes.map((route, index) => (
                  <div
                    key={route.id}
                    className={styles.routeCard}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className={styles.routeHeader}>
                      <h2 className={styles.routeTitle}>{route.title}</h2>
                      {isAdmin && (
                        <div className={styles.routeActions}>
                          <button
                            onClick={() => openUpdateForm(route)}
                            className={styles.updateButton}
                          >
                            Update
                          </button>
                          <button
                            onClick={() => handleDeleteRoute(route.id)}
                            className={styles.deleteButton}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                    <div className={styles.detailsGrid}>
                      <div>
                        <div className={styles.detailItem}>
                          <p className={styles.detailLabel}>Stops</p>
                          <p className={styles.detailValue}>
                            {route.routeData.stops.join(" → ")}
                          </p>
                        </div>
                        <div className={styles.detailItem}>
                          <p className={styles.detailLabel}>Times</p>
                          <p className={styles.detailValue}>
                            {route.routeData.times.join(", ")}
                          </p>
                        </div>
                      </div>
                      <div>
                        <div className={styles.detailItem}>
                          <p className={styles.detailLabel}>Uploaded By</p>
                          <p className={styles.detailValue}>{route.admin.name}</p>
                        </div>
                        <div className={styles.detailItem}>
                          <p className={styles.detailLabel}>Created On</p>
                          <p className={styles.detailValue}>
                            {new Date(route.createdAt).toLocaleDateString("en-US", {
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
        </div>
      </main>
    </div>
  );
}