
import { useEffect, useState } from "react";
import "../ReportSummary.css";

const API_URL = "http://localhost:5256/api/report";
const SUMMARY_API = `${API_URL}/summary`;

function ReportSummary() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // -------------------------
  // FETCH SUMMARY
  // -------------------------
  const fetchSummary = async () => {
    try {
      setLoading(true);
      setError("");

      // IMPORTANT:
      // Use /summary, NOT /api/report
      const response = await fetch(SUMMARY_API);

      if (!response.ok) {
        throw new Error(
          `Failed to load report summary (${response.status})`
        );
      }

      const result = await response.json();

      setData(result);
    } catch (err) {
      console.error("Summary error:", err);
      setError(err.message || "Failed to load report summary");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // LOAD WHEN PAGE OPENS
  // -------------------------
  useEffect(() => {
    fetchSummary();
  }, []);

  // -------------------------
  // LOADING
  // -------------------------
  if (loading) {
    return (
      <div className="report-page">
        <div className="loading">
          Loading report summary...
        </div>
      </div>
    );
  }

  // -------------------------
  // ERROR
  // -------------------------
  if (error) {
    return (
      <div className="report-page">
        <div className="error">
          <h3>Unable to load report</h3>
          <p>{error}</p>

          <button
            className="retry-btn"
            onClick={fetchSummary}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // -------------------------
  // NO DATA
  // -------------------------
  if (!data) {
    return (
      <div className="report-page">
        <div className="error">
          No report data found.
        </div>
      </div>
    );
  }

  return (
    <div className="report-page">
      <div className="report-container">

        {/* ================= HEADER ================= */}
        <div className="report-header">
          <div>
            <h1>Report Summary</h1>
            <p>
              Overview of all issued kart reports
            </p>
          </div>

          <button
            className="refresh-btn"
            onClick={fetchSummary}
          >
            ↻ Refresh
          </button>
        </div>


        {/* ================= TOTAL REPORTS ================= */}
        <div className="total-card">
          <div>
            <span>Total Reports</span>

            <strong>
              {data.totalReports ?? 0}
            </strong>
          </div>

          <div className="total-icon">
            📋
          </div>
        </div>


        {/* ================= MAIN SECTIONS ================= */}
        <div className="report-grid">

          {/* VEHICLES */}
          <ReportCard
            title="Vehicles"
            icon="🚕"
            items={data.vehicles}
            nameKey="vehicle"
          />


          {/* STATUS */}
          <ReportCard
            title="Kart Status"
            icon="📌"
            items={data.statuses}
            nameKey="status"
          />


          {/* KART TYPE */}
          <ReportCard
            title="Kart Type"
            icon="🎫"
            items={data.kartTypes}
            nameKey="type"
          />


          {/* DURATION */}
          <ReportCard
            title="Kart Duration"
            icon="⏱️"
            items={data.durations}
            nameKey="duration"
          />


          {/* ACTIVITY */}
          <ReportCard
            title="Activity"
            icon="📍"
            items={data.activities}
            nameKey="activity"
          />

        </div>

      </div>
    </div>
  );
}


/* =====================================================
   REUSABLE REPORT CARD
===================================================== */

function ReportCard({
  title,
  icon,
  items,
  nameKey
}) {
  return (
    <div className="report-card">

      {/* CARD HEADER */}
      <div className="card-header">

        <div className="card-title">

          <span className="card-icon">
            {icon}
          </span>

          <h2>
            {title}
          </h2>

        </div>

      </div>


      {/* CARD ITEMS */}
      <div className="items">

        {items && items.length > 0 ? (

          items.map((item, index) => (

            <div
              className="report-item"
              key={index}
            >

              <span className="item-name">
                {formatName(item[nameKey])}
              </span>

              <span className="item-count">
                {item.total}
              </span>

            </div>

          ))

        ) : (

          <div className="empty">
            No data
          </div>

        )}

      </div>

    </div>
  );
}


/* =====================================================
   FORMAT ENUM NAMES
===================================================== */

function formatName(value) {
  if (!value) {
    return "";
  }

  return value
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
}


export default ReportSummary;

