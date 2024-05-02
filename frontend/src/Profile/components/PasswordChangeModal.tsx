import { useRef, MouseEvent, FC } from "react";
import Modal from "../../shared-UI/Modal";
import Button from "../../shared-UI/Button";
import classes from "./ProfileEditForm.module.css";

interface PasswordChangeModalT {
  closeChangePasswordModal: () => void;
  onPasswordChange: (newPassword: string) => void;
}

const PasswordChangeModal: FC<PasswordChangeModalT> = ({
  closeChangePasswordModal,
  onPasswordChange,
}) => {
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const submitChangePassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (!passwordRef.current || !confirmPasswordRef.current) {
      throw new Error("Please fill inputs");
      //change style to red
    }

    if (
      passwordRef.current.value === "" ||
      confirmPasswordRef.current.value === ""
    ) {
      throw new Error("Please fill inputs");
    }

    if (passwordRef.current.value === confirmPasswordRef.current.value) {
      onPasswordChange(passwordRef.current.value);
      closeChangePasswordModal();
    } else {
      console.log("Please enter currect password");
    }
  };

  return (
    <Modal onBackdropClick={closeChangePasswordModal}>
      <div className={classes["user-info"]}>
        <div className={classes.control}>
          <label>Password</label>
          <input type="password" ref={passwordRef} />
        </div>

        <div className={classes.control}>
          <label>Confirm Password</label>
          <input type="password" ref={confirmPasswordRef} />
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
