import { useContext } from "react";
import { Route } from "react-router-dom";

import MainHeader from "./Header/MainHeader";
import Users from "./user/pages/Users";
import AnyUserPlaces from "./user/pages/AnyUserPlaces";
import Authorized from "./Profile/Authorized";
import AuthForms from "./Authentication/AuthForms";
import PlacePage from "./places/pages/PlacePage";

import AuthContext from "./store/auth-context";

function App(props) {
  const authContext = useContext(AuthContext);

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

      {authContext.isLoggedin && <Authorized token={authContext.token} />}
    </>
  );
}

export default App;
