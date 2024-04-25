import { useRef } from "react";

const ImageUpload = ({ id, className, onChangeImage, children }) => {
  const inputRef = useRef();

  const pickImageHandler = (event) => {
    event.preventDefault();

    const file = event.target.files[0];
    onChangeImage(file);
  };

  const triggerFileChangeHandler = (event) => {
    event.preventDefault();
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
