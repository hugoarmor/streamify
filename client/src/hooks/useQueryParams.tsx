import { useMemo } from "react";
import { useLocation } from "react-router-dom";

export function useQueryParams() {
  const { search } = useLocation();

  const urlSearchParams = useMemo(() => new URLSearchParams(search), [search]);
  return useMemo(() => Object.fromEntries(urlSearchParams), [urlSearchParams]);
}
