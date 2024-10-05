import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import PictureUploadFromFile from "../uploadPicture/PictureUploadFromFile";

const value = {
  id: "12345",
  className: "",
  onChangeImage: jest.fn(),
  chidren: "",
};

test("image upload button upload image successfully", () => {
  render(
    <PictureUploadFromFile
      id={value.id}
      children={value.chidren}
      className={value.className}
      onChangeImage={value.onChangeImage}
    />
  );

  const file = new File([""], "image.png", { type: "image/png" });
  const uploadButton = screen.getByTestId("upload-button");
  fireEvent.click(uploadButton);

  const uploader = screen.getByTestId("photo-uploader");

  fireEvent.change(uploader, {
    target: { files: [file] },
  });

  expect(value.onChangeImage).toHaveBeenCalled();
});
