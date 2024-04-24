import { FC } from "react";
import { HasChildren } from "../helpers/props";
import classes from "./Button.module.css";

type ButtonProps = HasChildren & {
  className?: string;
  action: "submit" | "cancel" | "delete" | "edit";
  onClick: Function;
  type: "button" | "submit" | "reset" | undefined;
};

const Button: FC<ButtonProps> = ({
  className,
  action,
  onClick,
  type,
  children,
}) => {
  const classNames = `${classes.button} ${className} ${
    classes[`button-${action}`]
  }`;

  const clickButtonHandler = (event: React.MouseEvent<HTMLElement>) => {
    onClick(event);
  };

  return (
    <button
      type={type}
      className={classNames}
      onClick={clickButtonHandler}
      // onSubmit={clickButtonHandler}
    >
      {children}
    </button>
  );
};

export default Button;
