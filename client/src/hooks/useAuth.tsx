import { useMutation, useQuery } from "react-query";
import { AuthQueries } from "../queries/auth";
import { useEffect } from "react";
import { setCookie } from "nookies";

type Props = {
  fetchUser?: boolean
};

export function useAuth({ fetchUser = true }: Props = {}) {
  const {
    data: user,
    isLoading,
    isSuccess: isAuthenticated,
    isError,
    refetch,
  } = useQuery("user", AuthQueries.me, {
    enabled: fetchUser,
  });
  const {
    data: signInJamGuestData,
    mutate: signInJamGuest,
    isError: isSignInJamGuestError,
  } = useMutation("signInJamGuest", AuthQueries.signInJamGuest);
  const {
    data: signInData,
    mutate: signIn,
    isError: isSignInError,
    isLoading: isLoadingSignIn
  } = useMutation("signIn", AuthQueries.signIn);
  const isAdmin = user?.id !== "guest";

  useEffect(() => {
    const bearerToken = signInJamGuestData?.token ?? signInData?.token

    if (!bearerToken) return;

    setCookie(
      null,
      "bearerToken",
      bearerToken,
      {
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
      }
    );

    refetch();
  }, [signInJamGuestData, signInData]);

  return {
    user,
    isLoading,
    isError,
    isAuthenticated,
    signInJamGuest,
    isSignInJamGuestError,
    signIn,
    isSignInError,
    isLoadingSignIn,
    isAdmin
  };
}
