import React, { useState, useEffect, useRef } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import FormField from '../molecules/FormField';
import Button from '../atoms/Button';
import ErrorMessage from '../atoms/ErrorMessage';
import RichTextEditor from '../molecules/RichTextEditor';
import { FiImage, FiUpload, FiX } from 'react-icons/fi';

const validationSchema = Yup.object().shape({
  header: Yup.string().max(255, "Maximum 255 characters").required("Required"),
  short: Yup.string().max(255, "Maximum 255 characters").required("Required"),
  post_text: Yup.string().required("Required"),
  image: Yup.mixed(),
});

export default function PostForm({ 
  initialValues, 
  onSubmit, 
  isSubmitting, 
  submitLabel = "Submit",
  onImageChange,
  onFormChange
}) {
  const [imagePreview, setImagePreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const dropZoneRef = useRef(null);

  useEffect(() => {
    if (initialValues?.imagePreview) {
      setImagePreview(initialValues.imagePreview);
    }
  }, [initialValues]);


  const processImageFile = (file, setFieldValue) => {
    if (!file) return;

      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      const localUrl = URL.createObjectURL(file);
      setImagePreview(localUrl);
      setFieldValue("image", file);
      if (onImageChange) {
        onImageChange(file, localUrl);
      }
  };

  const handleImageChange = (event, setFieldValue) => {
    const file = event.currentTarget.files[0];
    if (file) {
      processImageFile(file, setFieldValue);
    } else {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
        setImagePreview(null);
      }
      setFieldValue("image", null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e, setFieldValue) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        processImageFile(file, setFieldValue);
      }
    }
  };

  const handleRemoveImage = (setFieldValue) => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
    setFieldValue("image", null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onImageChange) {
      onImageChange(null, null);
    }
  };

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  return (
    <Formik
      initialValues={initialValues || { header: "", short: "", post_text: "", image: null }}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({ setFieldValue, values, errors, touched }) => {

        return (
          <Form className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="header" className="block text-sm font-medium text-text-primary">
                  Header
                </label>
                <span className={`text-xs ${
                  (values.header || "").length > 255 
                    ? "text-red-600" 
                    : (values.header || "").length > 200 
                    ? "text-yellow-600" 
                    : "text-text-muted"
                }`}>
                  {(values.header || "").length} / 255
                </span>
              </div>
            <FormField
              name="header"
              id="header"
                label=""
              type="text"
              value={values.header || ""}
              placeholder="Enter post header"
              disabled={isSubmitting}
                maxLength={255}
              onChange={(e) => {
                setFieldValue("header", e.target.value);
                if (onFormChange) {
                  onFormChange({
                    ...values,
                    header: e.target.value,
                    imagePreview: imagePreview || initialValues?.imagePreview,
                  });
                }
              }}
              invalid={errors.header && touched.header}
              errorMessage={errors.header && touched.header ? errors.header : undefined}
            />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="short" className="block text-sm font-medium text-text-primary">
                  Short Description
                </label>
                <span className={`text-xs ${
                  (values.short || "").length > 255 
                    ? "text-red-600" 
                    : (values.short || "").length > 200 
                    ? "text-yellow-600" 
                    : "text-text-muted"
                }`}>
                  {(values.short || "").length} / 255
                </span>
              </div>
            <FormField
              name="short"
              id="short"
                label=""
              type="text"
              value={values.short || ""}
              placeholder="Enter short description"
              disabled={isSubmitting}
                maxLength={255}
              onChange={(e) => {
                setFieldValue("short", e.target.value);
                if (onFormChange) {
                  onFormChange({
                    ...values,
                    short: e.target.value,
                    imagePreview: imagePreview || initialValues?.imagePreview,
                  });
                }
              }}
              invalid={errors.short && touched.short}
              errorMessage={errors.short && touched.short ? errors.short : undefined}
            />
            </div>

          <div>
            <label htmlFor="post_text" className="block text-sm font-medium text-text-primary mb-2">
              Post Text
            </label>
            <RichTextEditor
              value={values.post_text || ""}
              onChange={(content) => {
                setFieldValue("post_text", content);
                if (onFormChange) {
                  onFormChange({
                    ...values,
                    post_text: content,
                    imagePreview: imagePreview || initialValues?.imagePreview,
                  });
                }
              }}
              placeholder="Write your post content..."
              disabled={isSubmitting}
            />
            {errors.post_text && touched.post_text && (
              <ErrorMessage message={errors.post_text} />
            )}
          </div>

          <div>
            <label htmlFor="image" className="block text-sm font-medium text-text-primary mb-2">
              Image (Optional)
            </label>
            
            {!imagePreview ? (
              <div
                ref={dropZoneRef}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, setFieldValue)}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragging
                    ? "border-blue-500 bg-blue-50"
                    : "border-border-color bg-bg-secondary hover:border-blue-400 hover:bg-bg-tertiary"
                }`}
              >
              <input
                  ref={fileInputRef}
                id="image"
                name="image"
                type="file"
                accept="image/*"
                className="hidden"
                disabled={isSubmitting}
                onChange={(e) => handleImageChange(e, setFieldValue)}
              />
                <div className="flex flex-col items-center gap-4">
                  <div className="text-4xl text-text-muted">
                    {isDragging ? <FiUpload /> : <FiImage />}
                  </div>
                  <div>
                    <label
                      htmlFor="image"
                      className="flex items-center justify-center gap-2 px-4 py-2 border border-border-color rounded-lg bg-bg-primary text-text-primary cursor-pointer hover:bg-bg-tertiary transition-colors inline-block"
                    >
                      <FiUpload />
                      <span>Choose Image</span>
                    </label>
                    <p className="mt-2 text-sm text-text-muted">
                      or drag and drop an image here
                    </p>
                    <p className="mt-1 text-xs text-text-muted">
                      PNG, JPG, GIF up to 5MB
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative group">
                <div className="relative rounded-lg overflow-hidden border border-border-color">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full max-h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(setFieldValue)}
                      className="opacity-0 group-hover:opacity-100 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-all duration-200"
                      disabled={isSubmitting}
                    >
                      <FiX className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-700"
                  disabled={isSubmitting}
                >
                  Change Image
                </button>
                </div>
              )}
            
            {errors.image && touched.image && (
              <ErrorMessage message={errors.image} />
            )}
          </div>

          <div className="flex items-center gap-4">
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              className="px-6"
            >
              {isSubmitting ? "Submitting..." : submitLabel}
            </Button>
            {isSubmitting && (
              <p className="text-sm text-text-muted flex items-center gap-2">
                <span className="spinner-border spinner-border-sm" role="status"></span>
                Please wait, do not click submit again...
              </p>
            )}
          </div>
        </Form>
        );
      }}
    </Formik>
  );
}

