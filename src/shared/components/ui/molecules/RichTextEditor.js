import React, { useMemo } from 'react';
import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';

export default function RichTextEditor({ value, onChange, placeholder, disabled }) {
  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'color': [] }, { 'background': [] }],
      ['link', 'image'],
      ['clean']
    ],
  }), []);

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'color', 'background',
    'link', 'image'
  ];

  return (
    <div className="rich-text-editor">
      <ReactQuill
        theme="snow"
        value={value || ''}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder || 'Write your post content...'}
        readOnly={disabled}
        style={{
          backgroundColor: 'var(--bg-secondary)',
          color: 'var(--text-primary)',
        }}
      />
      <style>{`
        .rich-text-editor .ql-container {
          font-size: 16px;
          font-family: inherit;
          min-height: 200px;
          background-color: var(--bg-secondary);
          color: var(--text-primary);
        }
        .rich-text-editor .ql-editor {
          min-height: 200px;
          color: var(--text-primary);
        }
        .rich-text-editor .ql-toolbar {
          background-color: var(--bg-secondary);
          border-color: var(--border-color);
        }
        .rich-text-editor .ql-toolbar .ql-stroke {
          stroke: var(--text-primary);
        }
        .rich-text-editor .ql-toolbar .ql-fill {
          fill: var(--text-primary);
        }
        .rich-text-editor .ql-toolbar .ql-picker-label {
          color: var(--text-primary);
        }
        .rich-text-editor .ql-toolbar button:hover,
        .rich-text-editor .ql-toolbar button.ql-active {
          color: var(--text-primary);
        }
        .rich-text-editor .ql-container {
          border-color: var(--border-color);
        }
        [data-theme="dark"] .rich-text-editor .ql-snow .ql-stroke {
          stroke: var(--text-primary);
        }
        [data-theme="dark"] .rich-text-editor .ql-snow .ql-fill {
          fill: var(--text-primary);
        }
      `}</style>
    </div>
  );
}

