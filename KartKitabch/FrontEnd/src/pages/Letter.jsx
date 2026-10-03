

import React, { useEffect, useState } from "react";
import axios from "axios";
// import LetterHeader from "../components/letter/letterheader";
import LetterBody from "../components/letter/letterbody";
import DocumentEditor from "../components/letter/DocumentEditor";
import DatePickerModule from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { useEditor, EditorContent } from "@tiptap/react";

import StarterKit from "@tiptap/starter-kit";
import { Image } from "@tiptap/extension-image";
import { TextAlign } from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
const DatePicker = DatePickerModule.default;

const API = "http://localhost:5256/api/letter";
const PERSON_API = "http://localhost:5256/api/person";
const PROVINCE_API = "http://localhost:5256/api/provincesandcities";
const OFFICECONTENT_API = "http://localhost:5256/api/officecontent";
const Vechile_API = "http://localhost:5256/api/vehicle";
const Sender_API = "http://localhost:5256/api/sender";



export default function LetterPage() {

    // =======================
    // States
    // =======================

    const [persons, setPersons] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [vechile, setvechile] = useState([]);
    const [officeContents, setOfficeContents] = useState([]);
    const [sender, setsender] = useState([]);
    const [person, setPerson] = useState({
        id: 0,
        name: "",
        fatherName: "",
        nic: ""
    });

    const [letter, setLetter] = useState({
        id: 0,
        plateNumber: "",
        reportDate: null,
        chasis: "",
        personId: "",
        vechileId: "",
        provincesAndCitiesId: "",
        officeContentId: "",
        senderId: ""
    });

    // =======================
    // Load Data
    // =======================

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const personsRes = await axios.get(PERSON_API);
            const provincesRes = await axios.get(PROVINCE_API);
            const officeContentRes = await axios.get(OFFICECONTENT_API);
            const vechiles = await axios.get(Vechile_API);
            const sender = await axios.get(Sender_API);
            setvechile(vechiles.data)
            setsender(sender.data)
            setPersons(personsRes.data);
            setProvinces(provincesRes.data);
            setOfficeContents(officeContentRes.data);
        } catch (err) {
            console.log(err);
        }
    };

    // =======================
    // Save Both Person & Letter
    // =======================

    const saveAll = async () => {
        try {

            const payload = {
                plateNumber: letter.plateNumber,
                dateS: letter.reportDate
                    ? letter.reportDate.format("YYYY/MM/DD")
                    : "",
                chasis: letter.chasis,
                personId: letter.personId, // Already set by savePerson()
                provincesAndCitiesId: Number(letter.provincesAndCitiesId),
                officeContentId: Number(letter.officeContentId),
                vechileId: Number(letter.vechileId),
                senderId: Number(letter.senderId)
            };

            await axios.post(API, payload);

            alert("Saved Successfully");

            // Clear Person Form
            setPerson({
                id: 0,
                name: "",
                fatherName: "",
                nic: ""
            });

            // Clear Letter Form
            setLetter({
                id: 0,
                plateNumber: "",
                reportDate: null,
                chasis: "",
                personId: "",
                provincesAndCitiesId: "",
                officeContentId: "",
                vechileId: "",
                senderId: ""
            });

            loadData();

        } catch (err) {
            console.log(err.response?.data || err);
            alert("Save Failed");
        }
    };
    const savePerson = async () => {
        try {
            if (
                !person.name.trim() ||
                !person.fatherName.trim() ||
                !person.nic.trim()
            ) {
                return;
            }

            const res = await axios.post(PERSON_API, person);

            await loadData();

            setLetter(prev => ({
                ...prev,
                personId: res.data.id
            }));

        } catch (err) {
            console.log(err);
        }
    };

    const editor = useEditor({
        extensions: [
            StarterKit,
            Image,
            TextStyle,
            TextAlign.configure({
                types: ["heading", "paragraph"],
                alignments: ["left", "center", "right"],
            }),
        ],

        content: "",

        editorProps: {
            attributes: {
                class: "ProseMirror",
                spellCheck: "true",
            },
        },
    });

    if (!editor) return null;

    const setDirection = (dir) => {
        const element = document.querySelector(".ProseMirror");
        if (element) {
            element.dir = dir;

            if (dir === "rtl") {
                editor.chain().focus().setTextAlign("right").run();
            } else {
                editor.chain().focus().setTextAlign("left").run();
            }
        }
    };
    const selectedSender = sender.find(
        (s) => s.id === Number(letter.senderId)
    );
    const selectedOffice = officeContents.find(
        o => o.id === Number(letter.officeContentId)
    );
    return (
        <>
            <div className="">
                <div className="container aborder" style={{ height: "1020px" }}>
                    <div className="no-print">
                        <div className="card p-3 mb-4">
                            <h5>Person Information</h5>
                            <div className="row">

                                <div className="col-md-4">
                                    <label>Name</label>
                                    <input
                                        className="form-control"
                                        value={person.name}
                                        onChange={(e) =>
                                            setPerson({ ...person, name: e.target.value })
                                        }
                                        onBlur={savePerson}
                                    />
                                </div>

                                <div className="col-md-4">
                                    <label>Father Name</label>
                                    <input
                                        className="form-control"
                                        value={person.fatherName}
                                        onChange={(e) =>
                                            setPerson({ ...person, fatherName: e.target.value })
                                        }
                                        onBlur={savePerson}
                                    />
                                </div>

                                <div className="col-md-4">
                                    <label>NIC</label>
                                    <input
                                        className="form-control"
                                        value={person.nic}
                                        onChange={(e) =>
                                            setPerson({ ...person, nic: e.target.value })
                                        }
                                        onBlur={savePerson}
                                    />
                                </div>

                            </div>
                        </div>
                        <div className="card shadow-sm border-0 rounded-4 p-4 mb-4">
                            <h4 className="text-primary mb-4 fw-bold">
                                Letter Information
                            </h4>

                            <div className="row g-4">

                                {/* Plate Number */}
                                <div className="col-lg-3 col-md-6">
                                    <label className="form-label fw-semibold">Plate Number</label>
                                    <input
                                        className="form-control"
                                        value={letter.plateNumber}
                                        onChange={(e) =>
                                            setLetter({ ...letter, plateNumber: e.target.value })
                                        }
                                    />
                                </div>

                                {/* Province */}
                                <div className="col-lg-3 col-md-6">
                                    <label className="form-label fw-semibold">Province</label>

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
                                        <option value="">Select Province</option>

                                        {provinces.map((p) => (
                                            <option key={p.id} value={p.id}>
                                                {p.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {/* Province */}
                                {/* Vehicle */}
                                <div className="col-lg-3 col-md-6">
                                    <label className="form-label fw-semibold">
                                        Vehicle
                                    </label>
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
                                            Select Vehicle
                                        </option>
                                        {vechile.map((v) => (

                                            <option
                                                key={v.id}
                                                value={v.id}
                                            >
                                                {v.type}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Chasis */}
                                <div className="col-lg-3 col-md-6">
                                    <label className="form-label fw-semibold">Chasis</label>

                                    <input
                                        className="form-control"
                                        value={letter.chasis}
                                        onChange={(e) =>
                                            setLetter({ ...letter, chasis: e.target.value })
                                        }
                                    />
                                </div>

                                {/* Person */}
                                <div className="col-lg-3 col-md-6">
                                    <label className="form-label fw-semibold">Person</label>

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

                                {/* Report Date */}
                                <div className="col-lg-3 col-md-6">
                                    <label className="form-label fw-semibold">
                                        Report Date
                                    </label>

                                    <DatePicker
                                        value={letter.reportDate}
                                        onChange={(value) =>
                                            setLetter({
                                                ...letter,
                                                reportDate: value
                                            })
                                        }
                                        calendar={persian}
                                        locale={persian_fa}
                                        format="YYYY/MM/DD"
                                        placeholder="Select Report Date"
                                        inputClass="form-control"
                                        containerClassName="w-100"
                                    />
                                </div>

                                {/* Office */}
                                <div className="col-lg-3 col-md-6">
                                    <label className="form-label fw-semibold">Office</label>
                                    <select
                                        className="form-select"
                                        value={letter.officeContentId || ""}
                                        onChange={(e) => {

                                            const id = Number(e.target.value);

                                            setLetter({
                                                ...letter,
                                                officeContentId: id
                                            });

                                            const selectedOffice = officeContents.find(
                                                o => o.id === id
                                            );

                                            if (selectedOffice && editor) {
                                                editor.commands.setContent(selectedOffice.content || "");
                                            }
                                        }}
                                    >
                                        <option value="">Select Office</option>

                                        {officeContents.map((o) => (
                                            <option key={o.id} value={o.id}>
                                                {o.office} - {o.typeLetter}
                                            </option>
                                        ))}
                                    </select>
                                </div>


                                <div className="col-lg-3 col-md-6">
                                    <label className="form-label fw-semibold">Sender</label>

                                    <select
                                        className="form-select"
                                        value={letter.senderId}
                                        onChange={(e) =>
                                            setLetter({
                                                ...letter,
                                                senderId: Number(e.target.value)
                                            })
                                        }
                                    >
                                        <option value="">Select Sender</option>

                                        {sender.map((s) => (
                                            <option key={s.id} value={s.id}>
                                                {s.senderTitle} - {s.senderName}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Save Button */}
                                <div className="col-12 d-flex justify-content-end mt-3">
                                    <button
                                        className="btn btn-success px-5"
                                        onClick={saveAll}
                                    >
                                        Save Letter
                                    </button>
                                </div>

                            </div>

                        </div>
                    </div>
                    {/* <LetterHeader /> */}
                    <div className="header text-center">

                        {/* Top Title */}
                        <div className="row" style={{ marginBottom: -30 }}>
                            <div className="col-12" >
                                <h2>بسم الله الرحمن الرحیم</h2>
                            </div>
                        </div>

                        {/* Header Content */}
                        <div className="row align-items-center">

                            {/* Right Logo */}
                            <div className="col-12 col-md-2 text-center text-md-end mb-3">
                                <img
                                    src="/images/transport.jpg"
                                    alt="Right Logo"
                                    className="img-fluid "
                                    style={{ maxWidth: "120px", maxHeight: "130px" }}
                                />

                                <div className="d-flex justify-content-center gap-2 mt-3 ms-3">
                                    <div className="text-center">
                                        <small style={{ fontSize: "7px" }}>اګاهی
                                        </small>
                                        <div
                                            className="border border-2 border-dark"
                                            style={{ width: "20px", height: "20px" }}
                                        ></div>
                                    </div>

                                    <div className="text-center">
                                        <small style={{ fontSize: "7px" }}>محرم</small>
                                        <div
                                            className="border border-2 border-dark"
                                            style={{ width: "20px", height: "20px" }}
                                        ></div>
                                    </div>

                                    <div className="text-center">
                                        <small style={{ fontSize: "7px" }}>اطمینانیه</small>
                                        <div
                                            className="border border-2 border-dark"
                                            style={{ width: "20px", height: "20px" }}
                                        ></div>
                                    </div>

                                    <div className="text-center">
                                        <small style={{ fontSize: "7px" }}>عادی</small>
                                        <div
                                            className="border border-2 border-dark"
                                            style={{ width: "20px", height: "20px" }}
                                        ></div>
                                    </div>
                                </div>
                            </div>

                            {/* Center Text */}
                            <div className="col-12 col-md-8 text-center">

                                <div className="row">

                                    <div className="col-6 text-end">
                                        <h6>امــــارت اسلامی افغانستـــان</h6>
                                        <h6>وزارت ترانسپورت و هوانوردی</h6>
                                    </div>

                                    <div className="col-6 text-end">
                                        <h6>د افغانستان اسلامي امــــــارت</h6>
                                        <h6>د ترانسپورت او هوایی چلند وزارت</h6>
                                    </div>

                                </div>
                                <h6>د کندهار ولایت د واټ ترانسپورټ تنظیم ریاست</h6>
                                <h6>د تنظیم اوانســـــــــــجام آمــــــــریت</h6>
                                <h6>کاری واحد مرکز</h6>

                            </div>

                            {/* Left Logo */}
                            <div className="col-12 col-md-2 text-center text-md-start">
                                <img
                                    src="/images/em.webp"
                                    alt="Left Logo"
                                    className="img-fluid"
                                    style={{ maxWidth: "100px", maxHeight: "90px" }}
                                />
                                <div className="mt-3 text-end">
                                    <p className="mb-0"><strong>صفحه:</strong> 1</p>
                                    <p className="mt-1">1405/04/19</p>
                                </div>
                            </div>

                        </div>
                    </div>
                    <hr />
                    {
                        selectedOffice?.typeLetter === "مکتوب" ? (

                            // Only show editor and buttons
                            <div className="container-fluid">

                                <div className="row no-print">
                                    <div className="col-12">

                                        <div className="d-flex flex-wrap gap-2 mb-3">

                                            <button
                                                type="button"
                                                className="btn btn-outline-secondary"
                                                onClick={() => editor.chain().focus().toggleBold().run()}
                                            >
                                                <b>B</b>
                                            </button>

                                            <button
                                                type="button"
                                                className="btn btn-outline-secondary"
                                                onClick={() => editor.chain().focus().toggleItalic().run()}
                                            >
                                                <i>I</i>
                                            </button>

                                            <button
                                                type="button"
                                                className="btn btn-outline-secondary"
                                                onClick={() => editor.chain().focus().setTextAlign("left").run()}
                                            >
                                                Left
                                            </button>

                                            <button
                                                type="button"
                                                className="btn btn-outline-secondary"
                                                onClick={() => editor.chain().focus().setTextAlign("center").run()}
                                            >
                                                Center
                                            </button>

                                            <button
                                                type="button"
                                                className="btn btn-outline-secondary"
                                                onClick={() => editor.chain().focus().setTextAlign("right").run()}
                                            >
                                                Right
                                            </button>

                                            <button
                                                type="button"
                                                className="btn btn-outline-secondary"
                                                onClick={() => editor.chain().focus().toggleBulletList().run()}
                                            >
                                                • List
                                            </button>

                                            <button
                                                type="button"
                                                className="btn btn-outline-secondary"
                                                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                                            >
                                                1. List
                                            </button>

                                            <button
                                                type="button"
                                                className="btn btn-outline-secondary"
                                                onClick={() => editor.chain().focus().undo().run()}
                                            >
                                                Undo
                                            </button>

                                            <button
                                                type="button"
                                                className="btn btn-outline-secondary"
                                                onClick={() => editor.chain().focus().redo().run()}
                                            >
                                                Redo
                                            </button>

                                            {/* Language Direction */}
                                            <button
                                                type="button"
                                                className="btn btn-primary"
                                                onClick={() => setDirection("ltr")}
                                            >
                                                English
                                            </button>

                                            <button
                                                type="button"
                                                className="btn btn-success"
                                                onClick={() => setDirection("rtl")}
                                            >
                                                پښتو / فارسی
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-dark"
                                                onClick={() => window.print()}
                                            >
                                                🖨️ Print
                                            </button>
                                        </div>

                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-12">
                                        <EditorContent editor={editor} />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <strong><p>په درنښت</p></strong>
                                    <strong><p>{selectedSender?.senderTitle}</p></strong>
                                    <strong><p>{selectedSender?.senderName}</p></strong>
                                </div>
                            </div>

                        ) : (

                            // Show the normal layout
                            <div className="letterbody">
                                <div className="row border-top  border-dark">

                                    <div
                                        className="col-md-5 border-end  border-dark"
                                        style={{ height: "785px" }}
                                    >
                                        <div className="row">
                                            <div className="col-12 border border-dark">
                                                <strong>احکام</strong>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-7" style={{ height: "785px" }}>

                                        <div className="row">

                                            <div className="col-12  border border-dark">
                                                <strong>{selectedOffice?.typeLetter}</strong>
                                            </div>

                                            <div className="container-fluid">

                                                <div className="d-flex flex-wrap gap-2 mb-3  no-print">

                                                    <button
                                                        type="button"
                                                        className="btn btn-outline-secondary"
                                                        onClick={() => editor.chain().focus().toggleBold().run()}
                                                    >
                                                        <b>B</b>
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="btn btn-outline-secondary"
                                                        onClick={() => editor.chain().focus().toggleItalic().run()}
                                                    >
                                                        <i>I</i>
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="btn btn-outline-secondary"
                                                        onClick={() => editor.chain().focus().setTextAlign("left").run()}
                                                    >
                                                        Left
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="btn btn-outline-secondary"
                                                        onClick={() => editor.chain().focus().setTextAlign("center").run()}
                                                    >
                                                        Center
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="btn btn-outline-secondary"
                                                        onClick={() => editor.chain().focus().setTextAlign("right").run()}
                                                    >
                                                        Right
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="btn btn-outline-secondary"
                                                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                                                    >
                                                        • List
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="btn btn-outline-secondary"
                                                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                                                    >
                                                        1. List
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="btn btn-outline-secondary"
                                                        onClick={() => editor.chain().focus().undo().run()}
                                                    >
                                                        Undo
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="btn btn-outline-secondary"
                                                        onClick={() => editor.chain().focus().redo().run()}
                                                    >
                                                        Redo
                                                    </button>

                                                    {/* Language Direction */}
                                                    <button
                                                        type="button"
                                                        className="btn btn-primary"
                                                        onClick={() => setDirection("ltr")}
                                                    >
                                                        English
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="btn btn-success"
                                                        onClick={() => setDirection("rtl")}
                                                    >
                                                        پښتو / فارسی
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="btn btn-dark"
                                                        onClick={() => window.print()}
                                                    >
                                                        🖨️ Print
                                                    </button>

                                                </div>

                                                <EditorContent editor={editor} />

                                            </div>
                                            <div className="mt-4 ">
                                                <strong><p>په درنښت</p></strong>
                                                <strong><p>{selectedSender?.senderTitle}</p></strong>
                                                <strong><p>{selectedSender?.senderName}</p></strong>
                                            </div>

                                        </div>

                                    </div>

                                </div>
                            </div>

                        )
                    }
                </div>
                <div className="text-end print-only" style={{
                    marginRight: "35px"
                }}>
                    آدرس:  شهید آصف چوک د لسمی حوزی څنګ ته

                </div>
            </div>
        </>

    );
};