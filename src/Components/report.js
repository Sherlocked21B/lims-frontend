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
		background: "transparent",
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
	{ title: "Test Name", field: "testName", editable: "never" },
	{ title: "Parameter", field: "parameters", editable: "never" },
	{ title: "Unit", field: "units", editable: "never" },
	{ title: "Value", field: "value" },
	{ title: "Reference Range", field: "referenceRange", editable: "never" },
	{ title: "Status", field: "status", editable: "never" },
];

const Report = (props) => {
	const classes = useStyles();
	const info = props.location.state;
	// console.log(props.location);
	const [customerDetails, setCustomerDetails] = React.useState({});
	const [sampleDetails, setSampleDetails] = React.useState({
		name: info ? info.customerName : "",
		sample: info ? info.sampleNo : "",
		sampleId: info ? info._id : "",
		tests: info ? info.tests : [],
		animal: info ? info.animal : "",
	});
	// const [refData, setRefData] = React.useState([]);
	const [date, setDate] = React.useState(new Date());
	const [sampleType, setSampleType] = React.useState([]);
	const [report, setReport] = React.useState([]);
	const [methods, setMethods] = React.useState([]);
	const [Remarks, setRemarks] = React.useState("Remarks::");
	const [testCompleted, setTestCompleted] = React.useState(
		info ? info.status : false,
	);
	const [reportId, setReportId] = React.useState("");
	const [message, setMessage] = React.useState("");
	const [status, setStatus] = React.useState("");
	const [open, setOpen] = React.useState(false);

	useEffect(() => {
		// handleReferenceRange();
		fetchCustomerDetails();
		fetchMethods();
		fetchReport();
	}, []);

	// useEffect(() => {
	// 	console.log(report);
	// }, [report]);

	//function to check the whether the value is higher or lower than reference range
	const checkStatus = (value, referenceRange) => {
		const valueNum = parseInt(value);
		const numbers = referenceRange.match(/[0-9]*\.?[0-9]+/g);
		if (isNaN(valueNum)) {
			return "-";
		}
		if (!numbers) {
			return "-";
		}
		switch (numbers.length) {
			case 1:
				let num = parseFloat(numbers[0]);
				return value > num ? "High" : value < num ? "Low" : "Normal";
				break;
			case 2:
				let num1 = parseFloat(numbers[0]);
				let num2 = parseFloat(numbers[1]);
				return value > num2
					? "High"
					: value >= num1 && value <= num2
					? "Normal"
					: "Low";

			default:
				return "-";
		}
	};

	const ReportFields = (tests, refData) => {
		console.log(tests);
		console.log(refData);
		const result = [];
		let refTestIndex;
		tests.map((item) => {
			if (!item.units) {
				result.push({
					testName: item.testName,
				});
			}

			// console.log(refData);

			if (!item.units) {
				refTestIndex =
					refData.length > 0
						? refData.findIndex((x) => x.testName === item.testName)
						: -1;
				return;
			}

			// item.parameter.map(({ parameters, units, ...rest }, index) => {

			const refIndex =
				refTestIndex >= 0
					? refData[refTestIndex].refTable.findIndex(
							(x) => x.parameters === item.parameters,
					  )
					: -1;

			const reference =
				refTestIndex >= 0 && refIndex >= 0
					? refData[refTestIndex].refTable[refIndex].referenceRange
					: "-";

			const status = checkStatus(item.value, reference);

			result.push({
				...item,
				referenceRange: reference,
				status: status,
				// parameters,
				// units,
				// value: "Set Value",
				// status: "-",
			});
		});
		// });
		console.log(result);
		setReport(result);
	};

	const ReportFirstFields = (tests, refData) => {
		const result = [];
		let refTestIndex;
		tests.map((item) => {
			result.push({
				testName: item.testName,
			});
			refTestIndex =
				refData.length > 0
					? refData.findIndex((x) => x.testName === item.testName)
					: -1;

			item.parameter.map((param) => {
				const refIndex =
					refTestIndex >= 0
						? refData[refTestIndex].refTable.findIndex(
								(x) => x.parameters === param.parameters,
						  )
						: -1;
				result.push({
					referenceRange:
						refTestIndex >= 0 && refIndex >= 0
							? refData[refTestIndex].refTable[refIndex].referenceRange
							: "-",
					parameters: param.parameters,
					units: param.units,
					value: "set value",
					status: "-",
				});
			});
		});
		setReport(result);
	};

	const fetchMethods = async () => {
		try {
			const methodsInfo = await axios.get(`/method/`);
			setMethods(methodsInfo.data);
		} catch (e) {
			setMessage(e.response);
			setStatus("error");
			handleClick();
		}
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
			const { data } = await axios.get(
				`/testRequest/find/${sampleDetails.sampleId}`,
			);
			handleSampleType(data[0].sampleType);
			return data[0].toTest;
			//ReportFields(data[0].toTest);
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
			const referenceData = await handleReferenceRange();
			if (result.data.length > 0) {
				setRemarks(result.data[0].Remarks);
				setReportId(result.data[0]._id);
				// setReport([...result.data[0].result]);
				ReportFields(result.data[0].result, referenceData);
			} else {
				const testData = await fetchTestDetails();
				ReportFirstFields(testData, referenceData);
			}
		} catch (e) {
			console.log(e);
		}
	};

	const handleReferenceRange = async () => {
		try {
			const referenceTable = await axios.get(
				`/reference/find/${sampleDetails.animal}`,
			);
			// setRefData([...referenceTable.data]);
			// console.log(referenceTable.data);
			return referenceTable.data;
		} catch (e) {
			console.log(e);
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
				setMessage("Report Updated successfully");
				setStatus("success");
				handleClick();
			} catch (e) {
				setMessage(e.response);
				setStatus("error");
				handleClick();
			}
		} else {
			try {
				const { data } = await axios.post("/result/add", {
					result: report,
					sampleId: sampleDetails.sampleId,
					Remarks,
				});
				setReportId(data._id);
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

	const handleSampleType = (sampletypes) => {
		let sample = [];
		sampletypes.map((item) => {
			item.checked && sample.push(item.name);
		});
		setSampleType(sample);
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
			if (event.target.checked) {
				setMessage("Test Completed Sucessfully");
			} else {
				setMessage("Test Marked Uncompleted");
			}

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
						Pet Name : {info.petName}
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
						Sample Type: {sampleType.toString()}
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
					title="Report"
					columns={columns}
					icons={tableIcons}
					data={report}
					options={{
						paging: false,
						search: false,
						headerStyle: { background: "transparent" },
					}}
					components={{
						Container: (props) => <div {...props} />,

						// Cell: (props) => <div {...props} />,
					}}
					cellEditable={{
						onCellEditApproved: (newValue, oldValue, rowData, columnDef) => {
							return new Promise(async (resolve, reject) => {
								try {
									const copy = [...report];
									const refRange = copy[rowData.tableData.id]["referenceRange"];
									const status = checkStatus(newValue, refRange);
									copy[rowData.tableData.id][columnDef.field] = newValue;
									copy[rowData.tableData.id]["status"] = status;
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
