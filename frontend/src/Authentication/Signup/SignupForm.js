import { useContext, useRef } from "react";

import Button from "../../Shared-UI/Button";
import AuthContext from "../../store/auth-context";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import classes from "./SignupForm.module.css";

const SignupForm = (props) => {
  const userContext = useContext(AuthContext);

  const emailRef = useRef("");
  const passwordRef = useRef("");
  const usernameRef = useRef("");

  const showPasswordHandler = (event) => {
    if (passwordRef.current.type === "text") {
      passwordRef.current.type = "password";
    } else {
      passwordRef.current.type = "text";
    }
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    const userInfo = {
      username: usernameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };

    await userContext.signup(userInfo);
  };

  return (
    <form>
      {/* <form onSubmit={submitHandler}> */}

      <div className={classes.control}>
        <label htmlFor="email">E-Mail</label>
        <input type="email" ref={emailRef} autoFocus />
      </div>

      <div className={classes.control}>
        <label htmlFor="username">Username</label>
        <input type="text" ref={usernameRef} />
      </div>

      <div className={classes.control}>
        <label htmlFor="password">Password</label>
        <input type="password" ref={passwordRef} />
        <FontAwesomeIcon
          icon={faEye}
          className={classes["eye-icon"]}
          onClick={showPasswordHandler}
        />
      </div>

      <div className={classes.actions}>
        <Button onClick={submitHandler} action={"submit"}>
          Sign up
        </Button>
      </div>
    </form>
  );
};

export default SignupForm;
