import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing/Landing";
import Layout from "./Components/Layout/Layout";
import Home from "./pages/Home/Home";
import Questions from "./pages/Questions/Questions";
import Answer from "./pages/Answer/Answer";
import HowItWorks from "./pages/HowItWorks/HowItWorks";
import ForgotPassword from "./Components/Reset/ForgotPassword";
import ResetPassword from "./Components/Reset/ResetPassword"; // Import ResetPassword

function Routing() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Landing />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/question" element={<Questions />} />
        <Route path="/home/answers/:questionId" element={<Answer />} />
      </Route>

      {/* Existing Forgot Password route */}
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Add Reset Password route */}
      <Route path="/reset-password/:token" element={<ResetPassword />} />
    </Routes>
  );
}

export default Routing;
