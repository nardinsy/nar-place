// const BASE_URL = "http://localhost:5000/api/";
const BASE_URL = "http://192.168.1.6:5000/api/";

// const END_POINTS = {
//   getAllUsers: "users",
//   getuserPlaces: "places/placesByUserId/",
//   addPlace: "places/addPlace",
//   getPlaces: "places/userPlaces",
//   deletePlace: `places/`,
//   editPlace: "places/edit",
//   signup: "users/signup",
//   login: "users/login",
//   logout: "users/logout",
//   changeProfilePicture: "users/changeProfilePicture",
//   changePassword: "users/changePassword",
//   changeUsername: "users/changeUsername",
//   autoLogin: "users/autoLogin",
//   profilePicture: "users/profile-picture/",
//   placePicture: "places/place-picture/",
// };

export enum ENDPOINTS {
  getAllUsers = "users",
  signup = "users/signup",
  login = "users/login",
  logout = "users/logout",
  changeProfilePicture = "users/changeProfilePicture",
  profilePicture = "users/profile-picture/",
  changePassword = "users/changePassword",
  changeUsername = "users/changeUsername",
  deletePlace = `places/`,
  getPlaces = "places/userPlaces",
  addPlace = "places/addPlace",
  editPlace = "places/edit",
  getuserPlaces = "places/placesByUserId/",
  placePicture = "places/place-picture/",
}

const getApiAddress = (endPoint: ENDPOINTS, param?: string) => {
  if (param) {
    // return `${BASE_URL}${END_POINTS[endPoint]}${param}`;
    return `${BASE_URL}${endPoint}${param}`;
  }

  return `${BASE_URL}${endPoint}`;
  // return `${BASE_URL}${END_POINTS[endPoint]}`;
};

const createAbsoluteApiAddress = (relativePath: string) => {
  return `${BASE_URL}${relativePath}`;
};

export { getApiAddress, createAbsoluteApiAddress };
