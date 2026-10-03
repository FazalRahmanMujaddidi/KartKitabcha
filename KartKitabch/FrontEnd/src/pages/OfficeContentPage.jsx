import React, { useEffect, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import axios from "axios";

export default function OfficeContentPage() {

    const API = "http://localhost:5256/api/OfficeContent";
    const [officeContents, setOfficeContents] = useState([]);
    const emptyOfficeContent = {
        id: 0,
        office: "",
        typeLetter: "",
        content: "",
    };
    const [officeContent, setOfficeContent] = useState(emptyOfficeContent);
    useEffect(() => {
        loadData();
    }, []);
    const loadData = async () => {
        const office = await axios.get(API);
        setOfficeContents(office.data);
    };
    const saveOfficeContent = async () => {
        if (officeContent.id === 0) {
            await axios.post(API, officeContent);
        } else {
            await axios.put(
                `${API}/${officeContent.id}`,
                officeContent
            );
        }
        await loadData();
        setOfficeContent(emptyOfficeContent);
    };
    const editOfficeContent = (o) => {
        setOfficeContent({
            id: o.id,
            office: o.office,
            typeLetter: o.typeLetter,
            content: o.content,
        });
    };
    const deleteOfficeContent = async (id) => {
        if (!window.confirm("Delete?"))
            return;
        await axios.delete(`${API}/${id}`);
        loadData();
    };
    const cancelOfficeContent = () => {
        setOfficeContent(emptyOfficeContent);
    };
    return (
        <div className="container mt-4">
            <div className="card p-3">
                <div className="row g-3">
                    <div className="col-md-4">
                        <label>Office</label>
                        <input
                            className="form-control"
                            value={officeContent.office}
                            onChange={(e) =>
                                setOfficeContent({
                                    ...officeContent,
                                    office: e.target.value
                                })
                            }
                        />
                    </div>
                    <div className="col-md-4">
                        <label>Letter Type</label>
                        <input
                            className="form-control"
                            value={officeContent.typeLetter}
                            onChange={(e) =>
                                setOfficeContent({
                                    ...officeContent,
                                    typeLetter: e.target.value
                                })
                            }
                        />
                    </div>
                    <div className="col-md-12">
                        <label className="form-label">
                            Content
                        </label>
                        <Editor
                            apiKey="7uiy2a670lsrc22jx95fjbegivl9zirxewq2hm6mfn3pjc6l"
                            value={officeContent.content}
                            onEditorChange={(content) =>
                                setOfficeContent({
                                    ...officeContent,
                                    content: content
                                })
                            }
                            init={{
                                height: 350,
                                menubar: true,
                                branding: false,
                                plugins: [
                                    "advlist",
                                    "autolink",
                                    "lists",
                                    "link",
                                    "image",
                                    "charmap",
                                    "preview",
                                    "anchor",
                                    "searchreplace",
                                    "visualblocks",
                                    "code",
                                    "fullscreen",
                                    "insertdatetime",
                                    "media",
                                    "table",
                                    "help",
                                    "wordcount"
                                ],
                                toolbar:
                                    "undo redo | blocks | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist | link image table | code fullscreen"
                            }}
                        />
                    </div>
                    <div className="col-md-4">
                        <div className="row mt-3">
                            <div className="col-md-6">
                                <button
                                    className={`btn ${
                                        officeContent.id === 0
                                        ? "btn-success"
                                        : "btn-warning"
                                    } form-control`}
                                    onClick={saveOfficeContent}
                                >
                                    {
                                        officeContent.id === 0
                                        ? "Save"
                                        : "Update"
                                    }
                                </button>
                            </div>
                            <div className="col-md-6">
                                <button
                                    className="btn btn-secondary form-control"
                                    onClick={cancelOfficeContent}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <table className="table table-bordered mt-4">
                <thead>
                    <tr>
                        <th>Office</th>
                        <th>Letter Type</th>
                        <th>Content</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        officeContents.map(o => (
                            <tr key={o.id}>
                                <td>
                                    {o.office}
                                </td>
                                <td>
                                    {o.typeLetter}
                                </td>
                                <td
                                    dangerouslySetInnerHTML={{
                                        __html: o.content
                                    }}
                                ></td>
                                <td>
                                <button
                                        className="btn btn-warning btn-sm me-2"
                                        onClick={() =>
                                            editOfficeContent(o)
                                        }
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() =>
                                            deleteOfficeContent(o.id)
                                        }
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    );
}