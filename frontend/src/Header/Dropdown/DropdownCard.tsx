import classes from "./DropdownCard.module.css";

type item = { title: string; handler: (event: any) => any };
const Dropdown = ({ items }: { items: item[] }) => {
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
    <div className={classes["dropdown-container"]} data-testid="drop">
      <ul className={classes["dropdown-items"]}>{rows}</ul>
    </div>
  );
};

export default Dropdown;
