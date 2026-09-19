"use client";
import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus({
          type: "success",
          text: data.message || "Thank you! Your message has been sent successfully."
        });
        setFormData({ name: "", email: "", phone: "", message: "" });
      } else {
        setStatus({
          type: "error",
          text: data.error || "Failed to send message. Please try again."
        });
      }
    } catch (err) {
      console.error("Contact submit error:", err);
      setStatus({
        type: "error",
        text: "Network error. Please check your connection and try again."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="contact" id="contact">
      <h2 className="heading">
        <i className="fas fa-headset"></i> Get In <span>Touch</span>
      </h2>

      {/* Direct Contact Callout Bar */}
      <div style={{ display: "flex", justifyContent: "center", gap: "1.5rem", flexWrap: "wrap", marginBottom: "3rem" }}>
        <a
          href="tel:9354156323"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.6rem",
            padding: "0.8rem 1.6rem",
            borderRadius: "50px",
            background: "#2506ad",
            color: "#fff",
            fontWeight: "700",
            fontSize: "1.05rem",
            textDecoration: "none",
            boxShadow: "0 8px 20px rgba(37, 6, 173, 0.25)"
          }}
        >
          <i className="fas fa-phone-alt"></i> Call: +91 9354156323
        </a>

        <a
          href="https://wa.me/919354156323?text=Hi%20Ravindra,%20I%20would%20like%20to%20discuss%20a%20project!"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.6rem",
            padding: "0.8rem 1.6rem",
            borderRadius: "50px",
            background: "#25D366",
            color: "#fff",
            fontWeight: "700",
            fontSize: "1.05rem",
            textDecoration: "none",
            boxShadow: "0 8px 20px rgba(37, 211, 102, 0.3)"
          }}
        >
          <i className="fab fa-whatsapp" style={{ fontSize: "1.3rem" }}></i> WhatsApp: +91 9354156323
        </a>
      </div>

      <div className="container">
        <div className="content">
          <div className="image-box">
            <img
              draggable="false"
              src="/assets/images/contact1.png"
              alt="Contact Ravindra"
              onError={(e) => {
                e.currentTarget.src = "/assets/images/Ravindraprofile.jpeg";
              }}
            />
          </div>

          <form id="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <div className="field">
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
                <i className="fas fa-user"></i>
              </div>
              <div className="field">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
                <i className="fas fa-envelope"></i>
              </div>
              <div className="field">
                <input
                  type="text"
                  name="phone"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
                <i className="fas fa-phone-alt"></i>
              </div>
              <div className="message">
                <textarea
                  placeholder="Message"
                  name="message"
                  required
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                ></textarea>
                <i className="fas fa-comment-dots"></i>
              </div>
            </div>

            <div className="button-area">
              <button type="submit" disabled={loading}>
                {loading ? "Sending..." : "Submit"}{" "}
                <i className="fa fa-paper-plane"></i>
              </button>
            </div>

            {status && (
              <p
                style={{
                  color: status.type === "success" ? "#059669" : "#dc2626",
                  marginTop: "1rem",
                  fontWeight: 700
                }}
              >
                {status.text}
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
