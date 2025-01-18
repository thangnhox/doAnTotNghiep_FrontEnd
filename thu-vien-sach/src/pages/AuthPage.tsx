import React from "react";
import LoginForm from "../components/auth/LoginForm";
import RegisterForm from "../components/auth/RegisterForm";
import ResetPasswordForm from "../components/auth/ResetPasswordPage";

interface Props {
  action: "LOGIN" | "REGISTER" | "RESET-PASSWORD";
}

const AuthPage = (props: Props) => {
  const { action } = props;

  const renderAuthPage = (action: string) => {
    switch (action) {
      case "LOGIN":
        return <LoginForm />
      case "REGISTER":
        return <RegisterForm />
      case "RESET-PASSWORD":
        return <ResetPasswordForm />
      default:
        return "LOGIN"
    }
  }

  return (
    <div className="d-flex justify-content-center align-items-center">
      {
        renderAuthPage(action)
      }
    </div>
  );
};

export default AuthPage;
