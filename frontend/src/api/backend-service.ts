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

  addComment(
    NewComment: NewComment,
    token: string
  ): Promise<{ comment: CommentDto }>;

  getComments(placeId: string): Promise<CommentDto[]>;

  editComment(editComment: CommentDto, token: string): Promise<void>;

  deleteComment(commentId: string, token: string): Promise<void>;

  likeComment(
    NewCommentLike: CommentLikeDto,
    token: string
  ): Promise<{ commentLikeDto: CommentLikeDto }>;

  unlikeComment(
    userId: string,
    commentId: string,
    token: string
  ): Promise<{ commentLikes: { userId: string; commentId: string }[] }>;
}
