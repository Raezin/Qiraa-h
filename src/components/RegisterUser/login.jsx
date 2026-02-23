import React, { useState } from "react";
import {
  Stack,
  Typography,
  TextField,
  Button,
  Divider,
  Link,
} from "@mui/material";
import { motion } from "framer-motion";
import GoogleIcon from "@mui/icons-material/Google";
import { useNotify } from "../../utils/NotificationContext";
import { useUser } from "../../utils/UserContext";
import { login, loginWithGoogleHandler } from "../../utils/dataValidator";
import { useNavigate } from "react-router-dom";


const formVariant = {
  hidden: { x: 50, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
  exit: { x: -50, opacity: 0, transition: { duration: 0.4 } },
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login({ switchForm }) {
  const notify = useNotify();
  const { setUser } = useUser();
  const navigate = useNavigate();


  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
    setErrors({ ...errors, [field]: false });
  };

  /* ============================= */
  /* EMAIL/PASSWORD LOGIN */
  /* ============================= */

  const handleLogin = async () => {
    const newErrors = {};

    if (!emailRegex.test(formData.email)) {
      newErrors.email = true;
      notify.warning("Please enter a valid email address");
    } else if (!formData.password) {
      newErrors.password = true;
      notify.warning("Password cannot be empty");
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);

      const result = await login(
        formData.email,
        formData.password,
        setUser
      );

      if (result.success) {
        notify.success("Login successful 🎉");
        navigate("/")
      } else {
        notify.error(result.message || "Login failed");
      }

    } catch (err) {
      notify.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /* ============================= */
  /* GOOGLE LOGIN */
  /* ============================= */

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);

      const result = await loginWithGoogleHandler(setUser);

      if (result.success) {
        notify.success("Google login successful 🎉");
      } else {
        notify.error(result.message || "Google login failed");
      }

    } catch (err) {
      notify.error("Google authentication error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      variants={formVariant}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <Stack spacing={3}>
        <Typography variant="h4" sx={{ fontWeight: 600, textAlign: "center" }}>
          Login
        </Typography>

        <Stack spacing={2}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            variant="filled"
            value={formData.email}
            onChange={handleChange("email")}
            error={Boolean(errors.email)}
          />

          <TextField
            label="Password"
            type="password"
            fullWidth
            variant="filled"
            value={formData.password}
            onChange={handleChange("password")}
            error={Boolean(errors.password)}
          />
        </Stack>

        <Button
          variant="contained"
          fullWidth
          sx={{ py: 1.5, borderRadius: 3 }}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Processing..." : "Login"}
        </Button>

        <Stack direction="row" justifyContent="center" spacing={1}>
          <Typography sx={{ fontSize: "0.875rem" }}>
            New here?
          </Typography>
          <Link component="button" onClick={switchForm}>
            Create Account
          </Link>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={1}>
          <Divider sx={{ flex: 1 }} />
          <Typography sx={{ fontSize: "0.875rem" }}>
            OR
          </Typography>
          <Divider sx={{ flex: 1 }} />
        </Stack>

        <Button
          variant="outlined"
          fullWidth
          startIcon={<GoogleIcon />}
          sx={{ py: 1.5, borderRadius: 3 }}
          onClick={handleGoogleLogin}
          disabled={loading}
        >
          {loading ? "Processing..." : "Sign in with Google"}
        </Button>
      </Stack>
    </motion.div>
  );
}
