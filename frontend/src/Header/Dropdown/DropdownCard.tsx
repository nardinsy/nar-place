import classes from "./DropdownCard.module.css";

export type DropDownItem = { title: string; handler: (event: any) => any };

const Dropdown = ({
  items,
  propClassName,
}: {
  items: DropDownItem[];
  propClassName?: string;
}) => {
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

  const finalClassName = propClassName
    ? propClassName
    : classes["dropdown-container"];

  return (
    <div className={finalClassName} data-testid="drop">
      <ul className={classes["dropdown-items"]}>{rows}</ul>
    </div>
  );
};

export default Dropdown;
