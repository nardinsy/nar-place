import { HasChildren } from "../helpers/props";
import classes from "./MessageModal.module.css";
import Modal from "./Modal";
import React, { FC } from "react";

type MessageProps = HasChildren & {
  className: string;
  message: string;
  //   children?: React.ReactNode | JSX.Element;
};

const MessageModal: FC<MessageProps> = ({ className, message, children }) => {
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
