import React, { useState, useEffect } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import FormField from '../molecules/FormField';
import Button from '../atoms/Button';
import ErrorMessage from '../atoms/ErrorMessage';
import RichTextEditor from '../molecules/RichTextEditor';
import { FiImage } from 'react-icons/fi';

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

  useEffect(() => {
    if (initialValues?.imagePreview) {
      setImagePreview(initialValues.imagePreview);
    }
  }, [initialValues]);


  const handleImageChange = (event, setFieldValue) => {
    const file = event.currentTarget.files[0];
    if (file) {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      const localUrl = URL.createObjectURL(file);
      setImagePreview(localUrl);
      setFieldValue("image", file);
      if (onImageChange) {
        onImageChange(file, localUrl);
      }
    } else {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
        setImagePreview(null);
      }
      setFieldValue("image", null);
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
            <FormField
              name="header"
              id="header"
              label="Header"
              type="text"
              value={values.header || ""}
              placeholder="Enter post header"
              disabled={isSubmitting}
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

            <FormField
              name="short"
              id="short"
              label="Short Description"
              type="text"
              value={values.short || ""}
              placeholder="Enter short description"
              disabled={isSubmitting}
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
            <div className="flex items-center gap-4">
              <label
                htmlFor="image"
                className="flex items-center justify-center gap-2 px-4 py-2 border border-border-color rounded-lg bg-bg-secondary text-text-primary cursor-pointer hover:bg-bg-tertiary transition-colors"
              >
                <FiImage />
                <span>Choose Image</span>
              </label>
              <input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                className="hidden"
                disabled={isSubmitting}
                onChange={(e) => handleImageChange(e, setFieldValue)}
              />
              {imagePreview && (
                <div className="flex-1">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-h-32 rounded-lg object-cover"
                  />
                </div>
              )}
            </div>
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

