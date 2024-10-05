import { FC } from "react";
import Modal from "../shared-UI/Modal";
import PictureUploadFromFile from "./PictureUploadFromFile";
import PictureUplaodFromUrl from "./PictureUploadFromUrl";

interface SelectPictureUploadOptionsModalT {
  changeNewPictureFile: (file: File) => void;
  changeNewPictureUrl: (url: string) => void;
  closeModal: () => void;
}

const SelectPictureUploadOptionsModal: FC<SelectPictureUploadOptionsModalT> = ({
  changeNewPictureFile,
  changeNewPictureUrl,
  closeModal,
}) => {
  return (
    <Modal onBackdropClick={closeModal}>
      <PictureUplaodFromUrl changeNewPictureUrl={changeNewPictureUrl} />

      <PictureUploadFromFile
        id={"1"}
        onChangeImage={changeNewPictureFile}
        className="w-full bg-primary text-white text-xl p-2 rounded-4xl border border-primary transition-colors hover:bg-white hover:text-primary hover:transition-all"
      />
    </Modal>
  );
};

export default SelectPictureUploadOptionsModal;
