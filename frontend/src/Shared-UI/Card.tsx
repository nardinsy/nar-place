import classes from "./Card.module.css";

type CardProps = {
  className: string | undefined;
  style: React.CSSProperties | undefined;
  children?: React.ReactNode;
};

const Card = ({ className, style, children }: CardProps) => {
  return (
    <div className={`${classes.card} ${className}`} style={style}>
      {children}
    </div>
  );
};

export default Card;
