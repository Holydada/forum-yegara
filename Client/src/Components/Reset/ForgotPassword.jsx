import React, { useState } from "react";
import axios from "../../Api/axios";
import { Link } from "react-router-dom";
import classes from "../Login/login.module.css"; // reusing your existing styles

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleForgot = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/users/forgot-password", { email });
      setMessage(res.data.message);
      setError("");
      // Redirect to login after a delay (optional)
      if (res.data.message) {
        setTimeout(() => (window.location.href = "/login"), 2000);
      }
    } catch (err) {
      setMessage("");
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className={classes.center_wrapper}>
      <section className={classes.signIn_container}>
        <h1>Forgot Password</h1>
        <p>Enter your email to receive a password reset link.</p>
        {message && <p style={{ color: "green" }}>{message}</p>}
        {error && <p className={classes.error_message}>{error}</p>}

        <form onSubmit={handleForgot} className={classes.signIn_form}>
          <div className={classes.label_in}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button className={classes.submit} type="submit">
            Send Reset Link
          </button>
          <p className={classes.forgotPwd}>
            <Link to="/login">Back to login</Link>
          </p>
        </form>
      </section>
    </div>
  );
};

export default ForgotPassword;
