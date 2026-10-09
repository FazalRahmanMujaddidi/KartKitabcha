import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const COLORS = {
  dark: "#343148",
  light: "#cdc6bd",
  brown: "#583432",
};

export default function VehiclePage() {
  const { hasRole } = useAuth();

  const isOwner = hasRole("Owner");
  const isSimpleUser = hasRole("SimpleUser");
  const isCompanyUser = hasRole("CompanyUser");

  // SimpleUser یوازې Save کولی شي
  const canCreate = isOwner || isSimpleUser;

  // یوازې Owner edit/delete کولی شي
  const canEdit = isOwner;
  const canDelete = isOwner;

  const [vehicles, setVehicles] = useState([]);
  const [isEdit, setIsEdit] = useState(false);

  const [form, setForm] = useState({
    id: 0,
    type: "",
  });

  // =========================
  // وسایط ترلاسه کول
  // =========================
  const fetchVehicles = async () => {
    try {
      const res = await api.get("/Vehicle");
      setVehicles(res.data);
    } catch (error) {
      console.error("Vehicle GET Error:", error);
      toast.error("د وسایطو معلومات ترلاسه نه شول");
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  // =========================
  // د فورم بدلون
  // =========================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // اضافه کول
  // =========================
  const createVehicle = async () => {
    if (!canCreate) {
      toast.error("تاسو د اضافه کولو اجازه نه لرئ");
      return;
    }

    if (!form.type.trim()) {
      toast.warning("د وسیلې ډول اړین دی");
      return;
    }

    try {
      await api.post("/Vehicle", {
        type: form.type,
      });

      toast.success("وسیله په بریالیتوب سره اضافه شوه");

      await fetchVehicles();
      resetForm();
    } catch (error) {
      console.error("Vehicle POST Error:", error);

      const message =
        error.response?.data?.message ||
        "وسیله اضافه نه شوه";

      toast.error(message);
    }
  };

  // =========================
  // نوي کول
  // =========================
  const updateVehicle = async () => {
    if (!canEdit) {
      toast.error("یوازې Owner کولی شي وسیله سم کړي");
      return;
    }

    if (!form.type.trim()) {
      toast.warning("د وسیلې ډول اړین دی");
      return;
    }

    try {
      await api.put(`/Vehicle/${form.id}`, {
        id: form.id,
        type: form.type,
      });

      toast.success("وسیله په بریالیتوب سره نوي شوه");

      await fetchVehicles();
      resetForm();
    } catch (error) {
      console.error("Vehicle PUT Error:", error);

      const message =
        error.response?.data?.message ||
        "د وسیلې نوي کول ناکام شول";

      toast.error(message);
    }
  };

  // =========================
  // حذف کول
  // =========================
  const deleteVehicle = async (id) => {
    if (!canDelete) {
      toast.error("یوازې Owner کولی شي وسیله حذف کړي");
      return;
    }

    if (!window.confirm("ایا غواړئ دا وسیله حذف کړئ؟")) {
      return;
    }

    try {
      await api.delete(`/Vehicle/${id}`);

      toast.success("وسیله په بریالیتوب سره حذف شوه");

      await fetchVehicles();
    } catch (error) {
      console.error("Vehicle DELETE Error:", error);

      const message =
        error.response?.data?.message ||
        "د وسیلې حذف کول ناکام شول";

      toast.error(message);
    }
  };

  // =========================
  // سمول
  // =========================
  const editVehicle = (vehicle) => {
    if (!canEdit) {
      toast.error("یوازې Owner کولی شي وسیله سم کړي");
      return;
    }

    setForm({
      id: vehicle.id,
      type: vehicle.type || "",
    });

    setIsEdit(true);
  };

  // =========================
  // پاکول
  // =========================
  const resetForm = () => {
    setForm({
      id: 0,
      type: "",
    });

    setIsEdit(false);
  };

  // =========================
  // کوچنۍ تڼۍ
  // =========================
  const smallButtonStyle = {
    fontSize: "12px",
    padding: "4px 10px",
    borderRadius: "5px",
    fontWeight: "600",
  };

  return (
    <div
      className="container-fluid mt-4 px-4"
      dir="rtl"
      style={{
        backgroundColor: COLORS.light,
        minHeight: "100vh",
        paddingTop: "20px",
        paddingBottom: "30px",
        textAlign: "right",
      }}
    >
      {/* =========================
          سرلیک
      ========================= */}
      <h2
        className="mb-4 fw-bold"
        style={{
          color: COLORS.dark,
          textAlign: "right",
        }}
      >
        د وسایطو مدیریت
      </h2>

      {/* =========================
          فورم
          CompanyUser ته نه ښکاري
      ========================= */}
      {canCreate && (
        <div
          className="card mb-4 shadow-sm"
          style={{
            backgroundColor: COLORS.light,
            border: "none",
            borderRadius: "10px",
          }}
        >
          <div
            className="card-header"
            style={{
              backgroundColor: COLORS.dark,
              color: COLORS.light,
              border: "none",
              padding: "12px 18px",
              textAlign: "right",
            }}
          >
            <h5
              className="mb-0 fw-bold"
              style={{
                color: COLORS.light,
                textAlign: "right",
              }}
            >
              {isEdit
                ? "د وسیلې سمول"
                : "د وسیلې اضافه کول"}
            </h5>
          </div>

          <div
            className="card-body"
            style={{
              backgroundColor: COLORS.light,
              textAlign: "right",
            }}
          >
            <div className="row g-2 justify-content-end">

              {/* د وسیلې ډول */}
              <div className="col-12 mb-2">
                <input
                  className="form-control"
                  name="type"
                  placeholder="د وسیلې ډول"
                  value={form.type}
                  onChange={handleChange}
                  style={{
                    backgroundColor: COLORS.light,
                    color: COLORS.dark,
                    border: "none",
                    boxShadow: `0 0 0 1px ${COLORS.dark}`,
                    textAlign: "right",
                  }}
                />
              </div>

              {/* تڼۍ */}
              <div className="col-12 d-flex justify-content-start gap-2">

                {isEdit && canEdit ? (
                  <button
                    type="button"
                    className="btn fw-bold"
                    onClick={updateVehicle}
                    style={{
                      ...smallButtonStyle,
                      backgroundColor: COLORS.brown,
                      color: COLORS.light,
                      border: "none",
                    }}
                  >
                    نوي کول
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn fw-bold"
                    onClick={createVehicle}
                    style={{
                      ...smallButtonStyle,
                      backgroundColor: COLORS.dark,
                      color: COLORS.light,
                      border: "none",
                    }}
                  >
                    اضافه کول
                  </button>
                )}

                <button
                  type="button"
                  className="btn fw-bold"
                  onClick={resetForm}
                  style={{
                    ...smallButtonStyle,
                    backgroundColor: COLORS.brown,
                    color: COLORS.light,
                    border: "none",
                  }}
                >
                  پاکول
                </button>

              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================
          د وسایطو لست
      ========================= */}
      <div
        className="card shadow-sm"
        style={{
          backgroundColor: COLORS.light,
          border: "none",
          borderRadius: "10px",
        }}
      >
        <div
          className="card-header"
          style={{
            backgroundColor: COLORS.dark,
            color: COLORS.light,
            border: "none",
            padding: "12px 18px",
            textAlign: "right",
          }}
        >
          <h5
            className="mb-0 fw-bold"
            style={{
              color: COLORS.light,
              textAlign: "right",
            }}
          >
            د وسایطو لست
          </h5>
        </div>

        <div
          className="card-body p-0"
          style={{
            backgroundColor: COLORS.light,
          }}
        >
          <div className="table-responsive">
            <table
              className="table mb-0"
              style={{
                backgroundColor: COLORS.light,
                color: COLORS.dark,
                textAlign: "right",
              }}
            >
              <thead>
                <tr
                  style={{
                    backgroundColor: COLORS.brown,
                  }}
                >
                  <th
                    style={{
                      backgroundColor: COLORS.brown,
                      color: COLORS.light,
                      textAlign: "right",
                      border: "none",
                    }}
                  >
                    شمېره
                  </th>

                  <th
                    style={{
                      backgroundColor: COLORS.brown,
                      color: COLORS.light,
                      textAlign: "right",
                      border: "none",
                    }}
                  >
                    د وسیلې ډول
                  </th>

                  {/* CompanyUser ته Actions نه ښکاري */}
                  {(canEdit || canDelete) && (
                    <th
                      style={{
                        backgroundColor: COLORS.brown,
                        color: COLORS.light,
                        textAlign: "right",
                        width: "180px",
                        border: "none",
                      }}
                    >
                      کړنې
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {vehicles.map((v, index) => (
                  <tr
                    key={v.id}
                    style={{
                      backgroundColor: COLORS.light,
                      color: COLORS.dark,
                    }}
                  >
                    <td
                      style={{
                        color: COLORS.dark,
                        backgroundColor: COLORS.light,
                        textAlign: "right",
                        border: "none",
                      }}
                    >
                      {index + 1}
                    </td>
                    <td
                      style={{
                        color: COLORS.dark,
                        backgroundColor: COLORS.light,
                        fontWeight: "600",
                        textAlign: "right",
                        border: "none",
                      }}
                    >
                      {v.type}
                    </td>
                    {(canEdit || canDelete) && (
                      <td
                        style={{
                          color: COLORS.dark,
                          backgroundColor: COLORS.light,
                          textAlign: "right",
                          whiteSpace: "nowrap",
                          border: "none",
                        }}
                      >
                        {canEdit && (
                          <button
                            type="button"
                            className="btn me-1"
                            onClick={() => editVehicle(v)}
                            style={{
                              ...smallButtonStyle,
                              backgroundColor: COLORS.dark,
                              color: COLORS.light,
                              border: "none",
                            }}
                          >
                            سمول
                          </button>
                        )}
                        {canDelete && (
                          <button
                            type="button"
                            className="btn"
                            onClick={() => deleteVehicle(v.id)}
                            style={{
                              ...smallButtonStyle,
                              backgroundColor: COLORS.brown,
                              color: COLORS.light,
                              border: "none",
                            }}
                          >
                            حذف
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}