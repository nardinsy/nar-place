import PlaceCard from "../UI/PlaceCard";

const PlaceItem = ({ placeInfo, userDto }) => {
  const { id, title, description, pictureUrl, address } = placeInfo;

  return (
    <PlaceCard
      id={id}
      title={title}
      description={description}
      address={address}
      image={pictureUrl}
      userDto={userDto}
    />
  );
};

export default PlaceItem;
