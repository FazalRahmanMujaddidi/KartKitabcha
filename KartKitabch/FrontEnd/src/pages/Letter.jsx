import React from "react";

import "../EmploymentLetter.css";
export default function LetterPage() {
    return (
        <div className="letter-page">
            <div className="letter">

                {/* Header */}
                <header className="header">
                    <div className="header-logo">
                        <img src="/images/em.webp" alt="Left Logo" />
                    </div>

                    <div className="header-center">
                        <h4>د کندهار ولایت د واټ ترانسپورټ تنظیم ریاست</h4>
                        <h5>د تنظیم اوانســـــــــــجام آمــــــــریت </h5>
                        <h6>کاری واحد مرکز </h6>
                    </div>

                    <div className="header-logo">
                        <img src="/images/transport.jpg" alt="Right Logo" />
                    </div>
                </header>

                {/* Reference Row */}
                <div className="reference-row">
                    <span>شماره: 1405/1</span>
                    <span>تاریخ: 1405/03/20</span>
                </div>

                {/* Body */}
                <div className="body">

                    {/* Left Column */}
                    <div className="left-column">
                        <div className="column-title">
                            <strong>خواب</strong>
                        </div>

                        <div className="column-content">
                            {/* Empty area */}
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="right-column">

                        <div className="column-title">
                            <strong>استخدام</strong>
                        </div>

                        <div className="content">

                            <p><strong>موضوع:</strong> معرفی جهت استخدام</p>

                            <p>
                                السلام علیکم ورحمة الله وبرکاته
                            </p>

                            <p>
                                محترماً، بر اساس حکم شماره ۱۵۱۴۱،
                                آقای <strong>عبدالله احمدی</strong> جهت اجرای وظیفه
                                معرفی می‌گردد.
                            </p>

                            <p>
                                شماره تذکره:
                                <strong>WDB9440231109064575</strong>
                            </p>

                            <p>
                                لطفاً مطابق مقررات اجراات لازم صورت گیرد.
                            </p>

                            <br />

                            <div className="signature">
                                <p>به درنښت</p>
                                <p>کاری واحد مرکز</p>
                            </div>

                        </div>

                    </div>

                </div>

                {/* Footer */}
                <footer className="footer">
                    آدرس: کابل، وزارت ترانسپورت و هوانوردی، ریاست تنظیم خدمات ترانسپورتی
                </footer>

            </div>
        </div>
    );
};
