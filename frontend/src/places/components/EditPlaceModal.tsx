import { FC } from "react";
import Modal from "../../Shared-UI/Modal";
import { PlaceDto, placeInfoCard } from "../../sharedTypes/dtos";
import PlaceInfoCard from "../UI/PlaceInfoCard";

type EditPlaceModalT = {
  editPlace: (placeInfo: placeInfoCard & { id: string }) => Promise<void>;
  placeDto: PlaceDto;
  closeEditModal: () => void;
  onDeletePlace: (id: any) => void;
};

const EditPlaceModal: FC<EditPlaceModalT> = ({
  editPlace,
  placeDto,
  closeEditModal,
  onDeletePlace,
}) => {
  const editPlaceHandler = (updatedplaceInfos: placeInfoCard) => {
    const place = { ...updatedplaceInfos, id: placeDto.placeId };
    editPlace(place);
  };

  const deletePlaceHandler = () => {
    onDeletePlace(placeDto.placeId);
  };

  return (
    <Modal onBackdropClick={closeEditModal}>
      <PlaceInfoCard
        onSubmit={editPlaceHandler}
        submitButtonName="Save"
        closeModal={closeEditModal}
        onCancel={closeEditModal}
        placeInputs={placeDto}
        extraAction={{
          action: deletePlaceHandler,
          "button-name": "Delete",
        }}
      />
    </Modal>
  );
};

export default EditPlaceModal;
