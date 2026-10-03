import React, { useEffect, useState } from "react";
import axios from "axios";

export default function PersonPage() {

    const API = "http://localhost:5256/api/person";

    const [persons, setPersons] = useState([]);

    const [person, setPerson] = useState({
        id: 0,
        name: "",
        fatherName: "",
        nic: ""
    });

    useEffect(() => {
        getPersons();
    }, []);

    const getPersons = async () => {
        try {
            const res = await axios.get(API);
            setPersons(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    const savePerson = async () => {
        try {

            if (person.id === 0) {
                await axios.post(API, person);
            } else {
                await axios.put(`${API}/${person.id}`, person);
            }

            setPerson({
                id: 0,
                name: "",
                fatherName: "",
                nic: ""
            });

            getPersons();

        } catch (err) {
            console.log(err.response?.data || err);
        }
    };

    const editPerson = (p) => {
        setPerson({
            id: p.id,
            name: p.name,
            fatherName: p.fatherName,
            nic: p.nic
        });
    };

    const removePerson = async (id) => {

        if (!window.confirm("Delete this person?"))
            return;

        try {
            await axios.delete(`${API}/${id}`);
            getPersons();
        } catch (err) {
            console.log(err);
        }
    };

    const cancelEdit = () => {
        setPerson({
            id: 0,
            name: "",
            fatherName: "",
            nic: ""
        });
    };

    return (
        <div className="container mt-4">

            <h2 className="mb-4">Persons</h2>

            <div className="card p-3 mb-4">

                <div className="row">

                    <div className="col-md-4 mb-3">
                        <label className="form-label">Name</label>
                        <input
                            className="form-control"
                            value={person.name}
                            onChange={(e) =>
                                setPerson({ ...person, name: e.target.value })
                            }
                        />
                    </div>

                    <div className="col-md-4 mb-3">
                        <label className="form-label">Father Name</label>
                        <input
                            className="form-control"
                            value={person.fatherName}
                            onChange={(e) =>
                                setPerson({
                                    ...person,
                                    fatherName: e.target.value
                                })
                            }
                        />
                    </div>

                    <div className="col-md-4 mb-3">
                        <label className="form-label">NIC</label>
                        <input
                            className="form-control"
                            value={person.nic}
                            onChange={(e) =>
                                setPerson({
                                    ...person,
                                    nic: e.target.value
                                })
                            }
                        />
                    </div>

                </div>

                <div>

                    <button
                        className={`btn ${person.id === 0 ? "btn-success" : "btn-warning"} me-2`}
                        onClick={savePerson}
                    >
                        {person.id === 0 ? "Save" : "Update"}
                    </button>

                    <button
                        className="btn btn-secondary"
                        onClick={cancelEdit}
                    >
                        Cancel
                    </button>

                </div>

            </div>

            <table className="table table-bordered table-striped">

                <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Father Name</th>
                        <th>NIC</th>
                        <th width="180">Actions</th>
                    </tr>
                </thead>

                <tbody>

                    {persons.map((p) => (

                        <tr key={p.id}>
                            <td>{p.id}</td>
                            <td>{p.name}</td>
                            <td>{p.fatherName}</td>
                            <td>{p.nic}</td>

                            <td>

                                <button
                                    className="btn btn-warning btn-sm me-2"
                                    onClick={() => editPerson(p)}
                                >
                                    Edit
                                </button>

                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => removePerson(p.id)}
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