import React from "react";
import LetterHeader from "../components/letter/letterheader";
import LetterBody from "../components/letter/letterbody";
// import "../EmploymentLetter.css";
export default function LetterPage() {
    return (
        <>
            <div className="container border border-3 border-dark" style={{ height: "1000px" }}>
                <LetterHeader />
                <LetterBody />
            </div>
            <div className="text-end " style={{
                marginRight: "35px"
            }}>
                آدرس:  شهید آصف څوک د لسمی حوزی څنګ ته

            </div>
        </>

    );
};
