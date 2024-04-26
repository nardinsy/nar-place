import { useContext } from "react";
import AuthContext from "../store/auth-context";

const useAuthContext = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error(
      "useAuthContext has to be used within <AuthContex.Provider>"
    );
  }

  return authContext;
};

export default useAuthContext;
