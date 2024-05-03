import { FC, createContext } from "react";
import { BackendService } from "../api/backend-service";
import { HasChildren } from "../helpers/props";
import {
  LoginResult,
  NewPlace,
  PlaceDto,
  PlaceInfoCardWithPictire,
  UserDto,
  UserLoginInformation,
  UserSignupInformation,
  placeInfoCard,
} from "../helpers/dtos";
import { ENDPOINTS, getApiAddress } from "../helpers/api-url";
import sendHttpRequest, { MyRequestOptions } from "../helpers/http-request";

class BackedServiceImpl implements BackendService {
  async getAllUsers(): Promise<UserDto[]> {
    const requestOptions = {
      method: "GET",
    };

    const address = getApiAddress(ENDPOINTS.getAllUsers);
    const data: { usersInfo: UserDto[] } = await sendHttpRequest(
      address,
      requestOptions
    );

    return data.usersInfo;
  }

  async signup(userInfo: UserSignupInformation): Promise<LoginResult> {
    const requestOptions: MyRequestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userInfo),
    };
    const address = getApiAddress(ENDPOINTS.signup);

    return await sendHttpRequest(address, requestOptions);
  }

  async login(userInfo: UserLoginInformation): Promise<LoginResult> {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userInfo),
    };
    const address = getApiAddress(ENDPOINTS.login);

    return await sendHttpRequest(address, requestOptions);
  }

  async logout(token: string): Promise<void> {
    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json", token },
    };
    const address = getApiAddress(ENDPOINTS.logout);

    await sendHttpRequest(address, requestOptions);
  }

  async changeProfilePicture(
    pictureFile: string | ArrayBuffer | undefined,
    token: string
  ): Promise<{ userInfo: UserDto }> {
    const userNewImage = { image: pictureFile };

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json", token },
      body: JSON.stringify(userNewImage),
    };
    const address = getApiAddress(ENDPOINTS.changeProfilePicture);

    return await sendHttpRequest(address, requestOptions);
  }

  async changePassword(newPassword: string, token: string): Promise<void> {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json", token },
      body: JSON.stringify({ password: newPassword }),
    };
    const address = getApiAddress(ENDPOINTS.changePassword);

    return await sendHttpRequest(address, requestOptions);
  }

  async changeUsername(newUsername: string, token: string): Promise<void> {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json", token },
      body: JSON.stringify({ username: newUsername }),
    };
    const address = getApiAddress(ENDPOINTS.changeUsername);

    return await sendHttpRequest(address, requestOptions);
  }

  async getLoggedUserPlaces(token: string): Promise<{ places: PlaceDto[] }> {
    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json", token },
    };

    const address = getApiAddress(ENDPOINTS.getLoggedUserPlaces);

    return await sendHttpRequest(address, requestOptions);
  }

  async addPlace(place: NewPlace, token: string): Promise<{ place: PlaceDto }> {
    const address = getApiAddress(ENDPOINTS.addPlace);

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json", token },
      body: JSON.stringify(place),
    };

    return await sendHttpRequest(address, requestOptions);
  }

  async editPlace(
    placeInfo: placeInfoCard & { id: string },
    token: string
  ): Promise<{ place: PlaceDto }> {
    const requestOptions = {
      method: "PATCH",
      headers: { "Content-Type": "application/json", token },
      body: JSON.stringify({
        id: placeInfo.id,
        title: placeInfo.title,
        description: placeInfo.description,
        address: placeInfo.address,
      }),
    };
    const address = getApiAddress(ENDPOINTS.editPlace);

    return await sendHttpRequest(address, requestOptions);
  }

  async deletePlaceById(placeId: string, token: string): Promise<void> {
    const requestOptions = {
      method: "DELETE",
      headers: { "Content-Type": "application/json", token },
    };
    const address = getApiAddress(ENDPOINTS.deletePlaceById, placeId);

    return await sendHttpRequest(address, requestOptions);
  }

  async getAnyUserPlacesByUserId(
    userId: string
  ): Promise<{ places: PlaceDto[] }> {
    const address = getApiAddress(ENDPOINTS.getAnyUserPlacesByUserId, userId);
    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };

    return await sendHttpRequest(address, requestOptions);
  }
}

const BackendContext = createContext<BackendService | undefined>(undefined);

export const BackendContextProvider: FC<HasChildren> = ({ children }) => {
  const service = new BackedServiceImpl();
  return (
    <BackendContext.Provider value={service}>
      {children}
    </BackendContext.Provider>
  );
};

export default BackendContext;
