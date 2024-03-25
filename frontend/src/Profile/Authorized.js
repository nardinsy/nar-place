import { useContext, useState } from "react";
import { Route } from "react-router-dom";

import MyPlacePage from "../places/pages/MyPlacesPage";
// import AddPlacePageOLD from "../places/pages/AddPlacePageOld";
import LogoutModal from "../Authentication/Logout/LogoutModal";
import ProfileSettingsPage from "./pages/ProfileSettingsPage";
import NewPlacePage from "../places/pages/NewPlacePage";

import sendHttpRequest from "../helpers/http-request";
import { getApiAddress, createAbsoluteApiAddress } from "../helpers/api-url";
import AuthContext from "../store/auth-context";
import PictureModal from "../shared/PictureModal";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const Authorized = ({ token }) => {
  const authContext = useContext(AuthContext);
  console.log("User Component Render");
  const [places, setPlaces] = useState([]);

  const history = useHistory();

  const addPlace = async (place) => {
    const newPLaceBlob = place.image;

    const reader = new FileReader();

    reader.onloadend = async () => {
      const newImageDataURLFormat = reader.result; //reader.result: data:image/jpeg;base64

      const newplace = {
        title: place.title,
        description: place.description,
        address: place.address,
        image: newImageDataURLFormat,
      };
      const address = getApiAddress("addPlace");

      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json", token },
        body: JSON.stringify(newplace),
      };

      const data = await sendHttpRequest(address, requestOptions);

      setPlaces((pre) => [...pre, data.place]);
      console.log(data.message);

      history.push("/myplace");
    };

    reader.readAsDataURL(newPLaceBlob);
  };

  const getPlaces = async () => {
    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json", token },
    };

    const address = getApiAddress("getPlaces");

    const data = await sendHttpRequest(address, requestOptions);

    console.log("getPlace api message:", data.mesaage);
    const places = data.places;
    setPlaces(places);
  };

  const editPlace = async (placeInfo) => {
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
    const address = getApiAddress("editPlace");

    const data = await sendHttpRequest(address, requestOptions);

    const editedPlace = places.find((place) => place.id === placeInfo.id);

    editedPlace.title = placeInfo.title;
    editedPlace.description = placeInfo.description;
    editedPlace.address = placeInfo.address;

    setPlaces((pre) => [...pre]);

    console.log("message:", data.message);
  };

  const deletePlace = async (placeId) => {
    const requestOptions = {
      method: "DELETE",
      headers: { "Content-Type": "application/json", token },
    };
    const address = getApiAddress("deletePlace", placeId);

    const data = await sendHttpRequest(address, requestOptions);

    console.log("delete place front");
    console.log("message:", data.message);

    setPlaces((pre) => {
      const filteredPLaces = places.filter((place) => place.id !== placeId);
      return filteredPLaces;
    });
  };

  const changeUserImage = async (userNewImage) => {
    // imuserNewImage: File {name: '2021-10-22 7.18.jpg', lastModified: 1704866449845, lastModifiedDate: Wed Jan 10 2024 09:30:49 GMT+0330 (Iran Standard Time), webkitRelativePath: '', size: 1156073, …}

    if (!userNewImage) {
      const data = await sendHttpRequestForChangeProfilePicture(undefined);

      localStorage.removeItem("userPictureUrl");

      authContext.setPictureUrl(undefined);
      return;
    }
    let data;

    const reader = new FileReader();

    reader.onloadend = async () => {
      const newImageDataURLFormat = reader.result; //reader.result: data:image/jpeg;base64

      try {
        data = await sendHttpRequestForChangeProfilePicture(
          newImageDataURLFormat
        );

        const absPictureUrl = createAbsoluteApiAddress(data.pictureUrl);

        localStorage.removeItem("userPictureUrl");
        localStorage.setItem("userPictureUrl", absPictureUrl);

        // if (!authContext.userPictureUrl) {
        //   const absPictureUrl = createAbsoluteApiAddress(data.pictureUrl);
        //   localStorage.setItem("userPictureUrl", absPictureUrl);
        // }

        // changeUserProfileClientSide(data.pictureUrl);
      } catch (error) {
        //can not change image on server
        console.log(error);
      }
    };

    reader.readAsDataURL(userNewImage);
    authContext.setPictureUrl(URL.createObjectURL(userNewImage));
    // setUserPictureUrl(URL.createObjectURL(userNewImage));
  };

  const sendHttpRequestForChangeProfilePicture = async (pictureFile) => {
    const userNewImage = { image: pictureFile };

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json", token },
      body: JSON.stringify(userNewImage),
    };
    const address = getApiAddress("changeProfilePicture");

    const data = await sendHttpRequest(address, requestOptions);
    return data;
  };

  const changePassword = async (newPassword) => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json", token },
      body: JSON.stringify({ password: newPassword }),
    };
    const address = getApiAddress("changePassword");

    const data = await sendHttpRequest(address, requestOptions);
    console.log(data.message);
  };

  const changeUsername = async (newUsername) => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json", token },
      body: JSON.stringify({ username: newUsername }),
    };
    const address = getApiAddress("changeUsername");

    const data = await sendHttpRequest(address, requestOptions);
    authContext.setUsername(newUsername);

    // setUsername(newUsername);

    console.log(data.message);
  };

  return (
    <>
      <Route path="/myplace">
        <MyPlacePage
          places={places}
          getPlaces={getPlaces}
          editPlace={editPlace}
          deletePlace={deletePlace}
        />
      </Route>

      <Route path="/new">
        <NewPlacePage addPlace={addPlace} />
        {/* <AddPlacePage addPlace={addPlace} /> */}
      </Route>

      <Route path="/logout">
        <LogoutModal />
      </Route>

      <Route path="/profile-settings">
        <ProfileSettingsPage
          changeUserImage={changeUserImage}
          changePassword={changePassword}
          changeUsername={changeUsername}
        />
      </Route>

      {/* <Route path="/photo">
        <PictureModal
          pictureUrl={authContext.userPictureUrl}
          showChevrons={true}
          ellipsisDropdownItems={ellipsisDropdownItems}
        />
      </Route> */}
    </>
  );
};

export default Authorized;
