import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = "http://localhost:5256/api/Vehicle";

export default function VehiclePage() {
  const [vehicles, setVehicles] = useState([]);
  const [isEdit, setIsEdit] = useState(false);

  const [form, setForm] = useState({
    id: 0,
    type: "",
  });

  const fetchVehicles = async () => {
    try {
      const res = await axios.get(API_URL);
      setVehicles(res.data);
    } catch {
      toast.error("Failed to load vehicles");
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const createVehicle = async () => {
    if (!form.type.trim()) {
      toast.warning("Vehicle type is required");
      return;
    }

    try {
      await axios.post(API_URL, form);
      toast.success("Vehicle created");

      fetchVehicles();
      resetForm();
    } catch {
      toast.error("Failed to create");
    }
  };

  const updateVehicle = async () => {
    try {
      await axios.put(`${API_URL}/${form.id}`, form);

      toast.success("Vehicle updated");

      fetchVehicles();
      resetForm();
    } catch {
      toast.error("Update failed");
    }
  };

  const deleteVehicle = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);

      toast.success("Vehicle deleted");

      fetchVehicles();
    } catch {
      toast.error("Delete failed");
    }
  };

  const editVehicle = (v) => {
    setForm(v);
    setIsEdit(true);
  };

  const resetForm = () => {
    setForm({
      id: 0,
      type: "",
    });

    setIsEdit(false);
  };

  return (
    <div className="container mt-4">

      <h2 className="text-primary mb-4">
        Vehicle Management
      </h2>

      <div className="card shadow-sm mb-4">
        <div className="card-header bg-primary text-white">
          Vehicle Form
        </div>

        <div className="card-body">
          <div className="row">

            <div className="col-md-9">
              <input
                className="form-control"
                name="type"
                placeholder="Vehicle Type"
                value={form.type}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-3 d-grid">
              {isEdit ? (
                <button
                  className="btn btn-warning"
                  onClick={updateVehicle}
                >
                  Update
                </button>
              ) : (
                <button
                  className="btn btn-success"
                  onClick={createVehicle}
                >
                  Create
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
      </div>

      <div className="card shadow-sm">
        <div className="card-header bg-dark text-white">
          Vehicle List
        </div>

        <div className="card-body">

          <table className="table table-bordered table-hover">
            <thead className="table-primary">
              <tr>
                <th>ID</th>
                <th>Vehicle Type</th>
                <th width="180">Actions</th>
              </tr>
            </thead>

            <tbody>
              {vehicles.map((v) => (
                <tr key={v.id}>
                  <td>{v.id}</td>
                  <td>{v.type}</td>

                  <td>
                    <button
                      className="btn btn-primary btn-sm me-2"
                      onClick={() => editVehicle(v)}
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteVehicle(v.id)}
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