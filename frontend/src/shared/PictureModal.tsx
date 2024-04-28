import { useState, useEffect, useRef, FC, ReactNode } from "react";
import Avatar from "../Profile/UI/Avatar";
import Dropdown from "../Header/Dropdown/DropdownCard";
import Modal from "../Shared-UI/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsis,
  faXmark,
  faChevronRight,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
import classes from "./PictureModal.module.css";
import { HasChildren } from "../helpers/props";

type PictureModalT = {
  pictureUrl: string | undefined;
  showChevrons: any;
  ellipsisDropdownItems: any;
  xMarkHandler: any;
  children?: ReactNode | ReactNode[];
};

const PictureModal: FC<PictureModalT> = ({
  pictureUrl,
  showChevrons,
  ellipsisDropdownItems,
  xMarkHandler,
  children,
}) => {
  const [showEllipsisDropdown, setShowEllipsisDropdown] = useState(false);
  const ellipsisRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkIfClickedOutside = (event) => {
      if (
        showEllipsisDropdown &&
        !ellipsisRef.current!.contains(event.target)
      ) {
        event.preventDefault();
        setShowEllipsisDropdown(false);
      }
    };

    window.addEventListener("mousedown", checkIfClickedOutside);

    return () => {
      window.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [showEllipsisDropdown]);

  const ellipsisClickHandler = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setShowEllipsisDropdown(true);
    // alert("Do you want to delete your picture?");
    //delete picture back to profile setting page
  };

  const closePictureModalHandler = (event) => {
    event.preventDefault();
    xMarkHandler();
  };

  return (
    <Modal onBackdropClick={xMarkHandler} cssClassName={classes.modal}>
      <div onClick={closePictureModalHandler}>
        <FontAwesomeIcon
          icon={faXmark}
          className={`${classes["picture-close"]} ${classes.icon}`}
        />
      </div>

      <div onClick={ellipsisClickHandler} ref={ellipsisRef}>
        <FontAwesomeIcon
          icon={faEllipsis}
          className={`${classes["picture-ellipsis"]} ${classes.icon}`}
        />
        {showEllipsisDropdown && <Dropdown items={ellipsisDropdownItems} />}
      </div>

      <div style={{ display: showChevrons ? "block" : "none" }}>
        <FontAwesomeIcon
          icon={faChevronRight}
          className={`${classes["picture-next"]} ${classes.icon}`}
        />
      </div>

      <div style={{ display: showChevrons ? "block" : "none" }}>
        <FontAwesomeIcon
          icon={faChevronLeft}
          className={`${classes["picture-back"]} ${classes.icon}`}
        />
      </div>

      <Avatar
        pictureUrl={pictureUrl}
        width={"28rem"}
        cssClassName={classes["modal-picture"]}
        alt={""}
      />
      {children}
    </Modal>
  );
};

export default PictureModal;
