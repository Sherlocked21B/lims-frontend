import React, { forwardRef } from "react";
import "./myStyle.css";
import {
	makeStyles,
	Select,
	InputLabel,
	Button,
	FormControl,
	TextField,
	MenuItem,
} from "@material-ui/core";
import { Redirect } from "react-router-dom";
import { addCustomerValidation } from "../validation/validator";
import axios from "../api";
import SnackBar from "./SnackBar";
import AddBox from "@material-ui/icons/AddBox";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import Check from "@material-ui/icons/Check";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Clear from "@material-ui/icons/Clear";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import Edit from "@material-ui/icons/Edit";
import FilterList from "@material-ui/icons/FilterList";
import FirstPage from "@material-ui/icons/FirstPage";
import LastPage from "@material-ui/icons/LastPage";
import Remove from "@material-ui/icons/Remove";
import SaveAlt from "@material-ui/icons/SaveAlt";
import Search from "@material-ui/icons/Search";
import ViewColumn from "@material-ui/icons/ViewColumn";
import MaterialTable, { MTableHeader } from "material-table";

const tableIcons = {
	Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
	Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
	Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
	Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
	DetailPanel: forwardRef((props, ref) => (
		<ChevronRight {...props} ref={ref} />
	)),
	Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
	Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
	Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
	FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
	LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
	NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
	PreviousPage: forwardRef((props, ref) => (
		<ChevronLeft {...props} ref={ref} />
	)),
	ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
	Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
	SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
	ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
	ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
};

const useStyles = makeStyles((theme) => ({
	root: {
		display: "flex",
		marginBottom: theme.spacing(7),
	},
	position: {
		marginLeft: theme.spacing(8),
		flex: "1 auto",
	},
	buttons: {
		marginTop: theme.spacing(6),
		marginLeft: theme.spacing(120),
	},
	button: {
		margin: "5px 10px 5px 5px",
	},
	label: {
		marginLeft: theme.spacing(9),
	},
}));

const columns = [
	{ title: "First Name", field: "firstName" },
	{
		title: "Last Name",
		field: "lastName",
	},
	{ title: "Email", field: "email" },
	{ title: "Address", field: "address" },
	{
		title: "Gender",
		field: "gender",
		lookup: { male: "male", female: "female", others: "others" },
	},
];
const AddCutomer = (props) => {
	const classes = useStyles();
	const [addCustomer, setAddCustomer] = React.useState({
		firstName: "",
		lastName: "",
		email: "",
		address: "",
		gender: "",
		contactNumber: "",
	});
	const [reset, setReset] = React.useState(Object.assign({}, addCustomer));
	const [open, setOpen] = React.useState(false);
	const [message, setMessage] = React.useState("");
	const [status, setStatus] = React.useState("");
	const [query, setQuery] = React.useState("");
	const [loading, setLoading] = React.useState(false);
	const [rows, setRows] = React.useState([]);

	const runSearch = async () => {
		try {
			setLoading(true);
			const { data } = await axios.get(`/customer/search/${query}`);
			setRows([...data]);
			setLoading(false);
		} catch (e) {
			console.log(e);
		}
	};

	React.useEffect(() => {
		if (query) {
			runSearch();
		} else {
			setRows([]);
		}
	}, [query]);

	const handleClick = () => {
		setOpen(true);
	};

	const handleChange = (input) => (event) => {
		setAddCustomer({ ...addCustomer, [input]: event.target.value });
	};

	const handleClose = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}

		setOpen(false);
	};
	const handleReset = () => {
		setAddCustomer({ ...reset });
	};

	const handleSubmit = async () => {
		const { error } = addCustomerValidation(addCustomer);
		if (error) {
			setMessage(error.details[0].message);
			setStatus("error");
			handleClick();
		}
		if (!error) {
			try {
				const res = await axios.post("/customer/add", addCustomer);
				if (query) {
					setRows([res.data.data]);
				} else {
					setRows([{ ...res.data.data }, ...rows]);
				}
				setMessage(res.data.message);
				setStatus("success");
				handleClick();
				handleReset();
				props.history.push("/addSample");
			} catch (e) {
				setMessage(e.response);
				setStatus("error");
				handleClick();
				console.log(e);
			}
		}
	};

	return (
		<div>
			<React.Fragment>
				<div
					style={{
						padding: "1em 2em 2em 2em",
						margin: "8em 2em 2em 2em",
						// opacity: "50%"
					}}
				>
					<h1 align="center">Customer Registration Page</h1>
					<h4>Customer Details</h4>
					<div className={classes.root}>
						<TextField
							name="First Name"
							label="First Name"
							variant="outlined"
							value={addCustomer.firstName}
							style={{ width: 80 }}
							className={classes.position}
							type="string"
							onChange={handleChange("firstName")}
						/>
						<TextField
							label="Last Name"
							variant="outlined"
							value={addCustomer.lastName}
							style={{ width: 80 }}
							className={classes.position}
							type="string"
							onChange={handleChange("lastName")}
						/>
						<TextField
							label="Email"
							variant="outlined"
							value={addCustomer.email}
							style={{ width: 80 }}
							className={classes.position}
							type="email"
							onChange={handleChange("email")}
						/>
					</div>
					<div className={classes.root}>
						<FormControl className={classes.formControl}>
							<InputLabel className={classes.label}>Gender</InputLabel>
							<Select
								labelId="demo-controlled-open-select-label"
								id="demo-controlled-open-select"
								value={addCustomer.gender}
								label="Gender"
								className={classes.position}
								style={{ width: 120 }}
								onChange={handleChange("gender")}
							>
								<MenuItem value="male">Male</MenuItem>
								<MenuItem value="female">Female</MenuItem>
								<MenuItem value="others">Others</MenuItem>
							</Select>
						</FormControl>
						<TextField
							label="Location"
							variant="outlined"
							value={addCustomer.address}
							style={{ width: 80 }}
							className={classes.position}
							type="string"
							onChange={handleChange("address")}
						/>
						<TextField
							label="Contact Number"
							variant="outlined"
							value={addCustomer.contactNumber}
							style={{ width: 80 }}
							className={classes.position}
							type="number"
							onChange={handleChange("contactNumber")}
						/>
					</div>
					<div>
						<div className={classes.buttons}>
							<Button
								variant="contained"
								style={{ width: "200px", paddingLeft: "20px" }}
								color="primary"
								className={classes.button}
								onClick={handleSubmit}
							>
								Add
							</Button>
							<Button
								variant="contained"
								style={{ width: "200px", paddingRight: "20px" }}
								color="secondary"
								className={classes.button}
								onClick={handleReset}
							>
								Reset
							</Button>
						</div>
					</div>
					<div style={Styles.table}>
						<MaterialTable
							icons={tableIcons}
							title="Customers"
							data={rows}
							columns={columns}
							onSearchChange={setQuery}
							options={{
								debounceInterval: 500,
								paging: false,
								headerStyle: { background: "transparent" },
								// searchAutoFocus: true
							}}
							components={{
								Container: (props) => <div {...props} />,

								// Cell: (props) => <div {...props} />,
							}}
							editable={{
								onRowUpdate: (newData, oldData) =>
									new Promise(async (resolve, reject) => {
										try {
											let { _id, ...req } = newData;
											const res = await axios.put(
												`/customer/update/${oldData._id}`,
												req,
											);
											const dataUpdate = [...rows];
											const index = oldData.tableData.id;
											dataUpdate[index] = res.data;
											setRows([...dataUpdate]);
											resolve();
										} catch (e) {
											console.log(e);
											reject();
										}
									}),
								onRowDelete: (oldData) =>
									new Promise(async (resolve, reject) => {
										try {
											const res = await axios.delete(
												`/customer/delete/${oldData._id}`,
											);
											const dataDelete = [...rows];
											const index = oldData.tableData.id;
											dataDelete.splice(index, 1);
											setRows([...dataDelete]);
											resolve();
										} catch (e) {
											console.log(e);
											reject();
										}
									}),
							}}
							localization={{
								toolbar: {
									searchPlaceholder: "Search Customer",
								},
							}}
							isLoading={loading}
						/>
					</div>
				</div>
			</React.Fragment>
			<SnackBar
				messege={message}
				open={open}
				handleClose={handleClose}
				status={status}
			/>
		</div>
	);
};
const Styles = {
	table: {
		marginTop: "5%",
		marginButton: "20%",
		marginLeft: "10%",
		marginRight: "10%",
	},
};

export default AddCutomer;
