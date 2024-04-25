import NewPlaceCard from "../../components/NewPlaceCard";
import classes from "./AddPlacePage.module.css";

const AddPlacePageOLD = ({ addPlace }) => {
  return (
    <div className={classes["form-new-place"]}>
      <NewPlaceCard addPlace={addPlace} />
    </div>
  );
};

export default AddPlacePageOLD;
