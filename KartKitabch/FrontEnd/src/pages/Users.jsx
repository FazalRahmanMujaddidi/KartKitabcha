
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../services/api";
import "./Users.css";
const emptyForm = {
  userName: "",
  email: "",
  phoneNumber: "",
  fullName: "",
  password: "",
  role: "SimpleUser",
  companyId: "",
};

export default function Users() {
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(true);

  const loadUsers = async () => {
    try {
      setUsersLoading(true);

      const res = await api.get("/User");

      setUsers(res.data);
    } catch (error) {
      toast.error("کاروونکي ونه لوستل شول");
    } finally {
      setUsersLoading(false);
    }
  };

  const loadCompanies = async () => {
    try {
      const res = await api.get("/company");

      setCompanies(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadUsers();
    loadCompanies();
  }, []);

  const change = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const createUser = async (e) => {
    e.preventDefault();

    if (
      !form.userName.trim() ||
      !form.email.trim() ||
      !form.password ||
      !form.role
    ) {
      toast.error("ضروري معلومات بشپړې کړئ");
      return;
    }

    try {
      setLoading(true);

      await api.post("/User", {
        userName: form.userName.trim(),
        email: form.email.trim(),
        phoneNumber: form.phoneNumber || null,
        fullName: form.fullName || null,
        password: form.password,
        role: form.role,
        companyId:
          form.companyId === ""
            ? null
            : Number(form.companyId),
      });

      toast.success("کاروونکی جوړ شو");

      setForm({ ...emptyForm });

      await loadUsers();
    } catch (error) {
      const data = error.response?.data;

      if (Array.isArray(data)) {
        toast.error(
          data[0]?.description ||
            "کاروونکی جوړ نه شو"
        );
      } else {
        toast.error(
          data?.message ||
            "کاروونکی جوړ نه شو"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const changeActive = async (id, isActive) => {
    try {
      await api.put(`/User/${id}/active`, {
        isActive: !isActive,
      });

      toast.success(
        !isActive
          ? "کاروونکی فعال شو"
          : "کاروونکی غیر فعال شو"
      );

      await loadUsers();
    } catch {
      toast.error("حالت بدل نه شو");
    }
  };

  const remove = async (id) => {
    if (
      !window.confirm(
        "ایا د دې کاروونکي د حذف کولو ډاډه یاست؟"
      )
    ) {
      return;
    }

    try {
      await api.delete(`/User/${id}`);

      toast.success("کاروونکی حذف شو");

      await loadUsers();
    } catch {
      toast.error("کاروونکی حذف نه شو");
    }
  };

  return (
    <div className="users-page" dir="rtl">

      {/* =========================================
          HEADER
          ========================================= */}

      <div className="users-header">
        <div>
          <h2>د کاروونکو مدیریت</h2>

          <p>
            نوي کاروونکي جوړول او مدیریت
          </p>
        </div>

        <div className="users-count">
          <span>ټول کاروونکي</span>
          <strong>{users.length}</strong>
        </div>
      </div>


      {/* =========================================
          CREATE USER
          ========================================= */}

      <div className="users-panel">

        <div className="users-panel-header">
          <div>
            <h3>نوی کاروونکی</h3>

            <p>
              د نوي کاروونکي معلومات داخل کړئ
            </p>
          </div>
        </div>


        <form
          onSubmit={createUser}
          className="users-form"
        >

          <div className="users-form-grid">

            {/* Full Name */}
            <div className="users-form-group">
              <label htmlFor="fullName">
                بشپړ نوم
              </label>

              <input
                id="fullName"
                name="fullName"
                value={form.fullName}
                onChange={change}
                placeholder="بشپړ نوم"
                disabled={loading}
              />
            </div>


            {/* Username */}
            <div className="users-form-group">
              <label htmlFor="userName">
                کارن نوم <span>*</span>
              </label>

              <input
                id="userName"
                name="userName"
                value={form.userName}
                onChange={change}
                placeholder="کارن نوم"
                autoComplete="username"
                disabled={loading}
              />
            </div>


            {/* Email */}
            <div className="users-form-group">
              <label htmlFor="email">
                Email <span>*</span>
              </label>

              <input
                id="email"
                type="email"
                name="email"
                value={form.email}
                onChange={change}
                placeholder="example@email.com"
                autoComplete="email"
                dir="ltr"
                disabled={loading}
              />
            </div>


            {/* Phone */}
            <div className="users-form-group">
              <label htmlFor="phoneNumber">
                موبایل
              </label>

              <input
                id="phoneNumber"
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={change}
                placeholder="د موبایل شمېره"
                dir="ltr"
                disabled={loading}
              />
            </div>


            {/* Password */}
            <div className="users-form-group">
              <label htmlFor="password">
                پاسورډ <span>*</span>
              </label>

              <input
                id="password"
                type="password"
                name="password"
                value={form.password}
                onChange={change}
                placeholder="پاسورډ"
                autoComplete="new-password"
                disabled={loading}
              />
            </div>


            {/* Role */}
            <div className="users-form-group">
              <label htmlFor="role">
                رول <span>*</span>
              </label>

              <select
                id="role"
                name="role"
                value={form.role}
                onChange={change}
                disabled={loading}
              >
                <option value="SimpleUser">
                  SimpleUser
                </option>

                <option value="CompanyUser">
                  CompanyUser
                </option>

                <option value="Owner">
                  Owner
                </option>
              </select>
            </div>


            {/* Company */}
            <div className="users-form-group">
              <label htmlFor="companyId">
                شرکت
              </label>

              <select
                id="companyId"
                name="companyId"
                value={form.companyId}
                onChange={change}
                disabled={loading}
              >
                <option value="">
                  -- شرکت انتخاب کړئ --
                </option>

                {companies.map((company) => (
                  <option
                    key={company.id}
                    value={company.id}
                  >
                    {company.name}
                  </option>
                ))}
              </select>
            </div>

          </div>


          {/* Submit */}
          <div className="users-form-actions">
            <button
              type="submit"
              className="users-btn users-btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="users-spinner"></span>
                  جوړېږي...
                </>
              ) : (
                <>
                  کاروونکی جوړ کړئ
                </>
              )}
            </button>
          </div>

        </form>
      </div>


      {/* =========================================
          USERS TABLE
          ========================================= */}

      <div className="users-panel">

        <div className="users-panel-header">
          <div>
            <h3>کاروونکي</h3>

            <p>
              د سیستم ټول ثبت شوي کاروونکي
            </p>
          </div>
        </div>


        <div className="users-table-wrapper">

          {usersLoading ? (
            <div className="users-loading">
              <span className="users-spinner"></span>
              کاروونکي لوستل کېږي...
            </div>
          ) : (
            <table className="users-table">

              <thead>
                <tr>
                  <th>نوم</th>
                  <th>کارونکی نوم</th>
                  <th>موبایل</th>
                  <th>شرکت</th>
                  <th>رول</th>
                  <th>حالت</th>
                  <th>عمل</th>
                </tr>
              </thead>

              <tbody>

                {users.map((user) => (
                  <tr key={user.id}>

                    <td>
                      <div className="users-name">
                        {user.fullName || "-"}
                      </div>
                    </td>

                    <td>
                      <span className="users-username">
                        {user.userName}
                      </span>
                    </td>

                    <td>
                      {user.phoneNumber || "-"}
                    </td>

                    <td>
                      {user.company?.name || "-"}
                    </td>

                    <td>
                      <div className="users-roles">
                        {user.roles?.map(
                          (role) => (
                            <span
                              key={role}
                              className="users-role"
                            >
                              {role}
                            </span>
                          )
                        ) || "-"}
                      </div>
                    </td>

                    <td>
                      <span
                        className={
                          user.isActive
                            ? "users-status users-status-active"
                            : "users-status users-status-inactive"
                        }
                      >
                        <span></span>

                        {user.isActive
                          ? "فعال"
                          : "غیر فعال"}
                      </span>
                    </td>

                    <td>
                      <div className="users-actions">

                        <button
                          type="button"
                          className="users-btn users-btn-light"
                          onClick={() =>
                            changeActive(
                              user.id,
                              user.isActive
                            )
                          }
                        >
                          {user.isActive
                            ? "غیر فعال"
                            : "فعال"}
                        </button>

                        <button
                          type="button"
                          className="users-btn users-btn-brown"
                          onClick={() =>
                            remove(user.id)
                          }
                        >
                          حذف
                        </button>

                      </div>
                    </td>

                  </tr>
                ))}


                {users.length === 0 && (
                  <tr>
                    <td
                      colSpan="7"
                      className="users-empty"
                    >
                      <div>
                        <strong>
                          کاروونکی موجود نه دی
                        </strong>

                        <span>
                          تر اوسه کوم کاروونکی
                          ثبت شوی نه دی
                        </span>
                      </div>
                    </td>
                  </tr>
                )}

              </tbody>

            </table>
          )}

        </div>
      </div>

    </div>
  );
}