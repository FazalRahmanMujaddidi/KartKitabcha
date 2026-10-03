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

                    </div>

                </div>
            </div>

            <div className="row">
                <div className="col-12">
                    <EditorContent editor={editor} />
                </div>
            </div>

        </div>

    ) : (

        // Show the normal layout
        <div className="letterbody">
            <div className="row border-top border-3 border-dark">

                <div
                    className="col-md-6 border-end border-3 border-dark"
                    style={{ height: "795px" }}
                >
                    <div className="row">
                        <div className="col-12 border-bottom border-3 border-dark">
                            <strong>احکام</strong>
                        </div>
                    </div>
                </div>

                <div className="col-md-6" style={{ height: "700px" }}>

                    <div className="row">

                        <div className="col-12 border-bottom border-3 border-dark">
                            <strong>{selectedOffice?.typeLetter}</strong>
                        </div>

                        <div className="container-fluid">

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

                            </div>

                            <EditorContent editor={editor} />

                        </div>

                        <div className="mt-4">
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