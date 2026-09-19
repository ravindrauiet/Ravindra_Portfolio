"use client";

export default function WhatsAppButton() {
  const phoneNumber = "919354156323";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=Hi%20Ravindra,%20I%20visited%20your%20portfolio%20website%20and%20would%20like%20to%20connect!`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      style={{
        position: "fixed",
        bottom: "30px",
        right: "30px",
        backgroundColor: "#25D366",
        color: "#ffffff",
        borderRadius: "50px",
        width: "60px",
        height: "60px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "32px",
        boxShadow: "0 8px 24px rgba(37, 211, 102, 0.45)",
        zIndex: 9999,
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        cursor: "pointer",
        textDecoration: "none"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.1) translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 12px 28px rgba(37, 211, 102, 0.6)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1) translateY(0)";
        e.currentTarget.style.boxShadow = "0 8px 24px rgba(37, 211, 102, 0.45)";
      }}
    >
      <i className="fab fa-whatsapp"></i>
    </a>
  );
}
