import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

// یوازې درې رنګونه
const COLORS = {
  dark: "#343148",
  light: "#cdc6bd",
  brown: "#583432",
};

export default function CompanyLocationPage() {
  const { loading: authLoading, hasRole } = useAuth();

  // Roles
  const isOwner = hasRole("Owner");
  const isSimpleUser = hasRole("SimpleUser");
  const isCompanyUser = hasRole("CompanyUser");

  // Permissions
  // Owner: هر څه
  // SimpleUser: یوازې لیدل او اضافه کول
  // CompanyUser: هېڅ اجازه نه لري
  const canView = isOwner || isSimpleUser;
  const canCreate = isOwner || isSimpleUser;
  const canEdit = isOwner;
  const canDelete = isOwner;

  const [items, setItems] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [cities, setCities] = useState([]);

  const [form, setForm] = useState({
    id: 0,
    companyId: "",
    oldLocationRecordCount: 0,
    provincesAndCitiesId: "",
  });

  const [isEdit, setIsEdit] = useState(false);

  // ==============================
  // ټول معلومات ترلاسه کول
  // ==============================
  const fetchAll = async () => {
    if (!canView) return;

    try {
      const res = await api.get("/CompanyLocation");
      setItems(res.data);
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("ستاسو ناسته ختمه شوې ده");
        return;
      }

      if (error.response?.status === 403) {
        toast.error("تاسو دې معلوماتو ته د لاسرسي اجازه نه لرئ");
        return;
      }

      toast.error("د ځایونو معلومات ترلاسه نه شول");
    }
  };

  // ==============================
  // شرکتونه او ښارونه ترلاسه کول
  // ==============================
  const fetchDropdowns = async () => {
    if (!canView) return;

    try {
      const [companiesRes, citiesRes] = await Promise.all([
        api.get("/company"),
        api.get("/ProvincesAndCities"),
      ]);

      setCompanies(companiesRes.data);
      setCities(citiesRes.data);
    } catch (error) {
      if (error.response?.status === 403) {
        toast.error("تاسو دې معلوماتو ته د لاسرسي اجازه نه لرئ");
        return;
      }

      toast.error("د شرکتونو او ښارونو معلومات ترلاسه نه شول");
    }
  };

  // ==============================
  // د Auth له چمتو کېدو وروسته معلومات
  // ==============================
  useEffect(() => {
    if (authLoading) return;

    if (!canView) return;

    fetchAll();
    fetchDropdowns();
  }, [authLoading, canView]);

  // ==============================
  // د فورم بدلون
  // ==============================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value === "" ? "" : parseInt(value, 10),
    }));
  };

  // ==============================
  // اضافه کول
  // ==============================
  const create = async () => {
    if (!canCreate) {
      toast.error("تاسو د اضافه کولو اجازه نه لرئ");
      return;
    }

    if (!form.companyId || !form.provincesAndCitiesId) {
      toast.error("مهرباني وکړئ شرکت او ښار وټاکئ");
      return;
    }

    try {
      await api.post("/CompanyLocation", {
        companyId: form.companyId,
        provincesAndCitiesId: form.provincesAndCitiesId,

        oldLocationRecordCount: Number(form.oldLocationRecordCount || 0),
      });

      toast.success("ځای په بریالیتوب سره اضافه شو");

      await fetchAll();
      resetForm();
    } catch (error) {
      if (error.response?.status === 403) {
        toast.error("تاسو د اضافه کولو اجازه نه لرئ");
        return;
      }

      toast.error("ځای اضافه نه شو");
    }
  };

  // ==============================
  // نوي کول
  // یوازې Owner
  // ==============================
  const update = async () => {
    if (!canEdit) {
      toast.error("یوازې Owner د سمولو اجازه لري");
      return;
    }

    if (!form.companyId || !form.provincesAndCitiesId) {
      toast.error("مهرباني وکړئ شرکت او ښار وټاکئ");
      return;
    }

    try {
      await api.put(`/CompanyLocation/${form.id}`, {
        companyId: form.companyId,
        provincesAndCitiesId: form.provincesAndCitiesId,
        oldLocationRecordCount: Number(form.oldLocationRecordCount || 0),
      });

      toast.success("ځای په بریالیتوب سره نوي شو");

      await fetchAll();
      resetForm();
    } catch (error) {
      if (error.response?.status === 403) {
        toast.error("یوازې Owner د سمولو اجازه لري");
        return;
      }

      toast.error("ځای نوي نه شو");
    }
  };

  // ==============================
  // حذف کول
  // یوازې Owner
  // ==============================
  const deleteItem = async (id) => {
    if (!canDelete) {
      toast.error("یوازې Owner د حذف کولو اجازه لري");
      return;
    }

    if (!window.confirm("ایا غواړئ دا ځای حذف کړئ؟")) {
      return;
    }

    try {
      await api.delete(`/CompanyLocation/${id}`);

      toast.success("ځای په بریالیتوب سره حذف شو");

      await fetchAll();
    } catch (error) {
      if (error.response?.status === 403) {
        toast.error("یوازې Owner د حذف کولو اجازه لري");
        return;
      }

      toast.error("ځای حذف نه شو");
    }
  };

  // ==============================
  // سمول
  // یوازې Owner
  // ==============================
  const editItem = (item) => {
    if (!canEdit) {
      toast.error("یوازې Owner د سمولو اجازه لري");
      return;
    }

    setForm({
      id: item.id,
      companyId: item.company?.id || "",
      provincesAndCitiesId:
        item.provincesAndCities?.id || "",
      oldLocationRecordCount: item.oldLocationRecordCount ?? 0,
    });

    setIsEdit(true);
  };

  // ==============================
  // فورم پاکول
  // ==============================
  const resetForm = () => {
    setForm({
      id: 0,
      companyId: "",
      provincesAndCitiesId: "",
      oldLocationRecordCount: 0,
    });

    setIsEdit(false);
  };

  // ==============================
  // د کوچنیو Buttonونو Style
  // ==============================
  const smallButtonStyle = {
    fontSize: "12px",
    padding: "4px 10px",
    borderRadius: "5px",
    fontWeight: "600",
  };

  // ==============================
  // Auth Loading
  // ==============================
  if (authLoading) {
    return (
      <div
        dir="rtl"
        style={{
          backgroundColor: COLORS.light,
          minHeight: "100vh",
          padding: "40px",
          textAlign: "right",
          color: COLORS.dark,
          fontWeight: "700",
        }}
      >
        معلومات لوډ کېږي...
      </div>
    );
  }

  // ==============================
  // CompanyUser
  // هېڅ اجازه نه لري
  // ==============================
  if (isCompanyUser || !canView) {
    return (
      <div
        dir="rtl"
        style={{
          backgroundColor: COLORS.light,
          minHeight: "100vh",
          padding: "40px",
          textAlign: "right",
        }}
      >
        <div
          style={{
            color: COLORS.dark,
            fontSize: "18px",
            fontWeight: "700",
          }}
        >
          تاسو دې پاڼې ته د لاسرسي اجازه نه لرئ.
        </div>
      </div>
    );
  }

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
      {/* ==============================
          سرلیک
      ============================== */}
      <h2
        className="mb-4 fw-bold"
        style={{
          color: COLORS.dark,
          textAlign: "right",
        }}
      >
        د شرکتونو مسیرونه
      </h2>

      {/* ==============================
          فورم
      ============================== */}
      <div
        className="card mb-4 shadow-sm"
        style={{
          backgroundColor: COLORS.light,
          border: "none",
          borderRadius: "10px",
        }}
      >
        {/* د فورم سرلیک */}
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
              ? "د شرکت مسیر سمول"
              : "د شرکت مسیر اضافه کول"}
          </h5>
        </div>

        <div
          className="card-body"
          style={{
            backgroundColor: COLORS.light,
            textAlign: "right",
          }}
        >
          <div
            className="row g-3 justify-content-start"
            style={{
              direction: "rtl",
              textAlign: "right",
            }}
          >
            {/* شرکت */}
            <div className="col-md-4">
              <label
                htmlFor="companyId"
                style={{
                  display: "block",
                  color: COLORS.dark,
                  fontWeight: "700",
                  fontSize: "14px",
                  marginBottom: "6px",
                  textAlign: "right",
                }}
              >
                شرکت
              </label>

              <select
                id="companyId"
                className="form-select"
                name="companyId"
                value={form.companyId}
                onChange={handleChange}
                style={{
                  backgroundColor: COLORS.light,
                  color: COLORS.dark,
                  border: "none",
                  boxShadow: `0 0 0 1px ${COLORS.dark}`,
                  textAlign: "right",
                  height: "42px",
                }}
              >
                <option value="">شرکت وټاکئ</option>

                {companies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* ښار */}
            <div className="col-md-4">
              <label
                htmlFor="provincesAndCitiesId"
                style={{
                  display: "block",
                  color: COLORS.dark,
                  fontWeight: "700",
                  fontSize: "14px",
                  marginBottom: "6px",
                  textAlign: "right",
                }}
              >
                ښار
              </label>

              <select
                id="provincesAndCitiesId"
                className="form-select"
                name="provincesAndCitiesId"
                value={form.provincesAndCitiesId}
                onChange={handleChange}
                style={{
                  backgroundColor: COLORS.light,
                  color: COLORS.dark,
                  border: "none",
                  boxShadow: `0 0 0 1px ${COLORS.dark}`,
                  textAlign: "right",
                  height: "42px",
                }}
              >
                <option value="">ښار وټاکئ</option>

                {cities.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* زاړه راپورونه */}
            <div className="col-md-4">
              <label
                htmlFor="oldLocationRecordCount"
                style={{
                  display: "block",
                  color: COLORS.dark,
                  fontWeight: "700",
                  fontSize: "14px",
                  marginBottom: "6px",
                  textAlign: "right",
                }}
              >
                زاړه راپورونه
              </label>

              <input
                id="oldLocationRecordCount"
                type="number"
                min="0"
                name="oldLocationRecordCount"
                value={form.oldLocationRecordCount}
                onChange={handleChange}
                placeholder="د زړو راپورونو شمېر"
                style={{
                  width: "100%",
                  height: "42px",
                  backgroundColor: COLORS.light,
                  color: COLORS.dark,
                  border: "none",
                  boxShadow: `0 0 0 1px ${COLORS.dark}`,
                  borderRadius: "6px",
                  padding: "8px 12px",
                  textAlign: "right",
                }}
              />
            </div>
          </div>

          {/* Buttons */}
          <div
            className="mt-3 d-flex justify-content-start gap-2"
            style={{
              direction: "rtl",
            }}
          >
            {isEdit ? (
              canEdit && (
                <button
                  type="button"
                  className="btn fw-bold"
                  onClick={update}
                  style={{
                    ...smallButtonStyle,
                    backgroundColor: COLORS.brown,
                    color: COLORS.light,
                    border: "none",
                  }}
                >
                  نوي کول
                </button>
              )
            ) : (
              canCreate && (
                <button
                  type="button"
                  className="btn fw-bold"
                  onClick={create}
                  style={{
                    ...smallButtonStyle,
                    backgroundColor: COLORS.dark,
                    color: COLORS.light,
                    border: "none",
                  }}
                >
                  اضافه کول
                </button>
              )
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

          {/* ==============================
              پاکول
          ============================== */}
          <div className="mt-3 text-end">
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

      {/* ==============================
          جدول
      ============================== */}
      <div
        className="card shadow-sm"
        style={{
          backgroundColor: COLORS.light,
          border: "none",
          borderRadius: "10px",
        }}
      >
        <div className="card-body p-0">
          <div className="table-responsive">
            <table
              className="table mb-0"
              style={{
                backgroundColor: COLORS.light,
                color: COLORS.dark,
                textAlign: "right",
              }}
            >
              {/* ==============================
                  جدول سر
              ============================== */}
<thead>
  <tr style={{ backgroundColor: COLORS.dark }}>
    <th
      style={{
        backgroundColor: COLORS.dark,
        color: COLORS.light,
        textAlign: "right",
      }}
    >
      شمېره
    </th>

    <th
      style={{
        backgroundColor: COLORS.dark,
        color: COLORS.light,
        textAlign: "right",
      }}
    >
      شرکت
    </th>

    <th
      style={{
        backgroundColor: COLORS.dark,
        color: COLORS.light,
        textAlign: "right",
        width: "180px",
      }}
    >
      ښار
    </th>

    {/* یوازې Owner ته کړنې */}
    {isOwner && (
      <th
        style={{
          backgroundColor: COLORS.dark,
          color: COLORS.light,
          textAlign: "right",
          width: "180px",
        }}
      >
        کړنې
      </th>
    )}
  </tr>
</thead>

              {/* ==============================
                  جدول معلومات
              ============================== */}
              <tbody>
                {items.map((x, index) => (
                  <tr
                    key={x.id}
                    style={{
                      backgroundColor: COLORS.light,
                      color: COLORS.dark,
                    }}
                  >
                    <td
                      style={{
                        backgroundColor: "#cdc6bd",
                        color: COLORS.dark,
                        textAlign: "right",
                        border: "none",
                      }}
                    >
                      {index + 1}
                    </td>
                    <td
                      style={{
                        backgroundColor: "#cdc6bd",
                        color: COLORS.dark,
                        fontWeight: "600",
                        textAlign: "right",
                        border: "none",
                      }}
                    >
                      {x.company?.name}
                    </td>
                    <td
                      style={{
                        backgroundColor: "#cdc6bd",
                        color: COLORS.dark,
                        fontWeight: "600",
                        textAlign: "right",
                        border: "none",
                      }}
                    >
                      {x.provincesAndCities?.name}
                    </td>
                    {isOwner && (
                      <td
                        style={{
                          backgroundColor: "#cdc6bd",
                          color: COLORS.dark,
                          textAlign: "right",
                          whiteSpace: "nowrap",
                          border: "none",
                        }}
                      >
                        <button
                          type="button"
                          className="btn me-1"
                          onClick={() => editItem(x)}
                          style={{
                            ...smallButtonStyle,
                            backgroundColor: COLORS.dark,
                            color: COLORS.light,
                            border: "none",
                          }}
                        >
                          سمول
                        </button>
                        <button
                          type="button"
                          className="btn"
                          onClick={() => deleteItem(x.id)}
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