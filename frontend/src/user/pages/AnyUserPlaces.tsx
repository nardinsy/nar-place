import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import PlacesList from "../../places/components/PlacesList";
import { UserDto, PlaceDto } from "../../helpers/dtos";
import useRequiredLocalBackendContext from "../../local-storage/use-required-local-backend-service-contex";

interface LocationState {
  userDto: UserDto;
}

const AnyUserPlaces = () => {
  const [loadedPlaces, setLoadedPlaces] = useState<PlaceDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [userDto, setUserDto] = useState<UserDto>({
    userId: "",
    username: "",
    pictureUrl: "",
    placeCount: 0,
  });

  const backend = useRequiredLocalBackendContext();

  const { userId } = useParams() as { userId: string };
  const { state } = useLocation<LocationState>();
  // const userDto = state.userDto;

  useEffect(() => {
    const fetchPlaces = async () => {
      const data = await backend.getAnyUserPlacesByUserId(userId);
      setLoadedPlaces(data.places);
      setLoading(false);
    };

    if (state) {
      setUserDto(state.userDto);
    } else {
      const userDto = backend.getAnyUserByUserId(userId);
      setUserDto(userDto);
    }

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
