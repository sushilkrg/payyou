import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { type RootState } from "../store/store";
import { setAuth, clearAuth } from "../store/slices/authSlice";
import { clearUser } from "../store/slices/userSlice";
// import axios from "axios";
import api from "../api/axiosInstance"

export const useRefreshOnLoad = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((s: RootState) => s.auth.isAuthenticated);
  const accessToken = useSelector((s: RootState) => s.auth.accessToken);

  // isReady controls whether the app renders yet
  // keeps UI hidden until we know the auth state is resolved
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const tryRefresh = async () => {
      // Case 1: Not authenticated — nothing to do, render immediately
      if (!isAuthenticated) {
        setIsReady(true);
        return;
      }

      // Case 2: Authenticated and accessToken already in memory
      // (e.g. navigating between pages without a full refresh)
      if (accessToken) {
        setIsReady(true);
        return;
      }

      // Case 3: Authenticated but no accessToken (page was refreshed)
      // Silently call /auth/refresh-token — httpOnly cookie sent automatically
      try {
        const { data } = await api.post(
          `/auth/refresh-token`,
          { withCredentials: true },
        );
        dispatch(setAuth({ accessToken: data.accessToken }));
      } catch {
        // Refresh token expired or invalid — force logout
        dispatch(clearAuth());
        dispatch(clearUser());
      } finally {
        setIsReady(true);
      }
    };

    tryRefresh();
  }, []);

  return { isReady };
};
