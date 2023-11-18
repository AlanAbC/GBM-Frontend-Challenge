"use client";

import { useState } from "react";
import styles from "./styles.module.scss";
import { Input, Button, Form } from "antd";
import { useAuth } from "@/utils/firebase/FirebaseAuthContext";
import { toast } from "react-toastify";
import queryKeys from "@/utils/queryKeys";
import { useRouter } from "next/navigation";

type FieldType = {
  email?: string;
  password?: string;
};

const Login = () => {
  const router = useRouter();
  const [loginForm] = Form.useForm();
  const [signUpForm] = Form.useForm();
  const { signup, login } = useAuth();
  const [isSigningUp, setIsSigningUp] = useState(false);

  const commonFormProps = {
    name: "basic",
    className: styles.form,
    autoComplete: "off",
  };

  // Handler for signup form submission
  const onFinishSignup = async ({ email, password }: FieldType) => {
    try {
      const userData = await signup(email, password);
      // Store user data in local storage and redirect to the home page
      localStorage.setItem(queryKeys.USER, userData.user.email);
      router.replace("/");
    } catch (error) {
      handleAuthError(error, "Error signing up. Please try again.");
    }
  };

  // Handler for login form submission
  const onFinishLogin = async ({ email, password }: FieldType) => {
    try {
      const userData = await login(email, password);
      // Store user data in local storage and redirect to the home page
      localStorage.setItem(queryKeys.USER, userData.user.email);
      router.replace("/");
    } catch (error) {
      handleAuthError(error, "Error logging in. Please try again.");
    }
  };

  const handleAuthError = (error: any, defaultMessage: string) => {
    const errorMessage =
      error.code === "auth/email-already-in-use"
        ? "Email already registered. Please log in."
        : error.code === "auth/invalid-login-credentials"
        ? "Invalid credentials. Please try again."
        : defaultMessage;

    toast.error(errorMessage);
  };

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <p className={styles.header}>Stock Tickers</p>
      </div>
      <div className={styles.right}>
        <Form
          form={isSigningUp ? signUpForm : loginForm}
          onFinish={isSigningUp ? onFinishSignup : onFinishLogin}
          {...commonFormProps}
        >
          <p className={styles.title}>{isSigningUp ? "Sign up" : "Log in"}</p>
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                type: "email",
                message: "Please enter a valid email",
              },
            ]}
          >
            <Input type="email" placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your password" }]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>

          <Form.Item>
            <Button
              data-testId="login-form-button"
              type="primary"
              htmlType="submit"
            >
              {isSigningUp ? "Sign Up" : "Log In"}
            </Button>
          </Form.Item>

          <p className={styles.bottom}>
            {isSigningUp
              ? "Already have an account? "
              : "Don't have an account? "}
            <label
              onClick={() => {
                isSigningUp
                  ? signUpForm.resetFields()
                  : loginForm.resetFields();
                setIsSigningUp(!isSigningUp);
              }}
            >
              {isSigningUp ? "Log In" : "Sign Up"}
            </label>
          </p>
        </Form>
      </div>
    </div>
  );
};

export default Login;
