import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "../../Api/axios";
import classes from "../Login/login.module.css";

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();

    if (password !== confirmPwd) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post(`/users/reset-password/${token}`, {
        password,
      });
      setMessage(res.data.message);
      setError("");
    } catch (err) {
      setMessage("");
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <section className={classes.signIn_container}>
      <h1>Reset Password</h1>
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p className={classes.error_message}>{error}</p>}
      <form onSubmit={handleReset} className={classes.signIn_form}>
        <div className={classes.label_in}>
          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm password"
            value={confirmPwd}
            onChange={(e) => setConfirmPwd(e.target.value)}
            required
            style={{ marginTop: "15px" }}
          />
        </div>
        <button className={classes.submit} type="submit">
          Reset Password
        </button>
        <p className={classes.forgotPwd}>
          <Link to="/login">Back to login</Link>
        </p>
      </form>
    </section>
  );
};

export default ResetPassword;
