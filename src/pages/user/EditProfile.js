import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ApiController from "../../shared/services/ApiController";
import { FormField, Button } from "../../shared/components";
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  username: Yup.string().required("Required"),
  first_name: Yup.string().required("Required"),
  last_name: Yup.string().required("Required"),
  phone: Yup.string().required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
});

export default function EditProfile() {
  const { user_id } = useParams();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const result = await ApiController.getUserById(user_id);
        if (result.success) {
          setProfileData(result.data);
        } else {
          setMessage("Failed to load profile data");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setMessage("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user_id]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const result = await ApiController.updateUserProfile(user_id, values);
      if (result.success) {
        setMessage("Profile updated successfully!");
        setTimeout(() => {
          navigate('/profile');
        }, 1000);
      } else {
        setMessage("Failed to update profile. Please try again.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage("Failed to update profile. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-text-muted">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <h2 className="text-3xl font-bold text-text-primary mb-8">Edit Profile</h2>

        <div className="bg-bg-secondary border border-border-color rounded-xl shadow-sm p-6 md:p-8">
          <Formik
            initialValues={profileData}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ isSubmitting }) => (
              <Form className="space-y-6">
                <FormField
                  name="username"
                  label="Username"
                  type="text"
                  required
                />

                <FormField
                  name="first_name"
                  label="First Name"
                  type="text"
                  required
                />

                <FormField
                  name="last_name"
                  label="Last Name"
                  type="text"
                  required
                />

                <FormField
                  name="phone"
                  label="Phone"
                  type="text"
                  required
                />

                <FormField
                  name="email"
                  label="Email"
                  type="email"
                  required
                />

                <div className="flex items-center gap-4">
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isSubmitting}
                    className="px-6"
                  >
                    {isSubmitting ? "Updating..." : "Update Profile"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/profile')}
                    className="px-6"
                  >
                    Cancel
                  </Button>
                </div>

                {message && (
                  <div
                    className={`p-4 rounded-lg ${
                      message.includes("successfully")
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-red-50 text-red-700 border border-red-200"
                    }`}
                  >
                    {message}
                  </div>
                )}
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
