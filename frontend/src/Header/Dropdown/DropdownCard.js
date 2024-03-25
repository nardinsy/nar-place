import classes from "./DropdownCard.module.css";

const Dropdown = ({ items }) => {
  const rows = items.map((item) => {
    return (
      <li
        key={item.title}
        className={classes["dropdown-item"]}
        onClick={item.handler}
      >
        <div className={classes["option-title"]}>{item.title}</div>
      </li>
    );
  });

  return (
    <div className={classes["dropdown-container"]}>
      <ul className={classes["dropdown-items"]}>{rows}</ul>
    </div>
  );
};

export default Dropdown;
