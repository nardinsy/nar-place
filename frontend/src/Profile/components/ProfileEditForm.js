import { useRef, useContext, useState, useEffect } from "react";
import { Route, useHistory } from "react-router-dom/cjs/react-router-dom.min";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";

import AuthContext from "../../store/auth-context";
import classes from "./ProfileEditForm.module.css";

import Button from "../../Shared-UI/Button";
import Avatar from "../UI/Avatar";
import ImageUpload from "../../shared/ImageUpload";
import PasswordChangeModal from "./PasswordChangeModal";
import PictureModal from "../../shared/PictureModal";

const ProfileEditForm = ({
  changeUserImage,
  changePassword,
  changeUsername,
}) => {
  const authContext = useContext(AuthContext);
  const userPictureUrl = authContext.userPictureUrl;

  const [avatarURL, setAvatarURL] = useState(userPictureUrl);
  const [file, setFile] = useState("noChange");
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showPictureModal, setShowPictureModal] = useState(false);

  const usernameRef = useRef("");
  const emailRef = useRef("");

  const history = useHistory();

  // useEffect(() => {
  //   setAvatarURL(userPictureUrl);
  // }, [userPictureUrl]);

  const changeFormAvatar = (fileFormatFile) => {
    setFile(fileFormatFile);
    setAvatarURL(URL.createObjectURL(fileFormatFile));

    // fileFormatFile: type object
    // File {name: '2021-10-22 7.18.jpg', lastModified: 1704866449845, lastModifiedDate: Wed Jan 10 2024 09:30:49 GMT+0330 (Iran Standard Time), webkitRelativePath: '', size: 1156073, …}

    // URL.createObjectURL(fileFormatFile): type string
    // blob:http://localhost:3000/055ee9ce-844c-43c2-9c4f-567c2da7b909
  };

  const changePasswordHandler = (newPassword) => {
    changePassword(newPassword);
    //show message
  };

  const formSubmitHandler = async (event) => {
    event.preventDefault();

    if (
      authContext.username !== usernameRef.current.value &&
      usernameRef.current.value !== ""
    ) {
      changeUsername(usernameRef.current.value);
      //show message
    }

    if (file !== "noChange") {
      changeUserImage(file);
      //show message
    }
  };

  const openChangePasswordModal = (event) => {
    event.preventDefault();
    setShowChangePasswordModal(true);
  };

  const closeChangePasswordModal = () => {
    setShowChangePasswordModal(false);
  };

  const onImageClickHandler = (event) => {
    // event.preventDefault();
    if (event.target.tagName === "IMG") {
      // window.open(authContext.userPictureUrl, "_blank");
      // history.push("/photo");
      setShowPictureModal(true);
    }
  };

  const closePictureModal = () => {
    setShowPictureModal(false);
  };

  const ellipsisDropdownItems = [
    {
      title: "Delete",
      handler: (event) => {
        const result = window.confirm(
          "Are you sure you want to reset your current avatar?"
        );

        if (result) {
          changeUserImage(undefined);
          setAvatarURL(undefined);
        }
      },
    },
    {
      title: "Save As ...",
      handler: (event) => {
        //navigate to profile setting page
      },
    },
  ];

  return (
    <div className={classes["profile-edit-form-container"]}>
      <form className={classes["profile-edit-form"]} id={1}>
        <div className={classes["user-form-header"]}>
          <h2>Edit Profile</h2>

          <div className={classes["user-image"]} onClick={onImageClickHandler}>
            <Avatar width={"9rem"} pictureUrl={avatarURL} />
            <div>
              <ImageUpload
                id={authContext.token}
                onChangeImage={changeFormAvatar}
                className={classes["edit-user-image-button"]}
              >
                <FontAwesomeIcon icon={faPen} />
              </ImageUpload>
            </div>
          </div>
        </div>

        <div className={classes["user-info"]}>
          <div className={classes.control}>
            <label>Username</label>
            <input type="text" ref={usernameRef} />
          </div>

          <div className={classes.control}>
            <label>Email</label>
            <input type="email" ref={emailRef} />
          </div>
        </div>

        <div className={classes.actions}>
          <Button
            type="submit"
            onClick={formSubmitHandler}
            action={"submit"}
            className={classes.btn}
          >
            Update Info
          </Button>

          <Button
            type="submit"
            onClick={openChangePasswordModal}
            action={"edit"}
            className={classes.changePassword}
          >
            Change Password
          </Button>
        </div>
      </form>
      {showChangePasswordModal && (
        <PasswordChangeModal
          closeChangePasswordModal={closeChangePasswordModal}
          onPasswordChange={changePasswordHandler}
        />
      )}
      {showPictureModal && (
        <PictureModal
          pictureUrl={authContext.userPictureUrl}
          showChevrons={false}
          ellipsisDropdownItems={ellipsisDropdownItems}
          xMarkHandler={closePictureModal}
        />
      )}
    </div>
  );
};

export default ProfileEditForm;
