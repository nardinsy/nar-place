import { useContext, useEffect } from "react";
import PlacesList from "../components/PlacesList";
import AuthContext from "../../store/auth-context";

const MyPlacePage = ({ places, getPlaces, editPlace, deletePlace }) => {
  console.log("Myplace Page Render");

  const authContext = useContext(AuthContext);
  const userInfo = {
    id: authContext.userId,
    username: authContext.username,
    pictureUrl: authContext.userPictureUrl,
    placeCount: places.length,
  };

  useEffect(() => {
    if (places.length === 0) {
      getPlaces();
      console.log("Get places through myPlacesPage");
    }
  }, []);

  return (
    <div>
      <PlacesList
        userPlaces={places}
        userInfo={userInfo}
        editable={true}
        editingCallbacks={{ editPlace, deletePlace }}
      />
    </div>
  );
};

export default MyPlacePage;
