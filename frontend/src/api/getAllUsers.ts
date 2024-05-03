import sendHttpRequest from "../helpers/http-request";
import { getApiAddress, ENDPOINTS } from "../helpers/api-url";
import { UserDto } from "../helpers/dtos";

export const getUsers = async () => {
  const requestOptions = {
    method: "GET",
  };

  const address = getApiAddress(ENDPOINTS.getAllUsers);
  const data: { message: string; usersInfo: UserDto[] } = await sendHttpRequest(
    address,
    requestOptions
  );

  return data.usersInfo;
};
