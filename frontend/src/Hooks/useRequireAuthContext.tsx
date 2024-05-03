import { useContext } from "react";
import AuthContext from "../contexts/auth-context";

const useRequireAuthContext = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error(
      "useAuthContext has to be used within <AuthContex.Provider>"
    );
  }

  return authContext;
};

export default useRequireAuthContext;
