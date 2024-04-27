import Modal from "../../Shared-UI/Modal";
import PlaceInfoCard from "../UI/PlaceInfoCard";

const EditPlaceModal = ({
  editPlace,
  placeDto,
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
        placeDto={placeDto}
        extraAction={{
          action: onDeletePlace,
          "button-name": "Delete",
        }}
      />
    </Modal>
  );
};

export default EditPlaceModal;
