import { useState, FC, PropsWithChildren, MouseEvent } from "react";
import { Link } from "react-router-dom";
import classes from "./PlaceCard.module.css";
import { PlaceDto, UserDto } from "../../helpers/dtos";
import wordWrap from "../../helpers/wordWrapper";
import controlLineWidth from "../../helpers/controlLineWidth";

type PlaceCardProps = PropsWithChildren<{
  placeDto: PlaceDto;
  userDto: UserDto;
}>;
const PlaceCard: FC<PlaceCardProps> = ({ placeDto, userDto, children }) => {
  const [showPictureModal, setShowPictureModal] = useState(false);

  // const ellipsisDropdownItems = [
  //   {
  //     title: "Save As ...",
  //     handler: (event) => {
  //       //navigate to profile setting page
  //     },
  //   },
  // ];
  const { placeId: id, title, description, address, pictureUrl } = placeDto;

  const titlelineWidth = 14;
  const descriptionLineWidth = 21;
  const addressLineWidth = 10;

  const cardClickHandler = (event: MouseEvent<HTMLDivElement>) => {
    const selection = window.getSelection();

    if (!selection) return;
    if (selection.toString().length !== 0) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      event.preventDefault();
      setShowPictureModal(true);
    }
  };

  const oneLineTitle = controlLineWidth(title, titlelineWidth);
  const oneLineAddress = controlLineWidth(address, addressLineWidth);
  const wrappedDescription = wordWrap(description, descriptionLineWidth);

  return (
    <div className={classes["place-card"]} onClick={cardClickHandler}>
      <Link
        to={{
          pathname: `/place/${id}`,
          state: { placeDto, userDto },
        }}
      >
        <img
          src={pictureUrl}
          alt={title}
          className={classes["place-image-full"]}
          loading="lazy"
        />
        <div className={classes["card-content"]}>
          <h2 className={classes["place-title"]}>{oneLineTitle}</h2>
          <div className={classes.wrapper}>
            <div className={classes.scroll}>
              <p className={classes.content}>{wrappedDescription}</p>
            </div>
          </div>

          <p className={classes["place-address"]}>
            <strong style={{ color: "#C0C0C0" }}>Address: </strong>
            {oneLineAddress}
          </p>
        </div>

        {children}
      </Link>
    </div>
  );
};

export default PlaceCard;
