// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import Box from "@mui/material/Box";
import CustomTextField from "../components/OutlinedTextField";
import { login } from "../firebase/auth"; // Import fungsi login dari auth.js

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const logo =
    "https://res.cloudinary.com/dxwmph7tj/image/upload/v1741494933/images-web/whtlytqgyqdef1mxnndl.png";
    const handleSubmit = async (e) => {
      e.preventDefault();
      setError("");
    
      try {
        await login(email, password); // Panggil fungsi login dari auth.js
        alert("Login successful!");
        // Redirect atau set authentication state di sini
      } catch (error) {
        setError(error.message);
      }
    };    

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark text-white">
      <div className="w-5/6 md:w-full max-w-md p-8 bg-white/5 rounded-lg shadow-lg">
        <img src={logo} className="w-28 mx-auto mb-2" draggable="false" />
        <h2 className="text-2xl font-bold text-center mb-6">Admin Login</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <Box
          component="form"
          sx={{ "& > :not(style)": { m: 2, width: "90%" } }}
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit}
        >
          <CustomTextField
            type="email"
            id="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant="outlined"
            focusedColor="success"
            className="mb-16"
          />
          <CustomTextField
            type="password"
            id="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="outlined"
            focusedColor="secondary"
          />
          <button className="w-full bg-color1 text-black px-6 py-3 rounded-md hover:bg-opacity-90 transition-colors mt-4">
            Login
          </button>
        </Box>
      </div>
    </div>
  );
};

export default LoginPage;
