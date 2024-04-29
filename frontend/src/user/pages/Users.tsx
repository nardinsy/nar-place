import { useEffect, useState } from "react";
import UsersList from "../components/UsersList";
import sendHttpRequest from "../../helpers/http-request";
import { ENDPOINTS, getApiAddress } from "../../helpers/api-url";
import { UserDto } from "../../sharedTypes/dtos";

//fetch all users
const Users = () => {
  const [users, setUsers] = useState<UserDto[] | []>([]);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    const requestOptions = {
      method: "GET",
    };
    const address = getApiAddress(ENDPOINTS.getAllUsers);

    const data: { message: string; usersInfo: UserDto[] } =
      await sendHttpRequest(address, requestOptions);

    const usersData: UserDto[] = data.usersInfo;
    setUsers([...usersData]);
  };

  return (
    <div>
      <UsersList users={users} />;
    </div>
  );
};

export default Users;
