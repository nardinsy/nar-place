import PlaceItem from "./PlaceItem";
import EditablePlaceItem from "./EditablePlaceItem";
import Card from "../../Shared-UI/Card";
import classes from "./PlacesList.module.css";

import { createAbsoluteApiAddress } from "../../helpers/api-url";

const PlacesList = ({ userPlaces, userInfo, editable, editingCallbacks }) => {
  if (userPlaces.length === 0) {
    return (
      <div className={classes.center}>
        <Card className={classes["center-message"]}>
          <h2>No place found.</h2>
        </Card>
      </div>
    );
  }

  let places;

  const editablePlaces = () => {
    return userPlaces.map((place) => {
      const absPlacePictureUrl = createAbsoluteApiAddress(place.pictureUrl);
      return (
        <li key={place.id}>
          <EditablePlaceItem
            key={place.id}
            placeInfo={{
              id: place.id,
              title: place.title,
              description: place.description,
              address: place.address,
              pictureUrl: absPlacePictureUrl,
            }}
            userInfo={userInfo}
            editPlace={editingCallbacks.editPlace}
            deletePlace={editingCallbacks.deletePlace}
          />
        </li>
      );
    });
  };

  const notEditablePlaces = () => {
    return userPlaces.map((place) => {
      const absPlacePictureUrl = createAbsoluteApiAddress(place.pictureUrl);

      return (
        <li key={place.id}>
          <PlaceItem
            key={place.id}
            placeInfo={{
              id: place.id,
              title: place.title,
              description: place.description,
              address: place.address,
              pictureUrl: absPlacePictureUrl,
            }}
            userInfo={userInfo}
          />
        </li>
      );
    });
  };

  if (editable) {
    places = editablePlaces();
  } else {
    places = notEditablePlaces();
  }

  return <ul className={classes["places-container"]}>{places}</ul>;
};

export default PlacesList;
