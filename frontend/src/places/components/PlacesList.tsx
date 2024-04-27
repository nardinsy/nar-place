import { FC } from "react";
import PlaceItem from "./PlaceItem";
import EditablePlaceItem from "./EditablePlaceItem";
import Card from "../../Shared-UI/Card";
import classes from "./PlacesList.module.css";
import { createAbsoluteApiAddress } from "../../helpers/api-url";
import { PlaceDto, UserDto, placeInfoCard } from "../../sharedTypes/dtos";

interface PlacesListProps {
  editable: boolean;
  userPlaces: PlaceDto[];
  userDto: UserDto;
  editingCallbacks?: {
    editPlace: (placeInfo: placeInfoCard & { id: string }) => Promise<void>;
    deletePlace: (placeId: string) => Promise<void>;
  };
}

const PlacesList: FC<PlacesListProps> = ({
  editable,
  userPlaces,
  userDto,
  editingCallbacks,
}) => {
  if (userPlaces.length === 0) {
    return (
      <div className={classes.center}>
        <Card className={classes["center-message"]}>
          <h2>No place found.</h2>
        </Card>
      </div>
    );
  }

  const places = editable ? editablePlaces() : notEditablePlaces();

  function editablePlaces() {
    if (!editingCallbacks)
      throw new Error("Editable places require edit callbacks");

    return userPlaces.map((place) => {
      const absPlacePictureUrl = createAbsoluteApiAddress(place.pictureUrl);
      const placeDto = { ...place, pictureUrl: absPlacePictureUrl };
      return (
        <li key={place.id}>
          <EditablePlaceItem
            key={place.id}
            placeDto={placeDto}
            userDto={userDto}
            editPlace={editingCallbacks.editPlace}
            deletePlace={editingCallbacks.deletePlace}
          />
        </li>
      );
    });
  }

  function notEditablePlaces() {
    return userPlaces.map((place) => {
      const absPlacePictureUrl = createAbsoluteApiAddress(place.pictureUrl);
      const placeDto = { ...place, pictureUrl: absPlacePictureUrl };
      return (
        <li key={place.id}>
          <PlaceItem key={place.id} placeDto={placeDto} userDto={userDto} />
        </li>
      );
    });
  }

  return <ul className={classes["places-container"]}>{places}</ul>;
};

export default PlacesList;
