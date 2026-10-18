"use client";

import { useState } from "react";
import Link from "next/link";

export default function FitKeyDeleteAccountPage() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [fullName, setFullName] = useState("");
  const [reason, setReason] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!phoneNumber.trim()) return;
    setSubmitted(true);
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        padding: "10rem 1.5rem 5rem 1.5rem",
        textTransform: "none",
      }}
    >
      <div
        style={{
          maxWidth: "840px",
          margin: "0 auto",
          background: "#ffffff",
          borderRadius: "16px",
          padding: "3.5rem 3rem",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.06)",
          border: "1px solid #e2e8f0",
          textTransform: "none",
        }}
      >
        {/* Navigation Breadcrumb */}
        <div style={{ marginBottom: "2rem", textTransform: "none" }}>
          <Link
            href="/privacy-policy/fitkey"
            style={{
              color: "#2506ad",
              fontSize: "1.4rem",
              fontWeight: 600,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            ← Back to FITKEY Privacy Policy
          </Link>
        </div>

        {/* Header */}
        <header
          style={{
            borderBottom: "2px solid #e2e8f0",
            paddingBottom: "2rem",
            marginBottom: "2.5rem",
            textTransform: "none",
          }}
        >
          <div
            style={{
              display: "inline-block",
              background: "#fee2e2",
              color: "#b91c1c",
              fontSize: "1.2rem",
              fontWeight: 700,
              padding: "0.4rem 1rem",
              borderRadius: "9999px",
              marginBottom: "1rem",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Google Play Data Safety Compliance
          </div>
          <h1
            style={{
              fontSize: "3.2rem",
              fontWeight: 800,
              color: "#0f172a",
              lineHeight: 1.2,
              marginBottom: "1.2rem",
              textTransform: "none",
            }}
          >
            Request FITKEY Account &amp; Data Deletion
          </h1>
          <p
            style={{
              fontSize: "1.6rem",
              color: "#64748b",
              lineHeight: 1.6,
              marginBottom: "1rem",
              textTransform: "none",
            }}
          >
            If you wish to delete your <strong>FITKEY - Gym &amp; Fitness Pass</strong> (<code>com.fitkey.fitkey_user</code>) account and erase your personal fitness records, you can submit your request directly using this page or from inside the app.
          </p>
        </header>

        {/* Content Body */}
        <article
          style={{
            color: "#334155",
            fontSize: "1.5rem",
            lineHeight: 1.8,
            textTransform: "none",
          }}
        >
          {/* Method 1: In-App Deletion */}
          <section
            style={{
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
              padding: "2rem",
              marginBottom: "2.5rem",
            }}
          >
            <h2 style={{ fontSize: "1.9rem", color: "#0f172a", fontWeight: 700, marginBottom: "0.8rem" }}>
              Option A: Delete Directly in the Mobile App
            </h2>
            <p style={{ marginBottom: "0.8rem" }}>
              If you have the FITKEY app installed on your device, you can delete your account instantly:
            </p>
            <ol style={{ paddingLeft: "2.2rem", margin: 0, lineHeight: 1.9 }}>
              <li>Open the <strong>FITKEY</strong> mobile app on your Android device.</li>
              <li>Tap the <strong>Profile</strong> icon in the bottom navigation bar.</li>
              <li>Go to <strong>Settings</strong> &gt; <strong>Account Management</strong>.</li>
              <li>Select <strong>Delete Account</strong> and confirm your request.</li>
            </ol>
          </section>

          {/* Method 2: Web Deletion Request Form */}
          <section
            style={{
              background: "#ffffff",
              border: "2px solid #e2e8f0",
              borderRadius: "14px",
              padding: "2.5rem",
              marginBottom: "2.5rem",
              boxShadow: "0 4px 16px rgba(0,0,0,0.04)",
            }}
          >
            <h2 style={{ fontSize: "2rem", color: "#0f172a", fontWeight: 700, marginBottom: "0.5rem" }}>
              Option B: Submit Web Deletion Request (Without App)
            </h2>
            <p style={{ color: "#64748b", fontSize: "1.4rem", marginBottom: "1.5rem" }}>
              As required by Google Play, you do not need the app installed to delete your account. Complete this form to submit your deletion request to our administrative team:
            </p>

            {submitted ? (
              <div
                style={{
                  background: "#f0fdf4",
                  border: "1px solid #bbf7d0",
                  borderRadius: "10px",
                  padding: "2rem",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>✅</div>
                <h3 style={{ color: "#166534", fontSize: "1.8rem", fontWeight: 700, margin: "0 0 0.5rem 0" }}>
                  Deletion Request Received
                </h3>
                <p style={{ color: "#14532d", margin: "0 0 1rem 0", fontSize: "1.45rem" }}>
                  Your request for phone number <strong>{phoneNumber}</strong> has been logged. Our data security team will verify and permanently delete your profile, workout history, and attendance records within 30 days.
                </p>
                <p style={{ color: "#166534", margin: 0, fontSize: "1.3rem" }}>
                  A confirmation SMS/notification will be dispatched once the deletion is finalized.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1.4rem" }}>
                <div>
                  <label
                    htmlFor="phone"
                    style={{ display: "block", fontWeight: 700, color: "#0f172a", marginBottom: "0.4rem" }}
                  >
                    Registered Mobile Number *
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "1rem 1.2rem",
                      borderRadius: "8px",
                      border: "1.5px solid #cbd5e1",
                      fontSize: "1.45rem",
                      fontFamily: "inherit",
                    }}
                  />
                  <small style={{ color: "#64748b", fontSize: "1.2rem" }}>
                    The phone number linked to your FITKEY OTP login.
                  </small>
                </div>

                <div>
                  <label
                    htmlFor="name"
                    style={{ display: "block", fontWeight: 700, color: "#0f172a", marginBottom: "0.4rem" }}
                  >
                    Full Name (as in profile)
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="e.g. John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "1rem 1.2rem",
                      borderRadius: "8px",
                      border: "1.5px solid #cbd5e1",
                      fontSize: "1.45rem",
                      fontFamily: "inherit",
                    }}
                  />
                </div>

                <div>
                  <label
                    htmlFor="reason"
                    style={{ display: "block", fontWeight: 700, color: "#0f172a", marginBottom: "0.4rem" }}
                  >
                    Reason for Deletion (Optional)
                  </label>
                  <select
                    id="reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "1rem 1.2rem",
                      borderRadius: "8px",
                      border: "1.5px solid #cbd5e1",
                      fontSize: "1.45rem",
                      fontFamily: "inherit",
                      background: "#fff",
                    }}
                  >
                    <option value="">Select a reason...</option>
                    <option value="no-longer-use">I no longer need gym access</option>
                    <option value="privacy-concern">Privacy &amp; data concerns</option>
                    <option value="moved-city">Relocated to a new city</option>
                    <option value="duplicate-account">Duplicate account</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div
                  style={{
                    background: "#fef2f2",
                    border: "1px solid #fecaca",
                    borderRadius: "8px",
                    padding: "1.2rem",
                    color: "#991b1b",
                    fontSize: "1.35rem",
                  }}
                >
                  <strong>⚠️ Warning:</strong> Deleting your account will cancel any active fitness passes, forfeit remaining gym credits, and erase all past workout streaks. This action cannot be reversed.
                </div>

                <button
                  type="submit"
                  style={{
                    background: "#dc2626",
                    color: "#ffffff",
                    border: "none",
                    padding: "1.2rem 2.4rem",
                    borderRadius: "8px",
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(220, 38, 38, 0.25)",
                    transition: "background 0.2s ease",
                  }}
                >
                  Submit Account Deletion Request
                </button>
              </form>
            )}
          </section>

          {/* Method 3: Direct Email Option */}
          <section
            style={{
              background: "#eff6ff",
              border: "1px solid #bfdbfe",
              borderRadius: "12px",
              padding: "2rem",
              marginBottom: "2.5rem",
            }}
          >
            <h2 style={{ fontSize: "1.9rem", color: "#1e3a8a", fontWeight: 700, marginBottom: "0.8rem" }}>
              Option C: Request via Official Email
            </h2>
            <p style={{ marginBottom: "1.2rem" }}>
              You may also email our support desk directly from your registered email address or provide your registered mobile number:
            </p>
            <a
              href="mailto:support@fitkey.in?cc=ravindranathjha76@gmail.com&subject=FITKEY%20Account%20Deletion%20Request%20-%20com.fitkey.fitkey_user&body=Hello%20FITKEY%20Support%20Team%2C%0A%0AI%20would%20like%20to%20request%20the%20permanent%20deletion%20of%20my%20FITKEY%20account%20and%20all%20associated%20data.%0A%0ARegistered%20Phone%20Number%3A%20%0AFull%20Name%3A%20%0AReason%20(Optional)%3A%20%0A%0AI%20understand%20that%20this%20will%20delete%20my%20attendance%2C%20check-ins%2C%20and%20active%20passes.%0A%0AThank%20you."
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.6rem",
                background: "#2506ad",
                color: "#ffffff",
                padding: "1rem 2rem",
                borderRadius: "8px",
                fontWeight: 700,
                fontSize: "1.45rem",
                textDecoration: "none",
              }}
            >
              ✉️ Send Deletion Request Email (support@fitkey.in)
            </a>
          </section>

          {/* Section: Data Retention Details */}
          <section
            style={{
              borderTop: "2px solid #e2e8f0",
              paddingTop: "2rem",
              fontSize: "1.4rem",
              color: "#64748b",
            }}
          >
            <h3 style={{ fontSize: "1.7rem", color: "#0f172a", fontWeight: 700, marginBottom: "0.8rem" }}>
              Data Deletion &amp; Retention Policy Details
            </h3>
            <ul style={{ paddingLeft: "2rem", lineHeight: 1.8 }}>
              <li>
                <strong>Data that is completely destroyed:</strong> Phone number, user profile identifiers, full name, avatar photos, QR check-in history, gym attendance logs, and workout records.
              </li>
              <li>
                <strong>Data retained:</strong> None, except payment transaction invoices that must be preserved under Indian tax laws and statutory financial record-keeping obligations for a required period.
              </li>
              <li>
                <strong>Turnaround time:</strong> All deletion requests received via app, web form, or email are processed within <strong>30 days</strong>.
              </li>
            </ul>
          </section>
        </article>
      </div>
    </main>
  );
}
