import { useRef, FC, ChangeEvent, MouseEvent } from "react";

type PictureUploadFromFileT = {
  id: string;
  className: string;
  onChangeImage: (file: File) => void;
};

const PictureUploadFromFile: FC<PictureUploadFromFileT> = ({
  id,
  className,
  onChangeImage,
  // children,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const pickImageHandler = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const files = (event.target as HTMLInputElement).files;
    if (!files || files.length === 0) {
      return;
    }

    const file: File = files[0];
    onChangeImage(file);
  };

  const triggerFileChangeHandler = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (!inputRef.current) throw new Error("Can not upload image succesfully");

    inputRef.current.click();
  };

  return (
    <div className="p-4 flex flex-col">
      <label className="text-2xl pb-2">Select from file:</label>

      <input
        data-testid="photo-uploader"
        id={id}
        ref={inputRef}
        style={{ display: "none" }}
        type="file"
        accept=".jpg,.png,.jpeg"
        onChange={pickImageHandler}
      />
      <button
        data-testid="upload-button"
        onClick={triggerFileChangeHandler}
        className={className}
      >
        Uplaod
        {/* {children} */}
      </button>
    </div>
  );
};

export default PictureUploadFromFile;
