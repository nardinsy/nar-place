import { useRef } from "react";
const ImageUpload = ({ id, className, onChangeImage, children }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const pickImageHandler = (event) => {
    event.preventDefault();

    const file: File = event.target.files[0];
    onChangeImage(file);
  };

  const triggerFileChangeHandler = (event) => {
    event.preventDefault();
    if (!inputRef.current) throw new Error("Can not upload image succesfully");
    inputRef.current.click();
  };

  return (
    <div>
      <input
        id={id}
        ref={inputRef}
        style={{ display: "none" }}
        type="file"
        accept=".jpg,.png,.jpeg"
        onChange={pickImageHandler}
      />
      <button onClick={triggerFileChangeHandler} className={className}>
        {children}
      </button>
    </div>
  );
};

export default ImageUpload;
