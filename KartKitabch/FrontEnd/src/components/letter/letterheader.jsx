
export default function LetterHeader(){
return(
<>
                <div className="header text-center">

                    {/* Top Title */}
                    <div className="row" style={{marginBottom:-30}}>
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
                                style={{ maxWidth: "120px", maxHeight:"130px" }}
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
                                style={{ maxWidth: "100px", maxHeight:"90px" }}
                            />
                            <div className="mt-3 text-end">
                                <p className="mb-0"><strong>صفحه:</strong> 1</p>
                                <p className="mt-1">1405/04/19</p>
                            </div>
                        </div>

                    </div>
                </div>
                </>
);
}