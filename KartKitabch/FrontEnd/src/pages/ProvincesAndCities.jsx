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

export default function ProvincesAndCitiesPage() {
  const { loading: authLoading, hasRole } = useAuth();

  // ==========================================
  // ROLES
  // ==========================================
  const isOwner = hasRole("Owner");
  const isSimpleUser = hasRole("SimpleUser");
  const isCompanyUser = hasRole("CompanyUser");

  // ==========================================
  // PERMISSIONS
  // ==========================================
  const canView = isOwner || isSimpleUser;
  const canCreate = isOwner || isSimpleUser;
  const canEdit = isOwner;
  const canDelete = isOwner;

  const [items, setItems] = useState([]);

  const [form, setForm] = useState({
    id: 0,
    name: "",
  });

  const [isEdit, setIsEdit] = useState(false);

  // ==========================================
  // GET ALL
  // ==========================================
  const fetchData = async () => {
    if (!canView) return;

    try {
      const res = await api.get("/ProvincesAndCities");
      setItems(res.data);
    } catch (error) {
      if (error.response?.status === 403) {
        toast.error(
          "تاسو دې معلوماتو ته د لاسرسي اجازه نه لرئ"
        );
        return;
      }

      toast.error(
        "د ولایتونو او ولسوالیو معلومات ترلاسه نه شول"
      );
    }
  };

  // ==========================================
  // LOAD DATA
  // ==========================================
  useEffect(() => {
    if (authLoading) return;
    if (!canView) return;

    fetchData();
  }, [authLoading, canView]);

  // ==========================================
  // HANDLE CHANGE
  // ==========================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==========================================
  // CREATE
  // ==========================================
  const createItem = async () => {
    if (!canCreate) {
      toast.error(
        "تاسو د معلوماتو د اضافه کولو اجازه نه لرئ"
      );
      return;
    }

    const name = form.name.trim();

    if (!name) {
      toast.error(
        "مهرباني وکړئ د ولایت یا ولسوالۍ نوم ولیکئ"
      );
      return;
    }

    try {
      await api.post(
        "/ProvincesAndCities",
        {
          name: name,
        }
      );

      toast.success(
        "ولایت یا ولسوالۍ په بریالیتوب سره اضافه شوه"
      );

      await fetchData();
      resetForm();
    } catch (error) {
      if (error.response?.status === 403) {
        toast.error(
          "تاسو د اضافه کولو اجازه نه لرئ"
        );
        return;
      }

      toast.error(
        "ولایت یا ولسوالۍ اضافه نه شوه"
      );
    }
  };

  // ==========================================
  // UPDATE
  // یوازې Owner
  // ==========================================
  const updateItem = async () => {
    if (!canEdit) {
      toast.error(
        "یوازې Owner د سمولو اجازه لري"
      );
      return;
    }

    const name = form.name.trim();

    if (!name) {
      toast.error(
        "مهرباني وکړئ د ولایت یا ولسوالۍ نوم ولیکئ"
      );
      return;
    }

    try {
      await api.put(
        `/ProvincesAndCities/${form.id}`,
        {
          id: form.id,
          name: name,
        }
      );

      toast.success(
        "معلومات په بریالیتوب سره نوي شول"
      );

      await fetchData();
      resetForm();
    } catch (error) {
      if (error.response?.status === 403) {
        toast.error(
          "یوازې Owner د سمولو اجازه لري"
        );
        return;
      }

      toast.error(
        "معلومات نوي نه شول"
      );
    }
  };

  // ==========================================
  // DELETE
  // یوازې Owner
  // ==========================================
  const deleteItem = async (id) => {
    if (!canDelete) {
      toast.error(
        "یوازې Owner د حذف کولو اجازه لري"
      );
      return;
    }

    const confirmed = window.confirm(
      "ایا غواړئ دا ولایت یا ولسوالۍ حذف کړئ؟"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(
        `/ProvincesAndCities/${id}`
      );

      toast.success(
        "ولایت یا ولسوالۍ په بریالیتوب سره حذف شوه"
      );

      await fetchData();
    } catch (error) {
      if (error.response?.status === 403) {
        toast.error(
          "یوازې Owner د حذف کولو اجازه لري"
        );
        return;
      }

      toast.error(
        "ولایت یا ولسوالۍ حذف نه شوه"
      );
    }
  };

  // ==========================================
  // EDIT
  // یوازې Owner
  // ==========================================
  const editItem = (item) => {
    if (!canEdit) {
      toast.error(
        "یوازې Owner د سمولو اجازه لري"
      );
      return;
    }

    setForm({
      id: item.id,
      name: item.name || "",
    });

    setIsEdit(true);
  };

  // ==========================================
  // RESET
  // ==========================================
  const resetForm = () => {
    setForm({
      id: 0,
      name: "",
    });

    setIsEdit(false);
  };

  // ==========================================
  // BUTTON STYLE
  // ==========================================
  const smallButtonStyle = {
    fontSize: "12px",
    padding: "5px 12px",
    borderRadius: "5px",
    fontWeight: "700",
    border: "none",
    whiteSpace: "nowrap",
  };

  // ==========================================
  // AUTH LOADING
  // ==========================================
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

  // ==========================================
  // COMPANY USER / NO ACCESS
  // ==========================================
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

  // ==========================================
  // MAIN PAGE
  // ==========================================
  return (
    <div
      className="container-fluid"
      dir="rtl"
      style={{
        backgroundColor: COLORS.light,
        minHeight: "100vh",
        paddingTop: "25px",
        paddingBottom: "40px",
        paddingRight: "25px",
        paddingLeft: "25px",
        textAlign: "right",
      }}
    >
      {/* PAGE TITLE */}
      <div
        style={{
          textAlign: "right",
          marginBottom: "20px",
        }}
      >
        <h2
          style={{
            color: COLORS.dark,
            fontSize: "22px",
            fontWeight: "800",
            margin: 0,
            textAlign: "right",
          }}
        >
          ولایتونه او ولسوالۍ
        </h2>

        <div
          style={{
            color: COLORS.dark,
            fontSize: "12px",
            fontWeight: "600",
            marginTop: "5px",
          }}
        >
          د ولایتونو او ولسوالیو معلومات
        </div>
      </div>

      {/* FORM CARD */}
      <div
        className="card mb-4 shadow-sm"
        style={{
          backgroundColor: COLORS.light,
          border: "none",
          borderRadius: "10px",
          textAlign: "right",
        }}
      >
        <div
          className="card-header"
          style={{
            backgroundColor: COLORS.dark,
            color: COLORS.light,
            border: "none",
            borderRadius: "10px 10px 0 0",
            padding: "11px 16px",
            textAlign: "right",
          }}
        >
          <div
            style={{
              color: COLORS.light,
              fontSize: "15px",
              fontWeight: "800",
              textAlign: "right",
            }}
          >
            {isEdit
              ? "د ولایت یا ولسوالۍ سمول"
              : "د ولایت یا ولسوالۍ اضافه کول"}
          </div>
        </div>

        <div
          className="card-body"
          style={{
            backgroundColor: COLORS.light,
            textAlign: "right",
            padding: "18px",
          }}
        >
          <div className="row g-2 justify-content-end">
            <div className="col-md-9">
              <input
                type="text"
                className="form-control"
                name="name"
                value={form.name}
                placeholder="د ولایت یا ولسوالۍ نوم"
                onChange={handleChange}
                style={{
                  backgroundColor: COLORS.light,
                  color: COLORS.dark,
                  border: `1px solid ${COLORS.dark}`,
                  borderRadius: "5px",
                  textAlign: "right",
                  fontSize: "13px",
                  fontWeight: "600",
                  boxShadow: "none",
                }}
              />
            </div>

            <div className="col-md-3 d-flex justify-content-start align-items-center">
              {isEdit
                ? canEdit && (
                    <button
                      type="button"
                      className="btn"
                      onClick={updateItem}
                      style={{
                        ...smallButtonStyle,
                        backgroundColor: COLORS.brown,
                        color: COLORS.light,
                      }}
                    >
                      نوي کول
                    </button>
                  )
                : canCreate && (
                    <button
                      type="button"
                      className="btn"
                      onClick={createItem}
                      style={{
                        ...smallButtonStyle,
                        backgroundColor: COLORS.dark,
                        color: COLORS.light,
                      }}
                    >
                      اضافه کول
                    </button>
                  )}

              <button
                type="button"
                className="btn"
                onClick={resetForm}
                style={{
                  ...smallButtonStyle,
                  backgroundColor: COLORS.brown,
                  color: COLORS.light,
                  marginRight: "6px",
                }}
              >
                پاکول
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* TABLE CARD */}
      <div
        className="card shadow-sm"
        style={{
          backgroundColor: COLORS.light,
          border: "none",
          borderRadius: "10px",
          textAlign: "right",
        }}
      >
        <div
          className="card-body p-0"
          style={{
            backgroundColor: COLORS.light,
            border: "none",
          }}
        >
          <div className="table-responsive">
            <table
              className="table mb-0"
              style={{
                backgroundColor: COLORS.light,
                color: COLORS.dark,
                textAlign: "right",
                border: "none",
              }}
            >
              <thead>
                <tr
                  style={{
                    backgroundColor: COLORS.dark,
                    border: "none",
                  }}
                >
                  <th
                    style={{
                      color: COLORS.light,
                      backgroundColor: COLORS.dark,
                      textAlign: "right",
                      border: "none",
                      padding: "10px 12px",
                      fontSize: "12px",
                      fontWeight: "800",
                      width: "100px",
                    }}
                  >
                    شمېره
                  </th>

                  <th
                    style={{
                      color: COLORS.light,
                      backgroundColor: COLORS.dark,
                      textAlign: "right",
                      border: "none",
                      padding: "10px 12px",
                      fontSize: "12px",
                      fontWeight: "800",
                    }}
                  >
                    نوم
                  </th>

                  {isOwner && (
                    <th
                      style={{
                        color: COLORS.light,
                        backgroundColor: COLORS.dark,
                        textAlign: "right",
                        border: "none",
                        padding: "10px 12px",
                        fontSize: "12px",
                        fontWeight: "800",
                        width: "180px",
                      }}
                    >
                      کړنې
                    </th>
                  )}
                </tr>
              </thead>

              <tbody>
                {items.length === 0 ? (
                  <tr
                    style={{
                      backgroundColor: COLORS.light,
                    }}
                  >
                    <td
                      colSpan={isOwner ? 3 : 2}
                      style={{
                        color: COLORS.dark,
                        backgroundColor: COLORS.light,
                        textAlign: "right",
                        border: "none",
                        padding: "20px",
                        fontWeight: "600",
                      }}
                    >
                      تر اوسه معلومات نشته.
                    </td>
                  </tr>
                ) : (
                  items.map((item, index) => (
                    <tr
                      key={item.id}
                      style={{
                        backgroundColor: COLORS.light,
                      }}
                    >
                      {/* INDEX / شمېره */}
                      <td
                        style={{
                          color: COLORS.dark,
                          backgroundColor: COLORS.light,
                          textAlign: "right",
                          border: "none",
                          padding: "10px 12px",
                          fontSize: "12px",
                          fontWeight: "600",
                        }}
                      >
                        {index + 1}
                      </td>

                      {/* Name */}
                      <td
                        style={{
                          color: COLORS.dark,
                          backgroundColor: COLORS.light,
                          textAlign: "right",
                          border: "none",
                          padding: "10px 12px",
                          fontSize: "13px",
                          fontWeight: "700",
                        }}
                      >
                        {item.name}
                      </td>

                      {/* ACTIONS - ONLY OWNER */}
                      {isOwner && (
                        <td
                          style={{
                            color: COLORS.dark,
                            backgroundColor: COLORS.light,
                            textAlign: "right",
                            border: "none",
                            padding: "8px 12px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          <button
                            type="button"
                            className="btn"
                            onClick={() => editItem(item)}
                            style={{
                              ...smallButtonStyle,
                              backgroundColor: COLORS.dark,
                              color: COLORS.light,
                              marginLeft: "5px",
                            }}
                          >
                            سمول
                          </button>

                          <button
                            type="button"
                            className="btn"
                            onClick={() => deleteItem(item.id)}
                            style={{
                              ...smallButtonStyle,
                              backgroundColor: COLORS.brown,
                              color: COLORS.light,
                            }}
                          >
                            حذف
                          </button>
                        </td>
                      )}
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