import ProfileEditForm from "../components/ProfileEditForm";
import { FC } from "react";

export interface ProfileSettingsPageT {
  changeUserImage: (userNewImage: File | undefined) => Promise<void>;
  changePassword: (newPassword: string) => Promise<void>;
  changeUsername: (newUsername: string) => Promise<void>;
}

const ProfileSettingsPage: FC<ProfileSettingsPageT> = ({
  changeUserImage,
  changePassword,
  changeUsername,
}) => {
  return (
    <div>
      <ProfileEditForm
        changeUserImage={changeUserImage}
        changePassword={changePassword}
        changeUsername={changeUsername}
      />
    </div>
  );
};

export default ProfileSettingsPage;
