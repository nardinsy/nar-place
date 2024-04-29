import { FC, useState, FormEvent, ChangeEvent, MouseEvent } from "react";
import classes from "./PlaceInfoCard.module.css";
import Button from "../../Shared-UI/Button";
import { placeInfoCard } from "../../sharedTypes/dtos";

interface PlaceInfoCardProps {
  onSubmit: (place: placeInfoCard) => void;
  submitButtonName: string;
  onCancel: () => void;

  closeModal?: () => void;
  extraAction?: {
    action: () => void;
    "button-name": string;
  };
  placeInputs?: placeInfoCard;
}

const PlaceInfoCard: FC<PlaceInfoCardProps> = ({
  onSubmit,
  placeInputs,
  submitButtonName,
  onCancel,
  closeModal,
  extraAction,
}) => {
  const [titleValue, setTitleValue] = useState(
    placeInputs ? placeInputs.title : ""
  );

  const [descriptionValue, setDescriptionValue] = useState(
    placeInputs ? placeInputs.description : ""
  );

  const [addressValue, setAddressValue] = useState(
    placeInputs ? placeInputs.address : ""
  );

  const titleChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setTitleValue(event.target.value);
  };

  const descriptionChangeHandler = (
    event: ChangeEvent<HTMLTextAreaElement>
  ) => {
    if (event.target.value.length > 300) {
      setDescriptionValue(event.target.value.slice(210));
    } else {
      setDescriptionValue(event.target.value);
    }
  };

  const addressChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setAddressValue(event.target.value);
  };

  const submitCardHandler = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (!titleValue || !descriptionValue || !addressValue) {
      throw new Error("Please fill inputs");
    }
    //here inputs border should turn to red

    const place = {
      title: titleValue,
      description: descriptionValue,
      address: addressValue,
    };

    // if (placeDto.id) {
    //   place.id = placeDto.id;
    // }

    await onSubmit(place);
    if (submitButtonName === "Save" && closeModal) {
      closeModal();
    }
  };

  const cancelCardHandler = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    onCancel();
  };

  const extraActionHandler = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (!placeInputs || !extraAction) throw new Error("");

    await extraAction.action();
  };

  return (
    <div className={classes["place-info-card-container"]}>
      <input
        maxLength={30}
        type="text"
        className={classes["place-title"]}
        placeholder="Title"
        value={titleValue}
        onChange={titleChangeHandler}
      />

      <textarea
        maxLength={210}
        className={classes["place-description"]}
        placeholder="Description about this place"
        value={descriptionValue}
        onChange={descriptionChangeHandler}
      />
      <input
        maxLength={30}
        className={classes["place-address"]}
        placeholder="Address"
        value={addressValue}
        onChange={addressChangeHandler}
      />

      <div className={classes["place-actions"]}>
        {extraAction && (
          <Button action={"delete"} onClick={extraActionHandler}>
            {extraAction["button-name"]}
          </Button>
        )}
        <Button action={"cancel"} onClick={cancelCardHandler}>
          Cancel
        </Button>
        <Button action={"submit"} onClick={submitCardHandler}>
          {submitButtonName}
        </Button>
      </div>
    </div>
  );
};

export default PlaceInfoCard;
