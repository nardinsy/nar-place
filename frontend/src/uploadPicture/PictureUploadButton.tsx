import { FC, useState } from "react";
import SelectPictureUploadOptionsModal from "./SelectPictureUploadOptionsModal";

interface PictureUploadButtonT {
  changeNewPictureFile: (file: File) => void;
  changeNewPictureUrl: (url: string) => void;
}

const PictureUploadButton: FC<PictureUploadButtonT> = ({
  changeNewPictureFile,
  changeNewPictureUrl,
}) => {
  const [showSelectModal, setShowSelectModal] = useState(false);

  const selectUploadPictureHandler = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowSelectModal(true);
  };

  const closeSelectPictureUploadOptionsModal = () => {
    setShowSelectModal(false);
  };

  const changeNewPictureUrlHandler = (url: string) => {
    changeNewPictureUrl(url);
    closeSelectPictureUploadOptionsModal();
  };

  const changeNewPictureFileHandler = (file: File) => {
    changeNewPictureFile(file);
    closeSelectPictureUploadOptionsModal();
  };

  return (
    <div>
      <button
        className="bg-primary text-white text-l px-4 py-2 rounded-4xl border border-primary transition-colors hover:bg-white hover:text-primary hover:transition-all"
        onClick={selectUploadPictureHandler}
      >
        Select picture
      </button>
      {showSelectModal && (
        <SelectPictureUploadOptionsModal
          changeNewPictureFile={changeNewPictureFileHandler}
          changeNewPictureUrl={changeNewPictureUrlHandler}
          closeModal={closeSelectPictureUploadOptionsModal}
        />
      )}
    </div>
  );
};

export default PictureUploadButton;
