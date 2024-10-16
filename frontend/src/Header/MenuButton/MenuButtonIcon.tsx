import Avatar from "../../shared-UI/Avatar";
import useRequiredAuthContext from "../../hooks/use-required-authContext";

const MenuButtonIcon = () => {
  const authContext = useRequiredAuthContext();

  return (
    <>
      {authContext.isLoggedin ? (
        <Avatar
          pictureUrl={authContext.userPictureUrl}
          alt={authContext.username}
          width={"3rem"}
        />
      ) : (
        <i
          data-testid="icon"
          className="text-5xl text-gray-light bx bx-user-circle"
        />
      )}
    </>
  );
};

export default MenuButtonIcon;
