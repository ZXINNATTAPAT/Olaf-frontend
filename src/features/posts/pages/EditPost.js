import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useAuth from "../../../shared/hooks/useAuth";
import ApiController from "../../../shared/services/ApiController";
import { PostForm, PostPreview } from "../../../shared/components";
import { CardSkeleton } from "../../../shared/components";

export default function EditPost() {
  const { post_id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const fromLocation = location?.state?.from?.pathname || "/profile";
  const [message, setMessage] = useState("");
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    header: "",
    short: "",
    post_text: "",
    image: null,
    imagePreview: null,
  });

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const result = await ApiController.getPostById(post_id);
        if (result.success) {
          setPost(result.data);
          setFormData({
            header: result.data.header || "",
            short: result.data.short || "",
            post_text: result.data.post_text || "",
            image: null,
            imagePreview: result.data.primary_image_url || result.data.image || null,
          });
        }
      } catch (error) {
        console.error("Error fetching post data:", error);
        setMessage("Failed to load post data");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [post_id]);

  const handleImageChange = (file, previewUrl) => {
    setFormData(prev => ({
      ...prev,
      image: file,
      imagePreview: previewUrl,
    }));
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    setIsSubmitting(true);
    setSubmitting(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("header", values.header);
      formData.append("short", values.short);
      formData.append("post_text", values.post_text);
      formData.append("user_id", user.id);

      if (values.image) {
        formData.append("image", values.image);
      }

      const result = await ApiController.updatePost(post_id, formData);

      if (result.success) {
        setMessage("Post updated successfully!");
        setTimeout(() => {
          navigate(fromLocation, { replace: true });
        }, 1000);
      } else {
        setMessage("Failed to update post. Please try again.");
      }
    } catch (error) {
      console.error("Error updating post:", error);
      setMessage("Failed to update post. Please try again.");
    } finally {
      setIsSubmitting(false);
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <CardSkeleton type="large" />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="text-center">
          <p className="text-text-muted">Post not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <h2 className="text-3xl font-bold text-text-primary mb-8">Edit Post</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div>
            <div className="bg-bg-secondary border border-border-color rounded-xl shadow-sm p-6">
                <PostForm
                  initialValues={formData}
                  onSubmit={handleSubmit}
                  isSubmitting={isSubmitting}
                  submitLabel="Update Post"
                  onImageChange={handleImageChange}
                  onFormChange={(values) => setFormData(prev => ({ ...prev, ...values }))}
                />
              {message && (
                <div
                  className={`mt-4 p-4 rounded-lg ${
                    message.includes("successfully")
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}
                >
                  {message}
                </div>
              )}
            </div>
          </div>

          {/* Preview Section */}
          <div>
            <h3 className="text-xl font-semibold text-text-primary mb-4">Preview</h3>
            <PostPreview formData={formData} user={user} />
          </div>
        </div>
      </div>
    </div>
  );
}
