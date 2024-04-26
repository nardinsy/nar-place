import { useState } from "react";
import PlaceCard from "../UI/PlaceCard";
import MessageModal from "../../Shared-UI/MessageModal";
import EditPlaceModal from "./EditPlaceModal";
import Button from "../../Shared-UI/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import classes from "./EditablePlaceItem.module.css";

// import fakeImage from "../../assets/is.jpg";
// import im from "../../assets/2.jpg";

const EditablePlaceItem = ({ placeInfo, userDto, editPlace, deletePlace }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedPlaceId, setSelectedPlaceId] = useState("");

  const { id, title, description, pictureUrl, address } = placeInfo;
  // console.log(placeInfo);

  const showEditModalHandler = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
  };

  const deletePlaceHandler = (id) => {
    setShowEditModal(false);
    setShowMessageModal(true);
    setSelectedPlaceId(id);
  };

  const confirmToDeleteByUserHandler = async (event) => {
    event.preventDefault();
    setShowMessageModal(false);
    await deletePlace(selectedPlaceId);
  };

  const cancelToDeleteByUserHandler = (event) => {
    event.preventDefault();
    setShowMessageModal(false);
    setShowEditModal(true);
  };

  return (
    <>
      <PlaceCard
        id={id}
        title={title}
        description={description}
        address={address}
        image={pictureUrl}
        userDto={userDto}
      >
        <div
          className={classes["place-edit-button"]}
          onClick={showEditModalHandler}
        >
          <FontAwesomeIcon icon={faPen} />
        </div>
      </PlaceCard>

      {showEditModal && (
        <EditPlaceModal
          editPlace={editPlace}
          placeInfo={placeInfo}
          closeEditModal={closeEditModal}
          onDeletePlace={deletePlaceHandler}
        />
      )}

      {showMessageModal && (
        <MessageModal message="Are you sure you want to delete this item?">
          <Button onClick={confirmToDeleteByUserHandler} action={"delete"}>
            Delete
          </Button>
          <Button onClick={cancelToDeleteByUserHandler} action={"cancel"}>
            Cancel
          </Button>
        </MessageModal>
      )}
    </>
  );
};

export default EditablePlaceItem;
