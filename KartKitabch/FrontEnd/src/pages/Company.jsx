import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

const API_URL = "http://localhost:5256/api/company";
const ENUM_TYPE_API =
  "http://localhost:5256/api/company/enums/company-type";
const ENUM_TON_API =
  "http://localhost:5256/api/company/enums/company-ton";

// یوازې درې رنګونه
const COLORS = {
  dark: "#343148",
  light: "#cdc6bd",
  brown: "#583432",
};

export default function CompanyPage() {
  const [companies, setCompanies] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [companyTypes, setCompanyTypes] = useState([]);
  const [companyTons, setCompanyTons] = useState([]);
  const [isEdit, setIsEdit] = useState(false);

  const [form, setForm] = useState({
    id: 0,
    name: "",
    myProperty: 0,
    companyTon: 0,
  });

  useEffect(() => {
    axios
      .get(ENUM_TYPE_API)
      .then((res) => setCompanyTypes(res.data))
      .catch((err) => console.error(err));

    axios
      .get(ENUM_TON_API)
      .then((res) => setCompanyTons(res.data))
      .catch((err) => console.error(err));
  }, []);

  const fetchCompanies = async () => {
    try {
      const res = await axios.get(API_URL);
      setCompanies(res.data);
    } catch (err) {
      toast.error("د شرکتونو معلومات نه شول ترلاسه کېدای.");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === "myProperty" || name === "companyTon"
          ? value === ""
            ? ""
            : Number(value)
          : value,
    }));
  };

  const createCompany = async () => {
    if (form.name.trim() === "") {
      toast.error("د شرکت نوم اړین دی.");
      return;
    }

    if (form.myProperty === 0) {
      toast.error("مهرباني وکړئ د شرکت ډول وټاکئ.");
      return;
    }

    try {
      await axios.post(API_URL, form);
      toast.success("شرکت په بریالیتوب سره ثبت شو.");
      fetchCompanies();
      resetForm();
    } catch (err) {
      toast.error("شرکت ثبت نه شو.");
      console.error(err);
    }
  };

  const updateCompany = async () => {
    try {
      await axios.put(`${API_URL}/${form.id}`, form);

      toast.success("د شرکت معلومات په بریالیتوب سره بدل شول.");

      fetchCompanies();
      resetForm();
    } catch (err) {
      toast.error("د شرکت معلومات بدل نه شول.");
      console.error(err);
    }
  };

  const deleteCompany = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);

      toast.success("شرکت په بریالیتوب سره حذف شو.");

      fetchCompanies();
    } catch (err) {
      toast.error("شرکت حذف نه شو.");
      console.error(err);
    }
  };

  const editCompany = (company) => {
    setForm({
      id: company.id,
      name: company.name || "",
      myProperty: company.myProperty || 0,
      companyTon: company.companyTon || 0,
    });

    setIsEdit(true);
  };

  const resetForm = () => {
    setForm({
      id: 0,
      name: "",
      myProperty: 0,
      companyTon: 0,
    });

    setIsEdit(false);
  };

  const getDetails = async (id) => {
    try {
      const res = await axios.get(`${API_URL}/details/${id}`);
      setSelectedItem(res.data);
    } catch {
      toast.error("د شرکت جزئیات ترلاسه نه شوې.");
    }
  };

  const getVehicleEmoji = (types) => {
    if (!types || types.length === 0) {
      return "🚕";
    }

    if (types.includes("تکسي")) {
      return "🚕";
    }

    if (types.includes("باربری")) {
      return "🚛";
    }

    if (types.includes("بس")) {
      return "🚌";
    }

    return "🚕";
  };

  // د کوچنیو تڼیو Style
  const smallButtonStyle = {
    fontSize: "12px",
    padding: "4px 9px",
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
      {/* د پاڼې سرلیک */}
      <h2
        className="mb-4 fw-bold"
        style={{
          color: COLORS.dark,
          textAlign: "right",
        }}
      >
        شرکتونه
      </h2>

      {/* د فورم کارت */}
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
            {isEdit ? "د شرکت معلومات بدلول" : "شرکت اضافه کول"}
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

            {/* د شرکت نوم */}
            <div className="col-md-4">
              <input
                className="form-control"
                name="name"
                placeholder="د شرکت نوم"
                value={form.name}
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

            {/* د شرکت ډول */}
            <div className="col-md-3">
              <select
                className="form-select"
                name="myProperty"
                value={form.myProperty}
                onChange={handleChange}
                style={{
                  backgroundColor: COLORS.light,
                  color: COLORS.dark,
                  border: "none",
                  boxShadow: `0 0 0 1px ${COLORS.dark}`,
                  textAlign: "right",
                }}
              >
                <option value="">د شرکت ډول وټاکئ</option>

                {companyTypes.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            {/* اندازه */}
            <div className="col-md-3">
              <select
                className="form-select"
                name="companyTon"
                value={form.companyTon}
                onChange={handleChange}
                style={{
                  backgroundColor: COLORS.light,
                  color: COLORS.dark,
                  border: "none",
                  boxShadow: `0 0 0 1px ${COLORS.dark}`,
                  textAlign: "right",
                }}
              >
                <option value="">اندازه وټاکئ</option>

                {companyTons.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            {/* ثبت / بدلول */}
            <div className="col-md-2 d-flex justify-content-start align-items-center">
              {isEdit ? (
                <button
                  type="button"
                  onClick={updateCompany}
                  className="btn fw-bold"
                  style={{
                    backgroundColor: COLORS.brown,
                    color: COLORS.light,
                    border: "none",
                    ...smallButtonStyle,
                  }}
                >
                  بدلول
                </button>
              ) : (
                <button
                  type="button"
                  onClick={createCompany}
                  className="btn fw-bold"
                  style={{
                    backgroundColor: COLORS.dark,
                    color: COLORS.light,
                    border: "none",
                    ...smallButtonStyle,
                  }}
                >
                  ثبتول
                </button>
              )}
            </div>
          </div>

          {/* ریست */}
          <div className="mt-3 text-end">
            <button
              type="button"
              onClick={resetForm}
              className="btn fw-bold"
              style={{
                backgroundColor: COLORS.brown,
                color: COLORS.light,
                border: "none",
                fontSize: "12px",
                padding: "5px 12px",
                borderRadius: "5px",
              }}
            >
              بیا تنظیمول
            </button>
          </div>
        </div>
      </div>

      {/* د شرکتونو جدول */}
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
                    }}
                  >
                    شمېره
                  </th>

                  <th
                    style={{
                      color: COLORS.light,
                      textAlign: "right",
                    }}
                  >
                    نوم
                  </th>

                  <th
                    style={{
                      color: COLORS.light,
                      textAlign: "right",
                    }}
                  >
                    د شرکت ډول
                  </th>

                  <th
                    style={{
                      color: COLORS.light,
                      textAlign: "right",
                    }}
                  >
                    اندازه
                  </th>

                  <th
                    style={{
                      color: COLORS.light,
                      textAlign: "right",
                    }}
                  >
                    کړنې
                  </th>
                </tr>
              </thead>

              <tbody>
                {companies.map((c, index) => (
                  <tr
                    key={c.id}
                    style={{
                      backgroundColor: COLORS.light,
                      color: COLORS.dark,
                    }}
                  >
                    <td
                      style={{
                        color: COLORS.dark,
                        textAlign: "right",
                      }}
                    >
                      {index + 1}
                    </td>

                    <td
                      style={{
                        color: COLORS.dark,
                        fontWeight: "600",
                        textAlign: "right",
                      }}
                    >
                      {c.name}
                    </td>

                    <td
                      style={{
                        color: COLORS.dark,
                        textAlign: "right",
                      }}
                    >
                      {companyTypes.find(
                        (t) => t.id === c.myProperty
                      )?.name || c.myProperty}
                    </td>

                    <td
                      style={{
                        color: COLORS.dark,
                        textAlign: "right",
                      }}
                    >
                      {companyTons.find(
                        (t) => t.id === c.companyTon
                      )?.name || c.companyTon}
                    </td>

                    <td
                      style={{
                        textAlign: "right",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {/* بدلول */}
                      <button
                        type="button"
                        onClick={() => editCompany(c)}
                        className="btn me-1"
                        style={{
                          ...smallButtonStyle,
                          backgroundColor: COLORS.dark,
                          color: COLORS.light,
                          border: "none",
                        }}
                      >
                        بدلول
                      </button>

                      {/* جزئیات */}
                      <button
                        type="button"
                        onClick={() => getDetails(c.id)}
                        className="btn me-1"
                        style={{
                          ...smallButtonStyle,
                          backgroundColor: COLORS.brown,
                          color: COLORS.light,
                          border: "none",
                        }}
                      >
                        جزئیات
                      </button>

                      {/* حذف */}
                      <button
                        type="button"
                        onClick={() => deleteCompany(c.id)}
                        className="btn"
                        style={{
                          ...smallButtonStyle,
                          backgroundColor: COLORS.dark,
                          color: COLORS.light,
                          border: "none",
                        }}
                      >
                        حذف
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* جزئیات */}
          {selectedItem && (
            <div
              style={{
                padding: "20px",
                backgroundColor: COLORS.light,
                textAlign: "right",
              }}
            >
              {selectedItem.locations?.length > 0 && (
                <div className="row g-3 justify-content-end">

                  {selectedItem.locations.map((l) => (
                    <div
                      key={l.id}
                      className="col-12 col-md-6 col-lg-4"
                    >
                      <div
                        className="card h-100 shadow-sm"
                        style={{
                          backgroundColor: COLORS.light,
                          border: "none",
                          borderRadius: "8px",
                        }}
                      >
                        <div className="card-body">

                          <div
                            className="fw-bold mb-2"
                            style={{
                              color: COLORS.dark,
                              textAlign: "right",
                            }}
                          >
                            📍 {getVehicleEmoji(l.vehicleTypes)}{" "}
                            {l.cityName}
                          </div>

                          <div
                            className="fw-bold"
                            style={{
                              color: COLORS.brown,
                              textAlign: "right",
                            }}
                          >
                            {getVehicleEmoji(l.vehicleTypes)} :{" "}
                            {l.destinationCount}
                          </div>

                        </div>
                      </div>
                    </div>
                  ))}

                </div>
              )}

              {/* عمومي شمېر */}
              {selectedItem.generalCount > 0 && (
                <div className="row justify-content-end mt-3">
                  <div className="col-12 col-md-6 col-lg-4">

                    <div
                      className="card h-100 shadow-sm"
                      style={{
                        backgroundColor: COLORS.light,
                        border: "none",
                        borderRadius: "8px",
                      }}
                    >
                      <div
                        className="card-body d-flex align-items-center justify-content-end"
                      >
                        <div
                          className="me-3"
                          style={{
                            color: COLORS.dark,
                            fontSize: "28px",
                          }}
                        >
                          {getVehicleEmoji(
                            selectedItem.generalVehicleTypes
                          )}
                        </div>

                        <div>
                          <div
                            className="small"
                            style={{
                              color: COLORS.dark,
                              textAlign: "right",
                            }}
                          >
                            عمومي منزل
                          </div>

                          <div
                            className="fw-bold"
                            style={{
                              color: COLORS.brown,
                              textAlign: "right",
                            }}
                          >
                            {selectedItem.generalCount}
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* ځایونه ونه موندل شول */}
              {(!selectedItem.locations ||
                selectedItem.locations.length === 0) &&
                selectedItem.generalCount === 0 && (
                  <div
                    className="mt-3 p-3"
                    style={{
                      backgroundColor: COLORS.brown,
                      color: COLORS.light,
                      border: "none",
                      borderRadius: "6px",
                      fontWeight: "600",
                      textAlign: "right",
                    }}
                  >
                    هېڅ ځای ونه موندل شو
                  </div>
                )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}