import { useEffect, useState, useCallback } from "react";
import UsersList from "../components/UsersList";
import { UserDto } from "../../helpers/dtos";
import useRequiredBackend from "../../hooks/use-required-backend";
import useRequiredLocalBackendContext from "../../local-storage/use-required-local-backend-service-contex";

const Users = () => {
  const [users, setUsers] = useState<UserDto[] | []>([]);
  const [loading, setLoading] = useState(true);
  // const backend = useRequiredBackend();
  const backend = useRequiredLocalBackendContext();

  useEffect(() => {
    const getUsers = async () => {
      setLoading(true);
      const usersData = await backend.getAllUsers();

      setUsers([...usersData]);
      setLoading(false);
    };
    getUsers();
    return () => {};
  }, []);

  return <UsersList users={users} loading={loading} />;
};

export default Users;
