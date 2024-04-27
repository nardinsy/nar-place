import { useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import PlaceInfoCard from "../UI/PlaceInfoCard";
import classes from "./NewPlace.module.css";
import MessageModal from "../../Shared-UI/MessageModal";
import Button from "../../Shared-UI/Button";

const NewPlaceCard = ({ addPlace }) => {
  const [showMessageModal, setShowMessageModal] = useState(false);
  let history = useHistory();

  const addPlaceHandler = async (place) => {
    await addPlace(place);

    setShowMessageModal(true);

    const timerId = setTimeout(() => {
      history.replace("/myplace");
    }, 5000);

    // clearTimeout(timerId);
  };

  console.log("new place page render");

  return (
    <div className={classes["new-place-container"]}>
      <PlaceInfoCard
        onSubmit={addPlaceHandler}
        submitButtonName="Post"
        onCancel={() => {}}
      />
      {showMessageModal && (
        <MessageModal message="Place added to your places.">
          <Button
            onClick={() => {
              setShowMessageModal(false);
              history.replace("/myplace");
            }}
            action={"submit"}
          >
            OK
          </Button>
        </MessageModal>
      )}
    </div>
  );
};

export default NewPlaceCard;

// const NewPlaceCard = ({ addPlace }) => {
//   const titleRef = useRef("");
//   const descriptionRef = useRef("");
//   const addressRef = useRef("");

//   const submitNewPlace = async (event) => {
//     event.preventDefault();
//     // userPlacesContext.addPlace();
//     const newPlace = {
//       title: titleRef.current.value,
//       description: descriptionRef.current.value,
//       address: addressRef.current.value,
//     };
//     await addPlace(newPlace);
//   };

//   return (
//     <div className={classes["new-place-card-container"]}>
//       <input
//         type="text"
//         className={`${classes["new-place-title"]} ${classes.input}`}
//         placeholder="Title"
//         ref={titleRef}
//       />
//       <textarea
//         className={`${classes["new-place-description"]} ${classes.input}`}
//         placeholder="Description about this place"
//         ref={descriptionRef}
//       />
//       <input
//         className={`${classes["new-place-address"]} ${classes.input}`}
//         placeholder="Address"
//         ref={addressRef}
//       />

//       <div className={classes["new-place-actions"]}>
//         <button className={`${classes["button-cancel"]} ${classes.btn}`}>
//           Cancel
//         </button>
//         <button
//           className={`${classes["button-post"]} ${classes.btn}`}
//           onClick={submitNewPlace}
//         >
//           Post
//         </button>
//       </div>
//     </div>
//   );
// };

// export default NewPlaceCard;
