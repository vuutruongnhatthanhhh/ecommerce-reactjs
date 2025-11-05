import Cookies from "js-cookie";
import { useAppDispatch, useAppSelector } from "@/store";
import { logout as logoutAction } from "@/store/authSlice";
import { persistor } from "@/store";

export const useAuth = () => {
  // Lấy user từ Redux
  const user = useAppSelector((s) => s.auth.user);
  const dispatch = useAppDispatch();

  const token = Cookies.get("access_token");

  const logout = async () => {
    // 1) Xoá token trong cookie
    Cookies.remove("access_token", { path: "/" });

    // 2) Xoá Redux state
    dispatch(logoutAction());

    // 3) Dọn sạch redux-persist storage
    try {
      persistor.pause();
      await persistor.flush();
      await persistor.purge();
    } finally {
      persistor.persist();
    }
  };

  return {
    isAuthenticated: !!user,
    user,
    token,
    logout,
  };
};
