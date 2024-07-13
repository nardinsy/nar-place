import { FC } from "react";
import { HasChildren } from "../helpers/props";
import classes from "./Button.module.css";

type ButtonProps = HasChildren & {
  id?: string;
  className?: string;
  action: "submit" | "cancel" | "delete" | "edit";
  onClick: Function;
  isDisabled?: boolean;
  type?: "button" | "submit" | "reset" | undefined;
  tabIndex?: number;
};

const Button: FC<ButtonProps> = ({
  id,
  className,
  action,
  onClick,
  isDisabled = false,
  type,
  tabIndex = 0,
  children,
}) => {
  const classNames = isDisabled
    ? `  ${classes["disabled-button"]} ${className} `
    : `${classes.button} ${className} ${classes[`button-${action}`]}`;

  const clickButtonHandler = (event: React.MouseEvent<HTMLElement>) => {
    onClick(event);
  };

  return (
    <button
      tabIndex={tabIndex}
      data-testid={id}
      type={type}
      className={classNames}
      onClick={clickButtonHandler}
      disabled={isDisabled}
      // onSubmit={clickButtonHandler}
    >
      {children}
    </button>
  );
};

export default Button;
