import mongoose from "mongoose";
import { Model, Schema } from "mongoose";

export interface IPlacePicture {
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
  placeId: string;
}

// Define the base schema with a discriminator key
const pictureKindSchema = new Schema(
  {
    kind: { type: String, required: true }, // Discriminator key
  },
  { discriminatorKey: "kind", _id: false } // `_id: false` prevents a new _id from being generated for the subdocument
);

// Define the specific schemas for UrlKind and FileKind
const UrlKindSchema = new Schema({
  path: { type: String, required: true },
});

const FileKindSchema = new Schema({
  data: { type: Buffer, required: true },
  contentType: { type: String, required: true },
});

// Define the main schema that uses the discriminators
const placePictureSchema = new Schema({
  placeId: { type: String, required: true },
  image: pictureKindSchema, // Use the base schema here
});

// Apply discriminators to the `image` field
placePictureSchema
  .path<Schema.Types.Subdocument>("image")
  .discriminator("Url", UrlKindSchema);
placePictureSchema
  .path<Schema.Types.Subdocument>("image")
  .discriminator("File", FileKindSchema);

// Create the model
const PlacePicture = mongoose.model("PlacePicture", placePictureSchema);
export default PlacePicture;

// Usage example
// const placeWithUrlImage = new PlacePicture({
//   placeId: '123',
//   image: {
//     kind: 'UrlKind',
//     path: '/path/to/image.jpg',
//   },
// });

// const placeWithFileImage = new PlacePicture({
//   placeId: '456',
//   image: {
//     kind: 'FileKind',
//     data: Buffer.from('...'),
//     contentType: 'image/png',
//   },
// });

// placeWithUrlImage.save();
// placeWithFileImage.save();
