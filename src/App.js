import AppBar from "./Components/appBar";
import AddCustomer from "./Components/AddCutomer";
import AddReagent from "./Components/AddReagent";
import AddTest from "./Components/AddTest";
import ImportReagent from "./Components/ImportReagent";
import PendingSample from "./Components/PendingSample";
import AllSample from "./Components/AllSample";
import AllReagent from "./Components/AllReagent";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import jwt_decode from "jwt-decode";
import { useDispatch } from "react-redux";
import { useState } from "react";
import Login from "./Components/login";
import Register from "./Components/register";
import { setUser } from "./action/setUser";
import { setToken } from "./api";

function App() {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const [isLogin, setLogin] = useState(token ? true : false);
  if (token) {
    try {
      const decoded = jwt_decode(token);
      dispatch(setUser(decoded.id, decoded.role));
    } catch (e) {
      localStorage.removeItem("token");
      setLogin(false);
    }
  }

  return isLogin ? (
    <Router>
      <div className="App">
        <AppBar />
        <Switch>
          <Route path="/" exact component={PendingSample} />
          <Route path="/addCustomer" component={AddCustomer} />
          <Route path="/addReagent" component={AddReagent} />
          <Route path="/addTest" component={AddTest} />
          <Route path="/importReagent" component={ImportReagent} />
          <Route path="/allSample" component={AllSample} />
          <Route path="/allReagent" component={AllReagent} />
          <Route path="/register" exact component={Register} />
          <Route path="/login" exact component={Login} />
        </Switch>
      </div>
    </Router>
  ) : (
    <Login isLogin={isLogin} setLogin={setLogin} />
  );
}

export default App;
