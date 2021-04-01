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

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import Login from "./Components/login";
import Register from "./Components/register";
import { setUser } from "./action/setUser";
import ProtectedStaffRoute from "./Components/ProtectedStaffRoute";
import ProtectedInventoryMRoute from "./Components/ProtectedInventoryMRoute";
import ProtectedStaffAccountRoute from "./Components/ProtectedStaffAccount";
import ProtectedInventoryStaff from "./Components/ProtectedInventoryStaff";
import ProtectedAdminRoute from "./Components/ProtectedAdminRoute";

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
          <ProtectedStaffAccountRoute
            path="/"
            exact
            component={PendingSample}
          />
          <ProtectedStaffAccountRoute
            path="/addCustomer"
            component={AddCustomer}
          />
          <ProtectedInventoryMRoute path="/addReagent" component={AddReagent} />
          <ProtectedStaffRoute path="/addTest" component={AddTest} />
          <ProtectedInventoryMRoute
            path="/importReagent"
            component={ImportReagent}
          />
          <ProtectedStaffAccountRoute path="/allSample" component={AllSample} />
          <ProtectedInventoryStaff path="/allReagent" component={AllReagent} />
          <ProtectedStaffRoute path="/allTest" component={AllTest} />
          <ProtectedStaffRoute path="/addSample" component={AddSample} />
          <ProtectedAdminRoute path="/register" exact component={Register} />
          <ProtectedStaffRoute
            path="/generateReport"
            exact
            component={GenerateReport}
          />
          <ProtectedStaffRoute path="/editTest" exact component={EditTest} />
        </Switch>
      </div>
    </Router>
  ) : (
    <Login isLogin={isLogin} setLogin={setLogin} />
  );
}

export default App;
