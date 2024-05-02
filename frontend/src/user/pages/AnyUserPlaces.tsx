import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import sendHttpRequest from "../../helpers/http-request";
import PlacesList from "../../places/components/PlacesList";
import { ENDPOINTS, getApiAddress } from "../../helpers/api-url";
import { UserDto } from "../../helpers/dtos";

interface LocationState {
  userDto: UserDto;
}

const AnyUserPlaces = () => {
  const [loadedPlaces, setLoadedPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  const { userId } = useParams() as { userId: string };
  const { state } = useLocation<LocationState>();
  const userDto = state.userDto;

  useEffect(() => {
    const fetchPlaces = async () => {
      const address = getApiAddress(ENDPOINTS.getuserPlaces, userId);
      const requestOptions = {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      };

      const data = await sendHttpRequest(address, requestOptions);
      setLoadedPlaces(data.places);
      setLoading(false);
    };
    fetchPlaces();
  }, [userId]);

  return (
    <div>
      <PlacesList
        userPlaces={loadedPlaces}
        userDto={userDto}
        editable={false}
        loading={loading}
      />
    </div>
  );
};

export default AnyUserPlaces;
