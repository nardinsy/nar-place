import { useState, FC, MouseEvent } from "react";
import Button from "../../shared-UI/Button";
import useRequiredAuthContext from "../../hooks/use-required-authContext";
import { ProfileSettingsPageT } from "../pages/ProfileSettingsPage";
import ProfilePictureAction from "./ProfilePictureAction";
import EditPassword from "./EditPassword";
import EditUserInfoForm from "./EditUserInfoForm";
import classes from "./ProfileEditForm.module.css";

const ProfileEditForm: FC<ProfileSettingsPageT> = ({
  changeProfilePicture,
  changePassword,
  changeUsername,
}) => {
  const authContext = useRequiredAuthContext();
  if (!authContext.isLoggedin)
    throw new Error("User in not logged in, Please login first");
  //redirect to login form

  const [file, setFile] = useState<File | "noChange">("noChange");
  const [username, setUsername] = useState(authContext.username);

  // const history = useHistory();

  // useEffect(() => {
  //   setAvatarURL(userPictureUrl);
  // }, [userPictureUrl]);

  const onChangeImage = (fileFormatFile: File) => {
    setFile(fileFormatFile);
  };

  const onChangeUsername = (username: string) => {
    setUsername(username);
  };

  const formSubmitHandler = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (username !== authContext.username) {
      changeUsername(username);
    }

    if (file !== "noChange") {
      changeProfilePicture(file);
      //show message
    }
  };

  return (
    <div className={classes["profile-edit-form-container"]}>
      <form className={classes["profile-edit-form"]} id={"1"}>
        <div className={classes["user-form-header"]}>
          <h2>Edit Profile</h2>

          <ProfilePictureAction
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
