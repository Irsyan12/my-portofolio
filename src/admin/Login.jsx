import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import CustomTextField from "../components/OutlinedTextField";
import { login } from "../firebase/auth"; 
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import { Snackbar, Alert } from "@mui/material";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error"
  });
  
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  // If already logged in, redirect to admin
  useEffect(() => {
    if (currentUser) {
      navigate('/admin');
    }
  }, [currentUser, navigate]);

  const logo = "https://res.cloudinary.com/dxwmph7tj/image/upload/v1741494933/images-web/whtlytqgyqdef1mxnndl.png";
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setSnackbar({
        open: true,
        message: "Please enter both email and password",
        severity: "warning"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await login(email, password);
      // No need to use localStorage for auth state,
      // Firebase handles this with tokens
      navigate('/admin');
    } catch (error) {
      console.error("Login error:", error);
      setSnackbar({
        open: true,
        message: error.message || "Authentication failed",
        severity: "error"
      });
    } finally {
      setIsLoading(false);
    }
  };    

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark text-white">
      <div className="w-5/6 md:w-full max-w-md p-8 bg-white/5 rounded-lg shadow-lg">
        <img src={logo} className="w-28 mx-auto mb-2" alt="Logo" draggable="false" />
        <h2 className="text-2xl font-bold text-center mb-6">Admin Login</h2>
        
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
            required
          />
          <CustomTextField
            type="password"
            id="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="outlined"
            focusedColor="secondary"
            required
          />
          <button 
            type="submit"
            className="w-full bg-color1 text-black px-6 py-3 rounded-md hover:bg-opacity-90 transition-colors mt-4 flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></span>
            ) : (
              "Login"
            )}
          </button>
        </Box>
      </div>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default LoginPage;