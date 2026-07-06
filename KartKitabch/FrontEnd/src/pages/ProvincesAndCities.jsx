import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = "http://localhost:5256/api/ProvincesAndCities";

export default function ProvincesAndCitiesPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    id: 0,
    name: "",
  });

  const [isEdit, setIsEdit] = useState(false);

  // GET ALL
  const fetchData = async () => {
    try {
      const res = await axios.get(API_URL);
      setItems(res.data);
    } catch (err) {
      toast.error("Failed to load data");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // CREATE
  const createItem = async () => {
    try {
      await axios.post(API_URL, form);

      toast.success("Created successfully");

      fetchData();
      resetForm();
    } catch (err) {
      toast.error("Create failed");
    }
  };

  // UPDATE
  const updateItem = async () => {
    try {
      await axios.put(`${API_URL}/${form.id}`, form);

      toast.success("Updated successfully");

      fetchData();
      resetForm();
    } catch (err) {
      toast.error("Update failed");
    }
  };

  // DELETE
  const deleteItem = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);

      toast.success("Deleted successfully");

      fetchData();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const editItem = (item) => {
    setForm(item);
    setIsEdit(true);
  };

  const resetForm = () => {
    setForm({
      id: 0,
      name: "",
    });
    setIsEdit(false);
  };

  return (
    <div className="container mt-4">
      <h2>Provinces & Cities</h2>

      <div className="card p-3 mb-3">
        <div className="row">
          <div className="col-md-10">
            <input
              className="form-control"
              name="name"
              value={form.name}
              placeholder="Province or City"
              onChange={handleChange}
            />
          </div>

          <div className="col-md-2">
            {isEdit ? (
              <button className="btn btn-warning w-100" onClick={updateItem}>
                Update
              </button>
            ) : (
              <button className="btn btn-success w-100" onClick={createItem}>
                Create
              </button>
            )}
          </div>
        </div>
      </div>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th width="180">Action</th>
          </tr>
        </thead>

        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>
                <button
                  className="btn btn-primary btn-sm me-2"
                  onClick={() => editItem(item)}
                >
                  Edit
                </button>

                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => deleteItem(item.id)}
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