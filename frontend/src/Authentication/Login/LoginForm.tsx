import { useRef, MouseEvent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import Button from "../../Shared-UI/Button";
import classes from "./LoginForm.module.css";
import { UserLoginInformation } from "../../../../backend/src/shared/dtos";
import useRequireAuthContext from "../../Hooks/useRequireAuthContext";

const LoginForm: React.FC = () => {
  const authContext = useRequireAuthContext();

  if (authContext.isLoggedin) throw new Error("User is loggedin already.");

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const togglePasswordVisibilityHandler = () => {
    if (!passwordRef.current) return;
    if (passwordRef.current.type === "text") {
      passwordRef.current.type = "password";
      return;
    }
    passwordRef.current.type = "text";
  };

  const submitHandler = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();

    if (!emailRef.current || !passwordRef.current) {
      console.log("Enter valid input");
      return;
    }

    const userInfo: UserLoginInformation = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };
    authContext.login(userInfo);
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
          onClick={togglePasswordVisibilityHandler}
        />
      </div>

      <div className={classes.actions}>
        <Button
          type="submit"
          onClick={submitHandler}
          // onKeyPress={submitByEnterHandler}
          action={"submit"}
        >
          Login
        </Button>
      </div>
    </form>
  );
};

export default LoginForm;
