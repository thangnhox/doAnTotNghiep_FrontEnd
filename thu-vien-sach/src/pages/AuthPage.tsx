import React from "react";
import LoginForm from "../components/auth/LoginForm";
import RegisterForm from "../components/auth/RegisterForm";

interface Props {
  action: "LOGIN" | "REGISTER";
}

const AuthPage = (props: Props) => {
  const { action } = props;

  return (
    <div className="d-flex justify-content-center align-items center">
      {action === "LOGIN" ? <LoginForm /> : <RegisterForm />}
    </div>
  );
};

export default AuthPage;
