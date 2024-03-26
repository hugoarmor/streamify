import { useMutation, useQuery } from "react-query";
import { AuthQueries } from "../queries/auth";
import { useEffect } from "react";
import { setCookie } from "nookies";

export function useAuth() {
  const {
    data: user,
    isLoading,
    isSuccess: isAuthenticated,
    isError,
    refetch,
  } = useQuery("user", AuthQueries.me);
  const { data: signInJamGuestData, mutate: signInJamGuest } = useMutation(
    "signInJamGuest",
    AuthQueries.signInJamGuest
  );

  useEffect(() => {
    if (!signInJamGuestData) return;

    setCookie(null, "bearerToken", signInJamGuestData.token, {
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });

    refetch();
  }, [signInJamGuestData]);

  return { user, isLoading, isError, isAuthenticated, signInJamGuest };
}
