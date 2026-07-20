import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";

import StarterKit from "@tiptap/starter-kit";
import { Image } from "@tiptap/extension-image";
import { TextAlign } from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";

const DocumentEditor = () => {
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

  return (
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
  );
};

export default DocumentEditor;