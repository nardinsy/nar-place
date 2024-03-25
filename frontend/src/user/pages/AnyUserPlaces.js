import { useState, useEffect } from "react";
import {
  useParams,
  useLocation,
} from "react-router-dom/cjs/react-router-dom.min";

import sendHttpRequest from "../../helpers/http-request";
import PlacesList from "../../places/components/PlacesList";
import { getApiAddress } from "../../helpers/api-url";

const AnyUserPlaces = (props) => {
  const [loadedPlaces, setLoadedPlaces] = useState([]);

  const userId = useParams().userId;
  const { state } = useLocation();
  const userInfo = state.userInfo;
  // userInfo = { id, username, pictureUrl, placeCount };

  useEffect(() => {
    const fetchPlaces = async () => {
      const address = getApiAddress("getuserPlaces", userId);
      const requestOptions = {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      };

      const data = await sendHttpRequest(address, requestOptions);
      setLoadedPlaces(data.places);
    };
    fetchPlaces();
  }, [userId]);

  return (
    <div>
      <PlacesList
        userPlaces={loadedPlaces}
        userInfo={userInfo}
        editable={false}
      />
    </div>
  );
};

export default AnyUserPlaces;
