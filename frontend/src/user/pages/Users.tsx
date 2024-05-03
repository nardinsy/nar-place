import { useEffect, useState, useCallback } from "react";
import UsersList from "../components/UsersList";
import { UserDto } from "../../helpers/dtos";
import useRequiredBackend from "../../hooks/use-required-backend";

//fetch all users
const Users = () => {
  const [users, setUsers] = useState<UserDto[] | []>([]);
  const [loading, setLoading] = useState(true);
  const backend = useRequiredBackend();

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = useCallback(async () => {
    setLoading(true);
    const usersData = await backend.getAllUsers();

    setUsers([...usersData]);
    setLoading(false);
  }, [setLoading, setUsers, backend]);

  return (
    <div>
      <UsersList users={users} loading={loading} />;
    </div>
  );
};

export default Users;
