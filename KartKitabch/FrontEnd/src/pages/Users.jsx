
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../services/api";
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
  const COLORS = {
    dark: "#343148",
    light: "#cdc6bd",
    brown: "#583432",
  };
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
  const pageStyle = {
    minHeight: "100vh",
    backgroundColor: COLORS.dark,
    color: COLORS.light,
    padding: "20px",
    direction: "rtl",
    textAlign: "right",
  };
  const headerStyle = {
    backgroundColor: COLORS.brown,
    color: COLORS.light,
    padding: "16px 20px",
    marginBottom: "15px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row-reverse",
    borderRadius: "6px",
    textAlign: "right",
  };
  const panelStyle = {
    backgroundColor: COLORS.light,
    color: COLORS.dark,
    padding: "18px",
    marginBottom: "15px",
    borderRadius: "6px",
    direction: "rtl",
    textAlign: "right",
  };
  const panelHeaderStyle = {
    backgroundColor: COLORS.brown,
    color: COLORS.light,
    padding: "10px 14px",
    marginBottom: "15px",
    borderRadius: "5px",
    direction: "rtl",
    textAlign: "right",
  };
  const inputStyle = {
    width: "100%",
    backgroundColor: COLORS.light,
    color: COLORS.dark,
    border: `1px solid ${COLORS.dark}`,
    borderRadius: "4px",
    padding: "7px 9px",
    fontSize: "13px",
    outline: "none",
    boxSizing: "border-box",
    direction: "rtl",
    textAlign: "right",
  };
  const labelStyle = {
    color: COLORS.dark,
    fontSize: "13px",
    fontWeight: "600",
    marginBottom: "5px",
    display: "block",
    direction: "rtl",
    textAlign: "right",
  };
  const primaryButtonStyle = {
    backgroundColor: COLORS.dark,
    color: COLORS.light,
    border: "none",
    borderRadius: "4px",
    padding: "6px 11px",
    fontSize: "12px",
    cursor: "pointer",
  };
  const brownButtonStyle = {
    backgroundColor: COLORS.brown,
    color: COLORS.light,
    border: "none",
    borderRadius: "4px",
    padding: "6px 11px",
    fontSize: "12px",
    cursor: "pointer",
  };
  const cellStyle = {
    padding: "9px 8px",
    fontSize: "12px",
    textAlign: "right",
    direction: "rtl",
    backgroundColor: COLORS.light,
    color: COLORS.dark,
  };
  const headerCellStyle = {
    padding: "9px 8px",
    fontSize: "12px",
    fontWeight: "600",
    textAlign: "right",
    direction: "rtl",
    whiteSpace: "nowrap",
    backgroundColor: COLORS.dark,
    color: COLORS.light,
  };
  return (
    <div style={pageStyle}>
      <div style={headerStyle}>
        <div
          style={{
            textAlign: "right",
            direction: "rtl",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "20px",
              color: COLORS.light,
              textAlign: "right",
            }}
          >
            د کاروونکو مدیریت
          </h2>
          <p
            style={{
              margin: "5px 0 0",
              fontSize: "13px",
              color: COLORS.light,
              textAlign: "right",
            }}
          >
            نوي کاروونکي جوړول او مدیریت
          </p>
        </div>
        <div
          style={{
            backgroundColor: COLORS.dark,
            color: COLORS.light,
            padding: "8px 14px",
            borderRadius: "5px",
            textAlign: "right",
            direction: "rtl",
            minWidth: "100px",
          }}
        >
          <span
            style={{
              display: "block",
              fontSize: "12px",
              textAlign: "right",
            }}
          >
            ټول کاروونکي
          </span>
          <strong
            style={{
              display: "block",
              fontSize: "18px",
              marginTop: "3px",
              textAlign: "right",
            }}
          >
            {users.length}
          </strong>
        </div>
      </div>
      <div style={panelStyle}>
        <div style={panelHeaderStyle}>
          <h3
            style={{
              margin: 0,
              fontSize: "17px",
              color: COLORS.light,
              textAlign: "right",
            }}
          >
            نوی کاروونکی
          </h3>
          <p
            style={{
              margin: "4px 0 0",
              fontSize: "12px",
              color: COLORS.light,
              textAlign: "right",
            }}
          >
            د نوي کاروونکي معلومات داخل کړئ
          </p>
        </div>
        <form
          onSubmit={createUser}
          style={{
            width: "100%",
            direction: "rtl",
            textAlign: "right",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "12px",
              direction: "rtl",
              textAlign: "right",
            }}
          >
            <div style={{ textAlign: "right" }}>
              <label
                htmlFor="fullName"
                style={labelStyle}
              >
                بشپړ نوم
              </label>
              <input
                id="fullName"
                name="fullName"
                value={form.fullName}
                onChange={change}
                placeholder="بشپړ نوم"
                disabled={loading}
                style={inputStyle}
              />
            </div>
            <div style={{ textAlign: "right" }}>
              <label
                htmlFor="userName"
                style={labelStyle}
              >
                کارن نوم{" "}
                <span style={{ color: COLORS.brown }}>
                  *
                </span>
              </label>
              <input
                id="userName"
                name="userName"
                value={form.userName}
                onChange={change}
                placeholder="کارن نوم"
                autoComplete="username"
                disabled={loading}
                style={inputStyle}
              />
            </div>
            <div style={{ textAlign: "right" }}>
              <label
                htmlFor="email"
                style={labelStyle}
              >
                Email{" "}
                <span style={{ color: COLORS.brown }}>
                  *
                </span>
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
                style={{
                  ...inputStyle,
                  textAlign: "right",
                }}
              />
            </div>
            <div style={{ textAlign: "right" }}>
              <label
                htmlFor="phoneNumber"
                style={labelStyle}
              >
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
                style={{
                  ...inputStyle,
                  textAlign: "right",
                }}
              />
            </div>
            <div style={{ textAlign: "right" }}>
              <label
                htmlFor="password"
                style={labelStyle}
              >
                پاسورډ{" "}
                <span style={{ color: COLORS.brown }}>
                  *
                </span>
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
                style={inputStyle}
              />
            </div>
            <div style={{ textAlign: "right" }}>
              <label
                htmlFor="role"
                style={labelStyle}
              >
                رول{" "}
                <span style={{ color: COLORS.brown }}>
                  *
                </span>
              </label>
              <select
                id="role"
                name="role"
                value={form.role}
                onChange={change}
                disabled={loading}
                style={inputStyle}
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
            <div style={{ textAlign: "right" }}>
              <label
                htmlFor="companyId"
                style={labelStyle}
              >
                شرکت
              </label>
              <select
                id="companyId"
                name="companyId"
                value={form.companyId}
                onChange={change}
                disabled={loading}
                style={inputStyle}
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
          <div
            style={{
              marginTop: "15px",
              display: "flex",
              justifyContent: "flex-start",
              direction: "rtl",
            }}
          >
            <button
              type="submit"
              style={primaryButtonStyle}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span
                    style={{
                      display: "inline-block",
                      width: "12px",
                      height: "12px",
                      border: `2px solid ${COLORS.light}`,
                      borderTopColor: COLORS.brown,
                      borderRadius: "50%",
                      marginLeft: "5px",
                      verticalAlign: "middle",
                      animation:
                        "users-spin 0.7s linear infinite",
                    }}
                  ></span>
                  جوړېږي...
                </>
              ) : (
                "کاروونکی جوړ کړئ"
              )}
            </button>
          </div>
        </form>
      </div>
      <div style={panelStyle}>
        <div style={panelHeaderStyle}>
          <h3
            style={{
              margin: 0,
              fontSize: "17px",
              color: COLORS.light,
              textAlign: "right",
            }}
          >
            کاروونکي
          </h3>
          <p
            style={{
              margin: "4px 0 0",
              fontSize: "12px",
              color: COLORS.light,
              textAlign: "right",
            }}
          >
            د سیستم ټول ثبت شوي کاروونکي
          </p>
        </div>
        <div
          style={{
            width: "100%",
            overflowX: "auto",
            direction: "rtl",
            textAlign: "right",
          }}
        >
          {usersLoading ? (
            <div
              style={{
                backgroundColor: COLORS.dark,
                color: COLORS.light,
                padding: "25px",
                textAlign: "right",
                direction: "rtl",
                fontSize: "13px",
                borderRadius: "5px",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: "12px",
                  height: "12px",
                  border: `2px solid ${COLORS.light}`,
                  borderTopColor: COLORS.brown,
                  borderRadius: "50%",
                  marginLeft: "5px",
                  verticalAlign: "middle",
                  animation:
                    "users-spin 0.7s linear infinite",
                }}
              ></span>
              کاروونکي لوستل کېږي...
            </div>
          ) : (
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                backgroundColor: COLORS.light,
                color: COLORS.dark,
                direction: "rtl",
                textAlign: "right",
              }}
            >
              <thead>
                <tr>
                  <th style={headerCellStyle}>
                    نوم
                  </th>
                  <th style={headerCellStyle}>
                    کارونکی نوم
                  </th>
                  <th style={headerCellStyle}>
                    موبایل
                  </th>
                  <th style={headerCellStyle}>
                    شرکت
                  </th>
                  <th style={headerCellStyle}>
                    رول
                  </th>
                  <th style={headerCellStyle}>
                    حالت
                  </th>
                  <th style={headerCellStyle}>
                    عمل
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td style={cellStyle}>
                      <div
                        style={{
                          fontWeight: "600",
                          color: COLORS.dark,
                          textAlign: "right",
                        }}
                      >
                        {user.fullName || "-"}
                      </div>
                    </td>
                    <td style={cellStyle}>
                      <span
                        style={{
                          color: COLORS.brown,
                          fontWeight: "600",
                          textAlign: "right",
                        }}
                      >
                        {user.userName}
                      </span>
                    </td>
                    <td style={cellStyle}>
                      {user.phoneNumber || "-"}
                    </td>
                    <td style={cellStyle}>
                      {user.company?.name || "-"}
                    </td>
                    <td style={cellStyle}>
                      <div
                        style={{
                          display: "flex",
                          gap: "4px",
                          flexWrap: "wrap",
                          justifyContent: "flex-start",
                          direction: "rtl",
                        }}
                      >
                        {user.roles?.map((role) => (
                          <span
                            key={role}
                            style={{
                              backgroundColor: COLORS.brown,
                              color: COLORS.light,
                              padding: "3px 7px",
                              borderRadius: "3px",
                              fontSize: "11px",
                            }}
                          >
                            {role}
                          </span>
                        )) || "-"}
                      </div>
                    </td>
                    <td style={cellStyle}>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "5px",
                          padding: "3px 7px",
                          borderRadius: "3px",
                          fontSize: "11px",
                          backgroundColor: user.isActive
                            ? COLORS.dark
                            : COLORS.brown,
                          color: COLORS.light,
                          direction: "rtl",
                        }}
                      >
                        <span
                          style={{
                            width: "6px",
                            height: "6px",
                            borderRadius: "50%",
                            backgroundColor: COLORS.light,
                          }}
                        ></span>
                        {user.isActive
                          ? "فعال"
                          : "غیر فعال"}
                      </span>
                    </td>
                    <td style={cellStyle}>
                      <div
                        style={{
                          display: "flex",
                          gap: "5px",
                          flexWrap: "wrap",
                          justifyContent: "flex-start",
                          direction: "rtl",
                        }}
                      >
                        <button
                          type="button"
                          onClick={() =>
                            changeActive(
                              user.id,
                              user.isActive
                            )
                          }
                          style={primaryButtonStyle}
                        >
                          {user.isActive
                            ? "غیر فعال"
                            : "فعال"}
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            remove(user.id)
                          }
                          style={brownButtonStyle}
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
                      style={{
                        backgroundColor: COLORS.light,
                        color: COLORS.dark,
                        padding: "25px",
                        textAlign: "right",
                        direction: "rtl",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "5px",
                          alignItems: "flex-start",
                          textAlign: "right",
                          width: "100%",
                        }}
                      >
                        <strong
                          style={{
                            color: COLORS.dark,
                            fontSize: "14px",
                          }}
                        >
                          کاروونکی موجود نه دی
                        </strong>
                        <span
                          style={{
                            color: COLORS.brown,
                            fontSize: "12px",
                          }}
                        >
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
      <style>
        {`
          @keyframes users-spin {
            to {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
    </div>
  );
}