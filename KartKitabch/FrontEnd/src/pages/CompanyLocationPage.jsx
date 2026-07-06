import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = "http://localhost:5256/api/CompanyLocation";
const COMPANY_API = "http://localhost:5256/api/company";
const CITY_API = "http://localhost:5256/api/ProvincesAndCities";

export default function CompanyLocationPage() {
  const [items, setItems] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [cities, setCities] = useState([]);

  const [form, setForm] = useState({
    id: 0,
    companyId: "",
    provincesAndCitiesId: "",
  });

  const [isEdit, setIsEdit] = useState(false);

  // GET ALL
  const fetchAll = async () => {
    try {
      const res = await axios.get(API_URL);
      setItems(res.data);
    } catch {
      toast.error("Failed to load locations");
    }
  };

  // Load dropdowns
  const fetchDropdowns = async () => {
    try {
      const companiesRes = await axios.get(COMPANY_API);
      const citiesRes = await axios.get(CITY_API);

      setCompanies(companiesRes.data);
      setCities(citiesRes.data);
    } catch {
      toast.error("Failed to load dropdowns");
    }
  };

  useEffect(() => {
    fetchAll();
    fetchDropdowns();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value === "" ? "" : parseInt(value),
    });
  };

  // CREATE
  const create = async () => {
    try {
      await axios.post(API_URL, {
        companyId: form.companyId,
        provincesAndCitiesId: form.provincesAndCitiesId,
      });

      toast.success("Location added");
      fetchAll();
      resetForm();
    } catch {
      toast.error("Failed to add");
    }
  };

  // UPDATE
  const update = async () => {
    try {
      await axios.put(`${API_URL}/${form.id}`, {
        companyId: form.companyId,
        provincesAndCitiesId: form.provincesAndCitiesId,
      });

      toast.success("Location updated");
      fetchAll();
      resetForm();
    } catch {
      toast.error("Update failed");
    }
  };

  // DELETE
  const deleteItem = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      toast.success("Deleted");
      fetchAll();
    } catch {
      toast.error("Delete failed");
    }
  };

  // EDIT
const editItem = (item) => {
  setForm({
    id: item.id,
    companyId: item.company?.id,   // ✅ FIX
    provincesAndCitiesId: item.provincesAndCities?.id, // ✅ FIX
  });

  setIsEdit(true);
};

  // RESET
  const resetForm = () => {
    setForm({
      id: 0,
      companyId: "",
      provincesAndCitiesId: "",
    });

    setIsEdit(false);
  };

  return (
    <div className="container mt-4">
      <h2>Company Locations</h2>

      <div className="card p-3 mb-3">
        <div className="row">

          <div className="col-md-5">
            <select
              className="form-select"
              name="companyId"
              value={form.companyId}
              onChange={handleChange}
            >
              <option value="">Select Company</option>

              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-5">
            <select
              className="form-select"
              name="provincesAndCitiesId"
              value={form.provincesAndCitiesId}
              onChange={handleChange}
            >
              <option value="">Select City</option>

              {cities.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-2">
            {isEdit ? (
              <button
                className="btn btn-warning w-100"
                onClick={update}
              >
                Update
              </button>
            ) : (
              <button
                className="btn btn-success w-100"
                onClick={create}
              >
                Add
              </button>
            )}
          </div>

        </div>

        <button
          className="btn btn-secondary mt-3"
          onClick={resetForm}
        >
          Reset
        </button>
      </div>

      <table className="table table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Company</th>
            <th>City</th>
            <th width="170">Action</th>
          </tr>
        </thead>

        <tbody>
          {items.map((x) => (
            <tr key={x.id}>
              <td>{x.id}</td>
              <td>{x.company?.name}</td>
              <td>{x.provincesAndCities?.name}</td>

              <td>
                <button
                  className="btn btn-primary btn-sm me-2"
                  onClick={() => editItem(x)}
                >
                  Edit
                </button>

                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => deleteItem(x.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}