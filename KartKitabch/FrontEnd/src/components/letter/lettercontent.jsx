import React, { useEffect, useState } from "react";
import axios from "axios";
import DatePickerModule from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
const DatePicker = DatePickerModule.default;
export default function LetterContent() {

    const API = "http://localhost:5256/api/letter";
    const PERSON_API = "http://localhost:5256/api/person";
  const Vechile_API = "http://localhost:5256/api/vehicle";
    const PROVINCE_API = "http://localhost:5256/api/provincesandcities";

    const [letters, setLetters] = useState([]);
    const [persons, setPersons] = useState([]);
    const [vechile, setvechile] = useState([]);
    const [provinces, setProvinces] = useState([]);

    const [letter, setLetter] = useState({
        id: 0,
        plateNumber: "",
        reportDate: null,
        chasis: "",
        personId: "",
        vechileId: "",
        provincesAndCitiesId: "",
    });

    useEffect(() => {
        loadData();
    }, []);
    const loadData = async () => {

        const letters = await axios.get(API);
        const persons = await axios.get(PERSON_API);
        const vechiles = await axios.get(Vechile_API);
        const provinces = await axios.get(PROVINCE_API);
        console.log(provinces.data); // <-- add this

        setLetters(letters.data);
        setPersons(persons.data);
        setvechile(vechiles.data)
        setProvinces(provinces.data);

    };

    const saveLetter = async () => {
        try {

            const payload = {
                plateNumber: letter.plateNumber,
                dateS: letter.reportDate
                    ? letter.reportDate.format("YYYY/MM/DD")
                    : "",
                chasis: letter.chasis,
                personId: Number(letter.personId),
                provincesAndCitiesId: Number(letter.provincesAndCitiesId),
                vechileId: Number(letter.vechileId)
            };

            console.log(payload);

            if (letter.id === 0)
                await axios.post(API, payload);
            else
                await axios.put(`${API}/${letter.id}`, payload);

            loadData();

        } catch (err) {
            console.log(err.response?.data);
        }
    };
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
    const editLetter = (l) => {

        setLetter({
            id: l.id,
            plateNumber: l.plateNumber,
            reportDate: l.dateS || null,
            chasis: l.chasis,
            personId: l.personId,
            provincesAndCitiesId: l.provinceId,
            vechileId: l.vechileId,
        });

    };
    const deleteLetter = async (id) => {

        if (!window.confirm("Delete Letter?"))
            return;

        await axios.delete(`${API}/${id}`);

        loadData();
    };

    return (
        <div className="container-fluid px-3 px-md-4 mt-4">

            <h2 className="mb-4 text-primary">Letter Management</h2>

            <div className="card shadow-sm p-3 mb-4">

                <div className="row g-3">

                    {/* Plate Number */}
                    <div className="col-12 col-md-6 col-lg-4">
                        <label className="form-label">Plate Number</label>
                        <input
                            className="form-control"
                            value={letter.plateNumber}
                            onChange={(e) =>
                                setLetter({
                                    ...letter,
                                    plateNumber: e.target.value
                                })
                            }
                        />
                    </div>

                    {/* Province */}
                    <div className="col-12 col-md-6 col-lg-4">
                        <label className="form-label">Province</label>

                        <select
                            className="form-select"
                            value={letter.provincesAndCitiesId}
                            onChange={(e) =>
                                setLetter({
                                    ...letter,
                                    provincesAndCitiesId: Number(e.target.value)
                                })
                            }
                        >
                            <option value="">
                                Select Province
                            </option>

                            {provinces.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    {/* vECHIL */}
                    <div className="col-12 col-md-6 col-lg-4">
                        <label className="form-label">Vechile</label>

                        <select
                            className="form-select"
                            value={letter.vechileId}
                            onChange={(e) =>
                                setLetter({
                                    ...letter,
                                    vechileId: Number(e.target.value)
                                })
                            }
                        >
                            <option value="">
                                Select Vechile
                            </option>

                            {provinces.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.type}
                                </option>
                            ))}
                        </select>
                    </div>
                    {/* Chasis */}
                    <div className="col-12 col-md-6 col-lg-4">
                        <label className="form-label">Chasis</label>
                        <input
                            className="form-control"
                            value={letter.chasis}
                            onChange={(e) => {
                                const value = e.target.value;

                                // Allow only English letters, numbers, and special characters
                                if (/^[A-Za-z0-9!@#$%^&*()_+\-={}[\]:;"'<>,.?/\\|`~ ]*$/.test(value)) {
                                    setLetter({
                                        ...letter,
                                        chasis: value
                                    });
                                }
                            }}
                        />
                    </div>

                    {/* Person */}
                    <div className="col-12 col-md-6">
                        <label className="form-label">Person</label>

                        <select
                            className="form-select"
                            value={letter.personId}
                            onChange={(e) =>
                                setLetter({
                                    ...letter,
                                    personId: Number(e.target.value)
                                })
                            }
                        >
                            <option value="">Select Person</option>

                            {persons.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Date */}
                    <div className="col-12 col-md-6">
                        <label className="form-label d-block">Date</label>

                        <div className="w-100">
                            <DatePicker
                                value={letter.reportDate}
                                onChange={(value) =>
                                    setLetter({
                                        ...letter,
                                        reportDate: value
                                    })
                                }
                                calendar={persian}
                                locale={afghanLocale}
                                format="YYYY/MM/DD"
                                placeholder="Select Date"
                                inputClass="form-control w-100"
                                containerClassName="w-100"
                            />
                        </div>
                    </div>



                </div>

                <div className="mt-4 d-flex flex-column flex-sm-row gap-2">

                    <button
                        className={`btn ${letter.id === 0
                            ? "btn-success"
                            : "btn-warning"
                            }`}
                        onClick={saveLetter}
                    >
                        {letter.id === 0 ? "Save" : "Update"}
                    </button>

                    <button
                        className="btn btn-secondary"
                        onClick={() =>
                            setLetter({
                                id: 0,
                                plateNumber: "",
                                reportDate: null,
                                chasis: "",
                                personId: "",
                                provincesAndCitiesId: "",
                                vechileId:"",
                            })
                        }
                    >
                        Cancel
                    </button>

                </div>

            </div>

            <div className="table-responsive">

                <table className="table table-bordered table-hover align-middle">

                    <thead className="">
                        <tr>
                            <th>ID</th>
                            <th>Plate Number</th>
                            <th>Date</th>
                            <th>Chasis</th>
                            <th>Person</th>
                            <th style={{ minWidth: "150px" }}>Action</th>
                        </tr>
                    </thead>

                    <tbody>

                        {letters.map((l) => (

                            <tr key={l.id}>

                                <td>{l.id}</td>
                                <td>{l.plateNumber} {l.provincesAndCities?.name}</td>
                                <td>{l.dateS}</td>
                                <td>{l.chasis}</td>
                                <td>{l.person?.name}</td>
                                <td>
                                    <div className="d-flex flex-wrap gap-2">

                                        <button
                                            className="btn btn-warning btn-sm"
                                            onClick={() => editLetter(l)}
                                        >
                                            Edit
                                        </button>

                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => deleteLetter(l.id)}
                                        >
                                            Delete
                                        </button>

                                    </div>
                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>
    );
}