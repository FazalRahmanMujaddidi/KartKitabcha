import { useEffect, useState } from "react";
import axios from "axios";

export default function SenderPage() {
    const API = "http://localhost:5256/api/Sender";
    const emptySender = {
        id: 0,
        senderTitle: "",
        senderName: ""
    };
    const [sender, setSender] = useState(emptySender);
    const [senders, setSenders] = useState([]);
    useEffect(() => {
        loadData();
    }, []);
    const loadData = async () => {
        const res = await axios.get(API);
        setSenders(res.data);
    };
    const saveSender = async () => {
        if (sender.id === 0)
            await axios.post(API, sender);
        else
            await axios.put(`${API}/${sender.id}`, sender);
        setSender(emptySender);
        loadData();
    };
    const editSender = (s) => {
        setSender({
            id: s.id,
            senderTitle: s.senderTitle,
            senderName: s.senderName
        });
    };
    const deleteSender = async (id) => {
        if (!window.confirm("Delete this sender?"))
            return;
        await axios.delete(`${API}/${id}`);
        loadData();
    };
    const cancel = () => {
        setSender(emptySender);
    };
    return (
        <div className="container mt-4">
            <div className="card p-4">
                <h4 className="mb-3">
                    Sender Management
                </h4>
                <div className="row g-3">
                    <div className="col-md-6">
                        <label className="form-label">
                            Sender Title
                        </label>
                        <input
                            className="form-control"
                            value={sender.senderTitle}
                            onChange={(e) =>
                                setSender({
                                    ...sender,
                                    senderTitle: e.target.value
                                })
                            }
                        />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">
                            Sender Name
                        </label>
                        <input
                            className="form-control"
                            value={sender.senderName}
                            onChange={(e) =>
                                setSender({
                                    ...sender,
                                    senderName: e.target.value
                                })
                            }
                        />
                    </div>
                    <div className="col-md-3">
                        <button
                            className={`btn ${sender.id === 0
                                ? "btn-success"
                                : "btn-warning"} w-100`}
                            onClick={saveSender}
                        >
                            {sender.id === 0 ? "Save" : "Update"}
                        </button>
                    </div>
                    <div className="col-md-3">
                        <button
                            className="btn btn-secondary w-100"
                            onClick={cancel}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
            <table className="table table-bordered table-striped mt-4">
                <thead className="table-dark">
                    <tr>
                        <th>Sender Title</th>
                        <th>Sender Name</th>
                        <th width="170">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {senders.map(s => (
                        <tr key={s.id}>
                            <td>{s.senderTitle}</td>
                            <td>{s.senderName}</td>
                            <td>
                                <button
                                    className="btn btn-warning btn-sm me-2"
                                    onClick={() => editSender(s)}
                                >
                                    Edit
                                </button>

                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => deleteSender(s.id)}
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