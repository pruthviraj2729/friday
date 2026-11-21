import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authApi, getApiError, setAccessToken } from "../api/authApi.js";
import { clearAuthError, setAuthError, setAuthenticated, setGuest } from "../state/authSlice.js";

export function useAuth() {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = useCallback(async (mode, values) => {
    setIsSubmitting(true);
    dispatch(clearAuthError());
    try {
      const result = await authApi[mode](values);
      setAccessToken(result.accessToken);
      dispatch(setAuthenticated({ user: result.user, accessToken: result.accessToken }));
      return true;
    } catch (error) {
      dispatch(setAuthError(getApiError(error)));
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [dispatch]);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      setAccessToken(null);
      dispatch(setGuest());
    }
  }, [dispatch]);

  const clearError = useCallback(() => dispatch(clearAuthError()), [dispatch]);

  return {
    ...auth,
    isSubmitting,
    signIn: (values) => submit("login", values),
    signUp: (values) => submit("register", values),
    logout,
    clearError
  };
}
