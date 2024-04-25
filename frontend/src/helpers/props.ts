import { ReactElement } from "react";

export type HasChildren = {
  children: ReactElement | string | JSX.Element[] | ReactElement[];
};
export type WithChildren<T> = T & HasChildren;

// type x = WithChildren<{}>;

// const x: { name: string } = { name: "Nardin" };
