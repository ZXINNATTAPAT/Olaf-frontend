import useAuth from "./useAuth";
import axiosInstance from "../services/axios/index";

export default function useLogout() {
  const { setUser, setAccessToken, setCSRFToken } = useAuth();

  const logout = async () => {
    try {
      // ใช้ HttpOnly cookies - server จะลบ cookies อัตโนมัติ
      const response = await axiosInstance.post(
        "/auth/logout/",
        {},
        {
          withCredentials: true,
        }
      );
      console.log(response);

      // ล้าง context
      setAccessToken(null);
      setCSRFToken(null);
      setUser({});

      // ลบเฉพาะ localStorage flags
      localStorage.removeItem("us");
      localStorage.removeItem("csrfToken");
      // ไม่ลบ accessToken เพราะใช้ cookies เป็นหลัก
    } catch (error) {
      console.log(error);
      // แม้จะ error ก็ให้ล้าง context
      setAccessToken(null);
      setCSRFToken(null);
      setUser({});
      localStorage.removeItem("us");
      localStorage.removeItem("csrfToken");
    }
  };

  return logout;
}
