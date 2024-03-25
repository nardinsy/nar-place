import Modal from "../../Shared-UI/Modal";
import PlaceInfoCard from "../UI/PlaceInfoCard";

const EditPlaceModal = ({
  editPlace,
  placeInfo,
  closeEditModal,
  onDeletePlace,
}) => {
  return (
    <Modal onBackdropClick={closeEditModal}>
      <PlaceInfoCard
        onSubmit={editPlace}
        submitButtonName="Save"
        closeModal={closeEditModal}
        onCancel={closeEditModal}
        placeInfo={placeInfo}
        extraAction={{
          action: onDeletePlace,
          "button-name": "Delete",
        }}
      />
    </Modal>
  );
};

export default EditPlaceModal;
