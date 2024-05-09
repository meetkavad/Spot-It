import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LoadingPage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    window.onload = () => {
      navigate("/Spot-It/v1/landing");
    };
  }, []);

  return (
    <>
      <h1>loading page</h1>
    </>
  );
};

export default LoadingPage;
