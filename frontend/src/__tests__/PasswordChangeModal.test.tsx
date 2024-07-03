import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import PasswordChangeModal from "../Profile/components/PasswordChangeModal";
import ReactDOM from "react-dom";
import { ReactNode, ReactPortal } from "react";

const renderComponent = () => {
  const props = {
    closeChangePasswordModal: jest.fn(),
    onPasswordChange: jest.fn((userInfo) => Promise.resolve()),
  };

  render(
    <PasswordChangeModal
      closeChangePasswordModal={props.closeChangePasswordModal}
      onPasswordChange={props.onPasswordChange}
    />
  );

  return props;
};

describe("changs password", () => {
  const oldCreatePortal = ReactDOM.createPortal;
  beforeAll(() => {
    ReactDOM.createPortal = (node: ReactNode): ReactPortal =>
      node as ReactPortal;
  });

  afterAll(() => {
    ReactDOM.createPortal = oldCreatePortal;
  });

  test("on click change button", async () => {
    const { onPasswordChange, closeChangePasswordModal } = renderComponent();
    const password = "1234567";
    const passwordInput = screen.getByLabelText("Password") as HTMLInputElement;
    passwordInput.value = password;
    fireEvent.change(passwordInput, { target: { value: password } });

    const passwordConfirmInput = screen.getByLabelText(
      "Confirm Password"
    ) as HTMLInputElement;
    // passwordConfirmInput.value = password;
    fireEvent.change(passwordConfirmInput, { target: { value: password } });

    const submitButton = screen.getByRole("button", {
      name: /Chnage/i,
    });
    fireEvent.click(submitButton);
    // console.log(passwordInput.value);
    await waitFor(() => expect(onPasswordChange).toHaveBeenCalledTimes(1));
    // await waitFor(() => {

    // expect(onPasswordChange).toHaveBeenCalledWith(password)
    // });
    // expect(onPasswordChange).toHaveBeenCalled();
    // expect(onPasswordChange).toHaveBeenCalledWith(password);
  });
});
