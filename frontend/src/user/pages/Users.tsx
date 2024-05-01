import { useEffect, useState } from "react";
import UsersList from "../components/UsersList";
import sendHttpRequest from "../../helpers/http-request";
import { ENDPOINTS, getApiAddress } from "../../helpers/api-url";
import { UserDto } from "../../sharedTypes/dtos";

//fetch all users
const Users = () => {
  const [users, setUsers] = useState<UserDto[] | []>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    const requestOptions = {
      method: "GET",
    };
    const address = getApiAddress(ENDPOINTS.getAllUsers);
    let data: { message: string; usersInfo: UserDto[] };

    setLoading(true);

    data = await sendHttpRequest(address, requestOptions);

    const usersData: UserDto[] = data.usersInfo;
    setUsers([...usersData]);
    setLoading(false);
  };

  return (
    <div>
      <UsersList users={users} loading={loading} />;
    </div>
  );
};

export default Users;
