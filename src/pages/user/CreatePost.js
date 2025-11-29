import React, { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Loader } from "../../shared/components";
import useAuth from "../../shared/hooks/useAuth";
import useLoader from "../../shared/hooks/useLoader";
import ApiController from "../../shared/services/ApiController";
import axiosInstance from "../../shared/services/httpClient";
import authService from "../../shared/services/AuthService";
import { PostForm, PostPreview } from "../../shared/components";
import { CreatePostWithImageRequestDTO, sanitizeDTO } from "../../shared/types/dto";
import { logCookieStatus, checkCookiesInApplicationTab, verifyCookiesInNetworkTab } from "../../shared/utils/cookieHelpers";
import { runFullCookieDiagnostic } from "../../shared/utils/debugCookies";

export default function CreatePost() {
  const { user } = useAuth();
  const { showLoader, hideLoader } = useLoader();
  const navigate = useNavigate();
  const location = useLocation();
  const fromLocation = location?.state?.from?.pathname || "/profile";
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    header: "",
    short: "",
    post_text: "",
    image: null,
    imagePreview: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSubmittingRef = useRef(false);

  const handleImageChange = (file, previewUrl) => {
    setFormData(prev => ({
      ...prev,
      image: file,
      imagePreview: previewUrl,
    }));
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    if (isSubmittingRef.current) {
      console.log("Already submitting, ignoring duplicate request");
      return;
    }

    console.log("Starting form submission with values:", values);
    isSubmittingRef.current = true;
    setIsSubmitting(true);
    setSubmitting(true);
    setMessage("");

    try {
      let imageUrl = null;

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
            `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || "your_cloud_name"}/image/upload`,
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
          console.log("Image uploaded successfully:", imageUrl);
        } catch (imageError) {
          console.error("Error uploading image to Cloudinary:", imageError);
          setMessage("Image upload failed. Please try again.");
          hideLoader();
          isSubmittingRef.current = false;
          setIsSubmitting(false);
          setSubmitting(false);
          return;
        }
      }

      console.log("Starting post creation");
      showLoader("กำลังสร้างโพสต์...");

      // Debug: Check cookies and CSRF token
      if (process.env.NODE_ENV === 'development') {
        console.log('🔍 Pre-request check:', {
          hasCSRFToken: !!authService.csrfToken,
          csrfToken: authService.csrfToken,
          user: user,
          apiBaseURL: axiosInstance.defaults.baseURL
        });
        logCookieStatus(); // Log cookie status (note: HttpOnly cookies won't appear here)
        checkCookiesInApplicationTab(); // Instructions to check Application tab
        verifyCookiesInNetworkTab(); // Instructions to check Network tab
        
        // Run full diagnostic if cookies seem missing
        if (!authService.csrfToken) {
          console.warn('⚠️ No CSRF token found - running full diagnostic...');
          runFullCookieDiagnostic();
        }
      }

      if (imageUrl) {
        // Use DTO structure
        // Note: Axios interceptor will automatically handle authentication and token refresh
        const postData = sanitizeDTO({
          header: values.header,
          short: values.short,
          post_text: values.post_text,
          image_url: imageUrl,
          caption: 'Main image for my post',
          is_primary: true,
          sort_order: 0
        }, CreatePostWithImageRequestDTO);

        // Use fetch instead of axios to ensure cookies are sent
        // Axios may have issues with withCredentials in some browsers
        const baseURL = axiosInstance.defaults.baseURL || 'http://localhost:8000/api';
        
        // IMPORTANT: Check if cookies exist before making request
        // Note: HttpOnly cookies cannot be read via document.cookie
        // But we can check Application tab → Cookies → localhost:8000
        if (process.env.NODE_ENV === 'development') {
          console.log('🔵 POST Request (fetch):', {
            url: `${baseURL}/posts/create-with-image/`,
            method: 'POST',
            credentials: 'include',
            hasCSRFToken: !!authService.csrfToken,
            postData: postData,
            note: 'Check Network tab → Request Headers → Cookie to verify cookies are sent'
          });
          console.log('🍪 Cookie Check:', {
            note: 'HttpOnly cookies (access, refresh) cannot be read via JavaScript',
            instruction: 'Please check DevTools → Application → Cookies → http://localhost:8000',
            expectedCookies: ['access', 'refresh', 'csrftoken']
          });
        }
        
        // CRITICAL: Use credentials: 'include' to send cookies with cross-origin requests
        // This is equivalent to withCredentials: true in axios
        const response = await fetch(`${baseURL}/posts/create-with-image/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': authService.csrfToken || '',
          },
          credentials: 'include', // CRITICAL: This ensures cookies are sent with cross-origin requests
          body: JSON.stringify(postData),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
          
          // If 401, check if cookies are being sent
          if (response.status === 401) {
            if (process.env.NODE_ENV === 'development') {
              console.error('❌ 401 Unauthorized - Cookies may not be sent');
              console.error('🔍 Debug Info:', {
                status: response.status,
                statusText: response.statusText,
                url: `${baseURL}/posts/create-with-image/`,
                credentials: 'include',
                note: 'Check Network tab → Request Headers → Cookie to verify cookies are sent'
              });
              runFullCookieDiagnostic();
            }
          }
          
          throw new Error(errorData.detail || errorData.error || 'Failed to create post');
        }

        const responseData = await response.json();

        console.log("Post created successfully:", responseData);
        setMessage("Post created successfully with image!");
      } else {
        const postData = {
          header: values.header,
          short: values.short,
          post_text: values.post_text,
          user_id: user.id,
        };

        const result = await ApiController.createPost(postData);
        if (!result.success) {
          throw new Error(result.error || "Failed to create post");
        }

        console.log("Post created successfully:", result.data);
        setMessage("Post created successfully!");
      }

      hideLoader();
      isSubmittingRef.current = false;
      setIsSubmitting(false);
      setSubmitting(false);

      resetForm();
      setFormData({
        header: "",
        short: "",
        post_text: "",
        image: null,
        imagePreview: null,
      });

      navigate(fromLocation, { replace: true });
    } catch (error) {
      console.error("Error creating post:", error);
      
      // Check if it's an authentication error
      if (error.response?.status === 401 || error.message?.includes('Unauthorized')) {
        // Note: HttpOnly cookies won't appear in document.cookie
        // Check Application tab → Cookies instead
        const errorDetail = error.response?.data?.detail || error.message;
        
        if (process.env.NODE_ENV === 'development') {
          console.error('❌ Authentication error - running diagnostic...');
          runFullCookieDiagnostic();
        }
        
        if (errorDetail?.includes('No valid refresh token') || errorDetail?.includes('token_not_valid')) {
          setMessage("Authentication failed: No valid cookies found. Please: 1) Logout and login again, 2) Check Application tab → Cookies, 3) Check Network tab → Login response has Set-Cookie headers. See console for diagnostic info.");
        } else {
          setMessage("Session expired. Please login again.");
        }
        
        // Redirect will be handled by httpClient interceptor
        // But we can also navigate here as a fallback
        setTimeout(() => {
          navigate('/auth/login', { replace: true });
        }, 3000);
      } else {
        setMessage("Failed to create post. Please try again.");
      }
      
      hideLoader();
      isSubmittingRef.current = false;
      setIsSubmitting(false);
      setSubmitting(false);
    }
  };


  return (
    <>
      <Loader />
      <div className="min-h-screen bg-bg-primary py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl font-bold text-text-primary mb-8">Create a New Post</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form Section */}
            <div>
              <div className="bg-bg-secondary border border-border-color rounded-xl shadow-sm p-6">
                <PostForm
                  initialValues={formData}
                  onSubmit={handleSubmit}
                  isSubmitting={isSubmitting}
                  submitLabel="Create Post"
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
    </>
  );
}
