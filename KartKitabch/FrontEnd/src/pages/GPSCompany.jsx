import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = "http://localhost:5256/api/GPSCompany";

// یوازې درې رنګونه
const COLORS = {
  dark: "#343148",
  light: "#cdc6bd",
  brown: "#583432",
};

export default function GPSCompany() {
  const [gps, setGps] = useState([]);
  const [isEdit, setIsEdit] = useState(false);

  const [form, setForm] = useState({
    id: 0,
    name: "",
  });

  // ======================================================
  // GPS شرکتونه ترلاسه کول
  // ======================================================

  const fetchGps = async () => {
    try {
      const res = await axios.get(API_URL);
      setGps(res.data);
    } catch (error) {
      console.error(error);
      toast.error("د جی پي ایس شرکتونو معلومات ترلاسه نه شول");
    }
  };

  useEffect(() => {
    fetchGps();
  }, []);

  // ======================================================
  // د فورم بدلون
  // ======================================================

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ======================================================
  // اضافه کول
  // ======================================================

  const createGps = async () => {
    if (!form.name || !form.name.trim()) {
      toast.warning("د جی پي ایس شرکت نوم اړین دی");
      return;
    }

    try {
      await axios.post(API_URL, {
        name: form.name.trim(),
      });

      toast.success("جی پي ایس شرکت په بریالیتوب سره اضافه شو");

      await fetchGps();
      resetForm();
    } catch (error) {
      console.error(error);
      toast.error("جی پي ایس شرکت اضافه نه شو");
    }
  };

  // ======================================================
  // نوي کول
  // ======================================================

  const updateGps = async () => {
    if (!form.name || !form.name.trim()) {
      toast.warning("د جی پي ایس شرکت نوم اړین دی");
      return;
    }

    try {
      await axios.put(`${API_URL}/${form.id}`, {
        id: form.id,
        name: form.name.trim(),
      });

      toast.success("جی پي ایس شرکت په بریالیتوب سره نوي شو");

      await fetchGps();
      resetForm();
    } catch (error) {
      console.error(error);
      toast.error("د جی پي ایس شرکت نوي کول ناکام شول");
    }
  };

  // ======================================================
  // حذف کول
  // ======================================================

  const deleteGps = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);

      toast.success("جی پي ایس شرکت په بریالیتوب سره حذف شو");

      await fetchGps();
    } catch (error) {
      console.error(error);
      toast.error("د جی پي ایس شرکت حذف کول ناکام شول");
    }
  };

  // ======================================================
  // سمول
  // ======================================================

  const editGps = (gpsItem) => {
    setForm({
      id: gpsItem.id,
      name: gpsItem.name || "",
    });

    setIsEdit(true);
  };

  // ======================================================
  // پاکول
  // ======================================================

  const resetForm = () => {
    setForm({
      id: 0,
      name: "",
    });

    setIsEdit(false);
  };

  // ======================================================
  // کوچني تڼۍ
  // ======================================================

  const smallButtonStyle = {
    fontSize: "12px",
    padding: "4px 10px",
    borderRadius: "5px",
    fontWeight: "600",
  };

  // ======================================================
  // UI
  // ======================================================

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
        color: COLORS.dark,
      }}
    >
      {/* ==================================================
          سرلیک
      ================================================== */}

      <h2
        className="mb-4 fw-bold"
        style={{
          color: COLORS.dark,
          textAlign: "right",
        }}
      >
        د جی پي ایس شرکتونو مدیریت
      </h2>

      {/* ==================================================
          فورم
      ================================================== */}

      <div
        className="card mb-4"
        style={{
          backgroundColor: COLORS.light,
          border: "none",
          borderRadius: "10px",
          boxShadow: "none",
        }}
      >
        {/* فورم سرلیک */}

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
            {isEdit ? "سمول" : "اضافه کول"}
          </h5>
        </div>

        {/* فورم برخه */}

        <div
          className="card-body"
          style={{
            backgroundColor: COLORS.light,
            textAlign: "right",
          }}
        >
          <div className="row g-2 justify-content-end">

            {/* ==================================================
                د جی پي ایس شرکت نوم
            ================================================== */}

            <div className="col-12 mb-2">

              <label
                className="form-label fw-bold w-100"
                style={{
                  color: COLORS.dark,
                  textAlign: "right",
                }}
              >
                د جی پي ایس شرکت نوم
              </label>

              <input
                type="text"
                className="form-control"
                name="name"
                placeholder="د جی پي ایس شرکت نوم ولیکئ"
                value={form.name}
                onChange={handleChange}
                style={{
                  backgroundColor: COLORS.light,
                  color: COLORS.dark,
                  border: `1px solid ${COLORS.dark}`,
                  borderRadius: "5px",
                  boxShadow: "none",
                  textAlign: "right",
                  direction: "rtl",
                }}
              />

            </div>

            {/* ==================================================
                نوي کول / اضافه کول او پاکول
            ================================================== */}

            <div className="col-12 d-flex justify-content-start gap-2">

              {isEdit ? (

                <button
                  type="button"
                  className="btn fw-bold"
                  onClick={updateGps}
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
                  onClick={createGps}
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

      {/* ==================================================
          د جی پي ایس شرکتونو لست
      ================================================== */}

      <div
        className="card"
        style={{
          backgroundColor: COLORS.light,
          border: "none",
          borderRadius: "10px",
          boxShadow: "none",
        }}
      >
        {/* سرلیک */}

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
            د جی پي ایس شرکتونو لست
          </h5>
        </div>

        {/* جدول */}

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
                direction: "rtl",
              }}
            >
              {/* ==================================================
                  جدول سر
              ================================================== */}

              <thead>

                <tr
                  style={{
                    backgroundColor: COLORS.dark,
                  }}
                >
                  <th
                    style={{
                      color: COLORS.light,
                      textAlign: "right",
                      border: "none",
                    }}
                  >
                    شمېره
                  </th>

                  <th
                    style={{
                      color: COLORS.light,
                      textAlign: "right",
                      border: "none",
                    }}
                  >
                    د جی پي ایس شرکت
                  </th>

                  <th
                    style={{
                      color: COLORS.light,
                      textAlign: "right",
                      width: "180px",
                      border: "none",
                    }}
                  >
                    کړنې
                  </th>
                </tr>

              </thead>

              {/* ==================================================
                  جدول معلومات
              ================================================== */}

              <tbody>

                {gps.length === 0 ? (

                  <tr>

                    <td
                      colSpan="3"
                      style={{
                        backgroundColor: COLORS.light,
                        color: COLORS.dark,
                        textAlign: "center",
                        padding: "20px",
                        border: "none",
                      }}
                    >
                      هېڅ جی پي ایس شرکت ونه موندل شو
                    </td>

                  </tr>

                ) : (

                  gps.map((v, index) => (

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
                          textAlign: "right",
                          border: "none",
                        }}
                      >
                        {index + 1}
                      </td>

                      <td
                        style={{
                          color: COLORS.dark,
                          fontWeight: "600",
                          textAlign: "right",
                          border: "none",
                        }}
                      >
                        {v.name}
                      </td>

                      <td
                        style={{
                          textAlign: "right",
                          whiteSpace: "nowrap",
                          border: "none",
                        }}
                      >
                        {/* سمول */}

                        <button
                          type="button"
                          className="btn me-1"
                          onClick={() => editGps(v)}
                          style={{
                            ...smallButtonStyle,
                            backgroundColor: COLORS.dark,
                            color: COLORS.light,
                            border: "none",
                          }}
                        >
                          سمول
                        </button>

                        {/* حذف */}

                        <button
                          type="button"
                          className="btn"
                          onClick={() => deleteGps(v.id)}
                          style={{
                            ...smallButtonStyle,
                            backgroundColor: COLORS.brown,
                            color: COLORS.light,
                            border: "none",
                          }}
                        >
                          حذف
                        </button>

                      </td>

                    </tr>

                  ))

                )}

              </tbody>
            </table>

          </div>
        </div>
      </div>
    </div>
  );
}