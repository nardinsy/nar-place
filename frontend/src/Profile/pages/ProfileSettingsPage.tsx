import ProfileEditForm from "../components/ProfileEditForm";

const ProfileSettingsPage = ({
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
