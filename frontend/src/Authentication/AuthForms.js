import { useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

import Modal from "../Shared-UI/Modal";
import LoginForm from "./Login/LoginForm";
import SignupForm from "./Signup/SignupForm";

import classes from "./AuthForms.module.css";

const AuthForms = ({ title }) => {
  let history = useHistory();

  const [authFormsTitle, setAuthFormsTitle] = useState(title);

  const switchAuthState = (event) => {
    setAuthFormsTitle(String(event.target.innerText));
  };

  const authenticationModalCloseHandler = (event) => {
    event.stopPropagation();
    history.replace("/");
  };

  const loginClassName =
    authFormsTitle === "Login"
      ? `${classes.option} ${classes.active}`
      : `${classes.option}`;

  const signupClassName =
    authFormsTitle === "Signup"
      ? `${classes.option} ${classes.active}`
      : `${classes.option}`;

  return (
    <Modal onBackdropClick={authenticationModalCloseHandler}>
      <header className={classes["forms-modal-header"]}>
        <div className={loginClassName} onClick={switchAuthState}>
          Login
        </div>
        <div className={signupClassName} onClick={switchAuthState}>
          Signup
        </div>
      </header>

      {authFormsTitle === "Login" ? <LoginForm /> : <SignupForm />}
    </Modal>
  );
};

export default AuthForms;
