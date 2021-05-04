import React, { useState, useRef, useEffect } from "react";
import "./myStyle.css";
import {
	makeStyles,
	Button,
	Typography,
	TextareaAutosize,
	Checkbox,
	FormControlLabel,
} from "@material-ui/core";
import axios from "../api";
import SnackBar from "./SnackBar";
import MaterialTable from "material-table";
import { forwardRef } from "react";
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

const useStyles = makeStyles((theme) => ({
	textArea: {
		marginTop: theme.spacing(5),
		width: "100%",
	},
	buttons: {
		marginTop: theme.spacing(6),
		marginLeft: theme.spacing(120),
	},
	checkbox: {
		marginLeft: "85%",
	},
	button: {
		margin: "5px 10px 5px 5px",
	},
	label: {
		marginLeft: theme.spacing(9),
	},
	saveButton: {
		marginLeft: "3%",
		marginTop: "5%",
		width: "200px",
		paddingLeft: "20px",
		height: "3.3em",
		background: "#28B463",
		color: "white",
	},
	backButton: {
		marginLeft: "3%",
		marginTop: "5%",
		width: "200px",
		paddingLeft: "20px",
		height: "3.3em",
	},
	printButton: {
		marginLeft: "50em",
		marginTop: "5%",
		width: "200px",
		paddingLeft: "20px",
		height: "3.3em",
	},
	Typo: {
		marginRight: "5",
		marginBottom: "5",
	},
	paper: {
		padding: "1em 2em 2em 2em",
		margin: "8em 2em 2em 2em",
		height: "95em",
	},
	parent: {
		position: "relative",
		width: "100%",
		height: "100px",
	},
	center: {
		position: "absolute",
		top: 0,
		width: "200px",
		right: "40%",
	},
	last: {
		position: "absolute",
		top: 0,
		width: "200px",
		right: theme.spacing(0),
	},
}));

const columns = [
	{ title: "Parameter", field: "parameters", editable: "never" },
	{ title: "Unit", field: "units", editable: "never" },
	{ title: "Reference Range", field: "referenceRange", editable: "never" },
	{ title: "Value", field: "value" },
	{ title: "Remarks", field: "remarks" },
];

const Report = (props) => {
	const classes = useStyles();
	const info = props.location.state;
	console.log(props.location);
	const [customerDetails, setCustomerDetails] = React.useState({});
	const [sampleDetails, setSampleDetails] = React.useState({
		name: info ? info.customerName : "",
		test: info ? info.testName : "",
		sample: info ? info.sampleNo : "",
		sampleId: info ? info._id : "",
	});
	const [date, setDate] = React.useState(new Date());
	const [report, setReport] = React.useState([]);
	const [Remarks, setRemarks] = React.useState("Remarks::");
	const [testCompleted, setTestCompleted] = React.useState(
		info ? info.status : false,
	);
	const [reportId, setReportId] = React.useState("");
	const [message, setMessage] = React.useState("");
	const [status, setStatus] = React.useState("");
	const [open, setOpen] = React.useState(false);

	useEffect(() => {
		fetchCustomerDetails();
		fetchTestDetails();
		fetchReport();
	}, []);

	const ReportFields = (parameters) => {
		setReport(
			parameters.map((item) => ({
				...item,
				value: "Set Value",
				remarks: "Set Remarks",
			})),
		);
	};

	const fetchCustomerDetails = async () => {
		try {
			const cusInfo = await axios.get(`/customer/${info.customerId}`);
			setCustomerDetails(cusInfo.data);
		} catch (e) {
			setMessage(e.response);
			setStatus("error");
			handleClick();
		}
	};

	const fetchTestDetails = async () => {
		try {
			const testInfo = await axios.get(`/test/search/${sampleDetails.test}`);
			ReportFields([...testInfo.data[0].parameter]);
			// setParameters([...testInfo.data[0].parameter]);
		} catch (e) {
			setMessage(e.response);
			setStatus("error");
			handleClick();
		}
	};

	const fetchReport = async () => {
		try {
			const result = await axios.get(
				`/result/sample/${sampleDetails.sampleId}`,
			);
			console.log(result);
			setReport([...result.data[0].result]);
			setRemarks(result.data[0].Remarks);
			setReportId(result.data[0]._id);
		} catch (e) {
			setMessage(e.response);
			setStatus("error");
			handleClick();
		}
	};

	const handleSave = async () => {
		if (reportId) {
			try {
				const saveReport = await axios.put(`/result/update/${reportId}`, {
					result: report,
					sampleId: sampleDetails.sampleId,
					Remarks,
				});
				setMessage("Report Saved successfully");
				setStatus("success");
				handleClick();
			} catch (e) {
				setMessage(e.response);
				setStatus("error");
				handleClick();
			}
		} else {
			try {
				const saveReport = await axios.post("/result/add", {
					result: report,
					sampleId: sampleDetails.sampleId,
					Remarks,
				});
				setMessage("Report Saved successfully");
				setStatus("success");
				handleClick();
			} catch (e) {
				setMessage(e.response);
				setStatus("error");
				handleClick();
			}
		}
	};

	const handleTestStatus = async (event) => {
		setTestCompleted(event.target.checked);
		try {
			const status = await axios.put(
				`/sample/update/${sampleDetails.sampleId}`,
				{
					status: event.target.checked,
				},
			);
			setMessage("Test Completed Sucessfully");
			setStatus("success");
			handleClick();
		} catch (e) {
			setMessage(e.response);
			setStatus("error");
			handleClick();
		}
	};

	const handleBack = () => {
		props.history.push({ pathname: "/generateReport", state: info });
	};
	const handleClick = () => {
		setOpen(true);
	};

	const handleClose = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}

		setOpen(false);
	};

	return (
		<div className={classes.paper}>
			<style>{`@media print {.no-print{display: none;}}`}</style>
			<div className={classes.parent}>
				<div>
					<Typography className={classes.Typo}>
						Customer Name : {sampleDetails.name}
					</Typography>
					<Typography className={classes.Typo}>
						Age: {customerDetails.age}
					</Typography>
				</div>
				<div className={classes.center}>
					<Typography className={classes.Typo}>
						Location: {customerDetails.address}
					</Typography>
					<Typography className={classes.Typo}>
						Sample No: {sampleDetails.sample}
					</Typography>
				</div>
				<div className={classes.last}>
					<Typography className={classes.Typo}>
						Date: {date.toLocaleDateString()}
					</Typography>
					<Typography className={classes.Typo}>
						Test Name: {sampleDetails.test}
					</Typography>
				</div>
			</div>
			<div className={"no-print"}>
				<FormControlLabel
					className={classes.checkbox}
					control={
						<Checkbox
							checked={testCompleted}
							onChange={handleTestStatus}
							name="testCompleted"
							color="primary"
						/>
					}
					label="Test Completed"
				/>
			</div>
			<div>
				<MaterialTable
					showEmptyDataSourceMessage={false}
					title="Report Card"
					columns={columns}
					icons={tableIcons}
					data={report}
					options={{
						paging: false,
						search: false,
					}}
					cellEditable={{
						onCellEditApproved: (newValue, oldValue, rowData, columnDef) => {
							return new Promise(async (resolve, reject) => {
								try {
									const copy = [...report];
									copy[rowData.tableData.id][columnDef.field] = newValue;
									setReport([...copy]);
									resolve();
								} catch (e) {
									console.log(e);
								}
							});
						},
					}}
				/>
			</div>
			<div>
				<TextareaAutosize
					className={classes.textArea}
					aria-label="minimum height"
					rowsMin={3}
					placeholder="Remarks::"
					value={Remarks}
					onChange={(event) => setRemarks(event.target.value)}
				/>
			</div>
			<div className="no-print">
				<Button
					variant="contained"
					color="primary"
					className={classes.backButton}
					onClick={handleBack}
				>
					Back
				</Button>

				<Button
					variant="contained"
					color="primary"
					className={classes.saveButton}
					onClick={handleSave}
				>
					Save
				</Button>
				{testCompleted ? (
					<Button
						variant="contained"
						color="primary"
						className={classes.printButton}
						onClick={() => {
							window.print();
						}}
					>
						Print
					</Button>
				) : null}
			</div>
			<div>
				<SnackBar
					messege={message}
					open={open}
					handleClose={handleClose}
					status={status}
				/>
			</div>
		</div>
	);
};

export default Report;
