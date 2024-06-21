import ReactDOM from "react-dom";
import classes from "./Modal.module.css";
import { FC } from "react";
import { HasChildren } from "../helpers/props";

const Backdrop = ({
  onBackdropClick,
}: {
  onBackdropClick?: (event: any) => void;
}) => {
  return <div className={classes.backdrop} onClick={onBackdropClick}></div>;
};

type ModalOverlayProps = HasChildren & {
  cssClassName: string | undefined;
};

const ModalOverlay: FC<ModalOverlayProps> = ({
  cssClassName,
  children,
}: ModalOverlayProps) => {
  return (
    <div className={`${classes.modal} ${cssClassName}`}>
      <div className={classes.content}>{children}</div>
    </div>
  );
};

const portalElement = document.getElementById("overlays") as HTMLElement;

type ModalProps = HasChildren & {
  onBackdropClick?: (event: any) => void;
  cssClassName?: string;
};

const Modal: FC<ModalProps> = ({ onBackdropClick, cssClassName, children }) => {
  return (
    <>
      {ReactDOM.createPortal(
        <Backdrop onBackdropClick={onBackdropClick} />,
        portalElement
      )}
      {ReactDOM.createPortal(
        <ModalOverlay cssClassName={cssClassName}>{children}</ModalOverlay>,
        portalElement
      )}
    </>
  );
};

export default Modal;
