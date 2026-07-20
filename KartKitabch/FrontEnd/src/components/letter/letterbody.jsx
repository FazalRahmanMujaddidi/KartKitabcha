import DocumentEditor from "./DocumentEditor";
import { useState } from "react";
export default function LetterBody() {
    const [title, setTitle] = useState("پیشنهاد");
    return (
        <>
            <div className="letterbody ">
                <div className="row border-top border-3 border-dark">
                    <div className="col-md-6 border-end border-3 border-dark " style={{ height: "795px" }}>
                        <div className="row">
                            <div className="col-12 border-bottom border-3 border-dark" >
                                <div>
                                    <strong>احکام</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 " style={{ height: "700px" }}>
                        <div className="row">
                            <div className="col-12 border-bottom border-3 border-dark">
                                <strong>{title}</strong>

                                <select
                                    className="form-select form-select-sm w-auto no-print"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                >
                                    <option value="پیشنهاد">پیشنهاد</option>
                                    <option value="استعلام">استعلام</option>
                                </select>
                            </div>
                            <DocumentEditor />
                            <div className="">
                                <strong><p>په درنښت</p> </strong>
                                <strong><p>توزیع اسنادو عمومی مدیریت</p></strong>
                                <strong><p>فضل الرحمن موسی زی</p></strong>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}