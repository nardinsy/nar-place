import { useState, FC, MouseEvent } from "react";
import Button from "../../shared-UI/Button";
import useRequiredAuthContext from "../../hooks/use-required-authContext";
import { ProfileSettingsPageT } from "../pages/ProfileSettingsPage";
import ProfileEditFormUserPicture from "./ProfileEditFormUserPicture";
import EditPassword from "./EditPassword";
import EditUserInfoForm from "./EditUserInfoForm";
import { validateNewUsername } from "../../helpers/inputsValidation";
import classes from "./ProfileEditForm.module.css";

const ProfileEditForm: FC<ProfileSettingsPageT> = ({
  changeProfilePicture,
  changePassword,
  changeUsername,
}) => {
  const authContext = useRequiredAuthContext();
  if (!authContext.isLoggedin) {
    throw new Error("User in not logged in, Please login first");
    //redirect to login form
  }

  const [profilePicture, setProfilePicture] = useState<File | "noChange">(
    "noChange"
  );
  const [username, setUsername] = useState(authContext.username);
  const [isDirty, setIsDirty] = useState(false);

  const onChangeImage = (fileFormatFile: File) => {
    setProfilePicture(fileFormatFile);
    setIsDirty(true);
  };

  const onChangeUsername = (username: string) => {
    setUsername(username);
    setIsDirty(true);
  };

  const formSubmitHandler = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (validateNewUsername(username, authContext.username)) {
      changeUsername(username);
    }

    if (profilePicture !== "noChange") {
      changeProfilePicture(profilePicture);
      //show message
    }
  };

  return (
    <div className={classes["profile-edit-form-container"]}>
      <form className={classes["profile-edit-form"]} id={"1"}>
        <div className={classes["user-form-header"]}>
          <h2>Edit Profile</h2>

          <ProfileEditFormUserPicture
            onChangeImage={onChangeImage}
            userPictureUrl={authContext.userPictureUrl}
            username={authContext.username}
            token={authContext.token}
            changeProfilePicture={changeProfilePicture}
          />
        </div>

        <div className={classes["user-info"]}>
          <EditUserInfoForm
            username={authContext.username}
            changeUsername={onChangeUsername}
          />
        </div>
        <div className={classes.actions}>
          <Button
            type="submit"
            onClick={formSubmitHandler}
            isDisabled={!isDirty}
            action={"submit"}
            className={classes.btn}
          >
            Update Info
          </Button>

          <EditPassword changePassword={changePassword} />
        </div>
      </form>
    </div>
  );
};

export default ProfileEditForm;

// const history = useHistory();

// useEffect(() => {
//   setAvatarURL(userPictureUrl);
// }, [userPictureUrl]);
