import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5256/api/company";

export default function CompanyPage() {
  const [companies, setCompanies] = useState([]);
  const [form, setForm] = useState({
    id: 0,
    name: "",
    myProperty: 0,
    companyTon: 0,
  });

  const [isEdit, setIsEdit] = useState(false);

  // GET ALL
  const fetchCompanies = async () => {
    const res = await axios.get(API_URL);
    setCompanies(res.data);
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // CREATE
  const createCompany = async () => {
    await axios.post(API_URL, form);
    fetchCompanies();
    resetForm();
  };

  // UPDATE
  const updateCompany = async () => {
    await axios.put(`${API_URL}/${form.id}`, form);
    fetchCompanies();
    resetForm();
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
              <option value={0}>Taxi</option>
              <option value={1}>Bus</option>
              <option value={2}>BarBari</option>
            </select>
          </div>

          <div className="col-md-3">
            <select
              className="form-select"
              name="companyTon"
              value={form.companyTon}
              onChange={handleChange}
            >
              <option value={0}>Medium Ton</option>
              <option value={1}>Big Ton</option>
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
                  <td>{c.myProperty}</td>
                  <td>{c.companyTon}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-primary me-2"
                      onClick={() => editCompany(c)}
                    >
                      Edit
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
        </div>
      </div>
    </div>
  );
}