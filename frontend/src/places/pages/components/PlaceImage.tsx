import { FC } from "react";
import classes from "../PlacePage.module.css";

type PlaceImageT = {
  src: string;
  alt: string;
};
const PlaceImage: FC<PlaceImageT> = ({ src, alt }) => {
  return (
    <div className={classes["place-page-image-container"]}>
      <img
        src={src}
        alt={alt}
        className={classes["place-image"]}
        loading="lazy"
      />
    </div>
  );
};

export default PlaceImage;
