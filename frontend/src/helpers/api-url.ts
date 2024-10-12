const BASE_URL = "http://192.168.1.13:5000/api/";

export enum ENDPOINTS {
  getAllUsers = "users",

  signup = "users/signup",
  login = "users/login",
  logout = "users/logout",

  changeProfilePicture = "users/change/profile-picture",
  changePassword = "users/change/password",
  changeUsername = "users/change/username",

  getLoggedUserPlaces = "places/userPlaces",
  addPlacePictureFile = "places/add-place-picture-file",
  addPlacePictureUrl = "places/add-place-picture-url",
  editPlace = "places/edit-place",
  deletePlaceById = `places/delete-place/`,
  getAnyUserPlacesByUserId = "places/any-user-places-by-userId/",
  getPlaceById = "places/place/",

  getComments = "places/getComments",
  addComment = "places/addComment",
  editComment = "places/editComment",
  deleteComment = "places/deleteComment",
  likeComment = "places/like-comment",
  unlikeComment = "places/unlike-comment",
  replyComment = "places/reply-comment",

  getNewNotifications = "users/new-notification",
  getCurrentNotifications = "users/current-notifications",
  mergeAndResetNotifications = "users/update-notifications",
}

const getApiAddress = (endPoint: string, param?: string) => {
  if (param) {
    return `${BASE_URL}${endPoint}${param}`;
  }

  return `${BASE_URL}${endPoint}`;
};

const createAbsoluteApiAddress = (relativePath: string) => {
  // return `${BASE_URL}${relativePath}`;
  return relativePath;
};

const createRelativePath = (absolutePath: string) => {
  // const semiPictureUrl = absolute.match(BASE_URL);

  return absolutePath.replace(BASE_URL, "");
};

export { getApiAddress, createAbsoluteApiAddress, createRelativePath };
