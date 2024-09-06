import {
  LoginResult,
  UserLoginInformation,
  PlaceDto,
  UserDto,
  placeInfoCard,
  UserSignupInformation,
  NewPlace,
  CommentDto,
  NewComment,
  CommentLikeDto,
  CommentReplyDto,
  NotificationDto,
} from "../helpers/dtos";

export interface BackendService {
  getAllUsers(): Promise<UserDto[]>;

  signup(userInfo: UserSignupInformation): Promise<LoginResult>;

  login(userInfo: UserLoginInformation): Promise<LoginResult>;

  logout(token: string): Promise<void>;

  changeProfilePicture(
    pictureFile: string | ArrayBuffer | undefined,
    token: string
  ): Promise<{
    userInfo: UserDto;
  }>;

  changePassword(newPassword: string, token: string): Promise<void>;

  changeUsername(newUsername: string, token: string): Promise<void>;

  getLoggedUserPlaces(token: string): Promise<{
    places: PlaceDto[];
  }>;

  addPlace(
    place: NewPlace,
    token: string
  ): Promise<{
    place: PlaceDto;
  }>;

  editPlace(
    placeInfo: placeInfoCard & { id: string },
    token: string
  ): Promise<{ place: PlaceDto }>;

  deletePlaceById(placeId: string, token: string): Promise<void>;

  getAnyUserPlacesByUserId(userId: string): Promise<{
    places: PlaceDto[];
  }>;

  getPlaceById(
    placeId: string
  ): Promise<{ placeDto: PlaceDto; userDto: UserDto }>;

  addComment(
    NewComment: NewComment,
    commentActionTo: string,
    token: string
  ): Promise<{ comment: CommentDto }>;

  getComments(placeId: string): Promise<CommentDto[]>;

  editComment(editComment: CommentDto, token: string): Promise<void>;

  deleteComment(
    commentId: string,
    parentId: string | undefined,
    token: string
  ): Promise<void>;

  likeComment(
    NewCommentLike: CommentLikeDto,
    commentActionTo: string,
    token: string
  ): Promise<{ commentLikeDto: CommentLikeDto }>;

  unlikeComment(
    userId: string,
    commentId: string,
    token: string
  ): Promise<{ commentLikes: { userId: string; commentId: string }[] }>;

  replyComment(
    commentReply: CommentReplyDto,
    commentActionTo: string,
    token: string
  ): Promise<{ replyComment: CommentDto }>;

  getCurrentNotifications(
    token: string
  ): Promise<{ currentNotifications: NotificationDto[] }>;

  getNewNotifications(token: string): Promise<NotificationDto[]>;

  mergeAndResetNotifications(token: string): Promise<void>;
}
