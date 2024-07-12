import { FC, ChangeEvent, useState } from "react";
import classes from "./ProfileEditForm.module.css";
interface EditUserInfoFormT {
  username: string;
  changeUsername: (username: string) => void;
}
const EditUserInfoForm: FC<EditUserInfoFormT> = ({
  username,
  changeUsername,
}) => {
  const [usernameInput, setUsernameInput] = useState(username);

  const changeUsernameHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setUsernameInput(event.target.value);
    changeUsername(event.target.value);
  };

  return (
    <>
      <div className={classes.control}>
        <label className={classes.label}>Username</label>
        <input
          type="text"
          value={usernameInput}
          onChange={changeUsernameHandler}
        />
      </div>

      {/* <div className={classes.control}>
        <label>Email</label>
        <input type="email" ref={emailRef} />
        </div> */}
    </>
  );
};

export default EditUserInfoForm;
