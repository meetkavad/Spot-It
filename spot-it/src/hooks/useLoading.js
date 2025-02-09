import { useState } from "react";

export const useLoading = () => {
  const [loading, setLoading] = useState(false);

  const showLoader = () => setLoading(true);
  const hideLoader = () => setLoading(false);

  return { loading, showLoader, hideLoader };
};
