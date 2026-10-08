

import React, { useEffect, useMemo, useState } from "react";
import DatePickerModule from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import Select from "react-select";
import { toast } from "react-toastify";
import api from "../services/api";

const DatePicker = DatePickerModule.default;

const COMPANY_API = "/company";
const GPS_COMPANY_API = "/GPSCompany";
const CITY_API = "/ProvincesAndCities";
const VEHICLE_API = "/Vehicle";
const COMPANY_LOCATION_API = "/CompanyLocation";

const ENUM_DURATION = "/report/enums/kart-duration";
const ENUM_KART = "/report/enums/type-of-kart";
const ENUM_ACTIVITY = "/report/enums/type-of-activity";
const ENUM_STATUS = "/report/enums/kart-status";

const COLORS = {
  dark: "#343148",
  light: "#cdc6bd",
  brown: "#583432",
};

const fieldStyle = {
  backgroundColor: COLORS.light,
  color: COLORS.dark,
  border: `1px solid ${COLORS.dark}`,
  borderRadius: "5px",
  boxShadow: "none",
  textAlign: "right",
  direction: "rtl",
};

const smallButtonStyle = {
  fontSize: "12px",
  padding: "5px 12px",
  borderRadius: "5px",
  fontWeight: "600",
};

const searchableSelectStyles = {
  control: (base) => ({
    ...base,
    minHeight: "38px",
    height: "38px",
    backgroundColor: COLORS.light,
    color: COLORS.dark,
    border: `1px solid ${COLORS.dark}`,
    borderRadius: "5px",
    boxShadow: "none",
    direction: "rtl",
    textAlign: "right",
    "&:hover": {
      border: `1px solid ${COLORS.dark}`,
    },
  }),
  valueContainer: (base) => ({
    ...base,
    padding: "0 10px",
    direction: "rtl",
  }),
  singleValue: (base) => ({
    ...base,
    color: COLORS.dark,
    textAlign: "right",
    direction: "rtl",
  }),
  input: (base) => ({
    ...base,
    color: COLORS.dark,
    textAlign: "right",
    direction: "rtl",
    margin: 0,
    padding: 0,
  }),
  placeholder: (base) => ({
    ...base,
    color: COLORS.dark,
    opacity: 0.8,
    textAlign: "right",
    direction: "rtl",
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: COLORS.light,
    color: COLORS.dark,
    direction: "rtl",
    zIndex: 9999,
    border: `1px solid ${COLORS.dark}`,
    boxShadow: "none",
  }),
  menuList: (base) => ({
    ...base,
    padding: 0,
    direction: "rtl",
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? COLORS.brown
      : state.isFocused
        ? COLORS.dark
        : COLORS.light,
    color:
      state.isSelected || state.isFocused
        ? COLORS.light
        : COLORS.dark,
    cursor: "pointer",
    textAlign: "right",
    direction: "rtl",
    padding: "8px 10px",
  }),
  dropdownIndicator: (base) => ({
    ...base,
    color: COLORS.dark,
    padding: "5px",
  }),
  clearIndicator: (base) => ({
    ...base,
    color: COLORS.brown,
    padding: "5px",
  }),
  indicatorSeparator: (base) => ({
    ...base,
    backgroundColor: COLORS.dark,
  }),
};

const afghanMonths = [
  { id: 1, name: "حمل" },
  { id: 2, name: "ثور" },
  { id: 3, name: "جوزا" },
  { id: 4, name: "سرطان" },
  { id: 5, name: "اسد" },
  { id: 6, name: "سنبله" },
  { id: 7, name: "میزان" },
  { id: 8, name: "عقرب" },
  { id: 9, name: "قوس" },
  { id: 10, name: "جدی" },
  { id: 11, name: "دلو" },
  { id: 12, name: "حوت" },
];

export default function ReportFilter() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [isCompanyUser, setIsCompanyUser] = useState(false);
  const [reports, setReports] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [gpsCompanies, setGpsCompanies] = useState([]);
  const [cities, setCities] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [companyLocations, setCompanyLocations] = useState([]);
  const [durations, setDurations] = useState([]);
  const [kartTypes, setKartTypes] = useState([]);
  const [activities, setActivities] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [dropdownLoading, setDropdownLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [excelLoading, setExcelLoading] = useState(false);

  const [filters, setFilters] = useState({
    date: null,
    month: 0,
    paletNumber: "",
    companyId: 0,
    gpsCompanyId: 0,
    vehicleId: 0,
    status: 0,
    kartType: 0,
    duration: 0,
    activity: 0,
    provinceCityId: 0,
    companyLocationId: 0,
  });

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("user");
      if (!savedUser) {
        setCurrentUser(null);
        return;
      }
      const user = JSON.parse(savedUser);
      setCurrentUser(user);
      const roles = Array.isArray(user.roles)
        ? user.roles
        : user.role
          ? [user.role]
          : [];
      const owner = roles.includes("Owner");
      const companyUser = roles.includes("CompanyUser");
      setIsOwner(owner);
      setIsCompanyUser(companyUser);
      if (companyUser && user.companyId) {
        setFilters((prev) => ({
          ...prev,
          companyId: Number(user.companyId),
        }));
      }
    } catch (error) {
      console.error("Current user error:", error);
    }
  }, []);

  const afghanLocale = {
    ...persian_fa,
    months: [
      ["حمل", "حم"],
      ["ثور", "ثو"],
      ["جوزا", "جو"],
      ["سرطان", "سر"],
      ["اسد", "اسد"],
      ["سنبله", "سن"],
      ["میزان", "می"],
      ["عقرب", "عق"],
      ["قوس", "قو"],
      ["جدی", "جد"],
      ["دلو", "دل"],
      ["حوت", "حو"],
    ],
  };

  useEffect(() => {
    fetchDropdowns();
  }, []);

  const fetchDropdowns = async () => {
    try {
      setDropdownLoading(true);
      const [
        companyRes,
        gpsCompanyRes,
        cityRes,
        durationRes,
        kartRes,
        activityRes,
        statusRes,
        vehicleRes,
        companyLocationRes,
      ] = await Promise.all([
        api.get(COMPANY_API),
        api.get(GPS_COMPANY_API),
        api.get(CITY_API),
        api.get(ENUM_DURATION),
        api.get(ENUM_KART),
        api.get(ENUM_ACTIVITY),
        api.get(ENUM_STATUS),
        api.get(VEHICLE_API),
        api.get(COMPANY_LOCATION_API),
      ]);
      setCompanies(companyRes.data || []);
      setGpsCompanies(gpsCompanyRes.data || []);
      setCities(cityRes.data || []);
      setDurations(durationRes.data || []);
      setKartTypes(kartRes.data || []);
      setActivities(activityRes.data || []);
      setStatuses(statusRes.data || []);
      setVehicles(vehicleRes.data || []);
      setCompanyLocations(companyLocationRes.data || []);
    } catch (error) {
      console.error(
        "Dropdown error:",
        error.response?.data || error
      );
      if (error.response?.status !== 401) {
        toast.error(
          "د فلټرونو په راوړلو کې ستونزه رامنځته شوه"
        );
      }
    } finally {
      setDropdownLoading(false);
    }
  };

  const companyOptions = useMemo(() => {
    let list = companies;
    if (isCompanyUser && currentUser?.companyId) {
      list = companies.filter(
        (company) =>
          Number(company.id) ===
          Number(currentUser.companyId)
      );
    }
    return list.map((company) => ({
      value: company.id,
      label: company.name,
    }));
  }, [
    companies,
    isCompanyUser,
    currentUser,
  ]);

  const cityOptions = useMemo(() => {
    return cities.map((city) => ({
      value: city.id,
      label: city.name,
    }));
  }, [cities]);

  const companyLocationOptions = useMemo(() => {
    let list = Array.isArray(companyLocations)
      ? companyLocations
      : [];

    if (filters.companyId > 0) {
      list = list.filter(
        (location) =>
          Number(
            location.companyId ??
            location.CompanyId ??
            0
          ) === Number(filters.companyId)
      );
    } else if (
      isCompanyUser &&
      currentUser?.companyId
    ) {
      list = list.filter(
        (location) =>
          Number(
            location.companyId ??
            location.CompanyId ??
            0
          ) === Number(currentUser.companyId)
      );
    }

    if (filters.provinceCityId > 0) {
      list = list.filter(
        (location) =>
          Number(
            location.provincesAndCitiesId ??
            location.ProvincesAndCitiesId ??
            0
          ) === Number(filters.provinceCityId)
      );
    }

    return list.map((location) => ({
      value: Number(
        location.id ?? location.Id
      ),
      label:
        location.name ||
        location.Name ||
        location.locationName ||
        location.LocationName ||
        location.provincesAndCities?.name ||
        location.ProvincesAndCities?.Name ||
        `موقعیت ${
          location.id ?? location.Id
        }`,
    }));
  }, [
    companyLocations,
    filters.companyId,
    filters.provinceCityId,
    isCompanyUser,
    currentUser,
  ]);

  const selectedCompany = useMemo(() => {
    return (
      companyOptions.find(
        (option) =>
          Number(option.value) ===
          Number(filters.companyId)
      ) || null
    );
  }, [
    companyOptions,
    filters.companyId,
  ]);

  const selectedCity = useMemo(() => {
    return (
      cityOptions.find(
        (option) =>
          Number(option.value) ===
          Number(filters.provinceCityId)
      ) || null
    );
  }, [
    cityOptions,
    filters.provinceCityId,
  ]);

  const selectedCompanyLocation = useMemo(() => {
    return (
      companyLocationOptions.find(
        (option) =>
          Number(option.value) ===
          Number(filters.companyLocationId)
      ) || null
    );
  }, [
    companyLocationOptions,
    filters.companyLocationId,
  ]);

  useEffect(() => {
    fetchReports();
  }, [
    currentUser,
    filters.date,
    filters.month,
    filters.paletNumber,
    filters.companyId,
    filters.gpsCompanyId,
    filters.vehicleId,
    filters.status,
    filters.kartType,
    filters.duration,
    filters.activity,
    filters.provinceCityId,
    filters.companyLocationId,
  ]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const params = {};

      if (
        isCompanyUser &&
        currentUser?.companyId
      ) {
        params.companyId =
          Number(currentUser.companyId);
      }

      if (filters.date) {
        params.date =
          filters.date.format("YYYY/MM/DD");
      }

      if (filters.month > 0) {
        params.month = filters.month;
      }

      if (filters.paletNumber.trim()) {
        params.paletNumber =
          filters.paletNumber.trim();
      }

      if (
        (isOwner || isCompanyUser) &&
        filters.companyId > 0
      ) {
        params.companyId =
          filters.companyId;
      }

      if (
        isCompanyUser &&
        currentUser?.companyId
      ) {
        params.companyId =
          Number(currentUser.companyId);
      }

      if (filters.gpsCompanyId > 0) {
        params.gpsCompanyId =
          filters.gpsCompanyId;
      }

      if (filters.vehicleId > 0) {
        params.vehicleId =
          filters.vehicleId;
      }

      if (filters.status > 0) {
        params.status =
          filters.status;
      }

      if (filters.kartType > 0) {
        params.kartType =
          filters.kartType;
      }

      if (filters.duration > 0) {
        params.duration =
          filters.duration;
      }

      if (filters.activity > 0) {
        params.activity =
          filters.activity;
      }

      if (filters.provinceCityId > 0) {
        params.provinceCityId =
          filters.provinceCityId;
      }

      if (filters.companyLocationId > 0) {
        params.companyLocationId =
          filters.companyLocationId;
      }

      const response = await api.get(
        "/report/filter",
        { params }
      );

      setReports(response.data || []);
    } catch (error) {
      console.error(
        "Filter error:",
        error.response?.data || error
      );

      if (error.response?.status !== 401) {
        toast.error(
          "د راپورونو په راوړلو کې ستونزه رامنځته شوه"
        );
      }

      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadExcel = async () => {
    try {
      setExcelLoading(true);
      const params = {};

      if (
        isCompanyUser &&
        currentUser?.companyId
      ) {
        params.companyId =
          Number(currentUser.companyId);
      }

      if (filters.date) {
        params.date =
          filters.date.format("YYYY/MM/DD");
      }

      if (filters.month > 0) {
        params.month = filters.month;
      }

      if (filters.paletNumber.trim()) {
        params.paletNumber =
          filters.paletNumber.trim();
      }

      if (
        (isOwner || isCompanyUser) &&
        filters.companyId > 0
      ) {
        params.companyId =
          filters.companyId;
      }

      if (
        isCompanyUser &&
        currentUser?.companyId
      ) {
        params.companyId =
          Number(currentUser.companyId);
      }

      if (filters.gpsCompanyId > 0) {
        params.gpsCompanyId =
          filters.gpsCompanyId;
      }

      if (filters.vehicleId > 0) {
        params.vehicleId =
          filters.vehicleId;
      }

      if (filters.status > 0) {
        params.status =
          filters.status;
      }

      if (filters.kartType > 0) {
        params.kartType =
          filters.kartType;
      }

      if (filters.duration > 0) {
        params.duration =
          filters.duration;
      }

      if (filters.activity > 0) {
        params.activity =
          filters.activity;
      }

      if (filters.provinceCityId > 0) {
        params.provinceCityId =
          filters.provinceCityId;
      }

      if (filters.companyLocationId > 0) {
        params.companyLocationId =
          filters.companyLocationId;
      }

      const response = await api.get(
        "/report/export-excel",
        {
          params,
          responseType: "blob",
        }
      );

      const blob = new Blob(
        [response.data],
        {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }
      );

      const url =
        window.URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = url;

      link.download =
        `Reports_${new Date()
          .toISOString()
          .slice(0, 10)}.xlsx`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);

      toast.success(
        "د Excel راپور په بریالیتوب سره ښکته شو"
      );
    } catch (error) {
      console.error(
        "Excel download error:",
        error.response?.data || error
      );

      toast.error(
        "د Excel فایل په ښکته کولو کې ستونزه رامنځته شوه"
      );
    } finally {
      setExcelLoading(false);
    }
  };

  const handleSelectChange = (e) => {
    const { name, value } =
      e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
  };

  const handleCompanyChange = (
    selectedOption
  ) => {
    if (isCompanyUser) {
      return;
    }

    setFilters((prev) => ({
      ...prev,
      companyId: selectedOption
        ? Number(selectedOption.value)
        : 0,
      companyLocationId: 0,
    }));
  };

  const handleCityChange = (
    selectedOption
  ) => {
    setFilters((prev) => ({
      ...prev,
      provinceCityId:
        selectedOption
          ? Number(selectedOption.value)
          : 0,
      companyLocationId: 0,
    }));
  };

  const handleCompanyLocationChange = (
    selectedOption
  ) => {
    setFilters((prev) => ({
      ...prev,
      companyLocationId:
        selectedOption
          ? Number(selectedOption.value)
          : 0,
    }));
  };

  const handleTextChange = (e) => {
    const { name, value } =
      e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (value) => {
    setFilters((prev) => ({
      ...prev,
      date: value,
    }));
  };

  const handleReset = () => {
    setFilters({
      date: null,
      month: 0,
      paletNumber: "",
      companyId:
        isCompanyUser &&
        currentUser?.companyId
          ? Number(currentUser.companyId)
          : 0,
      gpsCompanyId: 0,
      vehicleId: 0,
      status: 0,
      kartType: 0,
      duration: 0,
      activity: 0,
      provinceCityId: 0,
      companyLocationId: 0,
    });
  };

  // ============================================
  // BATCH STATUS
  // ============================================

  const batchStatus = useMemo(() => {
    if (!reports.length) {
      return null;
    }

    const report = reports[0];

    const isDestination = Boolean(
      report.isDestination ??
      report.IsDestination ??
      false
    );

    const limit = Number(
      report.batchLimit ??
      report.BatchLimit ??
      0
    );

    const batchNumber = Number(
      report.batchNumber ??
      report.BatchNumber ??
      0
    );

    const total = Number(
      report.batchTotal ??
      report.BatchTotal ??
      0
    );

    const batchCount = Number(
      report.batchCount ??
      report.BatchCount ??
      0
    );

    const closed = Boolean(
      report.batchClosed ??
      report.BatchClosed ??
      false
    );

    const autoClose = Boolean(
      report.batchAutoClose ??
      report.BatchAutoClose ??
      false
    );

    const complete = Boolean(
      report.batchComplete ??
      report.BatchComplete ??
      false
    );

    return {
      isDestination,
      limit,
      batchNumber,
      total,
      batchCount,
      closed,
      autoClose,
      complete,
    };
  }, [reports]);

  if (
    !currentUser &&
    localStorage.getItem("token")
  ) {
    return (
      <div
        dir="rtl"
        style={{
          minHeight: "100vh",
          backgroundColor: COLORS.light,
          color: COLORS.dark,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: "bold",
        }}
      >
        سیستم چمتو کېږي...
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      className="container-fluid mt-4 px-4"
      style={{
        backgroundColor: COLORS.light,
        minHeight: "100vh",
        paddingTop: "20px",
        paddingBottom: "30px",
        color: COLORS.dark,
        textAlign: "right",
      }}
    >
      <div
        className="card mb-4"
        style={{
          border: `2px solid ${COLORS.dark}`,
          borderRadius: "10px",
          overflow: "visible",
          backgroundColor: COLORS.light,
          boxShadow: "none",
        }}
      >
        <div
          className="card-header"
          style={{
            backgroundColor: COLORS.dark,
            color: COLORS.light,
            border: "none",
            padding: "15px 20px",
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
            لټون
          </h5>

          {isCompanyUser && (
            <div
              style={{
                marginTop: "5px",
                fontSize: "12px",
                color: COLORS.light,
              }}
            >
              تاسو یوازې د خپلې شرکت راپورونه وینئ
            </div>
          )}
        </div>

        <div
          className="card-body"
          style={{
            backgroundColor: COLORS.light,
            padding: "20px",
            textAlign: "right",
          }}
        >
          <div className="row g-3">
            <div className="col-md-3">
              <label
                className="form-label fw-bold w-100"
                style={{
                  color: COLORS.dark,
                  textAlign: "right",
                }}
              >
                نېټه
              </label>

              <DatePicker
                value={filters.date}
                onChange={handleDateChange}
                calendar={persian}
                locale={afghanLocale}
                format="YYYY/MM/DD"
                placeholder="نېټه وټاکئ"
                inputClass="form-control"
                style={fieldStyle}
              />
            </div>

            <div className="col-md-3">
              <label
                className="form-label fw-bold w-100"
                style={{
                  color: COLORS.dark,
                  textAlign: "right",
                }}
              >
                میاشت
              </label>

              <select
                className="form-select"
                name="month"
                value={filters.month}
                onChange={handleSelectChange}
                style={fieldStyle}
              >
                <option value={0}>
                  ټولې میاشتې
                </option>

                {afghanMonths.map((month) => (
                  <option
                    key={month.id}
                    value={month.id}
                  >
                    {month.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-3">
              <label
                className="form-label fw-bold w-100"
                style={{
                  color: COLORS.dark,
                  textAlign: "right",
                }}
              >
                پلیت نمبر
              </label>

              <input
                type="text"
                name="paletNumber"
                value={filters.paletNumber}
                onChange={handleTextChange}
                placeholder="پلیت نمبر ولیکئ"
                className="form-control"
                style={fieldStyle}
              />
            </div>

            <div className="col-md-3">
              <label
                className="form-label fw-bold w-100"
                style={{
                  color: COLORS.dark,
                  textAlign: "right",
                }}
              >
                ولایت پلیت
              </label>

              <Select
                options={cityOptions}
                value={selectedCity}
                onChange={handleCityChange}
                isClearable
                isSearchable
                placeholder="ولایت پلیت ولټوئ..."
                noOptionsMessage={() =>
                  "هېڅ ولایت پلیت ونه موندل شو"
                }
                styles={searchableSelectStyles}
              />
            </div>

            <div className="col-md-3">
              <label
                className="form-label fw-bold w-100"
                style={{
                  color: COLORS.dark,
                  textAlign: "right",
                }}
              >
                شرکت
              </label>

              <Select
                options={companyOptions}
                value={selectedCompany}
                onChange={handleCompanyChange}
                isClearable={isOwner}
                isSearchable={isOwner}
                isDisabled={
                  isCompanyUser ||
                  dropdownLoading
                }
                placeholder={
                  isCompanyUser
                    ? "ستاسې شرکت"
                    : "شرکت ولټوئ..."
                }
                noOptionsMessage={() =>
                  "هېڅ شرکت ونه موندل شو"
                }
                styles={searchableSelectStyles}
              />
            </div>

            <div className="col-md-3">
              <label
                className="form-label fw-bold w-100"
                style={{
                  color: COLORS.dark,
                  textAlign: "right",
                }}
              >
                GPS شرکت
              </label>

              <select
                className="form-select"
                name="gpsCompanyId"
                value={filters.gpsCompanyId}
                onChange={handleSelectChange}
                style={fieldStyle}
              >
                <option value={0}>
                  ټول GPS شرکتونه
                </option>

                {gpsCompanies.map((gps) => (
                  <option
                    key={gps.id}
                    value={gps.id}
                  >
                    {gps.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-3">
              <label
                className="form-label fw-bold w-100"
                style={{
                  color: COLORS.dark,
                  textAlign: "right",
                }}
              >
                وسیله
              </label>

              <select
                className="form-select"
                name="vehicleId"
                value={filters.vehicleId}
                onChange={handleSelectChange}
                style={fieldStyle}
              >
                <option value={0}>
                  ټول وسایط
                </option>

                {vehicles.map((vehicle) => (
                  <option
                    key={vehicle.id}
                    value={vehicle.id}
                  >
                    {vehicle.type}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-3">
              <label
                className="form-label fw-bold w-100"
                style={{
                  color: COLORS.dark,
                  textAlign: "right",
                }}
              >
                حالت
              </label>

              <select
                className="form-select"
                name="status"
                value={filters.status}
                onChange={handleSelectChange}
                style={fieldStyle}
              >
                <option value={0}>
                  ټول حالتونه
                </option>

                {statuses.map((status) => (
                  <option
                    key={status.id}
                    value={status.id}
                  >
                    {status.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-3">
              <label
                className="form-label fw-bold w-100"
                style={{
                  color: COLORS.dark,
                  textAlign: "right",
                }}
              >
                د کارت ډول
              </label>

              <select
                className="form-select"
                name="kartType"
                value={filters.kartType}
                onChange={handleSelectChange}
                style={fieldStyle}
              >
                <option value={0}>
                  د کارت ټول ډولونه
                </option>

                {kartTypes.map((kart) => (
                  <option
                    key={kart.id}
                    value={kart.id}
                  >
                    {kart.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-3">
              <label
                className="form-label fw-bold w-100"
                style={{
                  color: COLORS.dark,
                  textAlign: "right",
                }}
              >
                موده
              </label>

              <select
                className="form-select"
                name="duration"
                value={filters.duration}
                onChange={handleSelectChange}
                style={fieldStyle}
              >
                <option value={0}>
                  ټولې مودې
                </option>

                {durations.map((duration) => (
                  <option
                    key={duration.id}
                    value={duration.id}
                  >
                    {duration.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-3">
              <label
                className="form-label fw-bold w-100"
                style={{
                  color: COLORS.dark,
                  textAlign: "right",
                }}
              >
                فعالیت
              </label>

              <select
                className="form-select"
                name="activity"
                value={filters.activity}
                onChange={handleSelectChange}
                style={fieldStyle}
              >
                <option value={0}>
                  ټول فعالیتونه
                </option>

                {activities.map((activity) => (
                  <option
                    key={activity.id}
                    value={activity.id}
                  >
                    {activity.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-3">
              <label
                className="form-label fw-bold w-100"
                style={{
                  color: COLORS.dark,
                  textAlign: "right",
                }}
              >
                مسیر
              </label>

              <Select
                options={companyLocationOptions}
                value={selectedCompanyLocation}
                onChange={handleCompanyLocationChange}
                isClearable
                isSearchable
                isDisabled={dropdownLoading}
                placeholder="مسیر ولټوئ..."
                noOptionsMessage={() =>
                  "هېڅ مسیر ونه موندل شو"
                }
                styles={searchableSelectStyles}
              />
            </div>

            <div className="col-md-3 d-flex align-items-end">
              <button
                type="button"
                className="btn w-100 fw-bold"
                onClick={handleReset}
                style={{
                  ...smallButtonStyle,
                  backgroundColor: COLORS.brown,
                  color: COLORS.light,
                  border: `1px solid ${COLORS.brown}`,
                  minHeight: "38px",
                }}
              >
                فلټرونه پاکول
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className="card"
        style={{
          border: `2px solid ${COLORS.dark}`,
          borderRadius: "10px",
          overflow: "hidden",
          backgroundColor: COLORS.light,
          boxShadow: "none",
        }}
      >
        <div
          className="card-header d-flex justify-content-between align-items-center"
          style={{
            backgroundColor: COLORS.dark,
            color: COLORS.light,
            border: "none",
            padding: "12px 20px",
            textAlign: "right",
            direction: "rtl",
          }}
        >
          <h5
            className="mb-0 fw-bold"
            style={{
              color: COLORS.light,
              textAlign: "right",
            }}
          >
            د راپورونو لست
          </h5>

          <div
            className="d-flex align-items-center gap-2"
            style={{
              direction: "rtl",
            }}
          >
            {/* BATCH STATUS */}

            {batchStatus &&
              !batchStatus.isDestination &&
              batchStatus.limit > 0 && (
                <div
                  title={[
                    `دوره: ${batchStatus.batchNumber}`,
                    `ټول: ${batchStatus.total}`,
                    batchStatus.closed
                      ? "ثبت بند دی"
                      : "ثبت خلاص دی",
                    batchStatus.autoClose
                      ? "بندیدل اتومات"
                      : "",
                    batchStatus.complete
                      ? "دوره بشپړه شوه"
                      : "",
                  ]
                    .filter(Boolean)
                    .join("\n")}
                  dir="ltr"
                  style={{
                    display: "inline-block",
                    fontWeight: "700",
                    color: COLORS.light,
                    backgroundColor:
                      batchStatus.closed
                        ? COLORS.brown
                        : batchStatus.complete
                          ? COLORS.brown
                          : COLORS.dark,
                    border: `1px solid ${COLORS.light}`,
                    borderRadius: "5px",
                    padding: "5px 10px",
                    fontSize: "12px",
                    cursor: "help",
                    unicodeBidi: "isolate",
                    whiteSpace: "nowrap",
                  }}
                >
                  {batchStatus.batchCount} /{" "}
                  {batchStatus.limit}
                </div>
              )}

            {/* REPORT COUNT */}

            <span
              className="badge"
              style={{
                backgroundColor: COLORS.brown,
                color: COLORS.light,
                fontSize: "12px",
                padding: "6px 10px",
              }}
            >
              {reports.length} راپورونه
            </span>

            {/* EXCEL BUTTON */}

            <button
              type="button"
              onClick={handleDownloadExcel}
              disabled={
                excelLoading ||
                loading ||
                reports.length === 0
              }
              style={{
                backgroundColor: COLORS.brown,
                color: COLORS.light,
                border: `1px solid ${COLORS.light}`,
                borderRadius: "5px",
                padding: "5px 12px",
                fontSize: "12px",
                fontWeight: "600",
                cursor:
                  excelLoading ||
                  loading ||
                  reports.length === 0
                    ? "not-allowed"
                    : "pointer",
                opacity:
                  excelLoading ||
                  loading ||
                  reports.length === 0
                    ? 0.6
                    : 1,
                whiteSpace: "nowrap",
              }}
            >
              {excelLoading
                ? "Excel چمتو کېږي..."
                : "Excel ښکته کول"}
            </button>
          </div>
        </div>

        <div className="card-body p-0">
          <div className="table-responsive">
            <table
              className="table mb-0"
              style={{
                backgroundColor: COLORS.light,
                color: COLORS.dark,
                direction: "rtl",
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
                <tr
                  style={{
                    backgroundColor: COLORS.brown,
                    color: COLORS.light,
                  }}
                >
                  <th
                    className="text-end"
                    style={{
                      position: "sticky",
                      top: 0,
                      zIndex: 21,
                      backgroundColor: COLORS.brown,
                      color: COLORS.light,
                      border: "none",
                      whiteSpace: "nowrap",
                    }}
                  >
                    شمېره
                  </th>

                  <th
                    className="text-end"
                    style={{
                      position: "sticky",
                      top: 0,
                      zIndex: 21,
                      backgroundColor: COLORS.brown,
                      color: COLORS.light,
                      border: "none",
                      whiteSpace: "nowrap",
                    }}
                  >
                    نېټه
                  </th>

                  <th
                    className="text-end"
                    style={{
                      position: "sticky",
                      top: 0,
                      zIndex: 21,
                      backgroundColor: COLORS.brown,
                      color: COLORS.light,
                      border: "none",
                      whiteSpace: "nowrap",
                    }}
                  >
                    شرکت
                  </th>

                  <th
                    className="text-end"
                    style={{
                      position: "sticky",
                      top: 0,
                      zIndex: 21,
                      backgroundColor: COLORS.brown,
                      color: COLORS.light,
                      border: "none",
                      whiteSpace: "nowrap",
                    }}
                  >
                    GPS شرکت
                  </th>

                  <th
                    className="text-end"
                    style={{
                      position: "sticky",
                      top: 0,
                      zIndex: 21,
                      backgroundColor: COLORS.brown,
                      color: COLORS.light,
                      border: "none",
                      whiteSpace: "nowrap",
                    }}
                  >
                    سریال نمبر
                  </th>

                  <th
                    className="text-end"
                    style={{
                      position: "sticky",
                      top: 0,
                      zIndex: 21,
                      backgroundColor: COLORS.brown,
                      color: COLORS.light,
                      border: "none",
                      whiteSpace: "nowrap",
                    }}
                  >
                    پلیت نمبر
                  </th>

                  <th
                    className="text-end"
                    style={{
                      position: "sticky",
                      top: 0,
                      zIndex: 21,
                      backgroundColor: COLORS.brown,
                      color: COLORS.light,
                      border: "none",
                      whiteSpace: "nowrap",
                    }}
                  >
                    ولایت پلیت
                  </th>

                  <th
                    className="text-end"
                    style={{
                      position: "sticky",
                      top: 0,
                      zIndex: 21,
                      backgroundColor: COLORS.brown,
                      color: COLORS.light,
                      border: "none",
                      whiteSpace: "nowrap",
                    }}
                  >
                    مسیر
                  </th>

                  <th
                    className="text-end"
                    style={{
                      position: "sticky",
                      top: 0,
                      zIndex: 21,
                      backgroundColor: COLORS.brown,
                      color: COLORS.light,
                      border: "none",
                      whiteSpace: "nowrap",
                    }}
                  >
                    وسیله
                  </th>

                  <th
                    className="text-end"
                    style={{
                      position: "sticky",
                      top: 0,
                      zIndex: 21,
                      backgroundColor: COLORS.brown,
                      color: COLORS.light,
                      border: "none",
                      whiteSpace: "nowrap",
                    }}
                  >
                    حالت
                  </th>

                  <th
                    className="text-end"
                    style={{
                      position: "sticky",
                      top: 0,
                      zIndex: 21,
                      backgroundColor: COLORS.brown,
                      color: COLORS.light,
                      border: "none",
                      whiteSpace: "nowrap",
                    }}
                  >
                    د کارت ډول
                  </th>

                  <th
                    className="text-end"
                    style={{
                      position: "sticky",
                      top: 0,
                      zIndex: 21,
                      backgroundColor: COLORS.brown,
                      color: COLORS.light,
                      border: "none",
                      whiteSpace: "nowrap",
                    }}
                  >
                    موده
                  </th>

                  <th
                    className="text-end"
                    style={{
                      position: "sticky",
                      top: 0,
                      zIndex: 21,
                      backgroundColor: COLORS.brown,
                      color: COLORS.light,
                      border: "none",
                      whiteSpace: "nowrap",
                    }}
                  >
                    فعالیت
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan="13"
                      className="text-center py-4"
                      style={{
                        backgroundColor: COLORS.light,
                        color: COLORS.dark,
                        border: "none",
                      }}
                    >
                      <span
                        style={{
                          color: COLORS.brown,
                          fontWeight: "bold",
                        }}
                      >
                        راپورونه لوډ کېږي...
                      </span>
                    </td>
                  </tr>
                ) : reports.length === 0 ? (
                  <tr>
                    <td
                      colSpan="13"
                      className="text-center py-4"
                      style={{
                        backgroundColor: COLORS.light,
                        color: COLORS.dark,
                        border: "none",
                      }}
                    >
                      هېڅ راپور ونه موندل شو
                    </td>
                  </tr>
                ) : (
                  reports.map(
                    (report, index) => (
                      <tr
                        key={report.id}
                        style={{
                          backgroundColor:
                            COLORS.light,
                          color: COLORS.dark,
                        }}
                      >
                        <td
                          className="text-end"
                          style={{
                            color: COLORS.dark,
                            backgroundColor:
                              COLORS.light,
                            border: "none",
                          }}
                        >
                          {index + 1}
                        </td>

                        <td
                          className="text-end"
                          style={{
                            color: COLORS.dark,
                            backgroundColor:
                              COLORS.light,
                            border: "none",
                            whiteSpace:
                              "nowrap",
                          }}
                        >
                          {report.dateS || "-"}
                        </td>

                        <td
                          className="text-end"
                          style={{
                            color: COLORS.dark,
                            backgroundColor:
                              COLORS.light,
                            border: "none",
                          }}
                        >
                          {report.company || "-"}
                        </td>

                        <td
                          className="text-end"
                          style={{
                            color: COLORS.dark,
                            backgroundColor:
                              COLORS.light,
                            border: "none",
                          }}
                        >
                          {report.gpsCompany || "-"}
                        </td>

                        <td
                          className="text-end"
                          style={{
                            color: COLORS.dark,
                            backgroundColor:
                              COLORS.light,
                            border: "none",
                          }}
                        >
                          {report.serialNumber ||
                            "-"}
                        </td>

                        <td
                          className="text-end"
                          style={{
                            color: COLORS.dark,
                            backgroundColor:
                              COLORS.light,
                            border: "none",
                          }}
                        >
                          {report.paletNumber ||
                            "-"}
                        </td>

                        <td
                          className="text-end"
                          style={{
                            color: COLORS.dark,
                            backgroundColor:
                              COLORS.light,
                            border: "none",
                          }}
                        >
                          {report.provinceCity ||
                            "-"}
                        </td>

                        <td
                          className="text-end"
                          style={{
                            color: COLORS.dark,
                            backgroundColor:
                              COLORS.light,
                            border: "none",
                          }}
                        >
                          {report.companyLocation ||
                            "-"}
                        </td>

                        <td
                          className="text-end"
                          style={{
                            color: COLORS.dark,
                            backgroundColor:
                              COLORS.light,
                            border: "none",
                          }}
                        >
                          {report.vehicle || "-"}
                        </td>

                        <td
                          className="text-end"
                          style={{
                            color: COLORS.dark,
                            backgroundColor:
                              COLORS.light,
                            border: "none",
                          }}
                        >
                          {report.status || "-"}
                        </td>

                        <td
                          className="text-end"
                          style={{
                            color: COLORS.dark,
                            backgroundColor:
                              COLORS.light,
                            border: "none",
                          }}
                        >
                          {report.kartType || "-"}
                        </td>

                        <td
                          className="text-end"
                          style={{
                            color: COLORS.dark,
                            backgroundColor:
                              COLORS.light,
                            border: "none",
                          }}
                        >
                          {report.duration || "-"}
                        </td>

                        <td
                          className="text-end"
                          style={{
                            color: COLORS.dark,
                            backgroundColor:
                              COLORS.light,
                            border: "none",
                          }}
                        >
                          {report.activity || "-"}
                        </td>
                      </tr>
                    )
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
