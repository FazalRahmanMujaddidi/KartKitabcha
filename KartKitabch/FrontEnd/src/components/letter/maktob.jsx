import LetterHeader from "./letterheader";
import DocumentEditor from "./DocumentEditor";

export default function maktob() {
  return (
    <>
  <div
    className="container d-flex flex-column"
    style={{ minHeight: "92vh" }}
  >
    <LetterHeader />

    <hr />

    <DocumentEditor />

    {/* Push this to the bottom */}
  
    <div
      className="text-end mt-auto border-top"
      style={{ marginRight: "5px" }}
    >
        
      آدرس: شهید آصف چوک د لسمی حوزی څنګ ته
    </div>
  </div>
</>

  );
}