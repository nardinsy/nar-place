import { FC, useState } from "react";
import classes from "./PlaceInfoCard.module.css";
import Button from "../../Shared-UI/Button";
import { PlaceDto } from "../../sharedTypes/dtos";

interface PlaceInfoCardProps {
  onSubmit: any;
  placeDto: PlaceDto;
  submitButtonName: string;
  onCancel: any;
  closeModal: any;
  extraAction: any;
}

const PlaceInfoCard: FC<PlaceInfoCardProps> = ({
  onSubmit,
  // placeDto = { id: "", title: "", description: "", address: "", image: "" },
  placeDto,
  submitButtonName,
  onCancel,
  closeModal,
  extraAction,
}) => {
  const [titleValue, setTitleValue] = useState(
    placeDto.title ? placeDto.title : ""
  );

  const [descriptionValue, setDescriptionValue] = useState(
    placeDto.description ? placeDto.description : ""
  );
  const [addressValue, setAddressValue] = useState(
    placeDto.address ? placeDto.address : ""
  );

  const titleChangeHandler = (event) => {
    setTitleValue(event.target.value);
  };

  const descriptionChangeHandler = (event) => {
    if (event.target.value.length > 300) {
      setDescriptionValue(event.target.value.slice(210));
    } else {
      setDescriptionValue(event.target.value);
    }
  };

  const addressChangeHandler = (event) => {
    setAddressValue(event.target.value);
  };

  const submitCardHandler = async (event) => {
    event.preventDefault();

    const p = new PlaceDto(
      titleValue,
      descriptionValue,
      addressValue,
      placeDto.picture,
      placeDto.id,
      "",
      ""
    );

    const place = {
      title: titleValue,
      description: descriptionValue,
      address: addressValue,
      // image: placeDto.image,
    };

    // if (placeDto.id) {
    //   place.id = placeDto.id;
    // }

    await onSubmit(place);
    if (submitButtonName === "Save") {
      closeModal();
    }
  };

  const cancelCardHandler = (event) => {
    event.preventDefault();
    onCancel();
  };

  const extraActionHandler = async (event) => {
    event.preventDefault();
    await extraAction.action(placeDto.id);
  };

  return (
    <div className={classes["place-info-card-container"]}>
      <input
        maxLength={30}
        type="text"
        className={classes["place-title"]}
        placeholder="Title"
        // ref={titleRef}
        value={titleValue}
        onChange={titleChangeHandler}
      />

      <textarea
        maxLength={210}
        className={classes["place-description"]}
        placeholder="Description about this place"
        // ref={descriptionRef}
        value={descriptionValue}
        onChange={descriptionChangeHandler}
      />
      <input
        maxLength={30}
        className={classes["place-address"]}
        placeholder="Address"
        // ref={addressRef}
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
