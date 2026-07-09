import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

const API_URL = "http://localhost:5256/api/company";
const ENUM_TYPE_API = "http://localhost:5256/api/company/enums/company-type";
const ENUM_TON_API = "http://localhost:5256/api/company/enums/company-ton";


export default function CompanyPage() {
  const [companies, setCompanies] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [companyTypes, setCompanyTypes] = useState([]);
  const [companyTons, setCompanyTons] = useState([]);
  useEffect(() => {
    axios.get(ENUM_TYPE_API).then(res => setCompanyTypes(res.data));
    axios.get(ENUM_TON_API).then(res => setCompanyTons(res.data));
  }, []);
  const [form, setForm] = useState({
    id: 0,
    name: "",
    myProperty: 0,
    companyTon: 0,
  });

  const [isEdit, setIsEdit] = useState(false);

  // GET ALL
  const fetchCompanies = async () => {
    try {
      const res = await axios.get(API_URL);
      setCompanies(res.data);
    } catch (err) {
      toast.error("Failed to load companies.");
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
          ? (value === "" ? "" : Number(value))
          : value,
    }));
  };


  // CREATE
  const createCompany = async () => {
    if (form.name.trim() === "") {
      toast.error("Company name is required.");
      return;
    }

    if (form.myProperty === 0) {
      toast.error("Please select a company type.");
      return;
    }

    try {
      await axios.post(API_URL, form);
      toast.success("Company created successfully.");
      fetchCompanies();
      resetForm();
    } catch (err) {
      toast.error("Failed to create company.");
      console.error(err);
    }
  };

  const updateCompany = async () => {
    try {
      await axios.put(`${API_URL}/${form.id}`, form);

      toast.success("Company updated successfully.");

      fetchCompanies();
      resetForm();
    } catch (err) {
      toast.error("Failed to update company.");
      console.error(err);
    }
  };

  // DELETE
  const deleteCompany = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    fetchCompanies();
  };

  const editCompany = (c) => {
    setForm(c);
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
      toast.error("Failed to load details");
    }
  };
  const getVehicleEmoji = (types) => {

  if (!types || types.length === 0)
    return "🚕";

  if (types.includes("Taxi"))
    return "🚕";

  if (types.includes("Truck"))
    return "🚛";

  if (types.includes("Bus"))
    return "🚌";

  return "🚕";
};
  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-primary">Company Management</h2>

      {/* FORM */}
      <div className="card p-3 mb-4 shadow-sm">
        <div className="row g-2">

          <div className="col-md-4">
            <input
              className="form-control"
              name="name"
              placeholder="Company Name"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-3">
            <select
              className="form-select"
              name="myProperty"
              value={form.myProperty}
              onChange={handleChange}
            >
              <option value="">Select Type</option>
              {companyTypes.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-3">
            <select
              className="form-select"
              name="companyTon"
              value={form.companyTon}
              onChange={handleChange}
            >
              <option value="">Select ton</option>

              {companyTons.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-2 d-grid">
            {isEdit ? (
              <button className="btn btn-warning" onClick={updateCompany}>
                Update
              </button>
            ) : (
              <button className="btn btn-success" onClick={createCompany}>
                Create
              </button>
            )}
          </div>

        </div>

        <button className="btn btn-secondary mt-3" onClick={resetForm}>
          Reset
        </button>
      </div>

      {/* TABLE */}
      <div className="card shadow-sm">
        <div className="card-body">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Type</th>
                <th>Ton</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {companies.map((c) => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>{c.name}</td>
                  <td>
                    {companyTypes.find(t => t.id === c.myProperty)?.name || c.myProperty}
                  </td>

                  <td>
                    {companyTons.find(t => t.id === c.companyTon)?.name || c.companyTon}
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-primary me-2"
                      onClick={() => editCompany(c)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-info btn-sm me-2"
                      onClick={() => getDetails(c.id)}
                    >
                      Details
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => deleteCompany(c.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>


          <hr />
{selectedItem && (
  <>

    {selectedItem.locations?.length > 0 ? (

      <div className="row g-3">

        {selectedItem.locations.map((l) => (
          <div key={l.id} className="col-12 col-md-6 col-lg-4">

            <div className="card h-100 border-0 shadow-sm">

              <div className="card-body">

                <div className="fw-bold text-primary mb-2">
                  📍
                  {getVehicleEmoji(l.vehicleTypes)}  {l.cityName}
                </div>

<div className="text-success fw-bold">
  {getVehicleEmoji(l.vehicleTypes)} : {l.destinationCount}
</div>

              </div>

            </div>

          </div>
        ))}

      </div>

    ) : null}


{selectedItem.generalCount > 0 && (
  <div className="col-12 col-md-6 col-lg-4 mt-3">
    <div className="card border-0 shadow-sm h-100">
      <div className="card-body d-flex align-items-center">

        <div className="fs-2 text-primary me-3">
         {getVehicleEmoji(selectedItem.generalVehicleTypes)}
        </div>

        <div>
          <div className="text-muted small">
            General Destination
          </div>

          <div className="fw-bold text-success">
            {selectedItem.generalCount}
          </div>
        </div>

      </div>
    </div>
  </div>
)}


    {
      (!selectedItem.locations || selectedItem.locations.length === 0)
      && selectedItem.generalCount === 0
      &&
      (
        <div className="alert alert-warning">
          No locations found
        </div>
      )
    }

  </>
)}
        </div>
      </div>
    </div>
  );
}