import React from "react";
import { Route } from "react-router-dom";
import MainHeader from "./Header/MainHeader";
import AuthForms from "./Authentication/AuthForm";
import Authorized from "./Profile/Authorized";
import AnyUserPlaces from "./user/pages/AnyUserPlaces";
import PlacePage from "./places/pages/PlacePage";
import Users from "./user/pages/Users";
import useAuthContext from "./Hooks/Auth";

const App: React.FC = (porps) => {
  // const authContext = useContext(AuthContext);
  // if (!authContext)
  //   throw new Error(
  //     "Auth context is not provided, Please wrap component with AuthContextProvider"
  //   );
  const authContext = useAuthContext();

  return (
    <>
      <MainHeader />

      <Route path="/" exact>
        <Users />
      </Route>

      <Route path="/login">
        <AuthForms title={"Login"} />
      </Route>

      <Route path="/signup">
        <AuthForms title={"Signup"} />
      </Route>

      <Route path="/places/:userId" exact>
        <AnyUserPlaces />
      </Route>

      <Route path="/place/:placeId" exact>
        <PlacePage />
      </Route>

      {authContext.isLoggedin && <Authorized token={authContext.token!} />}
    </>
  );
};

export default App;
