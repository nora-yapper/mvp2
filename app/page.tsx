"use client"

export default function HomePage() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#1a1a1a",
        color: "#e0e0e0",
        textAlign: "center",
        padding: "20px",
      }}
    >
      {/* Main container with geometric styling */}
      <div
        style={{
          backgroundColor: "#2a2a2a",
          padding: "60px 40px",
          clipPath: "polygon(0 0, calc(100% - 30px) 0, 100% 30px, 100% 100%, 30px 100%, 0 calc(100% - 30px))",
          maxWidth: "600px",
          width: "100%",
          position: "relative",
        }}
      >
        <h1
          style={{
            fontSize: "3.5rem",
            margin: "0 0 20px 0",
            fontWeight: "bold",
            letterSpacing: "0.1em",
            color: "#fff",
          }}
        >
          PROJECT 01
        </h1>

        <h2
          style={{
            fontSize: "1.4rem",
            fontWeight: "300",
            margin: "0 0 50px 0",
            color: "#ccc",
            letterSpacing: "0.05em",
          }}
        >
          Create Your First Startup Universe
        </h2>

        <button
          onClick={() => (window.location.href = "/main")}
          style={{
            padding: "15px 40px",
            fontSize: "1.1rem",
            cursor: "pointer",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
            letterSpacing: "0.05em",
            fontWeight: "500",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#0056b3"
            e.currentTarget.style.transform = "translateY(-2px)"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#007bff"
            e.currentTarget.style.transform = "translateY(0px)"
          }}
        >
          GET STARTED
        </button>
      </div>

      {/* Subtle background pattern */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
          linear-gradient(45deg, transparent 49%, rgba(255,255,255,0.02) 50%, transparent 51%),
          linear-gradient(-45deg, transparent 49%, rgba(255,255,255,0.02) 50%, transparent 51%)
        `,
          backgroundSize: "20px 20px",
          zIndex: -1,
        }}
      />
    </div>
  )
}
