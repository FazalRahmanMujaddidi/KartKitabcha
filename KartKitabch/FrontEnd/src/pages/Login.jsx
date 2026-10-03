
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    userName: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const change = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!form.userName.trim() || !form.password) {
      toast.error("د کارن نوم او پاسورډ ولیکئ");
      return;
    }

    try {
      setLoading(true);

      await login(form.userName.trim(), form.password);

      toast.success("په بریالیتوب سره داخل شو");

      navigate("/");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "د کارن نوم یا پاسورډ ستونزه ده";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page" dir="rtl">
      <div className="login-card">

        {/* Logo */}
        <div className="login-logo">
          <span>K</span>
        </div>

        {/* Title */}
        <div className="login-header">
          <h1>کارت کتاب</h1>

          <p>
            سیستم ته ننوتل
          </p>
        </div>

        {/* Form */}
        <form onSubmit={submit} className="login-form">

          {/* Username */}
          <div className="login-form-group">
            <label htmlFor="userName">
              کارن نوم
            </label>

            <div className="login-input-wrapper">
              <span className="login-input-icon">
                👤
              </span>

              <input
                id="userName"
                type="text"
                name="userName"
                value={form.userName}
                onChange={change}
                placeholder="خپل کارن نوم ولیکئ"
                autoComplete="username"
                disabled={loading}
              />
            </div>
          </div>

          {/* Password */}
          <div className="login-form-group">
            <label htmlFor="password">
              پاسورډ
            </label>

            <div className="login-input-wrapper">
              <span className="login-input-icon">
                🔒
              </span>

              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={change}
                placeholder="خپل پاسورډ ولیکئ"
                autoComplete="current-password"
                disabled={loading}
              />

              <button
                type="button"
                className="login-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                aria-label={
                  showPassword
                    ? "پاسورډ پټ کړئ"
                    : "پاسورډ ښکاره کړئ"
                }
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="login-submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="login-spinner"></span>
                <span>داخلېږي...</span>
              </>
            ) : (
              <>
                <span>ننوتل</span>
                <span className="login-arrow">←</span>
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="login-footer">
          <span>کارت کتاب</span>
          <span className="login-footer-dot">•</span>
          <span>د مدیریت سیستم</span>
        </div>

      </div>
    </div>
  );
}

