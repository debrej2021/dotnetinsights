import React from "react";
import { Helmet} from 'react-helmet';
const About = () => {
  return (
    <>
    <Helmet>
      <title>Cloud Migration Architecture | .NET System Design Patterns</title>
      <meta
        name="description"
  content="Explore cloud migration architecture patterns for .NET systems — including microservices, event-driven design, async processing, and scalable system strategies."

      />
      <link rel="canonical" href="https://insights.debprod.com/about" />
    </Helmet>
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 20px", color: "#cbd5f5" }}>
      
      <h1 style={{ fontSize: "2.5rem", marginBottom: "20px" }}>
        About Deb Insights
      </h1>

      <p style={{ marginBottom: "20px", lineHeight: "1.6" }}>
        I build systems, not just applications.
      </p>

      <p style={{ marginBottom: "20px", lineHeight: "1.6" }}>
        This platform is focused on scalable architecture, cloud migration strategies, 
        and real-world engineering decisions — not theoretical patterns.
      </p>

      <h2 style={{ marginTop: "30px", marginBottom: "10px" }}>
        What is this platform?
      </h2>

      <p style={{ marginBottom: "20px", lineHeight: "1.6" }}>
        Deb Insights is where I break down engineering problems into practical, 
        production-level thinking.
      </p>

      <p style={{ marginBottom: "20px", lineHeight: "1.6" }}>
        From .NET migration strategies to distributed system design — everything here 
        is built with real-world applicability in mind.
      </p>

      <h2 style={{ marginTop: "30px", marginBottom: "10px" }}>
        Why I built this
      </h2>

      <p style={{ marginBottom: "20px", lineHeight: "1.6" }}>
        Most content online explains "what" but not "why".
      </p>

      <p style={{ marginBottom: "20px", lineHeight: "1.6" }}>
        This platform focuses on decision-making, trade-offs, and system-level thinking.
      </p>

      <h2 style={{ marginTop: "30px", marginBottom: "10px" }}>
        What you'll find here
      </h2>

      <ul style={{ marginBottom: "20px", lineHeight: "1.6" }}>
        <li>Architecture breakdowns</li>
        <li>Migration strategies</li>
        <li>System design insights</li>
        <li>Practical engineering patterns</li>
      </ul>

      <div style={{ marginTop: "40px" }}>
        <a
          href="/dotnet-7rs"
          style={{
            background: "#3b82f6",
            padding: "12px 20px",
            borderRadius: "8px",
            color: "white",
            textDecoration: "none",
            fontWeight: "bold"
          }}
        >
          🚀 Explore .NET Migration (7 Rs)
        </a>
      </div>

    </div>
    </>
  );
};

export default About;