import mongoose from "mongoose";
import { model, Schema, Types } from "mongoose";

export interface IProfilePicture extends mongoose.Document {
  image:
    | {
        kind: "File";
        data: Buffer;
        contentType: string;
      }
    | {
        kind: "Url";
        path: string;
      };
  userId: string;
}

const pictureKindSchema = new Schema(
  {
    kind: { type: String, required: true },
  },
  { discriminatorKey: "kind", _id: false }
);

const UrlKindSchema = new Schema({
  path: { type: String, required: true },
});

const FileKindSchema = new Schema({
  data: { type: Buffer, required: true },
  contentType: { type: String, required: true },
});

//

const pictureSchema = new Schema<IProfilePicture>({
  image: pictureKindSchema,
  userId: { type: String },
});

pictureSchema
  .path<Schema.Types.Subdocument>("image")
  .discriminator("Url", UrlKindSchema);
pictureSchema
  .path<Schema.Types.Subdocument>("image")
  .discriminator("File", FileKindSchema);

const ProfilePicture = model<IProfilePicture>("Picture", pictureSchema);
export default ProfilePicture;
