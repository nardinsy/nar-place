import { useState, FC, PropsWithChildren, MouseEvent } from "react";
import { Link } from "react-router-dom";
import classes from "./PlaceCard.module.css";
import { PlaceDto, UserDto } from "../../helpers/dtos";

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

  const controlLineWidth = (text: string, lineLength: number) => {
    let result = "";
    if (text.length > lineLength) {
      const splitetText = text.split(" ");
      if (splitetText[0].length > lineLength) {
        // console.log(splitetText[0].slice(0, lineLength - 2) + " ...");
        return splitetText[0].slice(0, lineLength - 2) + " ...";
      } else {
        for (let i = 0; i < splitetText.length; i++) {
          if (result.length + splitetText[i].length < lineLength) {
            result += splitetText[i] + " ";
          } else {
            result += " ...";
            break;
          }
        }
      }
    } else {
      result = text;
    }

    return result;
  };

  function wordWrap(str: string, maxWidth: number) {
    let newLineStr = "\n";
    let done = false;
    let res = "";
    while (str.length > maxWidth) {
      let found = false;
      // Inserts new line at first whitespace of the line
      for (let i = maxWidth - 1; i >= 0; i--) {
        if (testWhite(str.charAt(i))) {
          res = res + [str.slice(0, i), newLineStr].join("");
          str = str.slice(i + 1);
          found = true;
          break;
        }
      }
      // Inserts new line at maxWidth position, the word is too long to wrap
      if (!found) {
        res += [str.slice(0, maxWidth), newLineStr].join("");
        str = str.slice(maxWidth);
      }
    }

    return res + str;
  }

  function testWhite(x: string) {
    let white = new RegExp(/^\s$/);
    return white.test(x.charAt(0));
  }

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
