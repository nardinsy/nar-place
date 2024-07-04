import { MouseEvent, FC, useState } from "react";
import Modal from "../../shared-UI/Modal";
import Button from "../../shared-UI/Button";
import classes from "./ProfileEditForm.module.css";
import {
  PasswordValidationResult,
  getValidationMessage,
  validateNewPassword,
} from "../../helpers/inputsValidation";

interface PasswordChangeModalT {
  closeChangePasswordModal: () => void;
  onPasswordChange: (newPassword: string) => void;
}

const PasswordChangeModal: FC<PasswordChangeModalT> = ({
  closeChangePasswordModal,
  onPasswordChange,
}) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [invalidPassword, setInvalidPassword] = useState({
    password: false,
    confirmPassword: false,
    message: "",
  });

  const submitChangePassword = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const { result, invalidInput } = validateNewPassword(
      password,
      confirmPassword
    );

    if (result !== PasswordValidationResult.valid) {
      handleInvalidPassword(result, invalidInput!);
      return;
    }

    await onPasswordChange(password);
    closeChangePasswordModal();
  };

  const handleInvalidPassword = (
    result: PasswordValidationResult,
    invalidInput: "password" | "confirm" | "both"
  ) => {
    const message = getValidationMessage(result);

    setInvalidPassword({
      password: invalidInput === "both" || invalidInput === "password",
      confirmPassword: invalidInput === "both" || invalidInput === "confirm",
      message,
    });
  };

  return (
    <Modal onBackdropClick={closeChangePasswordModal}>
      <div className={classes["user-info"]}>
        <div className={classes.control}>
          <label htmlFor="password">Password</label>
          <input
            className={invalidPassword.password ? `${classes.invalid}` : ``}
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
          />
        </div>

        <div className={classes.control}>
          <label htmlFor="confirm">Confirm Password</label>
          <input
            className={
              invalidPassword.confirmPassword ? `${classes.invalid}` : ``
            }
            id="confirm"
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <div data-testid="error-message" className={classes.message}>
          {invalidPassword.message ? <span>⚠️ </span> : ""}
          {invalidPassword.message}
        </div>

        <div className={classes["toggle-show"]}>
          <input
            type="checkbox"
            checked={showPassword}
            onChange={() => setShowPassword((pre) => !pre)}
          />
          <span> </span>Show password
        </div>
      </div>

      <div className={classes.actions}>
        <Button
          type="submit"
          onClick={submitChangePassword}
          action={"submit"}
          className={classes.btn}
        >
          Chnage
        </Button>
      </div>
    </Modal>
  );
};

export default PasswordChangeModal;
