import React, { useMemo } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function RichTextEditor({
  value,
  onChange,
  placeholder,
  disabled,
}) {
  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ color: [] }, { background: [] }],
        ["link", "image"],
        ["clean"],
      ],
    }),
    []
  );

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "color",
    "background",
    "link",
    "image",
  ];

  return (
    <div className="rich-text-editor">
      <ReactQuill
        theme="snow"
        value={value || ""}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder || "Write your post content..."}
        readOnly={disabled}
        className="bg-white"
      />
      <style>{`
        .rich-text-editor .ql-container {
          font-size: 16px;
          font-family: 'Lora', serif;
          min-height: 250px;
          background-color: #ffffff;
          color: #111827; /* gray-900 */
          border-bottom-left-radius: 0.5rem;
          border-bottom-right-radius: 0.5rem;
        }
        .rich-text-editor .ql-toolbar {
          background-color: #f9fafb; /* gray-50 */
          border-color: #e5e7eb; /* gray-200 */
          border-top-left-radius: 0.5rem;
          border-top-right-radius: 0.5rem;
        }
        .rich-text-editor .ql-container.ql-snow {
          border-color: #e5e7eb; /* gray-200 */
        }
        .rich-text-editor .ql-editor.ql-blank::before {
          color: #9ca3af; /* gray-400 */
          font-style: italic;
        }
        .rich-text-editor .ql-editor {
          min-height: 250px;
          line-height: 1.8;
        }
      `}</style>
    </div>
  );
}
