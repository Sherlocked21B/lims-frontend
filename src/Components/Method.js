import React, { useState, forwardRef } from "react";
import MaterialTable, { MTableToolbar } from "material-table";
import "./myStyle.css";
import { makeStyles, Button, TextField } from "@material-ui/core";
import SnackBar from "./SnackBar";
import axios from "../api";
import { methodValidator } from "../validation/validator";
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

const columns = [{ title: "Method", field: "methodName", align: "center" }];

const useStyles = makeStyles((theme) => ({
	body: {
		padding: "1em 2em 2em 2em",
		// margin: "4em 2em 2em 2em",
		marginTop: "7%",
		marginRight: "2em",
		marginLeft: "2em",
	},
	root: {
		display: "flex",
		marginTop: "1em",
		marginBottom: "2em",
		width: "70%",
	},
	root1: {
		display: "flex",
		marginTop: "1em",
		marginBottom: "2em",
		width: "50%",
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
		marginLeft: theme.spacing(6),
		width: "200px",
		paddingLeft: "20px",
		height: "3.3em",
	},
	table: {
		marginTop: "5%",
		marginButton: "20%",
		marginLeft: "10%",
		marginRight: "10%",
	},
	saveButton: {
		marginLeft: "90%",
		marginTop: "5%",
		width: "200px",
		paddingLeft: "20px",
		height: "3.3em",
		background: "#28B463",
		color: "white",
	},
}));

const useRowStyles = makeStyles({
	root: {
		"& > *": {
			borderBottom: "unset",
		},
	},
});

export default function Method() {
	const classes = useStyles();
	const [methodName, setMethodName] = React.useState("");

	const [value, setValue] = React.useState({});
	const [rows, setRows] = React.useState([]);
	const [message, setMessage] = React.useState();
	const [status, setStatus] = React.useState();
	const [open, setOpen] = React.useState(false);

	const handleClick = () => {
		setOpen(true);
	};

	const handleClose = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}

		setOpen(false);
	};

	React.useEffect(() => {
		handleFirstLoad();
	}, []);

	const handleFirstLoad = async () => {
		try {
			const { data } = await axios.get("/method/");
			setRows([...data]);
		} catch (e) {
			console.log(e);
		}
	};

	const handleChange = (event) => {
		setMethodName(event.target.value);
	};

	const addMethod = async () => {
		const { error } = methodValidator({ method: methodName });
		if (error) {
			setMessage(error.details[0].message);
			setStatus("error");
			handleClick();
		}
		if (!error) {
			try {
				const res = await axios.post("/method/add/", {
					methodName,
				});
				setMethodName("");
				handleFirstLoad();
				setMessage("Category added successfully");
				setStatus("success");
				handleClick();
			} catch (e) {
				setMessage(e);
				setStatus("error");
				handleClick();
			}
		}
	};

	return (
		<div className={classes.body}>
			<React.Fragment>
				<h4>Add Method</h4>
				<div className={classes.root1}>
					<TextField
						label="Method"
						variant="outlined"
						value={methodName}
						style={{ width: 80 }}
						className={classes.position}
						type="string"
						onChange={handleChange}
					/>
					<Button
						variant="contained"
						color="primary"
						className={classes.button}
						onClick={addMethod}
					>
						Add
					</Button>
				</div>
				<div className={classes.table}>
					<MaterialTable
						components={{
							toolbar: (props) => (
								<div style={{ background: "transparent" }}>
									<MTableToolbar {...props} />
								</div>
							),
						}}
						icons={tableIcons}
						title="Methods"
						data={rows}
						columns={columns}
						options={{
							debounceInterval: 500,
							paging: false,
							// searchAutoFocus: true
							headerStyle: { background: "transparent" },
						}}
						components={{
							Container: (props) => <div {...props} />,

							// Cell: (props) => <div {...props} />,
						}}
						editable={{
							onRowDelete: (oldData) =>
								new Promise(async (resolve, reject) => {
									try {
										const res = await axios.delete(
											`/method/delete/${oldData._id}`,
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
					/>
				</div>
				<div>
					<SnackBar
						messege={message}
						open={open}
						handleClose={handleClose}
						status={status}
					/>
				</div>
			</React.Fragment>
		</div>
	);
}
