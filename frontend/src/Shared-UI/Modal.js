import ReactDOM from "react-dom";

import classes from "./Modal.module.css";

const Backdrop = ({ onBackdropClick }) => {
  return <div className={classes.backdrop} onClick={onBackdropClick}></div>;
};

function ModalOverlay(props) {
  return (
    <div className={`${classes.modal} ${props.cssClassName}`}>
      <div className={classes.content}>{props.children}</div>
    </div>
  );
}

const portalElement = document.getElementById("overlays");

const Modal = ({ onBackdropClick, cssClassName, children }) => {
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
