// import React, { useEffect, useMemo, useState } from "react";
// import DatePickerModule from "react-multi-date-picker";
// import persian from "react-date-object/calendars/persian";
// import persian_fa from "react-date-object/locales/persian_fa";
// import DateObject from "react-date-object";
// import api from "../services/api";

// const DatePicker = DatePickerModule.default;

// const COLORS = {
//   dark: "#343148",
//   light: "#cdc6bd",
//   brown: "#583432",
// };

// const afghanMonths = [
//   { id: 1, name: "حمل" },
//   { id: 2, name: "ثور" },
//   { id: 3, name: "جوزا" },
//   { id: 4, name: "سرطان" },
//   { id: 5, name: "اسد" },
//   { id: 6, name: "سنبله" },
//   { id: 7, name: "میزان" },
//   { id: 8, name: "عقرب" },
//   { id: 9, name: "قوس" },
//   { id: 10, name: "جدی" },
//   { id: 11, name: "دلو" },
//   { id: 12, name: "حوت" },
// ];

// const afghanLocale = {
//   ...persian_fa,
//   months: [
//     ["حمل", "حم"],
//     ["ثور", "ثو"],
//     ["جوزا", "جو"],
//     ["سرطان", "سر"],
//     ["اسد", "اسد"],
//     ["سنبله", "سن"],
//     ["میزان", "می"],
//     ["عقرب", "عق"],
//     ["قوس", "قو"],
//     ["جدی", "جد"],
//     ["دلو", "دل"],
//     ["حوت", "حو"],
//   ],
// };

// const getCurrentPersianYear = () => {
//   const today = new DateObject({
//     calendar: persian,
//     locale: persian_fa,
//   });

//   const year = Number(today.year);

//   return Number.isFinite(year) ? year : 1405;
// };

// const formatMoney = (value) =>
//   Number(value || 0).toLocaleString("en-US");

// const formatNumber = (value) =>
//   Number(value || 0).toLocaleString("en-US");

// export default function FinanceReport() {
//   const currentPersianYear = getCurrentPersianYear();

//   const [date, setDate] = useState(null);
//   const [month, setMonth] = useState("");
//   const [year, setYear] = useState(currentPersianYear);
//   const [kartDuration, setKartDuration] = useState("");

//   const [report, setReport] = useState({
//     oneCount: 0,
//     threeCount: 0,
//     oneAmount: 0,
//     threeAmount: 0,
//     totalCount: 0,
//     totalAmount: 0,
//     daily: [],
//   });

//   const [loading, setLoading] = useState(false);
//   const toPersianDigits = (value) => {
//     return String(value)
//       .replace(/0/g, "۰")
//       .replace(/1/g, "۱")
//       .replace(/2/g, "۲")
//       .replace(/3/g, "۳")
//       .replace(/4/g, "۴")
//       .replace(/5/g, "۵")
//       .replace(/6/g, "۶")
//       .replace(/7/g, "۷")
//       .replace(/8/g, "۸")
//       .replace(/9/g, "۹");
//   };


//   // const years = useMemo(() => {
//   //   const currentYear = Number(currentPersianYear);

//   //   if (!Number.isFinite(currentYear)) {
//   //     return [];
//   //   }

//   //   return Array.from(
//   //     { length: 10 },
//   //     (_, index) => currentYear - index
//   //   ).filter((yearItem) =>
//   //     Number.isFinite(yearItem)
//   //   );
//   // }, [currentPersianYear]);
//   const years = useMemo(() => {
//     const currentYear = Number(currentPersianYear);
//     if (!Number.isFinite(currentYear)) return [];

//     return Array.from(
//       { length: currentYear - 1400 + 1 },
//       (_, index) => currentYear - index
//     );
//   }, [currentPersianYear]);
//   const fetchFinanceReport = async () => {
//     try {
//       setLoading(true);

//       const params = {};

//       if (date) {
//         params.date = date.format("YYYY/MM/DD");
//       }

//       if (month) {
//         params.month = Number(month);
//       }

//       if (month && Number.isFinite(Number(year))) {
//         params.year = Number(year);
//       }

//       if (kartDuration) {
//         params.kartDuration = Number(kartDuration);
//       }

//       const response = await api.get(
//         "/report/finance-report",
//         { params }
//       );

//       setReport({
//         oneCount: response.data?.oneCount || 0,
//         threeCount: response.data?.threeCount || 0,
//         oneAmount: response.data?.oneAmount || 0,
//         threeAmount: response.data?.threeAmount || 0,
//         totalCount: response.data?.totalCount || 0,
//         totalAmount: response.data?.totalAmount || 0,
//         daily: Array.isArray(response.data?.daily)
//           ? response.data.daily
//           : [],
//       });
//     } catch (error) {
//       console.error(
//         "Finance report error:",
//         error.response?.data || error
//       );

//       setReport({
//         oneCount: 0,
//         threeCount: 0,
//         oneAmount: 0,
//         threeAmount: 0,
//         totalCount: 0,
//         totalAmount: 0,
//         daily: [],
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchFinanceReport();
//   }, [date, month, year, kartDuration]);

//   const clearFilters = () => {
//     setDate(null);
//     setMonth("");
//     setYear(getCurrentPersianYear());
//     setKartDuration("");
//   };

//   return (
//     <div
//       dir="rtl"
//       style={{
//         minHeight: "100vh",
//         backgroundColor: COLORS.light,
//         padding: "15px",
//         color: COLORS.dark,
//         textAlign: "right",
//       }}
//     >
//       <div
//         style={{
//           backgroundColor: COLORS.dark,
//           color: COLORS.light,
//           borderRadius: "6px",
//           padding: "10px 14px",
//           marginBottom: "12px",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           flexWrap: "wrap",
//           gap: "8px",
//         }}
//       >
//         <h5
//           style={{
//             margin: 0,
//             fontWeight: "700",
//             textAlign: "right",
//           }}
//         >
//           مالي راپور
//         </h5>

//         <div
//           style={{
//             backgroundColor: COLORS.brown,
//             color: COLORS.light,
//             padding: "6px 12px",
//             borderRadius: "5px",
//             fontSize: "13px",
//             fontWeight: "700",
//           }}
//         >
//           ټول عاید: {formatMoney(report.totalAmount)} افغانۍ
//         </div>
//       </div>

//       <div
//         style={{
//           backgroundColor: COLORS.dark,
//           borderRadius: "6px",
//           padding: "12px",
//           marginBottom: "12px",
//         }}
//       >
//         <div
//           style={{
//             display: "grid",
//             gridTemplateColumns:
//               "repeat(auto-fit, minmax(160px, 1fr))",
//             gap: "8px",
//           }}
//         >
//           <div>
//             <label
//               style={{
//                 color: COLORS.light,
//                 fontSize: "12px",
//                 display: "block",
//                 marginBottom: "4px",
//                 textAlign: "right",
//               }}
//             >
//               نېټه
//             </label>

//             <DatePicker
//               value={date}
//               onChange={(value) => {
//                 setDate(value);

//                 if (value) {
//                   setMonth("");
//                 }
//               }}
//               calendar={persian}
//               locale={afghanLocale}
//               format="YYYY/MM/DD"
//               placeholder="نېټه وټاکئ"
//               inputClass="form-control"
//               calendarPosition="bottom-right"
//               style={{
//                 width: "100%",
//                 height: "34px",
//                 backgroundColor: COLORS.light,
//                 color: COLORS.dark,
//                 border: `1px solid ${COLORS.light}`,
//                 borderRadius: "4px",
//                 padding: "4px 8px",
//                 textAlign: "right",
//                 direction: "rtl",
//               }}
//             />
//           </div>

//           <div>
//             <label
//               style={{
//                 color: COLORS.light,
//                 fontSize: "12px",
//                 display: "block",
//                 marginBottom: "4px",
//                 textAlign: "right",
//               }}
//             >
//               میاشت
//             </label>

//             <select
//               value={month}
//               onChange={(e) => {
//                 setMonth(e.target.value);

//                 if (e.target.value) {
//                   setDate(null);
//                 }
//               }}
//               style={{
//                 width: "100%",
//                 height: "34px",
//                 border: `1px solid ${COLORS.light}`,
//                 borderRadius: "4px",
//                 padding: "4px 8px",
//                 backgroundColor: COLORS.light,
//                 color: COLORS.dark,
//                 textAlign: "right",
//                 direction: "rtl",
//               }}
//             >
//               <option value="">ټولې میاشتې</option>

//               {afghanMonths.map((monthItem) => (
//                 <option
//                   key={monthItem.id}
//                   value={monthItem.id}
//                 >
//                   {monthItem.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label
//               style={{
//                 color: COLORS.light,
//                 fontSize: "12px",
//                 display: "block",
//                 marginBottom: "4px",
//                 textAlign: "right",
//               }}
//             >
//               کال
//             </label>

//             <select
//               value={
//                 Number.isFinite(Number(year))
//                   ? year
//                   : ""
//               }
//               onChange={(e) => {
//                 const selectedYear = Number(e.target.value);

//                 if (Number.isFinite(selectedYear)) {
//                   setYear(selectedYear);
//                   setDate(null);
//                 }
//               }}
//               disabled={false}
//               style={{
//                 width: "100%",
//                 height: "34px",
//                 border: `1px solid ${COLORS.light}`,
//                 borderRadius: "4px",
//                 padding: "4px 8px",
//                 backgroundColor: COLORS.light,
//                 color: COLORS.dark,
//                 opacity: month ? 1 : 0.6,
//                 textAlign: "right",
//                 direction: "rtl",
//               }}
//             >
//               {years.map((yearItem) => (
//                 <option
//                   key={`shamsi-year-${yearItem}`}
//                   value={yearItem}
//                 >
//                   {toPersianDigits(yearItem)}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label
//               style={{
//                 color: COLORS.light,
//                 fontSize: "12px",
//                 display: "block",
//                 marginBottom: "4px",
//                 textAlign: "right",
//               }}
//             >
//               د کارت موده
//             </label>

//             <select
//               value={kartDuration}
//               onChange={(e) =>
//                 setKartDuration(e.target.value)
//               }
//               style={{
//                 width: "100%",
//                 height: "34px",
//                 border: `1px solid ${COLORS.light}`,
//                 borderRadius: "4px",
//                 padding: "4px 8px",
//                 backgroundColor: COLORS.light,
//                 color: COLORS.dark,
//                 textAlign: "right",
//                 direction: "rtl",
//               }}
//             >
//               <option value="">ټول</option>

//               <option value="1">
//                 یو - ۱۰۰۰ افغانۍ
//               </option>

//               <option value="2">
//                 دری - ۳۰۰۰ افغانۍ
//               </option>
//             </select>
//           </div>

//           <div
//             style={{
//               display: "flex",
//               alignItems: "flex-end",
//             }}
//           >
//             <button
//               type="button"
//               onClick={clearFilters}
//               style={{
//                 width: "100%",
//                 height: "34px",
//                 border: "none",
//                 borderRadius: "4px",
//                 backgroundColor: COLORS.brown,
//                 color: COLORS.light,
//                 fontWeight: "700",
//                 fontSize: "12px",
//                 cursor: "pointer",
//               }}
//             >
//               فلټر پاکول
//             </button>
//           </div>
//         </div>
//       </div>

//       <div
//         style={{
//           display: "grid",
//           gridTemplateColumns:
//             "repeat(auto-fit, minmax(180px, 1fr))",
//           gap: "10px",
//           marginBottom: "12px",
//         }}
//       >
//         <div
//           style={{
//             backgroundColor: COLORS.dark,
//             borderRadius: "6px",
//             padding: "14px",
//             textAlign: "right",
//           }}
//         >
//           <div
//             style={{
//               color: COLORS.light,
//               fontSize: "13px",
//               marginBottom: "7px",
//             }}
//           >
//             یو کلن کارت
//           </div>

//           <div
//             style={{
//               color: COLORS.light,
//               fontSize: "20px",
//               fontWeight: "700",
//             }}
//           >
//             {formatNumber(report.oneCount)}
//           </div>

//           <div
//             style={{
//               color: COLORS.light,
//               fontSize: "12px",
//               marginTop: "5px",
//             }}
//           >
//             {formatMoney(report.oneAmount)} افغانۍ
//           </div>
//         </div>

//         <div
//           style={{
//             backgroundColor: COLORS.dark,
//             borderRadius: "6px",
//             padding: "14px",
//             textAlign: "right",
//           }}
//         >
//           <div
//             style={{
//               color: COLORS.light,
//               fontSize: "13px",
//               marginBottom: "7px",
//             }}
//           >
//             دری کلن کارت
//           </div>

//           <div
//             style={{
//               color: COLORS.light,
//               fontSize: "20px",
//               fontWeight: "700",
//             }}
//           >
//             {formatNumber(report.threeCount)}
//           </div>

//           <div
//             style={{
//               color: COLORS.light,
//               fontSize: "12px",
//               marginTop: "5px",
//             }}
//           >
//             {formatMoney(report.threeAmount)} افغانۍ
//           </div>
//         </div>

//         <div
//           style={{
//             backgroundColor: COLORS.dark,
//             borderRadius: "6px",
//             padding: "14px",
//             textAlign: "right",
//           }}
//         >
//           <div
//             style={{
//               color: COLORS.light,
//               fontSize: "13px",
//               marginBottom: "7px",
//             }}
//           >
//             ټول کارتونه
//           </div>

//           <div
//             style={{
//               color: COLORS.light,
//               fontSize: "20px",
//               fontWeight: "700",
//             }}
//           >
//             {formatNumber(report.totalCount)}
//           </div>
//         </div>

//         <div
//           style={{
//             backgroundColor: COLORS.brown,
//             borderRadius: "6px",
//             padding: "14px",
//             textAlign: "right",
//           }}
//         >
//           <div
//             style={{
//               color: COLORS.light,
//               fontSize: "13px",
//               marginBottom: "7px",
//             }}
//           >
//             ټول مالي مبلغ
//           </div>

//           <div
//             style={{
//               color: COLORS.light,
//               fontSize: "20px",
//               fontWeight: "700",
//             }}
//           >
//             {formatMoney(report.totalAmount)}
//           </div>

//           <div
//             style={{
//               color: COLORS.light,
//               fontSize: "12px",
//               marginTop: "5px",
//             }}
//           >
//             افغانۍ
//           </div>
//         </div>
//       </div>

//       <div
//         style={{
//           backgroundColor: COLORS.dark,
//           borderRadius: "6px",
//           padding: "10px",
//         }}
//       >
//         <div
//           style={{
//             color: COLORS.light,
//             fontWeight: "700",
//             fontSize: "14px",
//             marginBottom: "8px",
//             textAlign: "right",
//           }}
//         >
//           د ورځې تفصیل
//         </div>

//         {loading ? (
//           <div
//             style={{
//               textAlign: "center",
//               padding: "25px",
//               color: COLORS.light,
//             }}
//           >
//             معلومات راټولیږي...
//           </div>
//         ) : report.daily.length === 0 ? (
//           <div
//             style={{
//               textAlign: "center",
//               padding: "25px",
//               color: COLORS.light,
//             }}
//           >
//             معلومات پیدا نه شول
//           </div>
//         ) : (
//           <div style={{ overflowX: "auto" }}>
//             <table
//               style={{
//                 width: "100%",
//                 borderCollapse: "collapse",
//                 color: COLORS.light,
//                 fontSize: "12px",
//                 direction: "rtl",
//                 textAlign: "right",
//               }}
//             >
//               <thead>
//                 <tr>
//                   <th
//                     style={{
//                       padding: "8px",
//                       textAlign: "right",
//                       color: COLORS.light,
//                     }}
//                   >
//                     نېټه
//                   </th>

//                   <th
//                     style={{
//                       padding: "8px",
//                       textAlign: "right",
//                       color: COLORS.light,
//                     }}
//                   >
//                     یو
//                   </th>

//                   <th
//                     style={{
//                       padding: "8px",
//                       textAlign: "right",
//                       color: COLORS.light,
//                     }}
//                   >
//                     د یو کلنی مبلغ
//                   </th>

//                   <th
//                     style={{
//                       padding: "8px",
//                       textAlign: "right",
//                       color: COLORS.light,
//                     }}
//                   >
//                     دری
//                   </th>

//                   <th
//                     style={{
//                       padding: "8px",
//                       textAlign: "right",
//                       color: COLORS.light,
//                     }}
//                   >
//                     د دری کلنی مبلغ
//                   </th>

//                   <th
//                     style={{
//                       padding: "8px",
//                       textAlign: "right",
//                       color: COLORS.light,
//                     }}
//                   >
//                     ټول
//                   </th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {report.daily.map((item, index) => (
//                   <tr key={index}>
//                     <td style={{ padding: "8px" }}>
//                       {item.date || "-"}
//                     </td>

//                     <td style={{ padding: "8px" }}>
//                       {formatNumber(item.oneCount)}
//                     </td>

//                     <td style={{ padding: "8px" }}>
//                       {formatMoney(item.oneAmount)}
//                     </td>

//                     <td style={{ padding: "8px" }}>
//                       {formatNumber(item.threeCount)}
//                     </td>

//                     <td style={{ padding: "8px" }}>
//                       {formatMoney(item.threeAmount)}
//                     </td>

//                     <td
//                       style={{
//                         padding: "8px",
//                         fontWeight: "700",
//                         color: COLORS.light,
//                       }}
//                     >
//                       {formatMoney(item.totalAmount)} افغانۍ
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useMemo, useState } from "react";
import DatePickerModule from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import DateObject from "react-date-object";
import api from "../services/api";

const DatePicker = DatePickerModule.default;

const COLORS = {
  dark: "#343148",
  light: "#cdc6bd",
  brown: "#583432",
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

const getCurrentPersianYear = () => {
  const today = new DateObject({
    calendar: persian,
    locale: persian_fa,
  });

  const year = Number(today.year);

  return Number.isFinite(year) ? year : 1405;
};

const formatMoney = (value) =>
  Number(value || 0).toLocaleString("en-US");

const formatNumber = (value) =>
  Number(value || 0).toLocaleString("en-US");

export default function FinanceReport() {
  const currentPersianYear = getCurrentPersianYear();

  const [date, setDate] = useState(null);
  const [month, setMonth] = useState("");
  const [year, setYear] = useState(currentPersianYear);
  const [kartDuration, setKartDuration] = useState("");

  const [report, setReport] = useState({
    oneCount: 0,
    threeCount: 0,
    oneAmount: 0,
    threeAmount: 0,
    totalCount: 0,
    totalAmount: 0,
    daily: [],
  });

  const [loading, setLoading] = useState(false);

  const toPersianDigits = (value) => {
    return String(value)
      .replace(/0/g, "۰")
      .replace(/1/g, "۱")
      .replace(/2/g, "۲")
      .replace(/3/g, "۳")
      .replace(/4/g, "۴")
      .replace(/5/g, "۵")
      .replace(/6/g, "۶")
      .replace(/7/g, "۷")
      .replace(/8/g, "۸")
      .replace(/9/g, "۹");
  };

  const years = useMemo(() => {
    const currentYear = Number(currentPersianYear);

    if (!Number.isFinite(currentYear)) return [];

    return Array.from(
      { length: currentYear - 1400 + 1 },
      (_, index) => currentYear - index
    );
  }, [currentPersianYear]);

  const fetchFinanceReport = async () => {
    try {
      setLoading(true);

      const params = {};

      if (date) {
        params.date = date.format("YYYY/MM/DD");
      }

      if (month) {
        params.month = Number(month);
      }

      if (Number.isFinite(Number(year))) {
        params.year = Number(year);
      }

      if (kartDuration) {
        params.kartDuration = Number(kartDuration);
      }

      const response = await api.get(
        "/report/finance-report",
        { params }
      );

      setReport({
        oneCount: response.data?.oneCount || 0,
        threeCount: response.data?.threeCount || 0,
        oneAmount: response.data?.oneAmount || 0,
        threeAmount: response.data?.threeAmount || 0,
        totalCount: response.data?.totalCount || 0,
        totalAmount: response.data?.totalAmount || 0,
        daily: Array.isArray(response.data?.daily)
          ? response.data.daily
          : [],
      });
    } catch (error) {
      console.error(
        "Finance report error:",
        error.response?.data || error
      );

      setReport({
        oneCount: 0,
        threeCount: 0,
        oneAmount: 0,
        threeAmount: 0,
        totalCount: 0,
        totalAmount: 0,
        daily: [],
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinanceReport();
  }, [date, month, year, kartDuration]);

  const clearFilters = () => {
    setDate(null);
    setMonth("");
    setYear(getCurrentPersianYear());
    setKartDuration("");
  };

  return (
    <div
      dir="rtl"
      style={{
        minHeight: "100vh",
        backgroundColor: COLORS.light,
        padding: "15px",
        color: COLORS.dark,
        textAlign: "right",
      }}
    >
      <div
        style={{
          backgroundColor: COLORS.dark,
          color: COLORS.light,
          borderRadius: "6px",
          padding: "10px 14px",
          marginBottom: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "8px",
        }}
      >
        <h5
          style={{
            margin: 0,
            fontWeight: "700",
            textAlign: "right",
          }}
        >
          مالي راپور
        </h5>

        <div
          style={{
            backgroundColor: COLORS.brown,
            color: COLORS.light,
            padding: "6px 12px",
            borderRadius: "5px",
            fontSize: "13px",
            fontWeight: "700",
          }}
        >
          ټول عاید: {formatMoney(report.totalAmount)} افغانۍ
        </div>
      </div>

      <div
        style={{
          backgroundColor: COLORS.dark,
          borderRadius: "6px",
          padding: "12px",
          marginBottom: "12px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "8px",
          }}
        >
          <div>
            <label
              style={{
                color: COLORS.light,
                fontSize: "12px",
                display: "block",
                marginBottom: "4px",
                textAlign: "right",
              }}
            >
              نېټه
            </label>

            <DatePicker
              value={date}
              onChange={(value) => {
                setDate(value);

                if (value) {
                  setMonth("");
                }
              }}
              calendar={persian}
              locale={afghanLocale}
              format="YYYY/MM/DD"
              placeholder="نېټه وټاکئ"
              inputClass="form-control"
              calendarPosition="bottom-right"
              style={{
                width: "100%",
                height: "34px",
                backgroundColor: COLORS.light,
                color: COLORS.dark,
                border: `1px solid ${COLORS.light}`,
                borderRadius: "4px",
                padding: "4px 8px",
                textAlign: "right",
                direction: "rtl",
              }}
            />
          </div>

          <div>
            <label
              style={{
                color: COLORS.light,
                fontSize: "12px",
                display: "block",
                marginBottom: "4px",
                textAlign: "right",
              }}
            >
              میاشت
            </label>

            <select
              value={month}
              onChange={(e) => {
                setMonth(e.target.value);

                if (e.target.value) {
                  setDate(null);
                }
              }}
              style={{
                width: "100%",
                height: "34px",
                border: `1px solid ${COLORS.light}`,
                borderRadius: "4px",
                padding: "4px 8px",
                backgroundColor: COLORS.light,
                color: COLORS.dark,
                textAlign: "right",
                direction: "rtl",
              }}
            >
              <option value="">ټولې میاشتې</option>

              {afghanMonths.map((monthItem) => (
                <option
                  key={monthItem.id}
                  value={monthItem.id}
                >
                  {monthItem.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              style={{
                color: COLORS.light,
                fontSize: "12px",
                display: "block",
                marginBottom: "4px",
                textAlign: "right",
              }}
            >
              کال
            </label>

            <select
              value={
                Number.isFinite(Number(year))
                  ? year
                  : ""
              }
              onChange={(e) => {
                const selectedYear = Number(e.target.value);

                if (Number.isFinite(selectedYear)) {
                  setYear(selectedYear);
                  setDate(null);
                }
              }}
              disabled={false}
              style={{
                width: "100%",
                height: "34px",
                border: `1px solid ${COLORS.light}`,
                borderRadius: "4px",
                padding: "4px 8px",
                backgroundColor: COLORS.light,
                color: COLORS.dark,
                opacity: month ? 1 : 0.6,
                textAlign: "right",
                direction: "rtl",
              }}
            >
              {years.map((yearItem) => (
                <option
                  key={`shamsi-year-${yearItem}`}
                  value={yearItem}
                >
                  {toPersianDigits(yearItem)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              style={{
                color: COLORS.light,
                fontSize: "12px",
                display: "block",
                marginBottom: "4px",
                textAlign: "right",
              }}
            >
              د کارت موده
            </label>

            <select
              value={kartDuration}
              onChange={(e) =>
                setKartDuration(e.target.value)
              }
              style={{
                width: "100%",
                height: "34px",
                border: `1px solid ${COLORS.light}`,
                borderRadius: "4px",
                padding: "4px 8px",
                backgroundColor: COLORS.light,
                color: COLORS.dark,
                textAlign: "right",
                direction: "rtl",
              }}
            >
              <option value="">ټول</option>

              <option value="1">
                یو - ۱۰۰۰ افغانۍ
              </option>

              <option value="2">
                دری - ۳۰۰۰ افغانۍ
              </option>
            </select>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
            }}
          >
            <button
              type="button"
              onClick={clearFilters}
              style={{
                width: "100%",
                height: "34px",
                border: "none",
                borderRadius: "4px",
                backgroundColor: COLORS.brown,
                color: COLORS.light,
                fontWeight: "700",
                fontSize: "12px",
                cursor: "pointer",
              }}
            >
               پاکول
            </button>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "10px",
          marginBottom: "12px",
        }}
      >
        <div
          style={{
            backgroundColor: COLORS.dark,
            borderRadius: "6px",
            padding: "14px",
            textAlign: "right",
          }}
        >
          <div
            style={{
              color: COLORS.light,
              fontSize: "13px",
              marginBottom: "7px",
            }}
          >
            یو کلن کارت
          </div>

          <div
            style={{
              color: COLORS.light,
              fontSize: "20px",
              fontWeight: "700",
            }}
          >
            {formatNumber(report.oneCount)}
          </div>

          <div
            style={{
              color: COLORS.light,
              fontSize: "12px",
              marginTop: "5px",
            }}
          >
            {formatMoney(report.oneAmount)} افغانۍ
          </div>
        </div>

        <div
          style={{
            backgroundColor: COLORS.dark,
            borderRadius: "6px",
            padding: "14px",
            textAlign: "right",
          }}
        >
          <div
            style={{
              color: COLORS.light,
              fontSize: "13px",
              marginBottom: "7px",
            }}
          >
            دری کلن کارت
          </div>

          <div
            style={{
              color: COLORS.light,
              fontSize: "20px",
              fontWeight: "700",
            }}
          >
            {formatNumber(report.threeCount)}
          </div>

          <div
            style={{
              color: COLORS.light,
              fontSize: "12px",
              marginTop: "5px",
            }}
          >
            {formatMoney(report.threeAmount)} افغانۍ
          </div>
        </div>

        <div
          style={{
            backgroundColor: COLORS.dark,
            borderRadius: "6px",
            padding: "14px",
            textAlign: "right",
          }}
        >
          <div
            style={{
              color: COLORS.light,
              fontSize: "13px",
              marginBottom: "7px",
            }}
          >
            ټول کارتونه
          </div>

          <div
            style={{
              color: COLORS.light,
              fontSize: "20px",
              fontWeight: "700",
            }}
          >
            {formatNumber(report.totalCount)}
          </div>
        </div>

        <div
          style={{
            backgroundColor: COLORS.brown,
            borderRadius: "6px",
            padding: "14px",
            textAlign: "right",
          }}
        >
          <div
            style={{
              color: COLORS.light,
              fontSize: "13px",
              marginBottom: "7px",
            }}
          >
            ټول مالي مبلغ
          </div>

          <div
            style={{
              color: COLORS.light,
              fontSize: "20px",
              fontWeight: "700",
            }}
          >
            {formatMoney(report.totalAmount)}
          </div>

          <div
            style={{
              color: COLORS.light,
              fontSize: "12px",
              marginTop: "5px",
            }}
          >
            افغانۍ
          </div>
        </div>
      </div>

      <div
        style={{
          backgroundColor: COLORS.dark,
          borderRadius: "6px",
          padding: "10px",
        }}
      >
        <div
          style={{
            color: COLORS.light,
            fontWeight: "700",
            fontSize: "14px",
            marginBottom: "8px",
            textAlign: "right",
          }}
        >
          د ورځې تفصیل
        </div>

        {loading ? (
          <div
            style={{
              textAlign: "center",
              padding: "25px",
              color: COLORS.light,
            }}
          >
            معلومات راټولیږي...
          </div>
        ) : report.daily.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "25px",
              color: COLORS.light,
            }}
          >
            معلومات پیدا نه شول
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                color: COLORS.light,
                fontSize: "12px",
                direction: "rtl",
                textAlign: "right",
              }}
            >
              <thead>
                <tr>
                  <th
                    style={{
                      padding: "8px",
                      textAlign: "right",
                      color: COLORS.light,
                    }}
                  >
                    نېټه
                  </th>

                  <th
                    style={{
                      padding: "8px",
                      textAlign: "right",
                      color: COLORS.light,
                    }}
                  >
                    یو
                  </th>

                  <th
                    style={{
                      padding: "8px",
                      textAlign: "right",
                      color: COLORS.light,
                    }}
                  >
                    د یو کلنی مبلغ
                  </th>

                  <th
                    style={{
                      padding: "8px",
                      textAlign: "right",
                      color: COLORS.light,
                    }}
                  >
                    دری
                  </th>

                  <th
                    style={{
                      padding: "8px",
                      textAlign: "right",
                      color: COLORS.light,
                    }}
                  >
                    د دری کلنی مبلغ
                  </th>

                  <th
                    style={{
                      padding: "8px",
                      textAlign: "right",
                      color: COLORS.light,
                    }}
                  >
                    ټول
                  </th>
                </tr>
              </thead>

              <tbody>
                {report.daily.map((item, index) => (
                  <tr key={index}>
                    <td style={{ padding: "8px" }}>
                      {item.date || "-"}
                    </td>

                    <td style={{ padding: "8px" }}>
                      {formatNumber(item.oneCount)}
                    </td>

                    <td style={{ padding: "8px" }}>
                      {formatMoney(item.oneAmount)}
                    </td>

                    <td style={{ padding: "8px" }}>
                      {formatNumber(item.threeCount)}
                    </td>

                    <td style={{ padding: "8px" }}>
                      {formatMoney(item.threeAmount)}
                    </td>

                    <td
                      style={{
                        padding: "8px",
                        fontWeight: "700",
                        color: COLORS.light,
                      }}
                    >
                      {formatMoney(item.totalAmount)} افغانۍ
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}