import React from "react";

const Footer = () => {
  return (
    <footer
      style={{
        marginTop: "60px",
        padding: "30px 20px",
        borderTop: "1px solid #1f2937",
        textAlign: "center",
        color: "#9ca3af"
      }}
    >
      <p style={{ marginBottom: "10px" }}>
        © {new Date().getFullYear()} Deb Insights — Engineering Systems & Architecture
      </p>

      <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
        
        <a
          href="https://www.linkedin.com/in/debashis-mohapatra-it/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: "#0A66C2",
            textDecoration: "none",
            fontWeight: "bold"
          }}
        >
          LinkedIn
        </a>

        <a
          href="https://x.com/Debsu15"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: "#1DA1F2",
            textDecoration: "none",
            fontWeight: "bold"
          }}
        >
          Twitter (X)
        </a>

      </div>

      <p style={{ marginTop: "10px", fontSize: "0.85rem" }}>
        Sharing practical insights on .NET, cloud migration, and system design.
      </p>
    </footer>
  );
};

export default Footer;