import { useContext, useRef } from "react";

import Button from "../../Shared-UI/Button";

import AuthContext from "../../store/auth-context";

import classes from "./LoginForm.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";

const LoginForm = (props) => {
  const authContext = useContext(AuthContext);

  const emailRef = useRef("");
  const passwordRef = useRef("");

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
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };

    await authContext.login(userInfo);
  };

  return (
    <form>
      <div className={classes.control}>
        <label htmlFor="email">E-Mail</label>
        <input type="email" ref={emailRef} autoFocus />
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
        <Button type="submit" onClick={submitHandler} action={"submit"}>
          Login
        </Button>
      </div>
    </form>
  );
};

export default LoginForm;
