import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
// import { IconPath } from "../../../shared/components";
import useAuth from "../../../shared/hooks/useAuth";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getImageUrl } from "../../../shared/services/CloudinaryService";
const baseUrl =
  process.env.REACT_APP_BASE_URL || "https://olaf-backend.onrender.com/api";

// Validation Schema using Yup
const form = Yup.object().shape({
  header: Yup.string().max(255, "Maximum 255 characters").required("Required"),
  short: Yup.string().max(255, "Maximum 255 characters").required("Required"),
  post_text: Yup.string().required("Required"),
  image: Yup.mixed(),
});

const EditPost = () => {
  const { post_id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const fromLocation = location?.state?.from?.pathname || "/Profile";
  const [message, setMessage] = useState("");
  const [post, setPost] = useState(null);
  // const Ic = IconPath();


  useEffect(() => {
    // Fetch post data when component loads
    const fetchPost = async () => {
      try {
        const response = await axios.get(`${baseUrl}/posts/${post_id}/`);
        setPost(response.data);
      } catch (error) {
        console.error("Error fetching post data:", error);
      }
    };
    fetchPost();
  }, [post_id]);

  const handleSubmit = async (values, { setSubmitting }) => {
    const formData = new FormData();
    formData.append("header", values.header);
    formData.append("short", values.short);
    formData.append("post_text", values.post_text);
    formData.append("user_id", user.id);

    if (values.image) {
      formData.append("image", values.image);
    }

    try {
      await axios.put(`${baseUrl}/posts/${post_id}/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      setMessage("Post updated successfully!");
      navigate(fromLocation, { replace: true });
    } catch (error) {
      console.error("Error updating post:", error);
      setMessage("Failed to update post. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <br />
      <br />

      <div className="container">
        <h2>Edit Post</h2>
        <Formik
          initialValues={{
            header: post.header || "",
            short: post.short || "",
            post_text: post.post_text || "",
            image: null,
          }}
          validationSchema={form}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, isSubmitting }) => (
            <Form>
              <div className="mb-3">
                <label htmlFor="header" className="form-label">
                  Header
                </label>
                <Field name="header" type="text" className="form-control" />
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
                <Field name="short" type="text" className="form-control" />
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
                  onChange={(event) =>
                    setFieldValue("image", event.currentTarget.files[0])
                  }
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
                Submit
              </button>
            </Form>
          )}
        </Formik>

        {message && <p>{message}</p>}

        <div className="post-preview mt-5">
          <h1>{post.header}</h1>
          <p>{post.short}</p>
          <p>{post.post_text}</p>
          <img
            src={getImageUrl(post.image, 'EDIT_PREVIEW')}
            alt="Post Preview"
            style={{ width: "70%" }}
            onError={(e) => {
              e.target.src = getImageUrl(null, 'DEFAULT');
            }}
          />
        </div>
      </div>
    </>
  );
};

export default EditPost;
