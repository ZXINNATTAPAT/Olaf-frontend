import React, { useState, useRef, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Loader } from "../../shared/components";
import useAuth from "../../shared/hooks/useAuth";
import useLoader from "../../shared/hooks/useLoader";
import ApiController from "../../shared/services/ApiController";
import ApiErrorHandler from "../../shared/services/ApiErrorHandler";
import axiosInstance from "../../shared/services/httpClient";
import authService from "../../shared/services/AuthService";
import { PostForm, PostPreview } from "../../shared/components";
import { CreatePostWithImageRequestDTO } from "../../shared/types/dto";
import { sanitizeDTO } from "../../shared/utils/dtoHelpers";
import {
  compressImage,
  validateImageFile,
  createImagePreview,
  revokeImagePreview,
} from "../../shared/utils/imageHelpers";
import {
  saveDraft,
  loadDraft,
  clearDraft,
  hasDraft,
  getDraftAge,
  formatDraftAge,
  DRAFT_AUTO_SAVE_INTERVAL,
} from "../../shared/utils/draftHelpers";
import {
  logCookieStatus,
  checkCookiesInApplicationTab,
  verifyCookiesInNetworkTab,
} from "../../shared/utils/cookieHelpers";
import { runFullCookieDiagnostic } from "../../shared/utils/debugCookies";

export default function CreatePost() {
  const { user } = useAuth();
  const { showLoader, hideLoader } = useLoader();
  const navigate = useNavigate();
  const location = useLocation();
  const fromLocation = location?.state?.from?.pathname || "/profile";
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' | 'error' | 'info'
  const [formData, setFormData] = useState({
    header: "",
    short: "",
    post_text: "",
    image: null,
    imagePreview: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showDraftRestore, setShowDraftRestore] = useState(false);
  const isSubmittingRef = useRef(false);
  const autoSaveIntervalRef = useRef(null);
  const draftLoadedRef = useRef(false);

  // Load draft on mount
  useEffect(() => {
    if (!draftLoadedRef.current && hasDraft()) {
      const draft = loadDraft();
      if (draft && (draft.header || draft.short || draft.post_text)) {
        setShowDraftRestore(true);
        draftLoadedRef.current = true;
      }
    }
  }, []);

  // Auto-save draft
  useEffect(() => {
    // Only auto-save if there's content
    if (formData.header || formData.short || formData.post_text) {
      autoSaveIntervalRef.current = setInterval(() => {
        saveDraft(formData);
      }, DRAFT_AUTO_SAVE_INTERVAL);
    }

    return () => {
      if (autoSaveIntervalRef.current) {
        clearInterval(autoSaveIntervalRef.current);
      }
    };
  }, [formData]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (autoSaveIntervalRef.current) {
        clearInterval(autoSaveIntervalRef.current);
      }
    };
  }, []);

  const restoreDraft = useCallback(() => {
    const draft = loadDraft();
    if (draft) {
      setFormData({
        header: draft.header || "",
        short: draft.short || "",
        post_text: draft.post_text || "",
        image: null,
        imagePreview: draft.imagePreview || null,
      });
      setShowDraftRestore(false);
      setMessage("Draft restored successfully");
      setMessageType("success");
      setTimeout(() => setMessage(""), 3000);
    }
  }, []);

  const discardDraft = useCallback(() => {
    clearDraft();
    setShowDraftRestore(false);
  }, []);

  const handleImageChange = async (file, previewUrl) => {
    if (!file) {
      // Remove image
      if (formData.imagePreview) {
        revokeImagePreview(formData.imagePreview);
      }
      setFormData((prev) => ({
        ...prev,
        image: null,
        imagePreview: null,
      }));
      return;
    }

    // Validate image
    const validation = validateImageFile(file, { maxSizeMB: 5 });
    if (!validation.valid) {
      setMessage(validation.error);
      setMessageType("error");
      setTimeout(() => setMessage(""), 5000);
      return;
    }

    try {
      // Compress image if needed
      setMessage("กำลังบีบอัดรูปภาพ...");
      setMessageType("info");
      const compressedFile = await compressImage(file, {
        maxWidth: 1920,
        maxHeight: 1080,
        quality: 0.8,
        maxSizeMB: 2,
      });

      // Revoke old preview
      if (formData.imagePreview) {
        revokeImagePreview(formData.imagePreview);
      }

      // Create new preview
      const preview = createImagePreview(compressedFile);

      setFormData((prev) => ({
        ...prev,
        image: compressedFile,
        imagePreview: preview,
      }));

      setMessage("รูปภาพพร้อมใช้งาน");
      setMessageType("success");
      setTimeout(() => setMessage(""), 2000);
    } catch (error) {
      console.error("Error processing image:", error);
      setMessage("เกิดข้อผิดพลาดในการประมวลผลรูปภาพ");
      setMessageType("error");
      setTimeout(() => setMessage(""), 5000);
    }
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
    setMessageType("");
    setUploadProgress(0);

    try {
      let imageUrl = null;

      if (values.image) {
        console.log("Starting image upload to Cloudinary");
        showLoader("กำลังอัปโหลดรูปภาพ...");
        setUploadProgress(10);
        try {
          // Validate image again before upload
          const validation = validateImageFile(values.image);
          if (!validation.valid) {
            throw new Error(validation.error);
          }

          const formData = new FormData();
          formData.append("file", values.image);
          formData.append(
            "upload_preset",
            process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET || "OLAF"
          );
          formData.append("folder", "olaf/blog");

          setUploadProgress(30);

          const cloudinaryResponse = await fetch(
            `https://api.cloudinary.com/v1_1/${
              process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || "your_cloud_name"
            }/image/upload`,
            {
              method: "POST",
              body: formData,
            }
          );

          setUploadProgress(70);

          if (!cloudinaryResponse.ok) {
            const errorText = await cloudinaryResponse.text();
            console.error("Cloudinary upload failed:", errorText);
            throw new Error(
              `Cloudinary upload failed: ${cloudinaryResponse.status} - ${errorText}`
            );
          }

          const cloudinaryResult = await cloudinaryResponse.json();
          imageUrl = cloudinaryResult.secure_url;
          setUploadProgress(100);
          console.log("Image uploaded successfully:", imageUrl);
        } catch (imageError) {
          console.error("Error uploading image to Cloudinary:", imageError);
          const errorMessage = ApiErrorHandler.handleError({
            message:
              imageError.message || "Image upload failed. Please try again.",
          });
          setMessage(
            errorMessage.message || "Image upload failed. Please try again."
          );
          setMessageType("error");
          hideLoader();
          setUploadProgress(0);
          isSubmittingRef.current = false;
          setIsSubmitting(false);
          setSubmitting(false);
          return;
        }
      }

      console.log("Starting post creation");
      showLoader("กำลังสร้างโพสต์...");

      // Debug: Check cookies and CSRF token
      if (process.env.NODE_ENV === "development") {
        console.log("🔍 Pre-request check:", {
          hasCSRFToken: !!authService.csrfToken,
          csrfToken: authService.csrfToken,
          user: user,
          apiBaseURL: axiosInstance.defaults.baseURL,
        });
        logCookieStatus(); // Log cookie status (note: HttpOnly cookies won't appear here)
        checkCookiesInApplicationTab(); // Instructions to check Application tab
        verifyCookiesInNetworkTab(); // Instructions to check Network tab

        // Run full diagnostic if cookies seem missing
        if (!authService.csrfToken) {
          console.warn("⚠️ No CSRF token found - running full diagnostic...");
          runFullCookieDiagnostic();
        }
      }

      if (imageUrl) {
        // Use DTO structure
        // Note: Axios interceptor will automatically handle authentication and token refresh
        const postData = sanitizeDTO(
          {
            header: values.header,
            short: values.short,
            post_text: values.post_text,
            image_url: imageUrl,
            caption: "Main image for my post",
            is_primary: true,
            sort_order: 0,
          },
          CreatePostWithImageRequestDTO
        );

        // Use fetch instead of axios to ensure cookies are sent
        // Axios may have issues with withCredentials in some browsers
        const baseURL =
          axiosInstance.defaults.baseURL || "http://localhost:8000/api";

        // IMPORTANT: Check if cookies exist before making request
        // Note: HttpOnly cookies cannot be read via document.cookie
        // But we can check Application tab → Cookies → localhost:8000
        if (process.env.NODE_ENV === "development") {
          console.log("🔵 POST Request (fetch):", {
            url: `${baseURL}/posts/create-with-image/`,
            method: "POST",
            credentials: "include",
            hasCSRFToken: !!authService.csrfToken,
            postData: postData,
            note: "Check Network tab → Request Headers → Cookie to verify cookies are sent",
          });
          console.log("🍪 Cookie Check:", {
            note: "HttpOnly cookies (access, refresh) cannot be read via JavaScript",
            instruction:
              "Please check DevTools → Application → Cookies → http://localhost:8000",
            expectedCookies: ["access", "refresh", "csrftoken"],
          });
        }

        // CRITICAL: Use credentials: 'include' to send cookies with cross-origin requests
        // This is equivalent to withCredentials: true in axios
        const response = await fetch(`${baseURL}/posts/create-with-image/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": authService.csrfToken || "",
          },
          credentials: "include", // CRITICAL: This ensures cookies are sent with cross-origin requests
          body: JSON.stringify(postData),
        });

        if (!response.ok) {
          const errorData = await response
            .json()
            .catch(() => ({ detail: "Unknown error" }));

          // If 401, check if cookies are being sent
          if (response.status === 401) {
            if (process.env.NODE_ENV === "development") {
              console.error("❌ 401 Unauthorized - Cookies may not be sent");
              console.error("🔍 Debug Info:", {
                status: response.status,
                statusText: response.statusText,
                url: `${baseURL}/posts/create-with-image/`,
                credentials: "include",
                note: "Check Network tab → Request Headers → Cookie to verify cookies are sent",
              });
              runFullCookieDiagnostic();
            }
          }

          throw new Error(
            errorData.detail || errorData.error || "Failed to create post"
          );
        }

        const responseData = await response.json();

        console.log("Post created successfully:", responseData);
        setMessage("โพสต์ถูกสร้างสำเร็จแล้ว!");
        setMessageType("success");

        // Clear draft on success
        clearDraft();
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
        setMessage("โพสต์ถูกสร้างสำเร็จแล้ว!");
        setMessageType("success");

        // Clear draft on success
        clearDraft();
      }

      hideLoader();
      setUploadProgress(0);
      isSubmittingRef.current = false;
      setIsSubmitting(false);
      setSubmitting(false);

      resetForm();

      // Clean up image preview
      if (formData.imagePreview) {
        revokeImagePreview(formData.imagePreview);
      }

      setFormData({
        header: "",
        short: "",
        post_text: "",
        image: null,
        imagePreview: null,
      });

      // Navigate after showing success message
      setTimeout(() => {
        navigate(fromLocation, { replace: true });
      }, 1500);
    } catch (error) {
      console.error("Error creating post:", error);

      // Use ApiErrorHandler for consistent error handling
      const errorInfo = ApiErrorHandler.handleError(error);

      // Check if it's an authentication error
      if (
        error.response?.status === 401 ||
        error.message?.includes("Unauthorized") ||
        errorInfo.status === 401
      ) {
        // Note: HttpOnly cookies won't appear in document.cookie
        // Check Application tab → Cookies instead
        const errorDetail =
          error.response?.data?.detail || error.message || errorInfo.message;

        if (process.env.NODE_ENV === "development") {
          console.error("❌ Authentication error - running diagnostic...");
          runFullCookieDiagnostic();
        }

        if (
          errorDetail?.includes("No valid refresh token") ||
          errorDetail?.includes("token_not_valid")
        ) {
          setMessage(
            "การยืนยันตัวตนล้มเหลว: ไม่พบ cookies ที่ถูกต้อง กรุณา: 1) Logout และ login ใหม่, 2) ตรวจสอบ Application tab → Cookies, 3) ตรวจสอบ Network tab → Login response มี Set-Cookie headers"
          );
        } else {
          setMessage("Session หมดอายุ กรุณา login ใหม่");
        }
        setMessageType("error");

        // Redirect will be handled by httpClient interceptor
        // But we can also navigate here as a fallback
        setTimeout(() => {
          navigate("/auth/login", { replace: true });
        }, 3000);
      } else {
        setMessage(
          errorInfo.message || "ไม่สามารถสร้างโพสต์ได้ กรุณาลองอีกครั้ง"
        );
        setMessageType("error");
      }

      hideLoader();
      setUploadProgress(0);
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
          <h2 className="text-3xl font-bold text-text-primary mb-8">
            Create a New Post
          </h2>

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
                  onFormChange={(values) =>
                    setFormData((prev) => ({ ...prev, ...values }))
                  }
                />
                {/* Draft Restore Banner */}
                {showDraftRestore && hasDraft() && (
                  <div className="mt-4 p-4 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">พบแบบร่างที่บันทึกไว้</p>
                        <p className="text-sm text-blue-600">
                          {formatDraftAge(getDraftAge())}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={restoreDraft}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                          กู้คืน
                        </button>
                        <button
                          onClick={discardDraft}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm"
                        >
                          ยกเลิก
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Upload Progress */}
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-text-secondary">
                        กำลังอัปโหลดรูปภาพ...
                      </span>
                      <span className="text-sm text-text-secondary">
                        {uploadProgress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Message Display */}
                {message && (
                  <div
                    className={`mt-4 p-4 rounded-lg ${
                      messageType === "success"
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : messageType === "error"
                        ? "bg-red-50 text-red-700 border border-red-200"
                        : "bg-blue-50 text-blue-700 border border-blue-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{message}</span>
                      <button
                        onClick={() => {
                          setMessage("");
                          setMessageType("");
                        }}
                        className="ml-4 text-current opacity-70 hover:opacity-100"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Preview Section */}
            <div>
              <h3 className="text-xl font-semibold text-text-primary mb-4">
                Preview
              </h3>
              <PostPreview formData={formData} user={user} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
