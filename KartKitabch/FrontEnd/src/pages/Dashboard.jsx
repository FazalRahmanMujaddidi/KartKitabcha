
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user, hasRole } = useAuth();

  return (
    <div dir="rtl">
      <div className="page-header">
        <div>
          <h2>ډشبورډ</h2>
          <p>
            ښه راغلاست، {user?.fullName || user?.userName}
          </p>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="card-number">کارت</div>
          <div className="card-title">
            د کارتونو راپورونه
          </div>

          <Link to="/reports" className="btn btn-dark">
            راپورونه
          </Link>
        </div>

        {hasRole("Owner") && (
          <div className="dashboard-card">
            <div className="card-number">کاروونکي</div>

            <div className="card-title">
              د سیستم کاروونکي
            </div>

            <Link to="/users" className="btn btn-brown">
              مدیریت
            </Link>
          </div>
        )}

        <div className="dashboard-card">
          <div className="card-number">
            {user?.roles?.join("، ") || "کاروونکی"}
          </div>

          <div className="card-title">
            ستاسې رول
          </div>
        </div>
      </div>
    </div>
  );
}

