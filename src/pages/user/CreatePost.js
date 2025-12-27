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

        const response = await axiosInstance.post(
          "/posts/create-with-image/",
          postData
        );
        const responseData = response.data;

        console.log("Post created successfully:", responseData);

        console.log("Post created successfully:", responseData);
        setMessage("โพสต์ถูกสร้างสำเร็จแล้ว!");
        setMessageType("success");
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
      <div className="min-h-screen bg-white py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2
            className="text-4xl font-bold text-gray-900 mb-12 text-center md:text-left"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Create a New Post
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
            {/* Form Section */}
            <div>
              <div className="bg-white">
                <PostForm
                  initialValues={formData}
                  onSubmit={handleSubmit}
                  isSubmitting={isSubmitting}
                  submitLabel="Publish Post"
                  onImageChange={handleImageChange}
                  onFormChange={(values) =>
                    setFormData((prev) => ({ ...prev, ...values }))
                  }
                />
                {/* Draft Restore Banner */}
                {showDraftRestore && hasDraft() && (
                  <div className="mt-8 p-4 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 font-serif">
                        Unsaved Draft Found
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDraftAge(getDraftAge())}
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={restoreDraft}
                        className="px-4 py-2 bg-gray-900 text-white rounded-full hover:bg-black transition-colors text-xs font-medium uppercase tracking-wide"
                      >
                        Restore
                      </button>
                      <button
                        onClick={discardDraft}
                        className="px-4 py-2 border border-gray-200 text-gray-500 rounded-full hover:border-gray-400 hover:text-gray-900 transition-colors text-xs font-medium uppercase tracking-wide"
                      >
                        Discard
                      </button>
                    </div>
                  </div>
                )}

                {/* Upload Progress */}
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">
                        Uploading Image...
                      </span>
                      <span className="text-sm text-gray-500">
                        {uploadProgress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1">
                      <div
                        className="bg-red-600 h-1 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Message Display */}
                {message && (
                  <div
                    className={`mt-6 p-4 rounded-lg flex items-center justify-between ${
                      messageType === "success"
                        ? "bg-green-50 text-green-800"
                        : messageType === "error"
                        ? "bg-red-50 text-red-800"
                        : "bg-blue-50 text-blue-800"
                    }`}
                  >
                    <span className="text-sm font-medium">{message}</span>
                    <button
                      onClick={() => {
                        setMessage("");
                        setMessageType("");
                      }}
                      className="ml-4 text-current opacity-60 hover:opacity-100"
                    >
                      <i className="bi bi-x-lg"></i>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Preview Section */}
            <div className="hidden lg:block sticky top-24 self-start">
              <h3
                className="text-2xl font-bold text-gray-900 mb-8"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Preview
              </h3>
              <div className="border border-gray-100 rounded-2xl p-6 shadow-sm">
                <PostPreview formData={formData} user={user} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
