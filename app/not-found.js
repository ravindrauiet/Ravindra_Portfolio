import Link from "next/link";

export default function NotFound() {
  return (
    <section
      style={{
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "6rem 2rem"
      }}
    >
      <h1 style={{ fontSize: "8rem", color: "#2506ad", fontWeight: 800, marginBottom: "0" }}>
        404
      </h1>
      <h2 style={{ fontSize: "2.4rem", color: "#002057", marginBottom: "1.5rem" }}>
        Page Not Found
      </h2>
      <p style={{ color: "#64748b", fontSize: "1.1rem", maxWidth: "500px", marginBottom: "2.5rem" }}>
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link
        href="/"
        className="btn"
        style={{
          padding: "1rem 2.2rem",
          background: "linear-gradient(135deg, #2506ad, #4a3aff)",
          color: "#ffffff",
          borderRadius: "14px",
          fontWeight: 700,
          textDecoration: "none"
        }}
      >
        <i className="fas fa-home" style={{ marginRight: "0.6rem" }}></i> Back to Home
      </Link>
    </section>
  );
}
