import { FC } from "react";
import classes from "../PlacePage.module.css";
import wordWrap from "../../../helpers/wordWrapper";
import { PlaceDto } from "../../../helpers/dtos";

type PlaceInfoT = {
  placeDto: PlaceDto;
};

const PlaceInfo: FC<PlaceInfoT> = ({ placeDto }) => {
  const { title, description, address, pictureUrl, creator } = placeDto;

  const titlelineWidth = 14;
  const descriptionLineWidth = 21;
  const addressLineWidth = 10;

  const oneLineTitle = wordWrap(title, titlelineWidth);
  const oneLineAddress = wordWrap(address, addressLineWidth);
  const wrappedDescription = wordWrap(description, descriptionLineWidth);

  const text = description.split("\n").map((item, index) => {
    return (
      <span key={index}>
        {item}
        <br />
      </span>
    );
  });

  return (
    <div className={classes["place-info"]}>
      <h3>{oneLineTitle}</h3>
      <p>
        <strong className={classes.strong}>Description:</strong> {text}
      </p>
      <p>
        <strong className={classes.strong}>Address: </strong>
        {oneLineAddress}
      </p>
    </div>
  );
};

export default PlaceInfo;
