// const BASE_URL = "http://localhost:5000/api/";
const BASE_URL = "http://192.168.1.6:5000/api/";

const END_POINTS = {
  getAllUsers: "users",
  getuserPlaces: "places/placesByUserId/",
  addPlace: "places/addPlace",
  getPlaces: "places/userPlaces",
  deletePlace: `places/`,
  editPlace: "places/edit",
  signup: "users/signup",
  login: "users/login",
  logout: "users/logout",
  changeProfilePicture: "users/changeProfilePicture",
  changePassword: "users/changePassword",
  changeUsername: "users/changeUsername",
  autoLogin: "users/autoLogin",
  profilePicture: "users/profile-picture/",
  placePicture: "places/place-picture/",
};

const getApiAddress = (endPoint, param) => {
  if (param) {
    return `${BASE_URL}${END_POINTS[endPoint]}${param}`;
  }

  return `${BASE_URL}${END_POINTS[endPoint]}`;
};

const createAbsoluteApiAddress = (relativePath) => {
  return `${BASE_URL}${relativePath}`;
};

export { getApiAddress, createAbsoluteApiAddress };
