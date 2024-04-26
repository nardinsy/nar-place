import { useContext, useRef, MouseEvent } from "react";
import Button from "../../Shared-UI/Button";
import AuthContext from "../../store/auth-context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import classes from "./SignupForm.module.css";
import { UserSignupInformation } from "../../../../backend/src/shared/dtos";

const SignupForm = (props) => {
  const authContext = useContext(AuthContext);
  if (!authContext)
    throw new Error(
      "Auth context is not provided, Please wrap component with AuthContextProvider"
    );

  if (authContext.isLoggedin) throw new Error("User is logged in already.");

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);

  const togglePasswordVisibilityHandler = (event) => {
    if (!passwordRef.current) return;
    if (passwordRef.current.type === "text") {
      passwordRef.current.type = "password";
      return;
    }
    passwordRef.current.type = "text";
  };

  const submitHandler = async (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();

    if (!emailRef.current || !passwordRef.current || !usernameRef.current) {
      console.log("Enter valid input");
      return;
    }

    const userInfo: UserSignupInformation = {
      username: usernameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };

    await authContext.signup(userInfo);
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
          onClick={togglePasswordVisibilityHandler}
        />
      </div>

      <div className={classes.actions}>
        <Button onClick={submitHandler} action={"submit"} type="submit">
          Sign up
        </Button>
      </div>
    </form>
  );
};

export default SignupForm;
