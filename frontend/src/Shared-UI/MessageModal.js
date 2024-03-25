import classes from "./MessageModal.module.css";
import Modal from "./Modal";

const MessageModal = ({ className, message, children }) => {
  const classNames = `${classes.message} ${className}`;
  return (
    <Modal>
      <div className={classes["message-container"]}>
        <div className={classes.message}>{message}</div>
        <div>{children}</div>
      </div>
    </Modal>
  );
};

export default MessageModal;
