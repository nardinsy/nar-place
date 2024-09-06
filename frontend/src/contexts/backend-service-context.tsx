import { FC, createContext } from "react";
import { BackendService } from "../api/backend-service";
import { HasChildren } from "../helpers/props";
import {
  CommentAction,
  CommentDto,
  CommentLikeDto,
  CommentReplyDto,
  LoginResult,
  NewComment,
  NewPlace,
  NotificationDto,
  PlaceDto,
  UserDto,
  UserLoginInformation,
  UserSignupInformation,
  placeInfoCard,
} from "../helpers/dtos";
import { ENDPOINTS } from "../helpers/api-url";
import sendHttpRequest, { MyRequestOptions } from "../helpers/http-request";

class BackedServiceImpl implements BackendService {
  async getAllUsers(): Promise<UserDto[]> {
    const requestOptions = {
      method: "GET",
    };

    const data: { usersInfo: UserDto[] } = await sendHttpRequest(
      ENDPOINTS.getAllUsers,
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

    return await sendHttpRequest(ENDPOINTS.signup, requestOptions);
  }

  async login(userInfo: UserLoginInformation): Promise<LoginResult> {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userInfo),
    };

    return await sendHttpRequest(ENDPOINTS.login, requestOptions);
  }

  async logout(token: string): Promise<void> {
    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json", token },
    };

    await sendHttpRequest(ENDPOINTS.logout, requestOptions);
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

    return await sendHttpRequest(
      ENDPOINTS.changeProfilePicture,
      requestOptions
    );
  }

  async changePassword(newPassword: string, token: string): Promise<void> {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json", token },
      body: JSON.stringify({ password: newPassword }),
    };

    return await sendHttpRequest(ENDPOINTS.changePassword, requestOptions);
  }

  async changeUsername(newUsername: string, token: string): Promise<void> {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json", token },
      body: JSON.stringify({ username: newUsername }),
    };

    return await sendHttpRequest(ENDPOINTS.changeUsername, requestOptions);
  }

  async getLoggedUserPlaces(token: string): Promise<{ places: PlaceDto[] }> {
    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json", token },
    };

    return await sendHttpRequest(ENDPOINTS.getLoggedUserPlaces, requestOptions);
  }

  async addPlace(place: NewPlace, token: string): Promise<{ place: PlaceDto }> {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json", token },
      body: JSON.stringify(place),
    };

    return await sendHttpRequest(ENDPOINTS.addPlace, requestOptions);
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

    return await sendHttpRequest(ENDPOINTS.editPlace, requestOptions);
  }

  async deletePlaceById(placeId: string, token: string): Promise<void> {
    const requestOptions = {
      method: "DELETE",
      headers: { "Content-Type": "application/json", token },
    };

    return await sendHttpRequest(
      ENDPOINTS.deletePlaceById,
      requestOptions,
      placeId
    );
  }

  async getAnyUserPlacesByUserId(
    userId: string
  ): Promise<{ places: PlaceDto[] }> {
    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };

    return await sendHttpRequest(
      ENDPOINTS.getAnyUserPlacesByUserId,
      requestOptions,
      userId
    );
  }

  async getPlaceById(
    placeId: string
  ): Promise<{ placeDto: PlaceDto; userDto: UserDto }> {
    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };

    return await sendHttpRequest(
      ENDPOINTS.getPlaceById,
      requestOptions,
      placeId
    );
  }

  // Comment

  async addComment(
    newComment: NewComment,
    commentActionTo: string,
    token: string
  ): Promise<{ comment: CommentDto }> {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json", token },
      body: JSON.stringify({ newComment, commentActionTo }),
    };

    return await sendHttpRequest(ENDPOINTS.addComment, requestOptions);
  }

  async getComments(placeId: string): Promise<CommentDto[]> {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ placeID: placeId }),
    };

    return await sendHttpRequest(ENDPOINTS.getComments, requestOptions);
  }

  async editComment(editedComment: CommentDto, token: string): Promise<void> {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json", token },
      body: JSON.stringify({ editedComment }),
    };

    return await sendHttpRequest(ENDPOINTS.editComment, requestOptions);
  }

  async deleteComment(
    commentId: string,
    parentId: string | undefined,
    token: string
  ): Promise<void> {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json", token },
      body: JSON.stringify({ commentId, parentId }),
    };

    return await sendHttpRequest(ENDPOINTS.deleteComment, requestOptions);
  }

  async likeComment(
    newCommentLike: CommentLikeDto,
    commentActionTo: string,
    token: string
  ): Promise<{ commentLikeDto: CommentLikeDto }> {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json", token },
      body: JSON.stringify({ newCommentLike, commentActionTo }),
    };

    return await sendHttpRequest(ENDPOINTS.likeComment, requestOptions);
  }

  async unlikeComment(
    userId: string,
    commentId: string,
    token: string
  ): Promise<{ commentLikes: { userId: string; commentId: string }[] }> {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json", token },
      body: JSON.stringify({ userId, commentId }),
    };

    return await sendHttpRequest(ENDPOINTS.unlikeComment, requestOptions);
  }

  async replyComment(
    commentReply: CommentReplyDto,
    commentActionTo: string,
    token: string
  ): Promise<{ replyComment: CommentDto }> {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json", token },
      body: JSON.stringify({ commentReply, commentActionTo }),
    };

    return await sendHttpRequest(ENDPOINTS.replyComment, requestOptions);
  }

  async getCurrentNotifications(
    token: string
  ): Promise<{ currentNotifications: NotificationDto[] }> {
    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json", token },
    };

    return await sendHttpRequest(
      ENDPOINTS.getCurrentNotifications,
      requestOptions
    );
  }

  async getNewNotifications(token: string): Promise<NotificationDto[]> {
    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json", token },
    };

    return await sendHttpRequest(ENDPOINTS.getNewNotifications, requestOptions);
  }

  async mergeAndResetNotifications(token: string): Promise<void> {
    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json", token },
    };

    return await sendHttpRequest(
      ENDPOINTS.mergeAndResetNotifications,
      requestOptions
    );
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
