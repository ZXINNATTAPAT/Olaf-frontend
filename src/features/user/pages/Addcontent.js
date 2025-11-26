import React, { useState, useEffect, useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { IconPath, Loader } from "../../../shared/components";
import useAuth from "../../../shared/hooks/useAuth";
import useLoader from "../../../shared/hooks/useLoader";
import { useLocation, useNavigate } from "react-router-dom";
import ApiController from "../../../shared/services/ApiController";
import axiosInstance from "../../../shared/services/axios/index";

// Validation Schema using Yup
const form = Yup.object().shape({
  header: Yup.string().max(255, "Maximum 255 characters").required("Required"),
  short: Yup.string().max(255, "Maximum 255 characters").required("Required"),
  post_text: Yup.string().required("Required"),
  image: Yup.mixed(), // Image is now optional
});

const Addcontent = () => {
  const { user } = useAuth();
  const { showLoader, hideLoader } = useLoader();
  const navigate = useNavigate();
  const location = useLocation();
  const fromLocation = location?.state?.from?.pathname || "/Profile";
  const [message, setMessage] = useState("");
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const [cloudinaryData, setCloudinaryData] = useState(null);
  const [localImagePreview, setLocalImagePreview] = useState(null);
  const isSubmittingRef = useRef(false);
  const Ic = IconPath();

  const [Newfrom, setNewfrom] = useState({
    header: "",
    short: "",
    post_text: "",
    image: null,
    user: user?.username || "",
  });

  // Function to handle file selection and create local preview
  const handleFileChange = (event, setFieldValue) => {
    const file = event.currentTarget.files[0];
    if (file) {
      // Clean up previous local URL
      if (localImagePreview) {
        URL.revokeObjectURL(localImagePreview);
      }
      // Create new local preview URL
      const localUrl = URL.createObjectURL(file);
      setLocalImagePreview(localUrl);
      setFieldValue("image", file);
    } else {
      // Clean up local URL if no file selected
      if (localImagePreview) {
        URL.revokeObjectURL(localImagePreview);
        setLocalImagePreview(null);
      }
      setFieldValue("image", null);
    }
  };

  // Cleanup local URL when component unmounts
  useEffect(() => {
    return () => {
      if (localImagePreview) {
        URL.revokeObjectURL(localImagePreview);
      }
    };
  }, [localImagePreview]);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    // Prevent double submission using ref
    if (isSubmittingRef.current) {
      console.log("Already submitting, ignoring duplicate request");
      return;
    }

    console.log("Starting form submission with values:", values);
    isSubmittingRef.current = true;
    setSubmitting(true);
    setMessage("");

    try {
      let imageUrl = null;

      // Step 1: Upload image to Cloudinary first (if provided)
      if (values.image) {
        console.log("Starting image upload to Cloudinary");
        showLoader("กำลังอัปโหลดรูปภาพ...");
        try {
          const formData = new FormData();
          formData.append("file", values.image);
          formData.append(
            "upload_preset",
            process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET || "OLAF"
          );
          formData.append("folder", "olaf/blog");
          const cloudinaryResponse = await fetch(
            `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || "your_cloud_name"
            }/image/upload`,
            {
              method: "POST",
              body: formData,
            }
          );
          if (!cloudinaryResponse.ok) {
            const errorText = await cloudinaryResponse.text();
            console.error("Cloudinary upload failed:", errorText);
            throw new Error(
              `Cloudinary upload failed: ${cloudinaryResponse.status} - ${errorText}`
            );
          }
          const cloudinaryResult = await cloudinaryResponse.json();
          imageUrl = cloudinaryResult.secure_url;
          setUploadedImageUrl(cloudinaryResult.secure_url);
          setCloudinaryData(cloudinaryResult);
          console.log("Image uploaded successfully:", imageUrl);
        } catch (imageError) {
          console.error("Error uploading image to Cloudinary:", imageError);
          setMessage("Image upload failed. Please try again.");
          hideLoader();
          isSubmittingRef.current = false;
          setSubmitting(false);
          return;
        }
      } else {
        console.log("No image provided, skipping Cloudinary upload");
      }

      // Step 2: Create post with image using single API call
      console.log("Starting post creation");
      showLoader("กำลังสร้างโพสต์...");

      if (imageUrl) {
        // Use special endpoint for posts with images
        const formData = new FormData();
        formData.append('header', values.header);
        formData.append('short', values.short);
        formData.append('post_text', values.post_text);
        formData.append('user_id', user.id);
        formData.append('image_url', imageUrl);
        formData.append('caption', 'Main image for my post');
        formData.append('is_primary', 'true');
        formData.append('sort_order', '0');

        console.log("Sending post data with image:", formData);
        const response = await axiosInstance.post('/posts/create-with-image/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        console.log("Post created successfully:", response.data);
        setMessage("Post created successfully with image!");
      } else {
        // Use regular endpoint for posts without images
        const postData = {
          header: values.header,
          short: values.short,
          post_text: values.post_text,
          user_id: user.id,
        };

        console.log("Sending post data:", postData);
        const result = await ApiController.createPost(postData);

        if (!result.success) {
          throw new Error(result.error || "Failed to create post");
        }

        console.log("Post created successfully:", result.data);
        setMessage("Post created successfully!");
      }

      // Clean up local preview URL
      if (localImagePreview) {
        URL.revokeObjectURL(localImagePreview);
        setLocalImagePreview(null);
      }

      // Reset states before navigation
      hideLoader();
      isSubmittingRef.current = false;
      setSubmitting(false);

      // Reset form after states are updated
      resetForm();

      // Navigate immediately
      navigate(fromLocation, { replace: true });

    } catch (error) {
      console.error("Error creating post:", error);
      setMessage("Failed to create post. Please try again.");
      hideLoader();
      isSubmittingRef.current = false;
      setSubmitting(false);
    }
  };
  return (
    <>
      <Loader />
      <br /><br />
      <div className="container">
        <h2>Create a New Post</h2>
        <Formik
          initialValues={{ header: "", short: "", post_text: "", image: null }}
          validationSchema={form}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, isSubmitting }) => (
            <>
              <Form>
                <div className="mb-3">
                  <label htmlFor="header" className="form-label">
                    Header
                  </label>
                  <Field
                    name="header"
                    type="text"
                    className="form-control"
                    disabled={isSubmitting}
                    onChange={(event) => {
                      setFieldValue("header", event.target.value);
                      setNewfrom((prevState) => ({
                        ...prevState,
                        header: event.target.value,
                      }));
                    }}
                  />
                  <ErrorMessage
                    name="header"
                    component="div"
                    className="text-danger"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="short" className="form-label">
                    Short Description
                  </label>
                  <Field
                    name="short"
                    type="text"
                    className="form-control"
                    disabled={isSubmitting}
                    onChange={(event) => {
                      setFieldValue("short", event.target.value);
                      setNewfrom((prevState) => ({
                        ...prevState,
                        short: event.target.value,
                      }));
                    }}
                  />
                  <ErrorMessage
                    name="short"
                    component="div"
                    className="text-danger"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="post_text" className="form-label">
                    Post Text
                  </label>
                  <Field
                    name="post_text"
                    as="textarea"
                    className="form-control"
                    rows="3"
                    disabled={isSubmitting}
                    onChange={(event) => {
                      setFieldValue("post_text", event.target.value);
                      setNewfrom((prevState) => ({
                        ...prevState,
                        post_text: event.target.value,
                      }));
                    }}
                  />
                  <ErrorMessage
                    name="post_text"
                    component="div"
                    className="text-danger"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="image" className="form-label">
                    Image (Optional)
                  </label>
                  <input
                    name="image"
                    type="file"
                    accept="image/*"
                    className="form-control"
                    disabled={isSubmitting}
                    onChange={(event) => handleFileChange(event, setFieldValue)}
                  />
                  <ErrorMessage
                    name="image"
                    component="div"
                    className="text-danger"
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating Post..." : "Submit"}
                </button>

                {/* แสดงข้อความป้องกันการ submit ซ้ำ */}
                {isSubmitting && (
                  <div className="mt-2 text-muted small">
                    <i className="bi bi-info-circle me-1"></i>
                    Please wait, do not click submit again...
                  </div>
                )}
              </Form>

              <br />
              <br />

              <div
                className={
                  window.innerWidth <= 425
                    ? "container-fluid"
                    : "container border border-dark shadow-sm rounded glasx"
                }
              >
                <div
                  className={
                    window.innerWidth <= 425
                      ? "d-flex justify-content-center"
                      : ""
                  }
                >
                  <div
                    className={window.innerWidth <= 426 ? "" : "swx container"}
                  >
                    <br />

                    <h1
                      className=""
                      style={{ fontWeight: "bolder", fontSize: "42.5px" }}
                    >
                      {Newfrom.header}
                    </h1>

                    <p
                      className=""
                      style={{ fontSize: "25px", opacity: "60%" }}
                    >
                      {Newfrom.short}
                    </p>

                    <p
                      className="border-top border-bottom border-dark  p-2"
                      style={{ fontSize: "16px" }}
                    >
                      <i className="bi bi-person-circle"></i>
                      &nbsp;{user?.username || ""}
                    </p>

                    <p className="" style={{ fontSize: "12px" }}>
                      <img className="m-1 iconsize" src={Ic[0]} alt="x" />

                      <span className="" style={{ fontWeight: "bold" }}>
                        {Newfrom.post_datetime}
                      </span>

                      <img className="m-1 iconsize" src={Ic[1]} alt="x" />

                      <span className=""> 1.5k </span>

                      <img className="m-1 iconsize" src={Ic[2]} alt="x" />

                      <span className=""> 15 </span>
                    </p>
                  </div>
                </div>

                <div className="d-flex justify-content-center">
                  <img
                    className=""
                    src={
                      localImagePreview ||
                      uploadedImageUrl ||
                      Newfrom.image ||
                      "https://miro.medium.com/v2/resize:fit:1100/format:webp/1*1Eq0WTubrn1gd_NofdVtJg.png"
                    }
                    alt="x"
                    style={{ width: "70%" }}
                  />
                </div>

                {/* แสดงข้อมูล Cloudinary */}
                {cloudinaryData && (
                  <div className="mt-3 p-3 bg-light rounded">
                    <h6>Cloudinary Data:</h6>
                    <div className="row">
                      <div className="col-md-6">
                        <p>
                          <strong>Public ID:</strong> {cloudinaryData.publicId}
                        </p>
                        <p>
                          <strong>Format:</strong> {cloudinaryData.format}
                        </p>
                        <p>
                          <strong>Size:</strong> {cloudinaryData.width} x{" "}
                          {cloudinaryData.height}
                        </p>
                      </div>
                      <div className="col-md-6">
                        <p>
                          <strong>URL:</strong>{" "}
                          <a
                            href={cloudinaryData.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View Image
                          </a>
                        </p>
                        <p>
                          <strong>Asset ID:</strong> {cloudinaryData.assetId}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <br />

                <div className="d-flex justify-content-center">
                  <div className="swx">
                    <p
                      className="crimson-text-regular"
                      style={{ fontSize: "24px" }}
                    >
                      {Newfrom.post_text}
                    </p>
                  </div>
                </div>
              </div>

              <br />
            </>
          )}
        </Formik>
        {message && (
          <div
            className={`alert ${message.includes("successfully")
                ? "alert-success"
                : "alert-danger"
              }`}
          >
            {message}
          </div>
        )}
      </div>
    </>
  );
};

export default Addcontent;
