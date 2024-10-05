import { ChangeEvent, FC, useState } from "react";

const PictureUplaodFromUrl: FC<{
  changeNewPictureUrl: (url: string) => void;
}> = ({ changeNewPictureUrl }) => {
  const [inputUrl, setInputUrl] = useState("");

  return (
    <div className="p-4 flex flex-col">
      <label className="text-2xl">Enter image URL:</label>
      <input
        type="text"
        className="border-[0.1rem] border-gray outline-none rounded-xl px-2 my-2"
        value={inputUrl}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          e.preventDefault();
          setInputUrl(e.target.value);
        }}
      />
      <button
        className="bg-primary text-white text-xl p-2 rounded-4xl border border-primary transition-colors hover:bg-white hover:text-primary hover:transition-all"
        onClick={(e: React.MouseEvent) => {
          e.preventDefault();
          if (!inputUrl) return;
          changeNewPictureUrl(inputUrl);
        }}
      >
        Upload
      </button>
    </div>
  );
};

export default PictureUplaodFromUrl;
