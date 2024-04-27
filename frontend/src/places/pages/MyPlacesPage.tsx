import { FC, useEffect } from "react";
import PlacesList from "../components/PlacesList";
import { PlaceDto, UserDto, placeInfoCard } from "../../sharedTypes/dtos";
import useAuthContext from "../../Hooks/Auth";

type MyPlacePageProps = {
  places: PlaceDto[];
  getPlaces: () => Promise<void>;
  editPlace: (placeInfo: placeInfoCard & { id: string }) => Promise<void>;
  deletePlace: (placeId: string) => Promise<void>;
};

const MyPlacePage: FC<MyPlacePageProps> = ({
  places,
  getPlaces,
  editPlace,
  deletePlace,
}) => {
  console.log("Myplace Page Render");

  let userDto;
  const authContext = useAuthContext();

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
