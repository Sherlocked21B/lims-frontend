import AppBar from "./Components/appBar";
import AddCustomer from "./Components/AddCutomer";
import AddReagent from "./Components/AddReagent";
import AddTest from "./Components/AddTest";
import ImportReagent from "./Components/ImportReagent";
import PendingSample from "./Components/PendingSample";
import AllSample from "./Components/AllSample";
import AllReagent from "./Components/AllReagent";
import AddSample from "./Components/AddSample";
import GenerateReport from "./Components/GenerateReport";
import AllTest from "./Components/AllTest";
import EditTest from "./Components/EditTest";
import ProtectedRoute from "./Components/ProtectedRoute";

import {
  BrowserRouter as Router,
  Route,
  Switch,
} from "react-router-dom";
import jwt_decode from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import Login from "./Components/login";
import Register from "./Components/register";
import { setUser } from "./action/setUser";

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
          <ProtectedRoute path="/allReagent" component={AllReagent} />
          <Route path="/allTest" component={AllTest} />
          <Route path="/addSample" component={AddSample} />
          <Route path="/register" exact component={Register} />
          <Route path="/login" exact component={Login} />
          <Route path="/generateReport" exact component={GenerateReport} />
          <Route path="/editTest" exact component={EditTest} />
        </Switch>
      </div>
    </Router>
  ) : (
    <Login isLogin={isLogin} setLogin={setLogin} />
  );
}

export default App;
