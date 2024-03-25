import { useRef } from "react";

import Modal from "../../Shared-UI/Modal";
import Button from "../../Shared-UI/Button";

import classes from "./ProfileEditForm.module.css";

const PasswordChangeModal = ({
  closeChangePasswordModal,
  onPasswordChange,
}) => {
  const passwordRef = useRef("");
  const confirmPasswordRef = useRef("");

  const submitChangePassword = (event) => {
    event.preventDefault();
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
