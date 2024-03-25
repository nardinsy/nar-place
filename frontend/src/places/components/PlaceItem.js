// import Card from "../../Shared-UI/Card";

// import classes from "./PlaceItem.module.css";
import fakeImage from "../../assets/is.jpg";
import PlaceCard from "../UI/PlaceCard";

const PlaceItem = ({ placeInfo, userInfo }) => {
  const { id, title, description, pictureUrl, address } = placeInfo;

  return (
    <PlaceCard
      id={id}
      title={title}
      description={description}
      address={address}
      image={pictureUrl}
      userInfo={userInfo}
    />
  );
};

export default PlaceItem;

{
  /* <>
<Card className={classes["place-card"]}>
  <img src={fakeImage} className={classes.photo} />
  <h3 className={classes["place-title"]}>{title}</h3>
  <p className={classes["place-description"]}>{description}</p>
  <span className={classes.address}>
    address: <p className={classes["place-address"]}>{address}</p>{" "}
  </span>
</Card>
</> */
}
