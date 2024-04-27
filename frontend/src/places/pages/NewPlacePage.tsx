import { useState, FC } from "react";
import ImageUpload from "../../shared/ImageUpload";
import PlaceInfoCard from "../UI/PlaceInfoCard";
import classes from "./NewPlacePage.module.css";
import picturePlaceholder from "../../assets/Image-placeholder.png";
import useAuthContext from "../../Hooks/Auth";
import {
  placeInfoCard,
  PlaceInfoCardWithPictire,
} from "../../sharedTypes/dtos";

interface NewPlacePageProps {
  addPlace: (place: PlaceInfoCardWithPictire) => Promise<void>;
}
const NewPlacePage: FC<NewPlacePageProps> = ({ addPlace }) => {
  const authContext = useAuthContext();
  if (!authContext.isLoggedin)
    throw new Error("User is not logged in, Please log in again");

  const [uploadedPicture, setUploadedPicture] = useState<string>();
  const [file, setFile] = useState<File | undefined>(undefined);

  const changeNewPicture = (file: File) => {
    setFile(file);
    setUploadedPicture(URL.createObjectURL(file));
  };

  const addNewPlace = (place: placeInfoCard) => {
    if (!file)
      throw new Error("Can not add place without file, try to add file");

    const placeInfoCardWithPictire: PlaceInfoCardWithPictire = {
      title: place.title,
      description: place.description,
      address: place.address,
      picture: file,
    };

    addPlace(placeInfoCardWithPictire);
  };

  return (
    <div className={classes["new-place-page-container"]}>
      <div className={classes["selection-container"]}>
        <div className={classes["picture"]}>
          <img
            className={classes["uploaded-picture"]}
            alt=""
            src={uploadedPicture ? uploadedPicture : picturePlaceholder}
          />
        </div>
        <div className={classes["upload-picture-button-container"]}>
          <ImageUpload
            id={authContext.token}
            onChangeImage={changeNewPicture}
            className={classes["select-picture-button"]}
          >
            Upload new picture
          </ImageUpload>
        </div>
      </div>

      <div className={classes["place-info"]}>
        <PlaceInfoCard
          onSubmit={addNewPlace}
          submitButtonName="Post"
          onCancel={() => {
            setUploadedPicture(undefined);
            setFile(undefined);
          }}
        />
      </div>
    </div>
  );
};

export default NewPlacePage;
