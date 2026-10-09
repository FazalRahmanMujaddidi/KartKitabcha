
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const API_URL = "/api/company";
const ENUM_TYPE_API = "/api/company/enums/company-type";
const ENUM_TON_API = "/api/company/enums/company-ton";
const ENUM_PLACE_API = "/api/company/enums/company-place";
const ENUM_CATEGORY_API = "/api/company/enums/company-category";

const COLORS = {
  dark: "#343148",
  light: "#cdc6bd",
  brown: "#583432",
};

const DEFAULT_COMPANY_TYPES = [
  { id: 1, name: "تکسی" },
  { id: 2, name: "بس" },
  { id: 3, name: "باربری" },
];

const DEFAULT_COMPANY_TONS = [
  { id: 1, name: "باربری_متوسط" },
  { id: 2, name: "باربری_بلند" },
  { id: 3, name: "مسافربری" },
  { id: 4, name: "باربری_شهری" },
  { id: 5, name: "مسافربری_شهری" },
];

const DEFAULT_COMPANY_PLACES = [
  { id: 1, name: "مرکزیت" },
  { id: 2, name: "نمایندګی" },
  { id: 3, name: "قراردادی" },
];

const DEFAULT_COMPANY_CATEGORIES = [
  { id: 1, name: "بنادرسرحدی" },
  { id: 2, name: "مراکزولایات" },
  { id: 3, name: "والسوالی" },
  { id: 4, name: "ولایت_والسوالی_مقصد_بس" },
  { id: 5, name: "ولایت_والسوالی_مقصد_تکسی" },
];

const getEnumArray = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.result)) return data.result;
  return [];
};

const normalizeEnumArray = (data, fallback) => {
  const array = getEnumArray(data);
  if (!Array.isArray(array) || array.length === 0) {
    return fallback;
  }

  return array.map((item) => ({
    id: Number(item.id),
    name: item.name ?? String(item.value ?? ""),
  }));
};

export default function CompanyPage() {
  const { user } = useAuth();

  const roles = Array.isArray(user?.roles)
    ? user.roles
    : user?.role
      ? [user.role]
      : [];

  const isOwner = roles.includes("Owner");
  const isSimpleUser = roles.includes("SimpleUser");
  const isCompanyUser = roles.includes("CompanyUser");
  const canManageCompany = isOwner || isSimpleUser;

  const [companies, setCompanies] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [destinationCounts, setDestinationCounts] = useState({});
  const [companyTypes, setCompanyTypes] = useState(DEFAULT_COMPANY_TYPES);
  const [companyTons, setCompanyTons] = useState(DEFAULT_COMPANY_TONS);
  const [companyPlaces, setCompanyPlaces] = useState(DEFAULT_COMPANY_PLACES);
  const [companyCategories, setCompanyCategories] = useState(DEFAULT_COMPANY_CATEGORIES);
  const [isEdit, setIsEdit] = useState(false);
  const [loadingAction, setLoadingAction] = useState(null);

  const [form, setForm] = useState({
    id: 0,
    name: "",
    myProperty: 0,
    companyPlace: 0,
    companyCategory: 0,
    companyTon: 0,
    oldRecordCount: null,
  });

  const smallButtonStyle = {
    fontSize: "12px",
    padding: "4px 9px",
    borderRadius: "5px",
    fontWeight: "600",
  };

  const labelStyle = {
    color: COLORS.dark,
    textAlign: "right",
    display: "block",
    marginBottom: "5px",
    fontWeight: "700",
  };

  const fieldStyle = {
    backgroundColor: COLORS.light,
    color: COLORS.dark,
    border: "none",
    boxShadow: `0 0 0 1px ${COLORS.dark}`,
    textAlign: "right",
    width: "100%",
  };

  useEffect(() => {
    const loadEnums = async () => {
      try {
        const results = await Promise.allSettled([
          axios.get(ENUM_TYPE_API),
          axios.get(ENUM_TON_API),
          axios.get(ENUM_PLACE_API),
          axios.get(ENUM_CATEGORY_API),
        ]);

        const [typeResult, tonResult, placeResult, categoryResult] = results;

        if (typeResult.status === "fulfilled") {
          setCompanyTypes(
            normalizeEnumArray(
              typeResult.value.data,
              DEFAULT_COMPANY_TYPES
            )
          );
        }

        if (tonResult.status === "fulfilled") {
          setCompanyTons(
            normalizeEnumArray(
              tonResult.value.data,
              DEFAULT_COMPANY_TONS
            )
          );
        }

        if (placeResult.status === "fulfilled") {
          setCompanyPlaces(
            normalizeEnumArray(
              placeResult.value.data,
              DEFAULT_COMPANY_PLACES
            )
          );
        }

        if (categoryResult.status === "fulfilled") {
          setCompanyCategories(
            normalizeEnumArray(
              categoryResult.value.data,
              DEFAULT_COMPANY_CATEGORIES
            )
          );
        }
      } catch (err) {
        console.error("Enum loading error:", err);
        setCompanyTypes(DEFAULT_COMPANY_TYPES);
        setCompanyTons(DEFAULT_COMPANY_TONS);
        setCompanyPlaces(DEFAULT_COMPANY_PLACES);
        setCompanyCategories(DEFAULT_COMPANY_CATEGORIES);
      }
    };

    loadEnums();
  }, []);

  const getLocationLimitByCompany = (company) => {
    if (!company) return 0;

    const companyType = Number(company.myProperty);
    const category = Number(company.companyCategory);

    if (companyType === 1 && category === 5) {
      return 100;
    }

    if (companyType === 2 && category === 4) {
      return 31;
    }

    return 0;
  };

  const isDestinationCompany = (company) => {
    if (!company) return false;

    const companyType = Number(company.myProperty);
    const category = Number(company.companyCategory);

    return (
      (companyType === 1 && category === 5) ||
      (companyType === 2 && category === 4)
    );
  };

  const fetchDestinationCounts = async (companyList) => {
    try {
      const destinationCompanies = companyList.filter((company) =>
        isDestinationCompany(company)
      );

      if (destinationCompanies.length === 0) {
        setDestinationCounts({});
        return;
      }

      const results = await Promise.all(
        destinationCompanies.map(async (company) => {
          try {
            const res = await axios.get(`${API_URL}/details/${company.id}`);
            const locations = Array.isArray(res.data?.locations)
              ? res.data.locations
              : [];

            return {
              companyId: company.id,
              locations,
            };
          } catch (err) {
            console.error(
              `Destination details failed for company ${company.id}:`,
              err
            );

            return {
              companyId: company.id,
              locations: [],
            };
          }
        })
      );

      const mapped = {};

      results.forEach((item) => {
        mapped[item.companyId] = item.locations.map((location) => ({
          id: location.id,
          cityName:
            location.cityName ||
            location.name ||
            "نامعلوم",

          destinationCount: Number(
            location.destinationCount ??
            location.DestinationCount ??
            0
          ),

          oldLocationRecordCount: Number(
            location.oldLocationRecordCount ??
            location.OldLocationRecordCount ??
            0
          ),

          vehicleTypes: location.vehicleTypes || [],

          isAddingClosed: Boolean(
            location.isAddingClosed ??
            location.IsAddingClosed ??
            false
          ),

          autoCloseEnabled:
            location.autoCloseEnabled ??
            location.AutoCloseEnabled ??
            true,

          extraReportBatches: Number(
            location.extraReportBatches ??
            location.ExtraReportBatches ??
            0
          ),
        }));
      });

      setDestinationCounts(mapped);
    } catch (err) {
      console.error("Destination counts loading error:", err);
      setDestinationCounts({});
    }
  };

  const fetchCompanies = async () => {
    try {
      const res = await axios.get(API_URL);

      const companyList = Array.isArray(res.data)
        ? res.data
        : getEnumArray(res.data);

      const visibleCompanies =
        isCompanyUser && user?.companyId
          ? companyList.filter(
              (company) =>
                Number(company.id) === Number(user.companyId)
            )
          : companyList;

      setCompanies(visibleCompanies);

      await fetchDestinationCounts(visibleCompanies);
    } catch (err) {
      toast.error("د شرکتونو معلومات نه شول ترلاسه کېدای.");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [isCompanyUser, user?.companyId]);

  useEffect(() => {
    if (
      !isCompanyUser ||
      !user?.companyId ||
      companies.length === 0
    ) {
      return;
    }

    const ownCompany = companies.find(
      (company) =>
        Number(company.id) === Number(user.companyId)
    );

    if (ownCompany) {
      getDetails(ownCompany.id);
    }
  }, [isCompanyUser, user?.companyId, companies]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === "myProperty" ||
        name === "companyPlace" ||
        name === "companyCategory" ||
        name === "companyTon"
          ? Number(value)
          : name === "oldRecordCount"
            ? value === ""
              ? null
              : Number(value)
            : value,
    }));
  };

  const validateForm = () => {
    if (form.name.trim() === "") {
      toast.error("د شرکت نوم اړین دی.");
      return false;
    }

    if (form.myProperty === 0) {
      toast.error("مهرباني وکړئ د شرکت ډول وټاکئ.");
      return false;
    }

    if (form.companyPlace === 0) {
      toast.error("مهرباني وکړئ د شرکت ځای وټاکئ.");
      return false;
    }

    if (form.companyCategory === 0) {
      toast.error("مهرباني وکړئ د شرکت کټګوري وټاکئ.");
      return false;
    }

    if (form.companyTon === 0) {
      toast.error("مهرباني وکړئ اندازه وټاکئ.");
      return false;
    }

    return true;
  };

  const createCompany = async () => {
    if (!validateForm()) return;

    try {
      await axios.post(API_URL, {
        ...form,
        oldRecordCount:
          form.oldRecordCount === ""
            ? null
            : form.oldRecordCount,
      });

      toast.success("شرکت په بریالیتوب سره ثبت شو.");

      await fetchCompanies();

      resetForm();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
        "شرکت ثبت نه شو."
      );

      console.error(err);
    }
  };

  const updateCompany = async () => {
    if (!validateForm()) return;

    try {
      await axios.put(`${API_URL}/${form.id}`, {
        ...form,
        oldRecordCount:
          form.oldRecordCount === ""
            ? null
            : form.oldRecordCount,
      });

      toast.success(
        "د شرکت معلومات په بریالیتوب سره بدل شول."
      );

      await fetchCompanies();

      resetForm();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
        "د شرکت معلومات بدل نه شول."
      );

      console.error(err);
    }
  };

  const deleteCompany = async (id) => {
    if (!window.confirm("ایا غواړئ دا شرکت حذف کړئ؟")) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/${id}`);

      toast.success(
        "شرکت په بریالیتوب سره حذف شو."
      );

      await fetchCompanies();

      if (selectedItem?.id === id) {
        setSelectedItem(null);
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
        "شرکت حذف نه شو."
      );

      console.error(err);
    }
  };

  const editCompany = (company) => {
    setForm({
      id: company.id,
      name: company.name || "",
      myProperty: Number(company.myProperty || 0),
      companyPlace: Number(company.companyPlace || 0),
      companyCategory: Number(
        company.companyCategory || 0
      ),
      companyTon: Number(company.companyTon || 0),
      oldRecordCount:
        company.oldRecordCount ??
        company.OldRecordCount ??
        null,
    });

    setIsEdit(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const resetForm = () => {
    setForm({
      id: 0,
      name: "",
      myProperty: 0,
      companyPlace: 0,
      companyCategory: 0,
      companyTon: 0,
      oldRecordCount: null,
    });

    setIsEdit(false);
  };

  const getDetails = async (id) => {
    try {
      const res = await axios.get(
        `${API_URL}/details/${id}`
      );

      setSelectedItem(res.data);

      const company = companies.find(
        (x) => Number(x.id) === Number(id)
      );

      if (
        company &&
        isDestinationCompany(company)
      ) {
        const locations = Array.isArray(
          res.data?.locations
        )
          ? res.data.locations
          : [];

        setDestinationCounts((prev) => ({
          ...prev,
          [id]: locations.map((location) => ({
            id: location.id,

            cityName:
              location.cityName ||
              location.name ||
              "نامعلوم",

            destinationCount: Number(
              location.destinationCount ??
              location.DestinationCount ??
              0
            ),

            oldLocationRecordCount: Number(
              location.oldLocationRecordCount ??
              location.OldLocationRecordCount ??
              0
            ),

            vehicleTypes:
              location.vehicleTypes || [],

            isAddingClosed: Boolean(
              location.isAddingClosed ??
              location.IsAddingClosed ??
              false
            ),

            autoCloseEnabled:
              location.autoCloseEnabled ??
              location.AutoCloseEnabled ??
              true,

            extraReportBatches: Number(
              location.extraReportBatches ??
              location.ExtraReportBatches ??
              0
            ),
          })),
        }));
      }
    } catch (err) {
      toast.error("د شرکت جزئیات ترلاسه نه شوې.");
      console.error(err);
    }
  };

  const getVehicleEmoji = (types) => {
    if (!types) return "🚕";

    const text = Array.isArray(types)
      ? types.join(" ")
      : String(types);

    if (
      text.includes("تکسي") ||
      text.includes("تکسی")
    ) {
      return "🚕";
    }

    if (text.includes("باربری")) {
      return "🚛";
    }

    if (text.includes("بس")) {
      return "🚌";
    }

    return "🚕";
  };

  const findEnumName = (list, id) => {
    if (!Array.isArray(list)) {
      return id;
    }

    return (
      list.find(
        (x) => Number(x.id) === Number(id)
      )?.name || id
    );
  };

  const getBatchLimit = (company) => {
    const companyType = Number(
      company.myProperty
    );

    const category = Number(
      company.companyCategory
    );

    if (
      companyType === 2 &&
      category === 4
    ) {
      return 31;
    }

    if (companyType === 3) {
      if (category === 1) return 80;
      if (category === 2) return 58;
      if (category === 3) return 36;
    }

    return 0;
  };

  const getTotalRecords = (company) => {
    return Number(
      company.reportCount ??
      company.ReportCount ??
      0
    );
  };

  const getCurrentBatchCount = (company) => {
    const limit = getBatchLimit(company);
    const total = getTotalRecords(company);

    if (limit <= 0 || total <= 0) {
      return 0;
    }

    return ((total - 1) % limit) + 1;
  };

  const getCurrentBatchNumber = (company) => {
    const limit = getBatchLimit(company);
    const total = getTotalRecords(company);

    if (limit <= 0) {
      return 0;
    }

    if (total <= 0) {
      return 1;
    }

    return Math.floor(
      (total - 1) / limit
    ) + 1;
  };

  const getMaximumRecords = (company) => {
    const limit = getBatchLimit(company);

    const extraBatches = Number(
      company.extraReportBatches ??
      company.ExtraReportBatches ??
      0
    );

    if (limit <= 0) {
      return 0;
    }

    return limit * (extraBatches + 1);
  };

  const isBatchComplete = (company) => {
    const limit = getBatchLimit(company);
    const total = getTotalRecords(company);

    if (limit <= 0 || total <= 0) {
      return false;
    }

    return total % limit === 0;
  };

  const allowAdding = async (id) => {
    if (loadingAction) return;

    try {
      setLoadingAction(`allow-${id}`);

      await axios.post(
        `${API_URL}/${id}/allow-adding`
      );

      toast.success(
        "د بلې دورې ثبت اجازه ورکړل شوه."
      );

      await fetchCompanies();

      if (selectedItem?.id === id) {
        const res = await axios.get(
          `${API_URL}/details/${id}`
        );

        setSelectedItem(res.data);
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
        "د ثبت اجازه ورنه کړل شوه."
      );

      console.error(err);
    } finally {
      setLoadingAction(null);
    }
  };

  const closeAdding = async (id) => {
    if (loadingAction) return;

    try {
      setLoadingAction(`close-${id}`);

      await axios.post(
        `${API_URL}/${id}/close-adding`
      );

      toast.success(
        "د دې شرکت ثبت بند شو."
      );

      await fetchCompanies();

      if (selectedItem?.id === id) {
        const res = await axios.get(
          `${API_URL}/details/${id}`
        );

        setSelectedItem(res.data);
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
        "ثبت بند نه شو."
      );

      console.error(err);
    } finally {
      setLoadingAction(null);
    }
  };

  const reopenAdding = async (id) => {
    if (loadingAction) return;

    try {
      setLoadingAction(`reopen-${id}`);

      await axios.post(
        `${API_URL}/${id}/reopen-adding`
      );

      toast.success(
        "د ثبت اجازه بېرته فعاله شوه."
      );

      await fetchCompanies();

      if (selectedItem?.id === id) {
        const res = await axios.get(
          `${API_URL}/details/${id}`
        );

        setSelectedItem(res.data);
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
        "د ثبت اجازه بېرته فعاله نه شوه."
      );

      console.error(err);
    } finally {
      setLoadingAction(null);
    }
  };

  const getDestinationLocations = (company) => {
    return destinationCounts[company.id] || [];
  };

  const getCompanyStatus = (company) => {
    const companyType = Number(
      company.myProperty
    );

    const category = Number(
      company.companyCategory
    );

    if (isDestinationCompany(company)) {
      const locations =
        getDestinationLocations(company);

      const limit =
        getLocationLimitByCompany(company);

      return {
        isDestination: true,
        isTaxi: companyType === 1,
        isBus: companyType === 2,
        locations,
        limit,
      };
    }

    const limit = getBatchLimit(company);
    const total = getTotalRecords(company);
    const batchCount =
      getCurrentBatchCount(company);
    const batchNumber =
      getCurrentBatchNumber(company);
    const maximum =
      getMaximumRecords(company);

    const closed =
      company.isAddingClosed ??
      company.IsAddingClosed ??
      false;

    const autoClose =
      company.autoCloseEnabled ??
      company.AutoCloseEnabled ??
      true;

    const complete =
      isBatchComplete(company);

    return {
      isDestination: false,
      isTaxi: false,
      isBus: false,
      limit,
      total,
      batchCount,
      batchNumber,
      maximum,
      closed,
      autoClose,
      complete,
    };
  };

  const handleLocationAllowAdding = async (location) => {
    if (loadingAction) return;

    try {
      setLoadingAction(
        `location-allow-${location.id}`
      );

      await axios.post(
        `${API_URL}/location/${location.id}/allow-adding`
      );

      toast.success(
        "د دې ځای لپاره بل Batch اجازه ورکړل شوه."
      );

      await fetchCompanies();

      if (selectedItem) {
        const res = await axios.get(
          `${API_URL}/details/${selectedItem.id}`
        );

        setSelectedItem(res.data);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "د بل Batch اجازه ورنه کړل شوه."
      );

      console.error(error);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleLocationClose = async (location) => {
    if (loadingAction) return;

    try {
      setLoadingAction(
        `location-close-${location.id}`
      );

      await axios.post(
        `${API_URL}/location/${location.id}/close-adding`
      );

      toast.success(
        "د دې ځای ثبتول بند شول."
      );

      await fetchCompanies();

      if (selectedItem) {
        const res = await axios.get(
          `${API_URL}/details/${selectedItem.id}`
        );

        setSelectedItem(res.data);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "د دې ځای بندول ناکام شول."
      );

      console.error(error);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleLocationReopen = async (location) => {
    if (loadingAction) return;

    try {
      setLoadingAction(
        `location-reopen-${location.id}`
      );

      await axios.post(
        `${API_URL}/location/${location.id}/reopen-adding`
      );

      toast.success(
        "د دې ځای ثبتول بېرته پرانیستل شول."
      );

      await fetchCompanies();

      if (selectedItem) {
        const res = await axios.get(
          `${API_URL}/details/${selectedItem.id}`
        );

        setSelectedItem(res.data);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "د دې ځای پرانیستل ناکام شول."
      );

      console.error(error);
    } finally {
      setLoadingAction(null);
    }
  };

  const selectedCompany = selectedItem
    ? companies.find(
        (x) =>
          Number(x.id) ===
          Number(selectedItem.id)
      )
    : null;

  const selectedLocationLimit =
    getLocationLimitByCompany(
      selectedCompany
    );

  const selectedCompanyOldRecordCount =
    Number(
      selectedItem?.oldRecordCount ??
      selectedItem?.OldRecordCount ??
      selectedCompany?.oldRecordCount ??
      selectedCompany?.OldRecordCount ??
      0
    );

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
      <h2
        className="mb-4 fw-bold"
        style={{
          color: COLORS.dark,
          textAlign: "right",
        }}
      >
        شرکتونه
      </h2>

      {canManageCompany && (
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
                ? "د شرکت معلومات بدلول"
                : "شرکت اضافه کول"}
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
              className="row g-3"
              dir="rtl"
              style={{
                width: "100%",
                margin: 0,
              }}
            >
              <div className="col-md-4">
                <label style={labelStyle}>
                  د شرکت نوم
                </label>

                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  style={fieldStyle}
                />
              </div>

              <div className="col-md-4">
                <label style={labelStyle}>
                  د شرکت ډول
                </label>

                <select
                  className="form-select"
                  name="myProperty"
                  value={form.myProperty}
                  onChange={handleChange}
                  style={fieldStyle}
                >
                  <option value={0}>
                    وټاکئ
                  </option>

                  {companyTypes.map((t) => (
                    <option
                      key={t.id}
                      value={t.id}
                    >
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-4">
                <label style={labelStyle}>
                  د شرکت ځای
                </label>

                <select
                  className="form-select"
                  name="companyPlace"
                  value={form.companyPlace}
                  onChange={handleChange}
                  style={fieldStyle}
                >
                  <option value={0}>
                    وټاکئ
                  </option>

                  {companyPlaces.map((p) => (
                    <option
                      key={p.id}
                      value={p.id}
                    >
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-4">
                <label style={labelStyle}>
                  د شرکت کټګوري
                </label>

                <select
                  className="form-select"
                  name="companyCategory"
                  value={form.companyCategory}
                  onChange={handleChange}
                  style={fieldStyle}
                >
                  <option value={0}>
                    وټاکئ
                  </option>

                  {companyCategories.map((c) => (
                    <option
                      key={c.id}
                      value={c.id}
                    >
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-4">
                <label style={labelStyle}>
                  اندازه
                </label>

                <select
                  className="form-select"
                  name="companyTon"
                  value={form.companyTon}
                  onChange={handleChange}
                  style={fieldStyle}
                >
                  <option value={0}>
                    وټاکئ
                  </option>

                  {companyTons.map((t) => (
                    <option
                      key={t.id}
                      value={t.id}
                    >
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-4">
                <label style={labelStyle}>
                  زاړه راپورونه
                </label>

                <input
                  type="number"
                  min="0"
                  name="oldRecordCount"
                  value={
                    form.oldRecordCount ?? ""
                  }
                  onChange={handleChange}
                  placeholder="د زړو راپورونو شمېر"
                  style={{
                    ...fieldStyle,
                    width: "100%",
                    height: "41px",
                    borderRadius: "8px",
                    backgroundColor:
                      COLORS.light,
                    color: COLORS.dark,
                    padding: "10px 14px",
                    fontSize: "16px",
                    boxSizing: "border-box",
                    outline: "none",
                    textAlign: "right",
                    direction: "rtl",
                    appearance: "none",
                    WebkitAppearance: "none",
                    MozAppearance:
                      "textfield",
                  }}
                />
              </div>

              <div className="col-md-4">
                <label
                  style={{
                    ...labelStyle,
                    width: "100%",
                  }}
                >
                  کړنه
                </label>

                <div
                  className="d-flex gap-2"
                  style={{
                    justifyContent:
                      "flex-start",
                    direction: "rtl",
                  }}
                >
                  {isEdit ? (
                    <button
                      type="button"
                      onClick={updateCompany}
                      className="btn fw-bold"
                      style={{
                        backgroundColor:
                          COLORS.brown,
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
                        backgroundColor:
                          COLORS.dark,
                        color: COLORS.light,
                        border: "none",
                        ...smallButtonStyle,
                      }}
                    >
                      ثبتول
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={resetForm}
                    className="btn fw-bold"
                    style={{
                      backgroundColor:
                        COLORS.brown,
                      color: COLORS.light,
                      border: "none",
                      ...smallButtonStyle,
                    }}
                  >
                    پاکول
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}


      <div
        className="card shadow-sm"
        style={{
          backgroundColor: COLORS.light,
          border: "none",
          borderRadius: "10px",
        }}
      >
        <div className="card-body p-0">
          <div
            className="table-responsive"
            style={{
              maxHeight: "65vh",
              overflowY: "auto",
            }}
          >
            <table
              className="table mb-0"
              style={{
                backgroundColor: COLORS.light,
                color: COLORS.dark,
                textAlign: "right",
              }}
            >
              <thead
                style={{
                  position: "sticky",
                  top: 0,
                  zIndex: 20,
                }}
              >
                <tr>
                  {[
                    "شمېره",
                    "نوم",
                    "د شرکت ډول",
                    "د شرکت ځای",
                    "د شرکت کټګوري",
                    "اندازه",
                    "د ثبت حالت",
                    ...(canManageCompany
                      ? ["کړنې"]
                      : []),
                  ].map((title) => (
                    <th
                      key={title}
                      style={{
                        position: "sticky",
                        top: 0,
                        zIndex: 21,
                        backgroundColor:
                          COLORS.dark,
                        color: COLORS.light,
                        textAlign: "right",
                        border: "none",
                      }}
                    >
                      {title}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {companies.map((c, index) => {
                  const status =
                    getCompanyStatus(c);

                  return (
                    <tr
                      key={c.id}
                      style={{
                        backgroundColor:
                          COLORS.light,
                        color: COLORS.dark,
                      }}
                    >
                      <td
                        style={{
                          backgroundColor:
                            COLORS.light,
                          color: COLORS.dark,
                          textAlign: "right",
                          border: "none",
                        }}
                      >
                        {index + 1}
                      </td>

                      <td
                        style={{
                          backgroundColor:
                            COLORS.light,
                          color: COLORS.dark,
                          fontWeight: "600",
                          textAlign: "right",
                          border: "none",
                          cursor: isCompanyUser
                            ? "pointer"
                            : "default",
                        }}
                        onClick={() => {
                          if (isCompanyUser) {
                            getDetails(c.id);
                          }
                        }}
                      >
                        {c.name}
                      </td>

                      <td
                        style={{
                          backgroundColor:
                            COLORS.light,
                          color: COLORS.dark,
                          textAlign: "right",
                          border: "none",
                        }}
                      >
                        {findEnumName(
                          companyTypes,
                          c.myProperty
                        )}
                      </td>

                      <td
                        style={{
                          backgroundColor:
                            COLORS.light,
                          color: COLORS.dark,
                          textAlign: "right",
                          border: "none",
                        }}
                      >
                        {findEnumName(
                          companyPlaces,
                          c.companyPlace
                        )}
                      </td>

                      <td
                        style={{
                          backgroundColor:
                            COLORS.light,
                          color: COLORS.dark,
                          textAlign: "right",
                          border: "none",
                        }}
                      >
                        {findEnumName(
                          companyCategories,
                          c.companyCategory
                        )}
                      </td>

                      <td
                        style={{
                          backgroundColor:
                            COLORS.light,
                          color: COLORS.dark,
                          textAlign: "right",
                          border: "none",
                        }}
                      >
                        {findEnumName(
                          companyTons,
                          c.companyTon
                        )}
                      </td>

                      <td
                        style={{
                          backgroundColor:
                            COLORS.light,
                          color: COLORS.dark,
                          textAlign: "right",
                          border: "none",
                          whiteSpace:
                            "nowrap",
                        }}
                      >
                        {status.isDestination ? (
                          <span></span>
                        ) : status.limit > 0 ? (
                          <div
                            title={[
                              `دوره: ${status.batchNumber}`,
                              `ټول: ${status.total}`,
                              status.closed
                                ? "ثبت بند دی"
                                : "ثبت خلاص دی",
                              status.autoClose
                                ? "بندیدل اتومات"
                                : "",
                              status.complete
                                ? "دوره بشپړه شوه"
                                : "",
                            ]
                              .filter(Boolean)
                              .join("\n")}
                            dir="ltr"
                            style={{
                              display:
                                "inline-block",
                              fontWeight: "700",
                              color:
                                COLORS.dark,
                              cursor: "help",
                              unicodeBidi:
                                "isolate",
                            }}
                          >
                            {status.batchCount} /{" "}
                            {status.limit}
                          </div>
                        ) : (
                          <span>—</span>
                        )}
                      </td>

                      {canManageCompany && (
                        <td
                          style={{
                            backgroundColor:
                              COLORS.light,
                            color: COLORS.dark,
                            textAlign:
                              "right",
                            whiteSpace:
                              "nowrap",
                            border: "none",
                          }}
                        >
                          <div className="dropdown">
                            <button
                              type="button"
                              className="btn dropdown-toggle"
                              data-bs-toggle="dropdown"
                              aria-expanded="false"
                              style={{
                                ...smallButtonStyle,
                                backgroundColor:
                                  COLORS.dark,
                                color:
                                  COLORS.light,
                                border: "none",
                              }}
                            >
                              عملیات
                            </button>

                            <ul
                              className="dropdown-menu"
                              style={{
                                textAlign:
                                  "right",
                                direction:
                                  "rtl",
                                backgroundColor:
                                  COLORS.light,
                                border: "none",
                                minWidth:
                                  "140px",
                              }}
                            >
                              <li>
                                <button
                                  type="button"
                                  className="dropdown-item"
                                  onClick={() =>
                                    allowAdding(
                                      c.id
                                    )
                                  }
                                  disabled={
                                    loadingAction ===
                                    `allow-${c.id}`
                                  }
                                  style={{
                                    color:
                                      COLORS.dark,
                                    textAlign:
                                      "right",
                                  }}
                                >
                                  {loadingAction ===
                                  `allow-${c.id}`
                                    ? "..."
                                    : "اجازه ثبت"}
                                </button>
                              </li>

                              <li>
                                <button
                                  type="button"
                                  className="dropdown-item"
                                  onClick={() =>
                                    closeAdding(
                                      c.id
                                    )
                                  }
                                  disabled={
                                    loadingAction ===
                                    `close-${c.id}`
                                  }
                                  style={{
                                    color:
                                      COLORS.brown,
                                    textAlign:
                                      "right",
                                  }}
                                >
                                  {loadingAction ===
                                  `close-${c.id}`
                                    ? "..."
                                    : "بندول ثبت"}
                                </button>
                              </li>

                              <li>
                                <button
                                  type="button"
                                  className="dropdown-item"
                                  onClick={() =>
                                    reopenAdding(
                                      c.id
                                    )
                                  }
                                  disabled={
                                    loadingAction ===
                                    `reopen-${c.id}`
                                  }
                                  style={{
                                    color:
                                      COLORS.dark,
                                    textAlign:
                                      "right",
                                  }}
                                >
                                  {loadingAction ===
                                  `reopen-${c.id}`
                                    ? "..."
                                    : "بیا خلاصول"}
                                </button>
                              </li>

                              <li>
                                <button
                                  type="button"
                                  className="dropdown-item"
                                  onClick={() =>
                                    editCompany(c)
                                  }
                                  style={{
                                    color:
                                      COLORS.dark,
                                    textAlign:
                                      "right",
                                  }}
                                >
                                  بدلول
                                </button>
                              </li>

                              <li>
                                <button
                                  type="button"
                                  className="dropdown-item"
                                  onClick={() =>
                                    getDetails(
                                      c.id
                                    )
                                  }
                                  style={{
                                    color:
                                      COLORS.brown,
                                    textAlign:
                                      "right",
                                  }}
                                >
                                  جزئیات
                                </button>
                              </li>

                              <li>
                                <button
                                  type="button"
                                  className="dropdown-item"
                                  onClick={() =>
                                    deleteCompany(
                                      c.id
                                    )
                                  }
                                  style={{
                                    color:
                                      COLORS.dark,
                                    textAlign:
                                      "right",
                                  }}
                                >
                                  حذف
                                </button>
                              </li>
                            </ul>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {selectedItem && (
            <div
              style={{
                padding: "20px",
                backgroundColor:
                  COLORS.light,
                textAlign: "right",
              }}
            >
              <div
                className="mb-3"
                style={{
                  backgroundColor:
                    COLORS.light,
                  textAlign: "right",
                }}
              >
                <div
                  className="fw-bold"
                  style={{
                    color: COLORS.dark,
                    fontSize: "15px",
                    marginBottom: "6px",
                  }}
                >
                  د شرکت زاړه راپورونه:{" "}
                  {selectedCompanyOldRecordCount}
                </div>
              </div>

              {Array.isArray(
                selectedItem.locations
              ) &&
                selectedItem.locations.length >
                  0 && (
                  <div className="row g-3 justify-content-end">
                    {selectedItem.locations.map(
                      (l) => {
                        const count = Number(
                          l.destinationCount ??
                          l.DestinationCount ??
                          0
                        );

                        const oldLocationCount =
                          Number(
                            l.oldLocationRecordCount ??
                            l.OldLocationRecordCount ??
                            0
                          );

                        const totalLocationRecords =
                          count +
                          oldLocationCount;

                        const limit =
                          selectedLocationLimit >
                          0
                            ? selectedLocationLimit
                            : 100;

                        const extraBatches =
                          Number(
                            l.extraReportBatches ??
                            l.ExtraReportBatches ??
                            0
                          );

                        const maximumRecords =
                          limit *
                          (extraBatches + 1);

                        const isComplete =
                          count >=
                          maximumRecords;

                        const isClosed =
                          Boolean(
                            l.isAddingClosed ??
                            l.IsAddingClosed ??
                            false
                          );

                        const autoClose =
                          l.autoCloseEnabled ??
                          l.AutoCloseEnabled ??
                          true;

                        const allowKey =
                          `location-allow-${l.id}`;

                        const closeKey =
                          `location-close-${l.id}`;

                        const reopenKey =
                          `location-reopen-${l.id}`;

                        return (
                          <div
                            key={l.id}
                            className="col-12 col-md-6 col-lg-4"
                          >
                            <div
                              className="card h-100 shadow-sm"
                              style={{
                                backgroundColor:
                                  COLORS.light,
                                border: "none",
                                borderRadius:
                                  "8px",
                              }}
                            >
                              <div className="card-body">
                                <div
                                  className="fw-bold mb-2"
                                  style={{
                                    color:
                                      COLORS.dark,
                                    textAlign:
                                      "right",
                                  }}
                                >
                                  📍{" "}
                                  {getVehicleEmoji(
                                    l.vehicleTypes
                                  )}{" "}
                                  {l.cityName}
                                </div>

                                <div
                                  className="fw-bold mb-2"
                                  style={{
                                    color:
                                      COLORS.brown,
                                    textAlign:
                                      "right",
                                  }}
                                >
                                  {getVehicleEmoji(
                                    l.vehicleTypes
                                  )} :{" "}
                                  {count} /{" "}
                                  {maximumRecords}
                                </div>

                                <div
                                  className="mb-2"
                                  style={{
                                    color:
                                      COLORS.dark,
                                    fontSize:
                                      "12px",
                                    textAlign:
                                      "right",
                                  }}
                                >
                                  نوي راپورونه:{" "}
                                  {count}
                                </div>

                                <div
                                  className="mb-2"
                                  style={{
                                    color:
                                      COLORS.dark,
                                    fontSize:
                                      "12px",
                                    textAlign:
                                      "right",
                                  }}
                                >
                                  د مسیر زاړه راپورونه:{" "}
                                  {oldLocationCount}
                                </div>

                                <div
                                  className="fw-bold mb-2"
                                  style={{
                                    color:
                                      COLORS.brown,
                                    fontSize:
                                      "13px",
                                    textAlign:
                                      "right",
                                  }}
                                >
                                  د مسیر ټول راپورونه:{" "}
                                  {totalLocationRecords}
                                </div>

                                <div
                                  style={{
                                    color:
                                      COLORS.dark,
                                    fontSize:
                                      "11px",
                                    textAlign:
                                      "right",
                                    marginBottom:
                                      "10px",
                                  }}
                                >
                                  هره دوره:{" "}
                                  {limit} | اضافي دورې:{" "}
                                  {extraBatches}
                                </div>

                                <div
                                  className="d-flex flex-wrap gap-2 justify-content-end"
                                  dir="rtl"
                                >
                                  {canManageCompany && (
                                    <>
                                      {!isClosed ? (
                                        <button
                                          type="button"
                                          className="btn btn-sm"
                                          disabled={
                                            loadingAction ===
                                            closeKey
                                          }
                                          style={{
                                            backgroundColor:
                                              COLORS.brown,
                                            color:
                                              COLORS.light,
                                            border:
                                              "none",
                                            fontWeight:
                                              "600",
                                            fontSize:
                                              "12px",
                                          }}
                                          onClick={() =>
                                            handleLocationClose(
                                              l
                                            )
                                          }
                                        >
                                          {loadingAction ===
                                          closeKey
                                            ? "..."
                                            : "🔒 بندول"}
                                        </button>
                                      ) : (
                                        <button
                                          type="button"
                                          className="btn btn-sm"
                                          disabled={
                                            loadingAction ===
                                            reopenKey
                                          }
                                          style={{
                                            backgroundColor:
                                              COLORS.dark,
                                            color:
                                              COLORS.light,
                                            border:
                                              "none",
                                            fontWeight:
                                              "600",
                                            fontSize:
                                              "12px",
                                          }}
                                          onClick={() =>
                                            handleLocationReopen(
                                              l
                                            )
                                          }
                                        >
                                          {loadingAction ===
                                          reopenKey
                                            ? "..."
                                            : "🔓 پرانیستل"}
                                        </button>
                                      )}

                                      {isComplete &&
                                        !isClosed && (
                                          <button
                                            type="button"
                                            className="btn btn-sm"
                                            disabled={
                                              loadingAction ===
                                              allowKey
                                            }
                                            style={{
                                              backgroundColor:
                                                COLORS.dark,
                                              color:
                                                COLORS.light,
                                              border:
                                                "none",
                                              fontWeight:
                                                "600",
                                              fontSize:
                                                "12px",
                                            }}
                                            onClick={() =>
                                              handleLocationAllowAdding(
                                                l
                                              )
                                            }
                                          >
                                            {loadingAction ===
                                            allowKey
                                              ? "..."
                                              : `➕ بل ${limit} اجازه`}
                                          </button>
                                        )}

                                      <button
                                        type="button"
                                        disabled={
                                          loadingAction ===
                                            closeKey ||
                                          loadingAction ===
                                            reopenKey
                                        }
                                        onClick={() => {
                                          if (
                                            isClosed
                                          ) {
                                            handleLocationReopen(
                                              l
                                            );
                                          } else {
                                            handleLocationClose(
                                              l
                                            );
                                          }
                                        }}
                                        style={{
                                          fontSize:
                                            "11px",
                                          color:
                                            isClosed ||
                                            (autoClose &&
                                              isComplete)
                                              ? COLORS.light
                                              : COLORS.dark,
                                          padding:
                                            "5px 8px",
                                          border: `1px solid ${COLORS.dark}`,
                                          borderRadius:
                                            "5px",
                                          backgroundColor:
                                            isClosed
                                              ? COLORS.brown
                                              : autoClose &&
                                                  isComplete
                                                ? COLORS.dark
                                                : COLORS.light,
                                          fontWeight:
                                            "600",
                                          minWidth:
                                            "55px",
                                          textAlign:
                                            "center",
                                          cursor:
                                            "pointer",
                                        }}
                                      >
                                        {loadingAction ===
                                          closeKey ||
                                        loadingAction ===
                                          reopenKey
                                          ? "..."
                                          : isClosed
                                            ? "🔓 پرانیستل"
                                            : autoClose &&
                                                isComplete
                                              ? "بشپړ"
                                              : "فعال"}
                                      </button>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                )}

              {selectedItem.generalCount >
                0 && (
                <div className="row justify-content-end mt-3">
                  <div className="col-12 col-md-6 col-lg-4">
                    <div
                      className="card h-100 shadow-sm"
                      style={{
                        backgroundColor:
                          COLORS.light,
                        border: "none",
                        borderRadius:
                          "8px",
                      }}
                    >
                      <div className="card-body">
                        <div
                          className="d-flex align-items-center justify-content-end"
                        >
                          <div
                            className="me-3"
                            style={{
                              color:
                                COLORS.dark,
                              fontSize:
                                "28px",
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
                                color:
                                  COLORS.dark,
                                textAlign:
                                  "right",
                              }}
                            >
                              عمومي منزل
                            </div>

                            <div
                              className="fw-bold"
                              style={{
                                color:
                                  COLORS.brown,
                                textAlign:
                                  "right",
                              }}
                            >
                              {selectedItem.generalCount}
                            </div>

                            <div
                              className="small mt-1"
                              style={{
                                color:
                                  COLORS.dark,
                                textAlign:
                                  "right",
                              }}
                            >
                              د شرکت زاړه راپورونه:{" "}
                              {
                                selectedCompanyOldRecordCount
                              }
                            </div>

                            <div
                              className="fw-bold mt-1"
                              style={{
                                color:
                                  COLORS.brown,
                                textAlign:
                                  "right",
                              }}
                            >
                              عمومي ټول راپورونه:{" "}
                              {Number(
                                selectedItem.generalCount ??
                                  0
                              ) +
                                selectedCompanyOldRecordCount}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {(!Array.isArray(
                selectedItem.locations
              ) ||
                selectedItem.locations.length ===
                  0) &&
                selectedItem.generalCount ===
                  0 && (
                  <div
                    className="mt-3 p-3"
                    style={{
                      backgroundColor:
                        COLORS.brown,
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