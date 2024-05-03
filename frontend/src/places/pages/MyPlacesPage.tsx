import { FC, useEffect } from "react";
import PlacesList from "../components/PlacesList";
import { PlaceDto, UserDto, placeInfoCard } from "../../helpers/dtos";
import useRequireAuthContext from "../../hooks/useRequireAuthContext";

type MyPlacePageProps = {
  places: PlaceDto[];
  getLoggedUserPlaces: () => Promise<void>;
  editPlace: (placeInfo: placeInfoCard & { id: string }) => Promise<void>;
  deletePlace: (placeId: string) => Promise<void>;
  loading: boolean;
};

const MyPlacePage: FC<MyPlacePageProps> = ({
  places,
  getLoggedUserPlaces,
  editPlace,
  deletePlace,
  loading,
}) => {
  console.log("Myplace Page Render");

  let userDto;
  const authContext = useRequireAuthContext();

  if (authContext.isLoggedin) {
    userDto = new UserDto(
      authContext.userId,
      authContext.username,
      authContext.userPictureUrl,
      places.length
    );
  } else {
    throw new Error("User is not looged in anymore. Please login again");
    //show login form modal
  }

  useEffect(() => {
    if (places.length === 0) {
      getLoggedUserPlaces();
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
        loading={loading}
      />
    </div>
  );
};

export default MyPlacePage;
