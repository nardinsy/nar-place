import classes from "./Button.module.css";

const Button = ({ className, action, onClick, type, children }) => {
  const classNames = `${classes.button} ${className} ${
    classes[`button-${action}`]
  }`;

  const clickButtonHandler = (event) => {
    onClick(event);
  };

  return (
    <>
      <button
        type={type}
        className={classNames}
        onClick={clickButtonHandler}
        onSubmit={clickButtonHandler}
      >
        {children}
      </button>
    </>
  );
};

export default Button;
