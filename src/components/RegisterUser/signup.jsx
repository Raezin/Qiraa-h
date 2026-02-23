import React, { useState } from "react";
import {
  Stack,
  Typography,
  TextField,
  Button,
  Divider,
  Link,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import GoogleIcon from "@mui/icons-material/Google";
import { useNotify } from "../../utils/NotificationContext";
import { useUser } from "../../utils/UserContext";
import { signup, loginWithGoogleHandler } from "../../utils/dataValidator";
import { useNavigate } from "react-router-dom";

const formVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Signup({ switchForm }) {
  const notify = useNotify();
  const { setUser } = useUser();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
    setErrors({ ...errors, [field]: false });
  };

  /* ============================= */
  /* STEP 1 VALIDATION */
  /* ============================= */

  const handleNext = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = true;
      notify.warning("Please enter your full name");
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = true;
      notify.warning("Please enter a valid email address");
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setStep(2);
  };

  /* ============================= */
  /* FINAL SIGNUP */
  /* ============================= */

  const handleSignup = async () => {
    const newErrors = {};

    if (!formData.password) {
      newErrors.password = true;
      notify.warning("Password cannot be empty");
    } else if (!formData.confirmPassword) {
      newErrors.confirmPassword = true;
      notify.warning("Please confirm your password");
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.password = true;
      newErrors.confirmPassword = true;
      notify.error("Passwords do not match");
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);

      const result = await signup(
        formData.name,
        formData.email,
        formData.password
      );

      if (result.success) {
        notify.success("Account created successfully 🎉");

        // Optional: automatically switch to login
        switchForm();

        // OR automatically login & redirect (advanced version)
        // navigate("/dashboard");
      } else {
        notify.error(result.message || "Signup failed");
      }

    } catch (err) {
      notify.error("Something went wrong during signup");
    } finally {
      setLoading(false);
    }
  };

  /* ============================= */
  /* GOOGLE SIGNUP */
  /* ============================= */

  const handleGoogleSignup = async () => {
    try {
      setLoading(true);

      const result = await loginWithGoogleHandler(setUser);

      if (result.success) {
        notify.success("Google signup successful 🎉");
        navigate("/dashboard");
      } else {
        notify.error(result.message || "Google signup failed");
      }

    } catch (err) {
      notify.error("Google authentication error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div variants={formVariant} initial="hidden" animate="visible" exit="exit">
      <Stack spacing={3}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Create Account
        </Typography>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div key="step1" variants={formVariant} initial="hidden" animate="visible" exit="exit">
              <Stack spacing={2}>
                <TextField
                  label="Full Name"
                  fullWidth
                  variant="filled"
                  value={formData.name}
                  onChange={handleChange("name")}
                  error={Boolean(errors.name)}
                />
                <TextField
                  label="Email"
                  type="email"
                  fullWidth
                  variant="filled"
                  value={formData.email}
                  onChange={handleChange("email")}
                  error={Boolean(errors.email)}
                />
              </Stack>
            </motion.div>
          ) : (
            <motion.div key="step2" variants={formVariant} initial="hidden" animate="visible" exit="exit">
              <Stack spacing={2}>
                <TextField
                  label="Password"
                  type="password"
                  fullWidth
                  variant="filled"
                  value={formData.password}
                  onChange={handleChange("password")}
                  error={Boolean(errors.password)}
                />
                <TextField
                  label="Confirm Password"
                  type="password"
                  fullWidth
                  variant="filled"
                  value={formData.confirmPassword}
                  onChange={handleChange("confirmPassword")}
                  error={Boolean(errors.confirmPassword)}
                />
              </Stack>
            </motion.div>
          )}
        </AnimatePresence>

        {step === 1 ? (
          <Button
            variant="contained"
            fullWidth
            sx={{ py: 1.5, borderRadius: 3 }}
            onClick={handleNext}
            disabled={loading}
          >
            Next
          </Button>
        ) : (
          <Button
            variant="contained"
            fullWidth
            sx={{ py: 1.5, borderRadius: 3 }}
            onClick={handleSignup}
            disabled={loading}
          >
            {loading ? "Creating..." : "Sign Up"}
          </Button>
        )}

        <Stack direction="row" justifyContent="center" spacing={1}>
          <Typography sx={{ fontSize: "0.875rem" }}>
            Already have an account?
          </Typography>
          <Link component="button" onClick={switchForm}>
            Sign In
          </Link>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={1}>
          <Divider sx={{ flex: 1 }} />
          <Typography sx={{ fontSize: "0.75rem" }}>
            OR
          </Typography>
          <Divider sx={{ flex: 1 }} />
        </Stack>

        <Button
          variant="outlined"
          fullWidth
          startIcon={<GoogleIcon />}
          sx={{ py: 1.5, borderRadius: 3 }}
          onClick={handleGoogleSignup}
          disabled={loading}
        >
          {loading ? "Processing..." : "Sign up with Google"}
        </Button>
      </Stack>
    </motion.div>
  );
}
