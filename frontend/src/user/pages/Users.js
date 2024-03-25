import { useEffect, useState } from "react";
import UsersList from "../components/UsersList";
import sendHttpRequest from "../../helpers/http-request";
import { getApiAddress } from "../../helpers/api-url";

//fetch all users
const Users = (props) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    const requestOptions = {
      method: "GET",
    };
    const address = getApiAddress("getAllUsers");

    const data = await sendHttpRequest(address, requestOptions);
    setUsers(data.usersInfo);
  };

  return (
    <div>
      <UsersList users={users} />;
    </div>
  );
};

export default Users;
