import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import classes from "./Spinner.module.css";

const Spinner = () => {
  // const [deg, setDeg] = useState(0);

  // let timer = setTimeout(() => {
  //   rotateIcon();
  //   clearTimeout(timer);
  // }, 400);

  // const rotateIcon = () => {
  //   setDeg((pre) => pre + 10);
  // };

  return (
    <>
      <h2 className={classes.loading}>Loading</h2>
      <FontAwesomeIcon
        icon={faSpinner}
        // style={{ transform: `rotate(${deg}deg)` }}
        className={classes.spinner}
      />
    </>
  );
};

export default Spinner;
