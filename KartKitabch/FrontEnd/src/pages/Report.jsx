

// import React, { useEffect, useState } from "react";
// import { toast } from "react-toastify";
// import Select from "react-select";

// import DatePickerModule from "react-multi-date-picker";
// import DateObject from "react-date-object";

// import persian from "react-date-object/calendars/persian";
// import persian_fa from "react-date-object/locales/persian_fa";

// import api from "../services/api";
// import { useAuth } from "../context/AuthContext";

// const DatePicker = DatePickerModule.default;

// // =========================================================
// // API
// // =========================================================

// const API_URL = "/report";
// const COMPANY_API = "/company";
// const GPS_COMPANY_API = "/GPSCompany";
// const CITY_API = "/ProvincesAndCities";
// const VEHICLE_API = "/Vehicle";

// const ENUM_DURATION = `${API_URL}/enums/kart-duration`;
// const ENUM_KART = `${API_URL}/enums/type-of-kart`;
// const ENUM_ACTIVITY = `${API_URL}/enums/type-of-activity`;
// const ENUM_STATUS = `${API_URL}/enums/kart-status`;

// // =========================================================
// // COLORS
// // یوازې درې رنګونه
// // =========================================================

// const COLORS = {
//   dark: "#343148",
//   light: "#cdc6bd",
//   brown: "#583432",
// };

// // =========================================================
// // FIELD STYLE
// // =========================================================

// const fieldStyle = {
//   backgroundColor: COLORS.light,
//   color: COLORS.dark,
//   border: `1px solid ${COLORS.dark}`,
//   borderRadius: "5px",
//   boxShadow: "none",
//   direction: "rtl",
//   textAlign: "right",
// };

// // =========================================================
// // SMALL BUTTON STYLE
// // =========================================================

// const smallButtonStyle = {
//   fontSize: "12px",
//   padding: "4px 10px",
//   borderRadius: "5px",
//   fontWeight: "600",
// };

// // =========================================================
// // SEARCHABLE SELECT STYLE
// // =========================================================

// const searchableSelectStyles = {
//   control: (base) => ({
//     ...base,
//     backgroundColor: COLORS.light,
//     color: COLORS.dark,
//     border: `1px solid ${COLORS.dark}`,
//     borderRadius: "5px",
//     minHeight: "38px",
//     height: "38px",
//     boxShadow: "none",
//     direction: "rtl",
//     textAlign: "right",

//     "&:hover": {
//       border: `1px solid ${COLORS.dark}`,
//     },
//   }),

//   valueContainer: (base) => ({
//     ...base,
//     padding: "0 10px",
//     direction: "rtl",
//   }),

//   singleValue: (base) => ({
//     ...base,
//     color: COLORS.dark,
//     direction: "rtl",
//     textAlign: "right",
//   }),

//   placeholder: (base) => ({
//     ...base,
//     color: COLORS.dark,
//     opacity: 0.85,
//     direction: "rtl",
//     textAlign: "right",
//   }),

//   input: (base) => ({
//     ...base,
//     color: COLORS.dark,
//     direction: "rtl",
//     textAlign: "right",
//   }),

//   menu: (base) => ({
//     ...base,
//     backgroundColor: COLORS.light,
//     color: COLORS.dark,
//     direction: "rtl",
//     zIndex: 9999,
//     border: `1px solid ${COLORS.dark}`,
//     boxShadow: "none",
//   }),

//   menuList: (base) => ({
//     ...base,
//     backgroundColor: COLORS.light,
//     padding: 0,
//     direction: "rtl",
//   }),

//   option: (base, state) => ({
//     ...base,

//     backgroundColor: state.isSelected
//       ? COLORS.brown
//       : state.isFocused
//       ? COLORS.dark
//       : COLORS.light,

//     color:
//       state.isSelected || state.isFocused
//         ? COLORS.light
//         : COLORS.dark,

//     cursor: "pointer",
//     textAlign: "right",
//     direction: "rtl",
//     padding: "8px 10px",
//   }),

//   dropdownIndicator: (base) => ({
//     ...base,
//     color: COLORS.dark,
//     padding: "5px",
//   }),

//   clearIndicator: (base) => ({
//     ...base,
//     color: COLORS.brown,
//     padding: "5px",
//   }),

//   indicatorSeparator: (base) => ({
//     ...base,
//     backgroundColor: COLORS.dark,
//   }),
// };

// // =========================================================
// // COMPONENT
// // =========================================================

// export default function ReportPage() {
//   const { user, hasRole } = useAuth();

//   // =========================================================
//   // PERMISSIONS
//   // =========================================================

//   const isOwner = hasRole("Owner");
//   const isSimpleUser = hasRole("SimpleUser");
//   const isCompanyUser = hasRole("CompanyUser");

//   // Owner:
//   // اضافه + سمول + حذف
//   //
//   // SimpleUser:
//   // اضافه
//   //
//   // CompanyUser:
//   // یوازې لیدل

//   const canCreate = isOwner || isSimpleUser;
//   const canEdit = isOwner;
//   const canDelete = isOwner;
//   const canManage = canCreate || canEdit || canDelete;

//   // =========================================================
//   // REPORTS
//   // =========================================================

//   const [reports, setReports] = useState([]);

//   // =========================================================
//   // DROPDOWNS
//   // =========================================================

//   const [companies, setCompanies] = useState([]);
//   const [gpsCompanies, setGpsCompanies] = useState([]);
//   const [cities, setCities] = useState([]);

//   const [durations, setDurations] = useState([]);
//   const [kartTypes, setKartTypes] = useState([]);
//   const [activities, setActivities] = useState([]);
//   const [statuses, setStatuses] = useState([]);

//   const [companyCities, setCompanyCities] = useState([]);
//   const [vehicles, setVehicles] = useState([]);

//   // =========================================================
//   // STATES
//   // =========================================================

//   const [isEdit, setIsEdit] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [saving, setSaving] = useState(false);

//   // =========================================================
//   // FORM
//   // =========================================================

//   const [form, setForm] = useState({
//     id: 0,

//     companyId: 0,
//     gpsCompanyId: 0,

//     serialNumber: "",
//     paletNumber: "",

//     provincesAndCitiesId: 0,

//     destinationCompanyId: null,
//     destinationProvinceId: null,

//     reportId: null,

//     vehicleId: 0,

//     kartDuration: 0,
//     typeOfKart: 0,
//     typeOfActivity: 0,
//     kartNewRenewLost: 0,

//     reportDate: null,
//   });

//   // =========================================================
//   // AFGHAN DATE LOCALE
//   // =========================================================

//   const afghanLocale = {
//     ...persian_fa,

//     months: [
//       ["حمل", "حم"],
//       ["ثور", "ثو"],
//       ["جوزا", "جو"],
//       ["سرطان", "سر"],
//       ["اسد", "اسد"],
//       ["سنبله", "سن"],
//       ["میزان", "می"],
//       ["عقرب", "عق"],
//       ["قوس", "قو"],
//       ["جدی", "جد"],
//       ["دلو", "دل"],
//       ["حوت", "حو"],
//     ],
//   };

//   // =========================================================
//   // DATE PARSER
//   // Backend string -> DateObject
//   // =========================================================

//   const parseReportDate = (dateValue) => {
//     if (!dateValue) {
//       return null;
//     }

//     if (
//       typeof dateValue === "object" &&
//       typeof dateValue.format === "function"
//     ) {
//       return dateValue;
//     }

//     if (typeof dateValue === "string") {
//       try {
//         return new DateObject({
//           date: dateValue,
//           calendar: persian,
//           locale: afghanLocale,
//           format: "YYYY/MM/DD",
//         });
//       } catch (error) {
//         console.error(
//           "Date conversion error:",
//           error
//         );

//         return null;
//       }
//     }

//     return null;
//   };

//   // =========================================================
//   // DATE STRING
//   // DateObject -> Backend string
//   // =========================================================

//   const getReportDateString = () => {
//     if (!form.reportDate) {
//       return null;
//     }

//     if (
//       typeof form.reportDate.format === "function"
//     ) {
//       return form.reportDate.format(
//         "YYYY/MM/DD"
//       );
//     }

//     if (
//       typeof form.reportDate === "string"
//     ) {
//       return form.reportDate;
//     }

//     return null;
//   };

//   // =========================================================
//   // FETCH REPORTS
//   // =========================================================

//   const fetchReports = async () => {
//     try {
//       setLoading(true);

//       const res = await api.get(API_URL);

//       setReports(res.data);
//     } catch (error) {
//       console.error(
//         "Reports error:",
//         error.response?.data || error
//       );

//       toast.error(
//         "د راپورونو راوړلو کې ستونزه رامنځته شوه"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   // =========================================================
//   // FETCH DROPDOWNS
//   // =========================================================

//   const fetchDropdowns = async () => {
//     try {
//       const [
//         c,
//         gps,
//         city,
//         d,
//         k,
//         a,
//         s,
//         v,
//       ] = await Promise.all([
//         api.get(COMPANY_API),
//         api.get(GPS_COMPANY_API),
//         api.get(CITY_API),
//         api.get(ENUM_DURATION),
//         api.get(ENUM_KART),
//         api.get(ENUM_ACTIVITY),
//         api.get(ENUM_STATUS),
//         api.get(VEHICLE_API),
//       ]);

//       setCompanies(c.data);
//       setGpsCompanies(gps.data);
//       setCities(city.data);
//       setDurations(d.data);
//       setKartTypes(k.data);
//       setActivities(a.data);
//       setStatuses(s.data);
//       setVehicles(v.data);
//     } catch (error) {
//       console.error(
//         "Dropdown error:",
//         error.response?.data || error
//       );

//       toast.error(
//         "د معلوماتو راوړلو کې ستونزه رامنځته شوه"
//       );
//     }
//   };

//   // =========================================================
//   // INITIAL LOAD
//   // =========================================================

//   useEffect(() => {
//     fetchReports();
//     fetchDropdowns();
//   }, []);

//   // =========================================================
//   // HANDLE INPUT CHANGE
//   // =========================================================

//   const handleChange = (e) => {
//     const {
//       name,
//       value,
//     } = e.target;

//     if (
//       [
//         "serialNumber",
//         "paletNumber",
//         "chasis",
//       ].includes(name)
//     ) {
//       setForm((prev) => ({
//         ...prev,
//         [name]: value,
//       }));
//     } else {
//       setForm((prev) => ({
//         ...prev,
//         [name]:
//           value === ""
//             ? null
//             : Number(value),
//       }));
//     }
//   };

//   // =========================================================
//   // COMPANY SELECT
//   // =========================================================

//   const handleCompanySelect = (
//     selectedOption
//   ) => {
//     const companyId = selectedOption
//       ? Number(selectedOption.value)
//       : 0;

//     setForm((prev) => ({
//       ...prev,
//       companyId,
//       destinationProvinceId: null,
//     }));

//     getCompanyCities(companyId);
//   };

//   // =========================================================
//   // CITY SELECT
//   // =========================================================

//   const handleCitySelect = (
//     selectedOption
//   ) => {
//     const cityId = selectedOption
//       ? Number(selectedOption.value)
//       : 0;

//     setForm((prev) => ({
//       ...prev,
//       provincesAndCitiesId: cityId,
//     }));

//     checkExistingTaxi(
//       form.paletNumber,
//       cityId
//     );
//   };

//   // =========================================================
//   // CREATE
//   // =========================================================

//   const create = async () => {
//     if (!canCreate) {
//       toast.error(
//         "تاسو د راپور د اضافه کولو اجازه نه لرئ"
//       );
//       return;
//     }

//     try {
//       setSaving(true);

//       const payload = {
//         companyId:
//           form.companyId,

//         gpsCompanyId:
//           form.gpsCompanyId || null,

//         serialNumber:
//           form.serialNumber,

//         paletNumber:
//           form.paletNumber,

//         provincesAndCitiesId:
//           form.provincesAndCitiesId,

//         destinationCompanyId:
//           form.destinationCompanyId || null,

//         destinationProvinceId:
//           form.destinationProvinceId || null,

//         reportId:
//           form.reportId || null,

//         vehicleId:
//           form.vehicleId,

//         kartDuration:
//           form.kartDuration || null,

//         typeOfKart:
//           form.typeOfKart || null,

//         typeOfActivity:
//           form.typeOfActivity || null,

//         kartNewRenewLost:
//           form.kartNewRenewLost || null,

//         dateS:
//           getReportDateString(),
//       };

//       console.log(
//         "CREATE PAYLOAD:",
//         payload
//       );

//       await api.post(
//         API_URL,
//         payload
//       );

//       toast.success(
//         "راپور په بریالیتوب اضافه شو"
//       );

//       await fetchReports();

//       reset();
//     } catch (err) {
//       console.error(
//         "Create error:",
//         err.response?.data || err
//       );

//       toast.error(
//         err.response?.data?.message ||
//           "د راپور اضافه کولو کې ستونزه رامنځته شوه"
//       );
//     } finally {
//       setSaving(false);
//     }
//   };

//   // =========================================================
//   // UPDATE
//   // =========================================================

//   const update = async () => {
//     if (!canEdit) {
//       toast.error(
//         "تاسو د راپور د سمولو اجازه نه لرئ"
//       );
//       return;
//     }

//     try {
//       setSaving(true);

//       const payload = {
//         id: form.id,

//         companyId:
//           form.companyId,

//         gpsCompanyId:
//           form.gpsCompanyId || null,

//         serialNumber:
//           form.serialNumber,

//         paletNumber:
//           form.paletNumber,

//         provincesAndCitiesId:
//           form.provincesAndCitiesId,

//         destinationCompanyId:
//           form.destinationCompanyId || null,

//         destinationProvinceId:
//           form.destinationProvinceId || null,

//         reportId:
//           form.reportId || null,

//         vehicleId:
//           form.vehicleId,

//         kartDuration:
//           form.kartDuration || null,

//         typeOfKart:
//           form.typeOfKart || null,

//         typeOfActivity:
//           form.typeOfActivity || null,

//         kartNewRenewLost:
//           form.kartNewRenewLost || null,

//         dateS:
//           getReportDateString(),
//       };

//       console.log(
//         "UPDATE PAYLOAD:",
//         payload
//       );

//       await api.put(
//         `${API_URL}/${form.id}`,
//         payload
//       );

//       toast.success(
//         "راپور په بریالیتوب نوي شو"
//       );

//       await fetchReports();

//       reset();
//     } catch (err) {
//       console.error(
//         "Update error:",
//         err.response?.data || err
//       );

//       toast.error(
//         err.response?.data?.message ||
//           "د راپور نوي کولو کې ستونزه رامنځته شوه"
//       );
//     } finally {
//       setSaving(false);
//     }
//   };

//   // =========================================================
//   // DELETE
//   // =========================================================

//   const remove = async (id) => {
//     if (!canDelete) {
//       toast.error(
//         "تاسو د راپور د حذف کولو اجازه نه لرئ"
//       );
//       return;
//     }

//     const confirmed = window.confirm(
//       "ایا د دې راپور د حذف کولو ډاډه یاست؟"
//     );

//     if (!confirmed) {
//       return;
//     }

//     try {
//       setSaving(true);

//       await api.delete(
//         `${API_URL}/${id}`
//       );

//       toast.success(
//         "راپور حذف شو"
//       );

//       await fetchReports();
//     } catch (err) {
//       console.error(
//         "Delete error:",
//         err.response?.data || err
//       );

//       toast.error(
//         err.response?.data?.message ||
//           "د راپور حذف کولو کې ستونزه رامنځته شوه"
//       );
//     } finally {
//       setSaving(false);
//     }
//   };

//   // =========================================================
//   // EDIT
//   // =========================================================

//   const edit = (r) => {
//     if (!canEdit) {
//       toast.error(
//         "تاسو د راپور د سمولو اجازه نه لرئ"
//       );
//       return;
//     }

//     const reportDate =
//       parseReportDate(
//         r.dateS
//       );

//     setForm({
//       id: r.id,

//       companyId:
//         r.companyId ||
//         r.company?.id ||
//         0,

//       gpsCompanyId:
//         r.gpsCompanyId ||
//         r.gpsCompany?.id ||
//         0,

//       serialNumber:
//         r.serialNumber || "",

//       paletNumber:
//         r.paletNumber || "",

//       provincesAndCitiesId:
//         r.provincesAndCitiesId ||
//         r.provincesAndCities?.id ||
//         0,

//       destinationCompanyId:
//         r.destinationCompanyId ||
//         r.destinationCompany?.id ||
//         null,

//       destinationProvinceId:
//         r.destinationProvinceId ||
//         r.destinationProvince?.id ||
//         null,

//       reportId:
//         r.reportId || null,

//       vehicleId:
//         r.vehicleId ||
//         r.vehicle?.id ||
//         0,

//       kartDuration:
//         r.kartDuration || 0,

//       typeOfKart:
//         r.typeOfKart || 0,

//       typeOfActivity:
//         r.typeOfActivity || 0,

//       kartNewRenewLost:
//         r.kartNewRenewLost || 0,

//       reportDate,
//     });

//     if (r.companyId) {
//       getCompanyCities(
//         r.companyId
//       );
//     }

//     setIsEdit(true);

//     window.scrollTo({
//       top: 0,
//       behavior: "smooth",
//     });
//   };

//   // =========================================================
//   // RESET
//   // =========================================================

//   const reset = () => {
//     setForm({
//       id: 0,

//       companyId: 0,
//       gpsCompanyId: 0,

//       serialNumber: "",
//       paletNumber: "",

//       provincesAndCitiesId: 0,

//       destinationCompanyId: null,
//       destinationProvinceId: null,

//       reportId: null,

//       vehicleId: 0,

//       kartDuration: 0,
//       typeOfKart: 0,
//       typeOfActivity: 0,
//       kartNewRenewLost: 0,

//       reportDate: null,
//     });

//     setCompanyCities([]);

//     setIsEdit(false);
//   };

//   // =========================================================
//   // COMPANY CITIES
//   // =========================================================

//   const getCompanyCities = async (
//     companyId
//   ) => {
//     if (!companyId) {
//       setCompanyCities([]);
//       return;
//     }

//     try {
//       const res =
//         await api.get(
//           `${COMPANY_API}/${companyId}/locations`
//         );

//       setCompanyCities(
//         res.data
//       );
//     } catch (err) {
//       console.error(
//         "Company locations error:",
//         err.response?.data || err
//       );

//       setCompanyCities([]);
//     }
//   };

//   // =========================================================
//   // CHECK EXISTING TAXI
//   // =========================================================

//   const checkExistingTaxi = async (
//     paletNumberValue = form.paletNumber,
//     provinceCityIdValue =
//       form.provincesAndCitiesId
//   ) => {
//     if (
//       !paletNumberValue ||
//       !provinceCityIdValue
//     ) {
//       return;
//     }

//     try {
//       const res =
//         await api.get(
//           `${API_URL}/check-existing`,
//           {
//             params: {
//               paletNumber:
//                 paletNumberValue,

//               provincesAndCitiesId:
//                 provinceCityIdValue,
//             },
//           }
//         );

//       if (res.data.exists) {
//         toast.warning(
//           res.data.message
//         );
//       }
//     } catch (err) {
//       console.error(
//         "Existing taxi check error:",
//         err.response?.data || err
//       );
//     }
//   };

//   // =========================================================
//   // SEARCHABLE OPTIONS
//   // =========================================================

//   const companyOptions =
//     companies.map((c) => ({
//       value: c.id,
//       label: c.name,
//     }));

//   const cityOptions =
//     cities.map((c) => ({
//       value: c.id,
//       label: c.name,
//     }));

//   const selectedCompany =
//     companyOptions.find(
//       (x) =>
//         Number(x.value) ===
//         Number(form.companyId)
//     ) || null;

//   const selectedCity =
//     cityOptions.find(
//       (x) =>
//         Number(x.value) ===
//         Number(
//           form.provincesAndCitiesId
//         )
//     ) || null;

//   // =========================================================
//   // UI
//   // =========================================================

//   return (
//     <div
//       dir="rtl"
//       className="container-fluid mt-4"
//       style={{
//         backgroundColor:
//           COLORS.light,

//         minHeight: "100vh",

//         color: COLORS.dark,

//         padding: "20px",

//         textAlign: "right",
//       }}
//     >
//       {/* =====================================================
//           TITLE
//       ===================================================== */}

//       <div
//         className="d-flex justify-content-between align-items-center mb-4"
//         style={{
//           direction: "rtl",
//         }}
//       >
//         <div>
//           <h2
//             className="fw-bold mb-1"
//             style={{
//               color: COLORS.dark,
//             }}
//           >
//             د راپورونو مدیریت
//           </h2>

//           <small
//             style={{
//               color: COLORS.brown,
//               fontWeight: "600",
//             }}
//           >
//             {isOwner
//               ? "Owner"
//               : isSimpleUser
//               ? "SimpleUser"
//               : isCompanyUser
//               ? "CompanyUser"
//               : ""}
//           </small>
//         </div>

//         <div
//           style={{
//             fontSize: "13px",
//             fontWeight: "700",
//             color: COLORS.brown,
//           }}
//         >
//           ټول راپورونه: {reports.length}
//         </div>
//       </div>

//       {/* =====================================================
//           COMPANY USER VIEW ONLY MESSAGE
//       ===================================================== */}

//       {isCompanyUser && (
//         <div
//           className="mb-3 p-2"
//           style={{
//             backgroundColor:
//               COLORS.light,
//             color: COLORS.dark,
//             border: `1px solid ${COLORS.dark}`,
//             borderRadius: "5px",
//             fontSize: "13px",
//             fontWeight: "600",
//           }}
//         >
//           تاسو د شرکت کاروونکي یاست؛
//           یوازې د راپورونو د لیدلو اجازه لرئ.
//         </div>
//       )}

//       {/* =====================================================
//           FORM
//           یوازې Owner او SimpleUser
//       ===================================================== */}

//       {canManage && (
//         <div
//           className="p-3 mb-4"
//           style={{
//             backgroundColor:
//               COLORS.light,

//             border: "none",

//             boxShadow: "none",

//             overflow: "visible",
//           }}
//         >
//           <div className="row g-2">

//             {/* COMPANY */}

//             <div className="col-md-3">
//               <label
//                 className="form-label fw-bold w-100"
//                 style={{
//                   color: COLORS.dark,
//                   textAlign: "right",
//                 }}
//               >
//                 شرکت
//               </label>

//               <Select
//                 options={
//                   companyOptions
//                 }
//                 value={
//                   selectedCompany
//                 }
//                 onChange={
//                   handleCompanySelect
//                 }
//                 placeholder="شرکت وټاکئ"
//                 isClearable
//                 isSearchable
//                 noOptionsMessage={() =>
//                   "شرکت پیدا نه شو"
//                 }
//                 loadingMessage={() =>
//                   "معلومات راوړل کېږي..."
//                 }
//                 styles={
//                   searchableSelectStyles
//                 }
//                 filterOption={(
//                   option,
//                   inputValue
//                 ) =>
//                   option.label
//                     .toLowerCase()
//                     .includes(
//                       inputValue.toLowerCase()
//                     )
//                 }
//                 isDisabled={saving}
//               />
//             </div>

//             {/* GPS COMPANY */}

//             <div className="col-md-3">
//               <label
//                 className="form-label fw-bold w-100"
//                 style={{
//                   color: COLORS.dark,
//                   textAlign: "right",
//                 }}
//               >
//                 GPS شرکت
//               </label>

//               <select
//                 className="form-select"
//                 name="gpsCompanyId"
//                 value={
//                   form.gpsCompanyId
//                 }
//                 onChange={
//                   handleChange
//                 }
//                 style={fieldStyle}
//                 disabled={saving}
//               >
//                 <option value={0}>
//                   د GPS شرکت وټاکئ
//                 </option>

//                 {gpsCompanies.map(
//                   (gps) => (
//                     <option
//                       key={gps.id}
//                       value={gps.id}
//                     >
//                       {gps.name}
//                     </option>
//                   )
//                 )}
//               </select>
//             </div>

//             {/* CITY */}

//             <div className="col-md-3">
//               <label
//                 className="form-label fw-bold w-100"
//                 style={{
//                   color: COLORS.dark,
//                   textAlign: "right",
//                 }}
//               >
//                ولایت پلیت
//               </label>

//               <Select
//                 options={
//                   cityOptions
//                 }
//                 value={
//                   selectedCity
//                 }
//                 onChange={
//                   handleCitySelect
//                 }
//                 placeholder="ولایت پلیت وټاکئ"
//                 isClearable
//                 isSearchable
//                 noOptionsMessage={() =>
//                   "ولایت یا ښار پیدا نه شو"
//                 }
//                 loadingMessage={() =>
//                   "معلومات راوړل کېږي..."
//                 }
//                 styles={
//                   searchableSelectStyles
//                 }
//                 filterOption={(
//                   option,
//                   inputValue
//                 ) =>
//                   option.label
//                     .toLowerCase()
//                     .includes(
//                       inputValue.toLowerCase()
//                     )
//                 }
//                 isDisabled={saving}
//               />
//             </div>

//             {/* SERIAL */}

//             <div className="col-md-3">
//               <label
//                 className="form-label fw-bold w-100"
//                 style={{
//                   color: COLORS.dark,
//                   textAlign: "right",
//                 }}
//               >
//                 سریال نمبر
//               </label>

//               <input
//                 className="form-control"
//                 name="serialNumber"
//                 placeholder="سریال نمبر"
//                 value={
//                   form.serialNumber
//                 }
//                 onChange={
//                   handleChange
//                 }
//                 style={fieldStyle}
//                 disabled={saving}
//               />
//             </div>

//             {/* PALET */}

//             <div className="col-md-3">
//               <label
//                 className="form-label fw-bold w-100"
//                 style={{
//                   color: COLORS.dark,
//                   textAlign: "right",
//                 }}
//               >
//                 پلیت نمبر
//               </label>

//               <input
//                 className="form-control"
//                 name="paletNumber"
//                 placeholder="پلیت نمبر"
//                 value={
//                   form.paletNumber
//                 }
//                 onChange={
//                   handleChange
//                 }
//                 onBlur={() =>
//                   checkExistingTaxi()
//                 }
//                 style={fieldStyle}
//                 disabled={saving}
//               />
//             </div>

//             {/* DURATION */}

//             <div className="col-md-3">
//               <label
//                 className="form-label fw-bold w-100"
//                 style={{
//                   color: COLORS.dark,
//                   textAlign: "right",
//                 }}
//               >
//                 موده
//               </label>

//               <select
//                 className="form-select"
//                 name="kartDuration"
//                 value={
//                   form.kartDuration
//                 }
//                 onChange={
//                   handleChange
//                 }
//                 style={fieldStyle}
//                 disabled={saving}
//               >
//                 <option value={0}>
//                   موده وټاکئ
//                 </option>

//                 {durations.map(
//                   (x) => (
//                     <option
//                       key={x.id}
//                       value={x.id}
//                     >
//                       {x.name}
//                     </option>
//                   )
//                 )}
//               </select>
//             </div>

//             {/* KART TYPE */}

//             <div className="col-md-3">
//               <label
//                 className="form-label fw-bold w-100"
//                 style={{
//                   color: COLORS.dark,
//                   textAlign: "right",
//                 }}
//               >
//                 د کارت ډول
//               </label>

//               <select
//                 className="form-select"
//                 name="typeOfKart"
//                 value={
//                   form.typeOfKart
//                 }
//                 onChange={
//                   handleChange
//                 }
//                 style={fieldStyle}
//                 disabled={saving}
//               >
//                 <option value={0}>
//                   د کارت ډول
//                 </option>

//                 {kartTypes.map(
//                   (x) => (
//                     <option
//                       key={x.id}
//                       value={x.id}
//                     >
//                       {x.name}
//                     </option>
//                   )
//                 )}
//               </select>
//             </div>

//             {/* ACTIVITY */}

//             <div className="col-md-3">
//               <label
//                 className="form-label fw-bold w-100"
//                 style={{
//                   color: COLORS.dark,
//                   textAlign: "right",
//                 }}
//               >
//                 فعالیت
//               </label>

//               <select
//                 className="form-select"
//                 name="typeOfActivity"
//                 value={
//                   form.typeOfActivity
//                 }
//                 onChange={
//                   handleChange
//                 }
//                 style={fieldStyle}
//                 disabled={saving}
//               >
//                 <option value={0}>
//                   فعالیت وټاکئ
//                 </option>

//                 {activities.map(
//                   (x) => (
//                     <option
//                       key={x.id}
//                       value={x.id}
//                     >
//                       {x.name}
//                     </option>
//                   )
//                 )}
//               </select>
//             </div>

//             {/* STATUS */}

//             <div className="col-md-3">
//               <label
//                 className="form-label fw-bold w-100"
//                 style={{
//                   color: COLORS.dark,
//                   textAlign: "right",
//                 }}
//               >
//                 حالت
//               </label>

//               <select
//                 className="form-select"
//                 name="kartNewRenewLost"
//                 value={
//                   form.kartNewRenewLost
//                 }
//                 onChange={
//                   handleChange
//                 }
//                 style={fieldStyle}
//                 disabled={saving}
//               >
//                 <option value={0}>
//                   حالت وټاکئ
//                 </option>

//                 {statuses.map(
//                   (x) => (
//                     <option
//                       key={x.id}
//                       value={x.id}
//                     >
//                       {x.name}
//                     </option>
//                   )
//                 )}
//               </select>
//             </div>

//             {/* DESTINATION */}

//             <div className="col-md-3">
//               <label
//                 className="form-label fw-bold w-100"
//                 style={{
//                   color: COLORS.dark,
//                   textAlign: "right",
//                 }}
//               >
//                 د ټکسي منزل
//               </label>

//               <select
//                 className="form-select"
//                 name="destinationProvinceId"
//                 value={
//                   form.destinationProvinceId ||
//                   0
//                 }
//                 onChange={
//                   handleChange
//                 }
//                 style={fieldStyle}
//                 disabled={
//                   saving ||
//                   !form.companyId
//                 }
//               >
//                 <option value={0}>
//                   د ټکسي منزل وټاکئ
//                 </option>

//                 {companyCities.map(
//                   (c) => (
//                     <option
//                       key={c.id}
//                       value={c.id}
//                     >
//                       {c.name}
//                     </option>
//                   )
//                 )}
//               </select>
//             </div>

//             {/* VEHICLE */}

//             <div className="col-md-3">
//               <label
//                 className="form-label fw-bold w-100"
//                 style={{
//                   color: COLORS.dark,
//                   textAlign: "right",
//                 }}
//               >
//                 وسیله
//               </label>

//               <select
//                 className="form-select"
//                 name="vehicleId"
//                 value={
//                   form.vehicleId
//                 }
//                 onChange={
//                   handleChange
//                 }
//                 style={fieldStyle}
//                 disabled={saving}
//               >
//                 <option value={0}>
//                   وسیله وټاکئ
//                 </option>

//                 {vehicles.map(
//                   (v) => (
//                     <option
//                       key={v.id}
//                       value={v.id}
//                     >
//                       {v.type}
//                     </option>
//                   )
//                 )}
//               </select>
//             </div>

//             {/* DATE */}

//             <div className="col-md-3">
//               <label
//                 className="form-label fw-bold w-100"
//                 style={{
//                   color: COLORS.dark,
//                   textAlign: "right",
//                 }}
//               >
//                 نېټه
//               </label>

//               <DatePicker
//                 value={
//                   form.reportDate
//                 }
//                 onChange={(value) =>
//                   setForm((prev) => ({
//                     ...prev,
//                     reportDate:
//                       value,
//                   }))
//                 }
//                 calendar={persian}
//                 locale={
//                   afghanLocale
//                 }
//                 format="YYYY/MM/DD"
//                 placeholder="نېټه وټاکئ"
//                 inputClass="form-control"
//                 style={{
//                   ...fieldStyle,
//                   width: "100%",
//                   height: "38px",
//                 }}
//                 disabled={saving}
//               />
//             </div>

//             {/* BUTTONS */}

//             <div
//               className="col-12 d-flex gap-2 mt-2"
//               style={{
//                 direction: "rtl",
//               }}
//             >
//               {isEdit ? (
//                 <>
//                   {canEdit && (
//                     <button
//                       type="button"
//                       className="btn fw-bold"
//                       onClick={
//                         update
//                       }
//                       disabled={
//                         saving
//                       }
//                       style={{
//                         ...smallButtonStyle,

//                         backgroundColor:
//                           COLORS.brown,

//                         color:
//                           COLORS.light,

//                         border:
//                           `1px solid ${COLORS.brown}`,
//                       }}
//                     >
//                       {saving
//                         ? "ثبتېږي..."
//                         : "نوي کول"}
//                     </button>
//                   )}
//                 </>
//               ) : (
//                 canCreate && (
//                   <button
//                     type="button"
//                     className="btn fw-bold"
//                     onClick={
//                       create
//                     }
//                     disabled={
//                       saving
//                     }
//                     style={{
//                       ...smallButtonStyle,

//                       backgroundColor:
//                         COLORS.dark,

//                       color:
//                         COLORS.light,

//                       border:
//                         `1px solid ${COLORS.dark}`,
//                     }}
//                   >
//                     {saving
//                       ? "ثبتېږي..."
//                       : "اضافه کول"}
//                   </button>
//                 )
//               )}

//               <button
//                 type="button"
//                 className="btn fw-bold"
//                 onClick={reset}
//                 disabled={saving}
//                 style={{
//                   ...smallButtonStyle,

//                   backgroundColor:
//                     COLORS.brown,

//                   color:
//                     COLORS.light,

//                   border:
//                     `1px solid ${COLORS.brown}`,
//                 }}
//               >
//                 پاکول
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* =====================================================
//           TABLE
//       ===================================================== */}

//       <div
//         className="p-0"
//         style={{
//           backgroundColor:
//             COLORS.light,

//           border: "none",

//           boxShadow: "none",
//         }}
//       >
//         <div className="table-responsive">

//           <table
//             className="table mb-0"
//             style={{
//               color:
//                 COLORS.dark,

//               border:
//                 "none",

//               backgroundColor:
//                 COLORS.light,

//               textAlign:
//                 "right",

//               direction:
//                 "rtl",
//             }}
//           >

//             <thead
//               style={{
//                 backgroundColor:
//                   COLORS.brown,

//                 color:
//                   COLORS.light,
//               }}
//             >
//               <tr>

//                 <th
//                   className="text-end"
//                   style={{
//                     border:
//                       "none",

//                     color:
//                       COLORS.light,

//                     whiteSpace:
//                       "nowrap",
//                   }}
//                 >
//                   شمېره
//                 </th>

//                 <th
//                   className="text-end"
//                   style={{
//                     border:
//                       "none",

//                     color:
//                       COLORS.light,

//                     whiteSpace:
//                       "nowrap",
//                   }}
//                 >
//                   نېټه
//                 </th>

//                 <th
//                   className="text-end"
//                   style={{
//                     border:
//                       "none",

//                     color:
//                       COLORS.light,

//                     whiteSpace:
//                       "nowrap",
//                   }}
//                 >
//                   شرکت
//                 </th>

//                 <th
//                   className="text-end"
//                   style={{
//                     border:
//                       "none",

//                     color:
//                       COLORS.light,

//                     whiteSpace:
//                       "nowrap",
//                   }}
//                 >
//                   GPS شرکت
//                 </th>

//                 <th
//                   className="text-end"
//                   style={{
//                     border:
//                       "none",

//                     color:
//                       COLORS.light,

//                     whiteSpace:
//                       "nowrap",
//                   }}
//                 >
//                   سریال نمبر
//                 </th>

//                 <th
//                   className="text-end"
//                   style={{
//                     border:
//                       "none",

//                     color:
//                       COLORS.light,

//                     whiteSpace:
//                       "nowrap",
//                   }}
//                 >
//                   پلیت نمبر
//                 </th>

//                 <th
//                   className="text-end"
//                   style={{
//                     border:
//                       "none",

//                     color:
//                       COLORS.light,

//                     whiteSpace:
//                       "nowrap",
//                   }}
//                 >
//                   ولایت / ښار
//                 </th>

//                 <th
//                   className="text-end"
//                   style={{
//                     border:
//                       "none",

//                     color:
//                       COLORS.light,

//                     whiteSpace:
//                       "nowrap",
//                   }}
//                 >
//                   کړنې
//                 </th>

//               </tr>
//             </thead>

//             <tbody>

//               {/* LOADING */}

//               {loading ? (
//                 <tr>
//                   <td
//                     colSpan="8"
//                     className="text-center"
//                     style={{
//                       border:
//                         "none",

//                       backgroundColor:
//                         COLORS.light,

//                       color:
//                         COLORS.dark,

//                       padding:
//                         "20px",
//                     }}
//                   >
//                     راپورونه لوډ کېږي...
//                   </td>
//                 </tr>
//               ) : reports.length === 0 ? (

//                 /* NO DATA */

//                 <tr>
//                   <td
//                     colSpan="8"
//                     className="text-center"
//                     style={{
//                       border:
//                         "none",

//                       backgroundColor:
//                         COLORS.light,

//                       color:
//                         COLORS.dark,

//                       padding:
//                         "20px",
//                     }}
//                   >
//                     هېڅ راپور ونه موندل شو
//                   </td>
//                 </tr>

//               ) : (

//                 /* REPORTS */

//                 reports.map(
//                   (r) => (
//                     <tr
//                       key={r.id}
//                       style={{
//                         backgroundColor:
//                           COLORS.light,
//                       }}
//                     >

//                       {/* ID */}

//                       <td
//                         className="text-end"
//                         style={{
//                           border:
//                             "none",

//                           color:
//                             COLORS.dark,

//                           backgroundColor:
//                             COLORS.light,
//                         }}
//                       >
//                         {r.id}
//                       </td>

//                       {/* DATE */}

//                       <td
//                         className="text-end"
//                         style={{
//                           border:
//                             "none",

//                           color:
//                             COLORS.dark,

//                           backgroundColor:
//                             COLORS.light,

//                           whiteSpace:
//                             "nowrap",
//                         }}
//                       >
//                         {r.dateS ||
//                           "-"}
//                       </td>

//                       {/* COMPANY */}

//                       <td
//                         className="text-end"
//                         style={{
//                           border:
//                             "none",

//                           color:
//                             COLORS.dark,

//                           backgroundColor:
//                             COLORS.light,
//                         }}
//                       >
//                         {r.company?.name ||
//                           "-"}
//                       </td>

//                       {/* GPS */}

//                       <td
//                         className="text-end"
//                         style={{
//                           border:
//                             "none",

//                           color:
//                             COLORS.dark,

//                           backgroundColor:
//                             COLORS.light,
//                         }}
//                       >
//                         {r.gpsCompany?.name ||
//                           "-"}
//                       </td>

//                       {/* SERIAL */}

//                       <td
//                         className="text-end"
//                         style={{
//                           border:
//                             "none",

//                           color:
//                             COLORS.dark,

//                           backgroundColor:
//                             COLORS.light,
//                         }}
//                       >
//                         {r.serialNumber ||
//                           "-"}
//                       </td>

//                       {/* PALET */}

//                       <td
//                         className="text-end"
//                         style={{
//                           border:
//                             "none",

//                           color:
//                             COLORS.dark,

//                           backgroundColor:
//                             COLORS.light,
//                         }}
//                       >
//                         {r.paletNumber ||
//                           "-"}
//                       </td>

//                       {/* CITY */}

//                       <td
//                         className="text-end"
//                         style={{
//                           border:
//                             "none",

//                           color:
//                             COLORS.dark,

//                           backgroundColor:
//                             COLORS.light,
//                         }}
//                       >
//                         {r.provincesAndCities
//                           ?.name ||
//                           "-"}
//                       </td>

//                       {/* ACTIONS */}

//                       <td
//                         className="text-end"
//                         style={{
//                           border:
//                             "none",

//                           backgroundColor:
//                             COLORS.light,
//                         }}
//                       >
//                         <div
//                           className="d-flex gap-1"
//                           style={{
//                             direction:
//                               "rtl",
//                           }}
//                         >

//                           {/* EDIT */}

//                           {canEdit && (
//                             <button
//                               type="button"
//                               className="btn fw-bold"
//                               onClick={() =>
//                                 edit(r)
//                               }
//                               disabled={
//                                 saving
//                               }
//                               style={{
//                                 ...smallButtonStyle,

//                                 backgroundColor:
//                                   COLORS.dark,

//                                 color:
//                                   COLORS.light,

//                                 border:
//                                   `1px solid ${COLORS.dark}`,
//                               }}
//                             >
//                               سمول
//                             </button>
//                           )}

//                           {/* DELETE */}

//                           {canDelete && (
//                             <button
//                               type="button"
//                               className="btn fw-bold"
//                               onClick={() =>
//                                 remove(
//                                   r.id
//                                 )
//                               }
//                               disabled={
//                                 saving
//                               }
//                               style={{
//                                 ...smallButtonStyle,

//                                 backgroundColor:
//                                   COLORS.brown,

//                                 color:
//                                   COLORS.light,

//                                 border:
//                                   `1px solid ${COLORS.brown}`,
//                               }}
//                             >
//                               حذف
//                             </button>
//                           )}

//                           {/* SIMPLE USER */}

//                           {isSimpleUser &&
//                             !isOwner && (
//                               <span
//                                 style={{
//                                   fontSize:
//                                     "12px",

//                                   color:
//                                     COLORS.brown,

//                                   fontWeight:
//                                     "600",
//                                 }}
//                               >
//                                 یوازې ثبت
//                               </span>
//                             )}

//                           {/* COMPANY USER */}

//                           {isCompanyUser && (
//                             <span
//                               style={{
//                                 fontSize:
//                                   "12px",

//                                 color:
//                                   COLORS.brown,

//                                 fontWeight:
//                                   "600",
//                               }}
//                             >
//                               لیدل
//                             </span>
//                           )}

//                         </div>
//                       </td>

//                     </tr>
//                   )
//                 )
//               )}

//             </tbody>
//           </table>

//         </div>
//       </div>
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Select from "react-select";

import DatePickerModule from "react-multi-date-picker";
import DateObject from "react-date-object";

import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const DatePicker = DatePickerModule.default;

// =========================================================
// API
// =========================================================

const API_URL = "/report";
const COMPANY_API = "/company";
const GPS_COMPANY_API = "/GPSCompany";
const CITY_API = "/ProvincesAndCities";
const VEHICLE_API = "/Vehicle";

const ENUM_DURATION = `${API_URL}/enums/kart-duration`;
const ENUM_KART = `${API_URL}/enums/type-of-kart`;
const ENUM_ACTIVITY = `${API_URL}/enums/type-of-activity`;
const ENUM_STATUS = `${API_URL}/enums/kart-status`;

// =========================================================
// COLORS
// یوازې درې رنګونه
// =========================================================

const COLORS = {
  dark: "#343148",
  light: "#cdc6bd",
  brown: "#583432",
};

// =========================================================
// FIELD STYLE
// =========================================================

const fieldStyle = {
  backgroundColor: COLORS.light,
  color: COLORS.dark,
  border: `1px solid ${COLORS.dark}`,
  borderRadius: "5px",
  boxShadow: "none",
  direction: "rtl",
  textAlign: "right",
};

// =========================================================
// SMALL BUTTON STYLE
// =========================================================

const smallButtonStyle = {
  fontSize: "12px",
  padding: "4px 10px",
  borderRadius: "5px",
  fontWeight: "600",
};

// =========================================================
// SEARCHABLE SELECT STYLE
// =========================================================

const searchableSelectStyles = {
  control: (base) => ({
    ...base,
    backgroundColor: COLORS.light,
    color: COLORS.dark,
    border: `1px solid ${COLORS.dark}`,
    borderRadius: "5px",
    minHeight: "38px",
    height: "38px",
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
    direction: "rtl",
    textAlign: "right",
  }),

  placeholder: (base) => ({
    ...base,
    color: COLORS.dark,
    opacity: 0.85,
    direction: "rtl",
    textAlign: "right",
  }),

  input: (base) => ({
    ...base,
    color: COLORS.dark,
    direction: "rtl",
    textAlign: "right",
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
    backgroundColor: COLORS.light,
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

// =========================================================
// COMPONENT
// =========================================================

export default function ReportPage() {
  const { user, hasRole } = useAuth();

  // =========================================================
  // PERMISSIONS
  // =========================================================

  const isOwner = hasRole("Owner");
  const isSimpleUser = hasRole("SimpleUser");
  const isCompanyUser = hasRole("CompanyUser");

  // Owner:
  // اضافه + سمول + حذف
  //
  // SimpleUser:
  // اضافه
  //
  // CompanyUser:
  // یوازې لیدل

  const canCreate = isOwner || isSimpleUser;
  const canEdit = isOwner;
  const canDelete = isOwner;
  const canManage = canCreate || canEdit || canDelete;

  // =========================================================
  // REPORTS
  // =========================================================

  const [reports, setReports] = useState([]);

  // =========================================================
  // DROPDOWNS
  // =========================================================

  const [companies, setCompanies] = useState([]);
  const [gpsCompanies, setGpsCompanies] = useState([]);
  const [cities, setCities] = useState([]);

  const [durations, setDurations] = useState([]);
  const [kartTypes, setKartTypes] = useState([]);
  const [activities, setActivities] = useState([]);
  const [statuses, setStatuses] = useState([]);

  const [companyCities, setCompanyCities] = useState([]);
  const [vehicles, setVehicles] = useState([]);

  // =========================================================
  // STATES
  // =========================================================

  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // =========================================================
  // FORM
  // =========================================================

  const [form, setForm] = useState({
    id: 0,

    companyId: 0,
    gpsCompanyId: 0,

    serialNumber: "",
    paletNumber: "",

    provincesAndCitiesId: 0,

    destinationCompanyId: null,
    destinationProvinceId: null,

    reportId: null,

    vehicleId: 0,

    kartDuration: 0,
    typeOfKart: 0,
    typeOfActivity: 0,
    kartNewRenewLost: 0,

    reportDate: null,
  });

  // =========================================================
  // AFGHAN DATE LOCALE
  // =========================================================

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

  // =========================================================
  // DATE PARSER
  // Backend string -> DateObject
  // =========================================================

  const parseReportDate = (dateValue) => {
    if (!dateValue) {
      return null;
    }

    if (
      typeof dateValue === "object" &&
      typeof dateValue.format === "function"
    ) {
      return dateValue;
    }

    if (typeof dateValue === "string") {
      try {
        return new DateObject({
          date: dateValue,
          calendar: persian,
          locale: afghanLocale,
          format: "YYYY/MM/DD",
        });
      } catch (error) {
        console.error(
          "Date conversion error:",
          error
        );

        return null;
      }
    }

    return null;
  };

  // =========================================================
  // DATE STRING
  // DateObject -> Backend string
  // =========================================================

  const getReportDateString = () => {
    if (!form.reportDate) {
      return null;
    }

    if (
      typeof form.reportDate.format === "function"
    ) {
      return form.reportDate.format(
        "YYYY/MM/DD"
      );
    }

    if (
      typeof form.reportDate === "string"
    ) {
      return form.reportDate;
    }

    return null;
  };

  // =========================================================
  // FETCH REPORTS
  // =========================================================

  const fetchReports = async () => {
    try {
      setLoading(true);

      const res = await api.get(API_URL);

      setReports(res.data);
    } catch (error) {
      console.error(
        "Reports error:",
        error.response?.data || error
      );

      toast.error(
        "د راپورونو راوړلو کې ستونزه رامنځته شوه"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // FETCH DROPDOWNS
  // =========================================================

  const fetchDropdowns = async () => {
    try {
      const [
        c,
        gps,
        city,
        d,
        k,
        a,
        s,
        v,
      ] = await Promise.all([
        api.get(COMPANY_API),
        api.get(GPS_COMPANY_API),
        api.get(CITY_API),
        api.get(ENUM_DURATION),
        api.get(ENUM_KART),
        api.get(ENUM_ACTIVITY),
        api.get(ENUM_STATUS),
        api.get(VEHICLE_API),
      ]);

      setCompanies(c.data);
      setGpsCompanies(gps.data);
      setCities(city.data);
      setDurations(d.data);
      setKartTypes(k.data);
      setActivities(a.data);
      setStatuses(s.data);
      setVehicles(v.data);
    } catch (error) {
      console.error(
        "Dropdown error:",
        error.response?.data || error
      );

      toast.error(
        "د معلوماتو راوړلو کې ستونزه رامنځته شوه"
      );
    }
  };

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    fetchReports();
    fetchDropdowns();
  }, []);

  // =========================================================
  // HANDLE INPUT CHANGE
  // =========================================================

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    if (
      [
        "serialNumber",
        "paletNumber",
        "chasis",
      ].includes(name)
    ) {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]:
          value === ""
            ? null
            : Number(value),
      }));
    }
  };

  // =========================================================
  // COMPANY SELECT
  // =========================================================

  const handleCompanySelect = (
    selectedOption
  ) => {
    const companyId = selectedOption
      ? Number(selectedOption.value)
      : 0;

    setForm((prev) => ({
      ...prev,
      companyId,
      destinationProvinceId: null,
    }));

    getCompanyCities(companyId);
  };

  // =========================================================
  // CITY SELECT
  // =========================================================

  const handleCitySelect = (
    selectedOption
  ) => {
    const cityId = selectedOption
      ? Number(selectedOption.value)
      : 0;

    setForm((prev) => ({
      ...prev,
      provincesAndCitiesId: cityId,
    }));

    checkExistingTaxi(
      form.paletNumber,
      cityId
    );
  };

  // =========================================================
  // CREATE
  // =========================================================

  const create = async () => {
    if (!canCreate) {
      toast.error(
        "تاسو د راپور د اضافه کولو اجازه نه لرئ"
      );
      return;
    }

    try {
      setSaving(true);

      const payload = {
        companyId:
          form.companyId,

        gpsCompanyId:
          form.gpsCompanyId || null,

        serialNumber:
          form.serialNumber,

        paletNumber:
          form.paletNumber,

        provincesAndCitiesId:
          form.provincesAndCitiesId,

        destinationCompanyId:
          form.destinationCompanyId || null,

        destinationProvinceId:
          form.destinationProvinceId || null,

        reportId:
          form.reportId || null,

        vehicleId:
          form.vehicleId,

        kartDuration:
          form.kartDuration || null,

        typeOfKart:
          form.typeOfKart || null,

        typeOfActivity:
          form.typeOfActivity || null,

        kartNewRenewLost:
          form.kartNewRenewLost || null,

        dateS:
          getReportDateString(),
      };

      console.log(
        "CREATE PAYLOAD:",
        payload
      );

      await api.post(
        API_URL,
        payload
      );

      toast.success(
        "راپور په بریالیتوب اضافه شو"
      );

      await fetchReports();

      reset();
    } catch (err) {
      console.error(
        "Create error:",
        err.response?.data || err
      );

      toast.error(
        err.response?.data?.message ||
          "د راپور اضافه کولو کې ستونزه رامنځته شوه"
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // UPDATE
  // =========================================================

  const update = async () => {
    if (!canEdit) {
      toast.error(
        "تاسو د راپور د سمولو اجازه نه لرئ"
      );
      return;
    }

    try {
      setSaving(true);

      const payload = {
        id: form.id,

        companyId:
          form.companyId,

        gpsCompanyId:
          form.gpsCompanyId || null,

        serialNumber:
          form.serialNumber,

        paletNumber:
          form.paletNumber,

        provincesAndCitiesId:
          form.provincesAndCitiesId,

        destinationCompanyId:
          form.destinationCompanyId || null,

        destinationProvinceId:
          form.destinationProvinceId || null,

        reportId:
          form.reportId || null,

        vehicleId:
          form.vehicleId,

        kartDuration:
          form.kartDuration || null,

        typeOfKart:
          form.typeOfKart || null,

        typeOfActivity:
          form.typeOfActivity || null,

        kartNewRenewLost:
          form.kartNewRenewLost || null,

        dateS:
          getReportDateString(),
      };

      console.log(
        "UPDATE PAYLOAD:",
        payload
      );

      await api.put(
        `${API_URL}/${form.id}`,
        payload
      );

      toast.success(
        "راپور په بریالیتوب نوي شو"
      );

      await fetchReports();

      reset();
    } catch (err) {
      console.error(
        "Update error:",
        err.response?.data || err
      );

      toast.error(
        err.response?.data?.message ||
          "د راپور نوي کولو کې ستونزه رامنځته شوه"
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // DELETE
  // =========================================================

  const remove = async (id) => {
    if (!canDelete) {
      toast.error(
        "تاسو د راپور د حذف کولو اجازه نه لرئ"
      );
      return;
    }

    const confirmed = window.confirm(
      "ایا د دې راپور د حذف کولو ډاډه یاست؟"
    );

    if (!confirmed) {
      return;
    }

    try {
      setSaving(true);

      await api.delete(
        `${API_URL}/${id}`
      );

      toast.success(
        "راپور حذف شو"
      );

      await fetchReports();
    } catch (err) {
      console.error(
        "Delete error:",
        err.response?.data || err
      );

      toast.error(
        err.response?.data?.message ||
          "د راپور حذف کولو کې ستونزه رامنځته شوه"
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // EDIT
  // =========================================================

  const edit = (r) => {
    if (!canEdit) {
      toast.error(
        "تاسو د راپور د سمولو اجازه نه لرئ"
      );
      return;
    }

    const reportDate =
      parseReportDate(
        r.dateS
      );

    setForm({
      id: r.id,

      companyId:
        r.companyId ||
        r.company?.id ||
        0,

      gpsCompanyId:
        r.gpsCompanyId ||
        r.gpsCompany?.id ||
        0,

      serialNumber:
        r.serialNumber || "",

      paletNumber:
        r.paletNumber || "",

      provincesAndCitiesId:
        r.provincesAndCitiesId ||
        r.provincesAndCities?.id ||
        0,

      destinationCompanyId:
        r.destinationCompanyId ||
        r.destinationCompany?.id ||
        null,

      destinationProvinceId:
        r.destinationProvinceId ||
        r.destinationProvince?.id ||
        null,

      reportId:
        r.reportId || null,

      vehicleId:
        r.vehicleId ||
        r.vehicle?.id ||
        0,

      kartDuration:
        r.kartDuration || 0,

      typeOfKart:
        r.typeOfKart || 0,

      typeOfActivity:
        r.typeOfActivity || 0,

      kartNewRenewLost:
        r.kartNewRenewLost || 0,

      reportDate,
    });

    if (r.companyId) {
      getCompanyCities(
        r.companyId
      );
    }

    setIsEdit(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================================================
  // RESET
  // =========================================================

  const reset = () => {
    setForm({
      id: 0,

      companyId: 0,
      gpsCompanyId: 0,

      serialNumber: "",
      paletNumber: "",

      provincesAndCitiesId: 0,

      destinationCompanyId: null,
      destinationProvinceId: null,

      reportId: null,

      vehicleId: 0,

      kartDuration: 0,
      typeOfKart: 0,
      typeOfActivity: 0,
      kartNewRenewLost: 0,

      reportDate: null,
    });

    setCompanyCities([]);

    setIsEdit(false);
  };

  // =========================================================
  // COMPANY CITIES
  // =========================================================

  const getCompanyCities = async (
    companyId
  ) => {
    if (!companyId) {
      setCompanyCities([]);
      return;
    }

    try {
      const res =
        await api.get(
          `${COMPANY_API}/${companyId}/locations`
        );

      setCompanyCities(
        res.data
      );
    } catch (err) {
      console.error(
        "Company locations error:",
        err.response?.data || err
      );

      setCompanyCities([]);
    }
  };

  // =========================================================
  // CHECK EXISTING TAXI
  // =========================================================

  const checkExistingTaxi = async (
    paletNumberValue = form.paletNumber,
    provinceCityIdValue =
      form.provincesAndCitiesId
  ) => {
    if (
      !paletNumberValue ||
      !provinceCityIdValue
    ) {
      return;
    }

    try {
      const res =
        await api.get(
          `${API_URL}/check-existing`,
          {
            params: {
              paletNumber:
                paletNumberValue,

              provincesAndCitiesId:
                provinceCityIdValue,
            },
          }
        );

      if (res.data.exists) {
        toast.warning(
          res.data.message
        );
      }
    } catch (err) {
      console.error(
        "Existing taxi check error:",
        err.response?.data || err
      );
    }
  };

  // =========================================================
  // SEARCHABLE OPTIONS
  // =========================================================

  const companyOptions =
    companies.map((c) => ({
      value: c.id,
      label: c.name,
    }));

  const cityOptions =
    cities.map((c) => ({
      value: c.id,
      label: c.name,
    }));

  const selectedCompany =
    companyOptions.find(
      (x) =>
        Number(x.value) ===
        Number(form.companyId)
    ) || null;

  const selectedCity =
    cityOptions.find(
      (x) =>
        Number(x.value) ===
        Number(
          form.provincesAndCitiesId
        )
    ) || null;

  // =========================================================
  // UI
  // =========================================================

  return (
    <div
      dir="rtl"
      className="container-fluid mt-4"
      style={{
        backgroundColor:
          COLORS.light,

        minHeight: "100vh",

        color: COLORS.dark,

        padding: "20px",

        textAlign: "right",
      }}
    >
      {/* =====================================================
          TITLE
      ===================================================== */}

      <div
        className="d-flex justify-content-between align-items-center mb-4"
        style={{
          direction: "rtl",
        }}
      >
        <div>
          <h2
            className="fw-bold mb-1"
            style={{
              color: COLORS.dark,
            }}
          >
            د راپورونو مدیریت
          </h2>

          <small
            style={{
              color: COLORS.brown,
              fontWeight: "600",
            }}
          >
            {isOwner
              ? "Owner"
              : isSimpleUser
              ? "SimpleUser"
              : isCompanyUser
              ? "CompanyUser"
              : ""}
          </small>
        </div>

        <div
          style={{
            fontSize: "13px",
            fontWeight: "700",
            color: COLORS.brown,
          }}
        >
          ټول راپورونه: {reports.length}
        </div>
      </div>

      {/* =====================================================
          COMPANY USER VIEW ONLY MESSAGE
      ===================================================== */}

      {isCompanyUser && (
        <div
          className="mb-3 p-2"
          style={{
            backgroundColor:
              COLORS.light,
            color: COLORS.dark,
            border: `1px solid ${COLORS.dark}`,
            borderRadius: "5px",
            fontSize: "13px",
            fontWeight: "600",
          }}
        >
          تاسو د شرکت کاروونکي یاست؛
          یوازې د راپورونو د لیدلو اجازه لرئ.
        </div>
      )}

      {/* =====================================================
          FORM
          یوازې Owner او SimpleUser
      ===================================================== */}

      {canManage && (
        <div
          className="p-3 mb-4"
          style={{
            backgroundColor:
              COLORS.light,

            border: "none",

            boxShadow: "none",

            overflow: "visible",
          }}
        >
          <div className="row g-2">

            {/* COMPANY */}

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
                options={
                  companyOptions
                }
                value={
                  selectedCompany
                }
                onChange={
                  handleCompanySelect
                }
                placeholder="شرکت وټاکئ"
                isClearable
                isSearchable
                noOptionsMessage={() =>
                  "شرکت پیدا نه شو"
                }
                loadingMessage={() =>
                  "معلومات راوړل کېږي..."
                }
                styles={
                  searchableSelectStyles
                }
                filterOption={(
                  option,
                  inputValue
                ) =>
                  option.label
                    .toLowerCase()
                    .includes(
                      inputValue.toLowerCase()
                    )
                }
                isDisabled={saving}
              />
            </div>

            {/* GPS COMPANY */}

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
                value={
                  form.gpsCompanyId
                }
                onChange={
                  handleChange
                }
                style={fieldStyle}
                disabled={saving}
              >
                <option value={0}>
                  د GPS شرکت وټاکئ
                </option>

                {gpsCompanies.map(
                  (gps) => (
                    <option
                      key={gps.id}
                      value={gps.id}
                    >
                      {gps.name}
                    </option>
                  )
                )}
              </select>
            </div>

            {/* CITY */}

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
                options={
                  cityOptions
                }
                value={
                  selectedCity
                }
                onChange={
                  handleCitySelect
                }
                placeholder="ولایت پلیت وټاکئ"
                isClearable
                isSearchable
                noOptionsMessage={() =>
                  "ولایت یا ښار پیدا نه شو"
                }
                loadingMessage={() =>
                  "معلومات راوړل کېږي..."
                }
                styles={
                  searchableSelectStyles
                }
                filterOption={(
                  option,
                  inputValue
                ) =>
                  option.label
                    .toLowerCase()
                    .includes(
                      inputValue.toLowerCase()
                    )
                }
                isDisabled={saving}
              />
            </div>

            {/* SERIAL */}

            <div className="col-md-3">
              <label
                className="form-label fw-bold w-100"
                style={{
                  color: COLORS.dark,
                  textAlign: "right",
                }}
              >
                سریال نمبر
              </label>

              <input
                className="form-control"
                name="serialNumber"
                placeholder="سریال نمبر"
                value={
                  form.serialNumber
                }
                onChange={
                  handleChange
                }
                style={fieldStyle}
                disabled={saving}
              />
            </div>

            {/* PALET */}

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
                className="form-control"
                name="paletNumber"
                placeholder="پلیت نمبر"
                value={
                  form.paletNumber
                }
                onChange={
                  handleChange
                }
                onBlur={() =>
                  checkExistingTaxi()
                }
                style={fieldStyle}
                disabled={saving}
              />
            </div>

            {/* DURATION */}

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
                name="kartDuration"
                value={
                  form.kartDuration
                }
                onChange={
                  handleChange
                }
                style={fieldStyle}
                disabled={saving}
              >
                <option value={0}>
                  موده وټاکئ
                </option>

                {durations.map(
                  (x) => (
                    <option
                      key={x.id}
                      value={x.id}
                    >
                      {x.name}
                    </option>
                  )
                )}
              </select>
            </div>

            {/* KART TYPE */}

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
                name="typeOfKart"
                value={
                  form.typeOfKart
                }
                onChange={
                  handleChange
                }
                style={fieldStyle}
                disabled={saving}
              >
                <option value={0}>
                  د کارت ډول
                </option>

                {kartTypes.map(
                  (x) => (
                    <option
                      key={x.id}
                      value={x.id}
                    >
                      {x.name}
                    </option>
                  )
                )}
              </select>
            </div>

            {/* ACTIVITY */}

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
                name="typeOfActivity"
                value={
                  form.typeOfActivity
                }
                onChange={
                  handleChange
                }
                style={fieldStyle}
                disabled={saving}
              >
                <option value={0}>
                  فعالیت وټاکئ
                </option>

                {activities.map(
                  (x) => (
                    <option
                      key={x.id}
                      value={x.id}
                    >
                      {x.name}
                    </option>
                  )
                )}
              </select>
            </div>

            {/* STATUS */}

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
                name="kartNewRenewLost"
                value={
                  form.kartNewRenewLost
                }
                onChange={
                  handleChange
                }
                style={fieldStyle}
                disabled={saving}
              >
                <option value={0}>
                  حالت وټاکئ
                </option>

                {statuses.map(
                  (x) => (
                    <option
                      key={x.id}
                      value={x.id}
                    >
                      {x.name}
                    </option>
                  )
                )}
              </select>
            </div>

            {/* DESTINATION */}

            <div className="col-md-3">
              <label
                className="form-label fw-bold w-100"
                style={{
                  color: COLORS.dark,
                  textAlign: "right",
                }}
              >
                د ټکسي منزل
              </label>

              <select
                className="form-select"
                name="destinationProvinceId"
                value={
                  form.destinationProvinceId || 0
                }
                onChange={
                  handleChange
                }
                style={fieldStyle}
                disabled={
                  saving ||
                  !form.companyId
                }
              >
                <option value={0}>
                  د ټکسي منزل وټاکئ
                </option>

                {companyCities.map(
                  (c) => (
                    <option
                      key={c.id}
                      value={c.id}
                    >
                      {c.name}
                    </option>
                  )
                )}
              </select>
            </div>

            {/* VEHICLE */}

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
                value={
                  form.vehicleId
                }
                onChange={
                  handleChange
                }
                style={fieldStyle}
                disabled={saving}
              >
                <option value={0}>
                  وسیله وټاکئ
                </option>

                {vehicles.map(
                  (v) => (
                    <option
                      key={v.id}
                      value={v.id}
                    >
                      {v.type}
                    </option>
                  )
                )}
              </select>
            </div>

            {/* DATE */}

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
                value={
                  form.reportDate
                }
                onChange={(value) =>
                  setForm((prev) => ({
                    ...prev,
                    reportDate:
                      value,
                  }))
                }
                calendar={persian}
                locale={
                  afghanLocale
                }
                format="YYYY/MM/DD"
                placeholder="نېټه وټاکئ"
                inputClass="form-control"
                style={{
                  ...fieldStyle,
                  width: "100%",
                  height: "38px",
                }}
                disabled={saving}
              />
            </div>

            {/* BUTTONS */}

            <div
              className="col-12 d-flex gap-2 mt-2"
              style={{
                direction: "rtl",
              }}
            >
              {isEdit ? (
                <>
                  {canEdit && (
                    <button
                      type="button"
                      className="btn fw-bold"
                      onClick={
                        update
                      }
                      disabled={
                        saving
                      }
                      style={{
                        ...smallButtonStyle,

                        backgroundColor:
                          COLORS.brown,

                        color:
                          COLORS.light,

                        border:
                          `1px solid ${COLORS.brown}`,
                      }}
                    >
                      {saving
                        ? "ثبتېږي..."
                        : "نوي کول"}
                    </button>
                  )}
                </>
              ) : (
                canCreate && (
                  <button
                    type="button"
                    className="btn fw-bold"
                    onClick={
                      create
                    }
                    disabled={
                      saving
                    }
                    style={{
                      ...smallButtonStyle,

                      backgroundColor:
                        COLORS.dark,

                      color:
                        COLORS.light,

                      border:
                        `1px solid ${COLORS.dark}`,
                    }}
                  >
                    {saving
                      ? "ثبتېږي..."
                      : "اضافه کول"}
                  </button>
                )
              )}

              <button
                type="button"
                className="btn fw-bold"
                onClick={reset}
                disabled={saving}
                style={{
                  ...smallButtonStyle,

                  backgroundColor:
                    COLORS.brown,

                  color:
                    COLORS.light,

                  border:
                    `1px solid ${COLORS.brown}`,
                }}
              >
                پاکول
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          TABLE
      ===================================================== */}

      <div
        className="p-0"
        style={{
          backgroundColor:
            COLORS.light,

          border: "none",

          boxShadow: "none",
        }}
      >
        <div className="table-responsive">

          <table
            className="table mb-0"
            style={{
              color:
                COLORS.dark,

              border:
                "none",

              backgroundColor:
                COLORS.light,

              textAlign:
                "right",

              direction:
                "rtl",
            }}
          >

            <thead
              style={{
                backgroundColor:
                  COLORS.brown,

                color:
                  COLORS.light,
              }}
            >
              <tr>

                <th
                  className="text-end"
                  style={{
                    border:
                      "none",

                    color:
                      COLORS.light,

                    whiteSpace:
                      "nowrap",
                  }}
                >
                  شمېره
                </th>

                <th
                  className="text-end"
                  style={{
                    border:
                      "none",

                    color:
                      COLORS.light,

                    whiteSpace:
                      "nowrap",
                  }}
                >
                  نېټه
                </th>

                <th
                  className="text-end"
                  style={{
                    border:
                      "none",

                    color:
                      COLORS.light,

                    whiteSpace:
                      "nowrap",
                  }}
                >
                  شرکت
                </th>

                <th
                  className="text-end"
                  style={{
                    border:
                      "none",

                    color:
                      COLORS.light,

                    whiteSpace:
                      "nowrap",
                  }}
                >
                  GPS شرکت
                </th>

                <th
                  className="text-end"
                  style={{
                    border:
                      "none",

                    color:
                      COLORS.light,

                    whiteSpace:
                      "nowrap",
                  }}
                >
                  سریال نمبر
                </th>

                <th
                  className="text-end"
                  style={{
                    border:
                      "none",

                    color:
                      COLORS.light,

                    whiteSpace:
                      "nowrap",
                  }}
                >
                  پلیت نمبر
                </th>

                <th
                  className="text-end"
                  style={{
                    border:
                      "none",

                    color:
                      COLORS.light,

                    whiteSpace:
                      "nowrap",
                  }}
                >
                  ولایت پلیت
                </th>

                <th
                  className="text-end"
                  style={{
                    border:
                      "none",

                    color:
                      COLORS.light,

                    whiteSpace:
                      "nowrap",
                  }}
                >
                  کړنې
                </th>

              </tr>
            </thead>

            <tbody>

              {/* LOADING */}

              {loading ? (
                <tr>
                  <td
                    colSpan="8"
                    className="text-center"
                    style={{
                      border:
                        "none",

                      backgroundColor:
                        COLORS.light,

                      color:
                        COLORS.dark,

                      padding:
                        "20px",
                    }}
                  >
                    راپورونه لوډ کېږي...
                  </td>
                </tr>
              ) : reports.length === 0 ? (

                /* NO DATA */

                <tr>
                  <td
                    colSpan="8"
                    className="text-center"
                    style={{
                      border:
                        "none",

                      backgroundColor:
                        COLORS.light,

                      color:
                        COLORS.dark,

                      padding:
                        "20px",
                    }}
                  >
                    هېڅ راپور ونه موندل شو
                  </td>
                </tr>

              ) : (

                /* REPORTS */

                reports.map(
                  (r, index) => (
                    <tr
                      key={r.id}
                      style={{
                        backgroundColor:
                          COLORS.light,
                      }}
                    >

                      {/* INDEX */}

                      <td
                        className="text-end"
                        style={{
                          border:
                            "none",

                          color:
                            COLORS.dark,

                          backgroundColor:
                            COLORS.light,
                        }}
                      >
                        {index + 1}
                      </td>

                      {/* DATE */}

                      <td
                        className="text-end"
                        style={{
                          border:
                            "none",

                          color:
                            COLORS.dark,

                          backgroundColor:
                            COLORS.light,

                          whiteSpace:
                            "nowrap",
                        }}
                      >
                        {r.dateS ||
                          "-"}
                      </td>

                      {/* COMPANY */}

                      <td
                        className="text-end"
                        style={{
                          border:
                            "none",

                          color:
                            COLORS.dark,

                          backgroundColor:
                            COLORS.light,
                        }}
                      >
                        {r.company?.name ||
                          "-"}
                      </td>

                      {/* GPS */}

                      <td
                        className="text-end"
                        style={{
                          border:
                            "none",

                          color:
                            COLORS.dark,

                          backgroundColor:
                            COLORS.light,
                        }}
                      >
                        {r.gpsCompany?.name ||
                          "-"}
                      </td>

                      {/* SERIAL */}

                      <td
                        className="text-end"
                        style={{
                          border:
                            "none",

                          color:
                            COLORS.dark,

                          backgroundColor:
                            COLORS.light,
                        }}
                      >
                        {r.serialNumber ||
                          "-"}
                      </td>

                      {/* PALET */}

                      <td
                        className="text-end"
                        style={{
                          border:
                            "none",

                          color:
                            COLORS.dark,

                          backgroundColor:
                            COLORS.light,
                        }}
                      >
                        {r.paletNumber ||
                          "-"}
                      </td>

                      {/* CITY */}

                      <td
                        className="text-end"
                        style={{
                          border:
                            "none",

                          color:
                            COLORS.dark,

                          backgroundColor:
                            COLORS.light,
                        }}
                      >
                        {r.provincesAndCities
                          ?.name ||
                          "-"}
                      </td>

                      {/* ACTIONS */}

                      <td
                        className="text-end"
                        style={{
                          border:
                            "none",

                          backgroundColor:
                            COLORS.light,
                        }}
                      >
                        <div
                          className="d-flex gap-1"
                          style={{
                            direction:
                              "rtl",
                          }}
                        >

                          {/* EDIT */}

                          {canEdit && (
                            <button
                              type="button"
                              className="btn fw-bold"
                              onClick={() =>
                                edit(r)
                              }
                              disabled={
                                saving
                              }
                              style={{
                                ...smallButtonStyle,

                                backgroundColor:
                                  COLORS.dark,

                                color:
                                  COLORS.light,

                                border:
                                  `1px solid ${COLORS.dark}`,
                              }}
                            >
                              سمول
                            </button>
                          )}

                          {/* DELETE */}

                          {canDelete && (
                            <button
                              type="button"
                              className="btn fw-bold"
                              onClick={() =>
                                remove(
                                  r.id
                                )
                              }
                              disabled={
                                saving
                              }
                              style={{
                                ...smallButtonStyle,

                                backgroundColor:
                                  COLORS.brown,

                                color:
                                  COLORS.light,

                                border:
                                  `1px solid ${COLORS.brown}`,
                              }}
                            >
                              حذف
                            </button>
                          )}

                          {/* SIMPLE USER */}

                          {isSimpleUser &&
                            !isOwner && (
                              <span
                                style={{
                                  fontSize:
                                    "12px",

                                  color:
                                    COLORS.brown,

                                  fontWeight:
                                    "600",
                                }}
                              >
                                یوازې ثبت
                              </span>
                            )}

                          {/* COMPANY USER */}

                          {isCompanyUser && (
                            <span
                              style={{
                                fontSize:
                                  "12px",

                                color:
                                  COLORS.brown,

                                fontWeight:
                                  "600",
                              }}
                            >
                              لیدل
                            </span>
                          )}

                        </div>
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
  );
}