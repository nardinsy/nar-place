import { useContext, useEffect } from "react";
import PlacesList from "../components/PlacesList";
import AuthContext from "../../store/auth-context";
import { UserDto } from "../../sharedTypes/dtos";

const MyPlacePage = ({ places, getPlaces, editPlace, deletePlace }) => {
  console.log("Myplace Page Render");

  const authContext = useContext(AuthContext);
  const userDto = new UserDto(
    authContext.userId,
    authContext.username,
    authContext.userPictureUrl,
    places.length
  );

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
        userDto={userDto}
        editable={true}
        editingCallbacks={{ editPlace, deletePlace }}
      />
    </div>
  );
};

export default MyPlacePage;
