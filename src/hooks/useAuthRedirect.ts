import { useEffect } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

export const useAuthRedirect = () => {
  const navigate = useNavigate();
  const token = Cookies.get("access_token");

  useEffect(() => {
    if (token) {
      // Nếu đã đăng nhập thì không cho vào đăng ký / đăng nhập
      navigate("/");
    }
  }, [token, navigate]);
};
