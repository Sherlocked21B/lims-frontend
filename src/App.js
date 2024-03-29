import React from "react";
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
import Report from "./Components/report";
import AllTest from "./Components/AllTest";
import EditTest from "./Components/EditTest";
import AddEquipment from "./Components/AddEquipment";
import AllEquipment from "./Components/AllEquipment";
import HandleEquipment from "./Components/HandleEquipment";
import Requisition from "./Components/requisition";
import SeeRequisition from "./Components/SeeRequisiton";
import AddAnimal from "./Components/AddAnimal";
import Method from "./Components/Method";
import Statement from "./Components/Statement";
import PrintStatement from "./Components/PrintStatement";

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
import AddReference from "./Components/AddReference";
import ReagentUsage from "./Components/ReagentUsage";
import TestRequestForm from "./Components/testRequestForm";
import Bill from "./Components/Bill";

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
					<ProtectedStaffAccountRoute
						path="/addReference"
						component={AddReference}
					/>
					<ProtectedStaffAccountRoute
						path="/reagentUsage"
						component={ReagentUsage}
					/>
					<ProtectedInventoryMRoute path="/addReagent" component={AddReagent} />
					<ProtectedInventoryMRoute
						path="/addEquipment"
						component={AddEquipment}
					/>
					<ProtectedInventoryMRoute
						path="/handleEquipment"
						component={HandleEquipment}
					/>
					<ProtectedInventoryMRoute
						path="/requisition"
						component={Requisition}
					/>
					<ProtectedStaffRoute path="/addTest" component={AddTest} />
					<ProtectedInventoryMRoute
						path="/importReagent"
						component={ImportReagent}
					/>
					<ProtectedStaffAccountRoute path="/allSample" component={AllSample} />
					<ProtectedInventoryStaff path="/allReagent" component={AllReagent} />
					<ProtectedInventoryStaff
						path="/allEquipment"
						component={AllEquipment}
					/>
					<ProtectedStaffRoute path="/allTest" component={AllTest} />
					<ProtectedStaffRoute path="/addAnimal" component={AddAnimal} />
					<ProtectedStaffRoute path="/method" component={Method} />
					<ProtectedStaffRoute path="/addSample" component={AddSample} />
					<ProtectedStaffRoute
						path="/testRequestForm"
						component={TestRequestForm}
					/>
					<ProtectedAdminRoute path="/register" exact component={Register} />
					<ProtectedAdminRoute
						path="/seeRequisition"
						exact
						component={SeeRequisition}
					/>
					<ProtectedStaffRoute
						path="/generateReport"
						exact
						component={GenerateReport}
					/>
					<ProtectedStaffAccountRoute
						path="/generateBill"
						exact
						component={Bill}
					/>
					<ProtectedStaffRoute path="/report" exact component={Report} />
					<ProtectedStaffRoute path="/editTest" exact component={EditTest} />
					<ProtectedStaffAccountRoute path="/statement" component={Statement} />
					<ProtectedStaffAccountRoute
						path="/printStatement"
						component={PrintStatement}
					/>
				</Switch>
			</div>
		</Router>
	) : (
		<Login isLogin={isLogin} setLogin={setLogin} />
	);
}

export default App;
