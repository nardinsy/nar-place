import React from "react";
export type SubmitEvent =
  | React.MouseEvent<HTMLElement>
  | React.KeyboardEvent<HTMLHtmlElement>;

export type FormEvent = React.FormEvent<HTMLFormElement>;
export type MouseEvent = React.MouseEvent<HTMLButtonElement>;
export type ChangeEvent = React.ChangeEvent<HTMLInputElement>;
