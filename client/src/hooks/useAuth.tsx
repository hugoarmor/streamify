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
    isSuccess: isUserAuthenticated,
    isError,
    refetch,
  } = useQuery("user", AuthQueries.me, {
    enabled: fetchUser,
  });
  const {
    isSuccess: isJamGuestAuthenticated,
    mutate: signInJamGuest,
    isError: isSignInJamGuestError,
  } = useMutation("signInJamGuest", AuthQueries.signInJamGuest);
  const {
    data: signInData,
    mutate: signIn,
    isError: isSignInError,
    isLoading: isLoadingSignIn
  } = useMutation("signIn", AuthQueries.signIn);

  useEffect(() => {
    const bearerToken = signInData?.token

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
  }, [signInData]);

  return {
    user,
    isLoading,
    isError,
    isAuthenticated: isUserAuthenticated || isJamGuestAuthenticated,
    signInJamGuest,
    isSignInJamGuestError,
    signIn,
    isSignInError,
    isLoadingSignIn,
  };
}
