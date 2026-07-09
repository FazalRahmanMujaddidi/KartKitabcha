import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import DatePickerModule from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

const DatePicker = DatePickerModule.default;
const API_URL = "http://localhost:5256/api/report";
const COMPANY_API = "http://localhost:5256/api/company";
const CITY_API = "http://localhost:5256/api/ProvincesAndCities";
const VEHICLE_API = "http://localhost:5256/api/Vehicle";
const ENUM_DURATION = `${API_URL}/enums/kart-duration`;
const ENUM_KART = `${API_URL}/enums/type-of-kart`;
const ENUM_ACTIVITY = `${API_URL}/enums/type-of-activity`;
const ENUM_STATUS = `${API_URL}/enums/kart-status`;

export default function ReportPage() {
  const [reports, setReports] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [cities, setCities] = useState([]);

  const [durations, setDurations] = useState([]);
  const [kartTypes, setKartTypes] = useState([]);
  const [activities, setActivities] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [companyCities, setCompanyCities] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [vehicles, setVehicles] = useState([]);

  const [form, setForm] = useState({

    id: 0,
    companyId: 0,
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

    chasis: "",
    reportDate: null
  });
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
  // ---------------- FETCH ----------------
  const fetchReports = async () => {
    try {
      const res = await axios.get(API_URL);
      setReports(res.data);
    } catch {
      toast.error("Failed to load reports");
    }
  };

  const fetchDropdowns = async () => {
    const [c, city, d, k, a, s, v] = await Promise.all([
      axios.get(COMPANY_API),
      axios.get(CITY_API),
      axios.get(ENUM_DURATION),
      axios.get(ENUM_KART),
      axios.get(ENUM_ACTIVITY),
      axios.get(ENUM_STATUS),
      axios.get(VEHICLE_API)
    ]);

    setCompanies(c.data);
    setCities(city.data);
    setDurations(d.data);
    setKartTypes(k.data);
    setActivities(a.data);
    setStatuses(s.data);
    setVehicles(v.data);
  };

  useEffect(() => {
    fetchReports();
    fetchDropdowns();
  }, []);

  // ---------------- HANDLE ----------------
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (["serialNumber", "paletNumber", "chasis"].includes(name)) {
      setForm({
        ...form,
        [name]: value,
      });
    } else {
      setForm({
        ...form,
        [name]: value === "" ? null : Number(value),
      });
    }
  };
  const handleProvinceChange = (e) => {

    const provinceId = Number(e.target.value);

    setForm({
      ...form,
      provincesAndCitiesId: provinceId
    });

    setTimeout(() => {
      checkExistingTaxi({
        provinceId: provinceId,
        paletNumber: form.paletNumber
      });
    }, 300);
  };

  // ---------------- CREATE ----------------
  const create = async () => {
    try {

      const payload = {
        companyId: form.companyId,
        serialNumber: form.serialNumber,
        paletNumber: form.paletNumber,
        provincesAndCitiesId: form.provincesAndCitiesId,

        destinationCompanyId:
          form.destinationCompanyId || null,

        destinationProvinceId:
          form.destinationProvinceId || null,

        reportId:
          form.reportId || null,

        kartDuration:
          form.kartDuration || null,

        typeOfKart:
          form.typeOfKart || null,

        typeOfActivity:
          form.typeOfActivity || null,

        kartNewRenewLost:
          form.kartNewRenewLost || null,

        chasis: form.chasis,

        dateS: form.reportDate
          ? form.reportDate.format("YYYY/MM/DD"): null,
          vehicleId: form.vehicleId,
      };

      await axios.post(API_URL, payload);

      toast.success("Report created");

      fetchReports();
      reset();

    } catch (err) {
      console.log(err.response?.data);
      toast.error("Create failed");
    }
  };

  // ---------------- UPDATE ----------------
  const update = async () => {
    try {

      const payload = {
        ...form,
        DateS:
          form.reportDate
            ? form.reportDate.format("YYYY/MM/DD")
            : null
      };


      await axios.put(
        `${API_URL}/${form.id}`,
        payload
      );


      toast.success("Report updated");

      fetchReports();
      reset();

    } catch {

      toast.error("Update failed");

    }
  };

  // ---------------- DELETE ----------------
  const remove = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      toast.success("Deleted");

      fetchReports();
    } catch {
      toast.error("Delete failed");
    }
  };

  // ---------------- EDIT ----------------
  const edit = (r) => {

    setForm({
      id: r.id,
      companyId: r.companyId,
      serialNumber: r.serialNumber,
      paletNumber: r.paletNumber,
      provincesAndCitiesId: r.provincesAndCitiesId,
      kartDuration: r.kartDuration,
      typeOfKart: r.typeOfKart,
      typeOfActivity: r.typeOfActivity,
      kartNewRenewLost: r.kartNewRenewLost,
      chasis: r.chasis,
      vehicleId: r.vehicleId,
      reportDate: r.dateS || null
    });

    setIsEdit(true);

  };

  const reset = () => {

    setForm({

      id: 0,
      companyId: 0,
      serialNumber: "",
      paletNumber: "",
      provincesAndCitiesId: 0,
      kartDuration: 0,
      typeOfKart: 0,
      typeOfActivity: 0,
      kartNewRenewLost: 0,
      chasis: "",
      reportDate: null,
      vehicleId: 0
    });


    setIsEdit(false);

  };
  const getCompanyCities = async (companyId) => {

    if (!companyId) {
      setCompanyCities([]);
      return;
    }

    try {
      const res = await axios.get(
        `${COMPANY_API}/${companyId}/locations`
      );

      setCompanyCities(res.data);

    } catch (err) {
      console.log(err);
    }
  };
  const checkExistingTaxi = async () => {

    if (
      !form.paletNumber ||
      !form.provincesAndCitiesId
    ) {
      return;
    }

    try {

      const res = await axios.get(
        `${API_URL}/check-existing`,
        {
          params: {
            paletNumber: form.paletNumber,
            provincesAndCitiesId: form.provincesAndCitiesId
          }
        }
      );


      if (res.data.exists) {

        toast.warning(
          res.data.message
        );

      }

    } catch (err) {

      console.log(err);

    }

  };
  // ---------------- UI ----------------
  return (
    <div className="container mt-4">

      <h2 className="text-primary mb-4">
        📄 Report Management
      </h2>

      {/* FORM */}
      <div className="card shadow-sm p-3 mb-4">
        <div className="row g-2">

          {/* COMPANY */}
          <div className="col-md-3">
            <select
              className="form-select"
              name="companyId"
              value={form.companyId}
              onChange={(e) => {
                handleChange(e);
                getCompanyCities(Number(e.target.value));
              }}
            >
              <option value={0}>Select Company</option>

              {companies.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* CITY */}
          <div className="col-md-3">
            <select
              className="form-select"
              name="provincesAndCitiesId"
              value={form.provincesAndCitiesId}
              onChange={handleProvinceChange}
            >
              <option value={0}>Select Province/City</option>

              {cities.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}

            </select>
          </div>

          <div className="col-md-3">
            <input
              className="form-control"
              name="serialNumber"
              placeholder="Serial Number"
              value={form.serialNumber}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-3">
            <input
              className="form-control"
              name="paletNumber"
              placeholder="Palet Number"
              value={form.paletNumber}
              onChange={(e) => {
                handleChange(e);
              }}
              onBlur={checkExistingTaxi}
            />
          </div>

          <div className="col-md-3">
            <input
              className="form-control"
              name="chasis"
              placeholder="Chasis"
              value={form.chasis}
              onChange={handleChange}
            />
          </div>

          {/* ENUMS */}
          <div className="col-md-3">
            <select className="form-select" name="kartDuration" value={form.kartDuration} onChange={handleChange}>
              <option value={0}>Duration</option>
              {durations.map(x => (
                <option key={x.id} value={x.id}>{x.name}</option>
              ))}
            </select>
          </div>

          <div className="col-md-3">
            <select className="form-select" name="typeOfKart" value={form.typeOfKart} onChange={handleChange}>
              <option value={0}>Type Kart</option>
              {kartTypes.map(x => (
                <option key={x.id} value={x.id}>{x.name}</option>
              ))}
            </select>
          </div>

          <div className="col-md-3">
            <select className="form-select" name="typeOfActivity" value={form.typeOfActivity} onChange={handleChange}>
              <option value={0}>Activity</option>
              {activities.map(x => (
                <option key={x.id} value={x.id}>{x.name}</option>
              ))}
            </select>
          </div>

          <div className="col-md-3">
            <select className="form-select" name="kartNewRenewLost" value={form.kartNewRenewLost} onChange={handleChange}>
              <option value={0}>Status</option>
              {statuses.map(x => (
                <option key={x.id} value={x.id}>{x.name}</option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
            {/* <select
              className="form-select"
              name="destinationProvinceId"
              value={form.destinationProvinceId}
              onChange={handleChange}
            >
              <option value={0}>Taxi Destination</option>

              {cities.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select> */}
            <select
              className="form-select"
              name="destinationProvinceId"
              value={form.destinationProvinceId}
              onChange={handleChange}
            >

              <option value={0}>
                Taxi Destination
              </option>

              {companyCities.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}

            </select>
          </div>
          <div className="col-md-3">
            <select
              className="form-select"
              name="vehicleId"
              value={form.vehicleId}
              onChange={handleChange} >
              <option value={0}>
                Select Vehicle
              </option>
              {vehicles.map(v => (
                <option
                  key={v.id}
                  value={v.id} >
                  {v.type}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
            <DatePicker
              value={form.reportDate}
              onChange={(value) =>
                setForm({
                  ...form,
                  reportDate: value
                })
              }

              calendar={persian}

              locale={afghanLocale}

              format="YYYY/MM/DD"

              placeholder="Select Date"

              inputClass="form-control"

            />


          </div>
          <div className="col-md-3 d-grid">
            {isEdit ? (
              <button className="btn btn-warning" onClick={update}>
                Update
              </button>
            ) : (
              <button className="btn btn-success" onClick={create}>
                Create
              </button>
            )}
          </div>

          <div className="col-md-3 d-grid">
            <button className="btn btn-secondary" onClick={reset}>
              Reset
            </button>
          </div>

        </div>
      </div>

      {/* TABLE */}
      <div className="card shadow-sm">
        <div className="card-body">

          <table className="table table-bordered table-hover">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Company</th>
                <th>Serial</th>
                <th>Palet Number</th>
                <th>Province</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {reports.map(r => (
                <tr key={r.id}>

                  <td>{r.id}</td>

                  <td>
                    {r.company?.name}
                  </td>
                  <td>
                    {r.serialNumber}
                  </td>

                  <td>
                    {r.paletNumber}
                  </td>
                  <td>
                    {r.provincesAndCities?.name}
                  </td>
                  <td>

                    <button
                      className="btn btn-primary btn-sm me-2"
                      onClick={() => edit(r)}
                    >
                      Edit
                    </button>


                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => remove(r.id)}
                    >
                      Delete
                    </button>

                  </td>

                </tr>
              ))}
            </tbody>

          </table>

        </div>
      </div>

    </div>
  );
}