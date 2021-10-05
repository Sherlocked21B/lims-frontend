import React, { useState, useRef, useEffect } from "react";
import "./myStyle.css";
import { TextField, Paper, makeStyles, Button, Chip } from "@material-ui/core";
import axios from "axios";
import axiosi from "../api";

import Autocomplete from "@material-ui/lab/Autocomplete";
import { importReagentValidator } from "../validation/validator";
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
import Popover from "@material-ui/core/Popover";
import Typography from "@material-ui/core/Typography";

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
		marginBottom: theme.spacing(5),
		marginTop: theme.spacing(6),
		justifyContent: "space-between",
		marginleft: theme.spacing(6),
		width: "70%",
	},
	paper: {
		padding: theme.spacing(1),
	},
	popover: {
		pointerEvents: "none",
	},
	position: {
		// marginLeft: theme.spacing(4),
		flex: "1 1 1 auto",
		width: "80%",
		marginRight: theme.spacing(4),
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
	saveButton: {
		marginLeft: "3%",
		marginTop: "5%",
		width: "200px",
		paddingLeft: "20px",
		height: "3.3em",
		background: "#28B463",
		color: "white",
	},
}));

const columns = [
	{ title: "Test Name", field: "testName" },
	{ title: "Parameter Name", field: "parameter" },
	{ title: "Reagent Name", field: "reagentName" },
	{ title: "Unit", field: "unit" },
	{ title: "Volume", field: "volume" },
];

const GenerateReport = (props) => {
	const classes = useStyles();
	const data = props.location.state;
	const [customerDetails, SetCustomerDetails] = React.useState({
		name: data ? data.customerName : "",
		sample: data ? data.sampleNo : "",
		sampleId: data ? data._id : "",
	});
	let cancelToken = useRef("");
	const [alltest, setAllTest] = React.useState([]);
	const [anchorEl, setAnchorEl] = React.useState(null);
	const [sampleType, setSampleType] = React.useState([]);
	const autoC = useRef(null);
	const [tests, setTests] = useState([]);
	const [volume, setVolume] = useState(0);
	const [unit, setUnit] = useState("Select Reagent");
	const [inputValue, setInputValue] = React.useState("");
	const [open, setOpen] = React.useState(false);
	const [message, setMessage] = React.useState("");
	const [status, setStatus] = React.useState("");
	const [tableData, setTableData] = React.useState([]);
	const [testrequest, setTestRequest] = useState([]);
	const [reagentUsage, setReagentUsage] = useState([]);
	const [reagentVol, setReagentVol] = useState([]);
	const [totalVolume, setTotalVolume] = useState([]);
	const [usedReagents, setUsedReagents] = useState([]);

	const handlePopoverOpen = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handlePopoverClose = () => {
		setAnchorEl(null);
	};

	const opens = Boolean(anchorEl);

	useEffect(() => {
		// fetchUsedReagent();
		fetchTestName();
	}, []);
	useEffect(() => {
		if (reagentVol.length > 0) {
			fetchTotalVolume();
		}
	}, [reagentVol]);

	useEffect(() => {
		if (customerDetails.sampleId) {
			fetchUsedReagent();
		}
	}, []);
	useEffect(() => {
		if (testrequest.length > 0) {
			fetchReagentUsage();
		}
	}, [testrequest]);

	const handleSampleType = (sampletypes) => {
		let sample = [];
		sampletypes.map((item) => {
			item.checked && sample.push(item.name);
		});
		setSampleType(sample);
	};

	const fetchTestName = async () => {
		try {
			const { data } = await axiosi.get(
				`/testRequest/find/${customerDetails.sampleId}`,
			);
			handleSampleType(data[0].sampleType);
			setTestRequest(data);
			setAllTest(data[0].toTest.map((test) => test.testName));
		} catch (e) {
			console.log(e);
		}
	};

	const fetchUsedReagent = async () => {
		try {
			const { data } = await axiosi.get(
				`usedReagent/find/${customerDetails.sampleId}`,
			);
			if (data.length > 0) {
				setUsedReagents(data);
			}
		} catch (e) {
			console.log(e);
		}
	};

	const fetchReagentUsage = async () => {
		try {
			let list = [];
			testrequest.length > 0 &&
				testrequest[0].toTest.map((item) => {
					let testName = item.testName;
					item.parameter.map(({ parameters, ...rest }) => {
						list.push({ testName: testName, parameter: parameters });
					});
				});
			console.log(list);
			const res = await axiosi.post("/reagentUsage/search", { list: list });
			const real = [];
			const reagents = [];
			res.data.map((item) => {
				if (item != null) {
					real.push(
						{ testName: item.testName, parameter: item.parameter },
						...item.reagentTable,
					);
					item.reagentTable.map((item) => {
						const index = reagents.findIndex(
							(element) => item.reagentName == element.reagentName,
						);
						if (index >= 0) {
							reagents[index] = {
								...reagents[index],
								volume: (
									parseFloat(reagents[index].volume) + parseFloat(item.volume)
								).toString(),
							};
						} else {
							reagents.push({
								reagentName: item.reagentName,
								volume: item.volume,
							});
						}
					});
				}
			});
			console.log("reagent is ", reagents);
			setReagentVol(reagents);

			setTableData(real);
		} catch (e) {
			console.log(e);
		}
	};

	const fetchTotalVolume = async () => {
		try {
			const res = await axiosi.post("/reagent/find", { list: reagentVol });
			console.log("fetch Total volume", reagentVol);
			console.log("response", res.data);
			setTotalVolume(res.data);
		} catch (e) {
			console.log(e);
		}
	};

	const compareReagent = () => {
		const reagents = [];
		let flag = false;
		reagentVol.map((item) => {
			const index = totalVolume.findIndex(
				(reagent) => reagent.reagentName == item.reagentName,
			);
			if (index < 0) {
				flag = true;
			} else {
				if (!(totalVolume[index].volume >= item.volume)) {
					reagents.push(item.reagentName);
					flag = true;
				}
			}
		});

		return { flag, reagents };
	};

	const handleReduce = async () => {
		try {
			const { flag, reagents } = compareReagent();
			if (!flag) {
				const resp = await axiosi.post("/reagent/reduce", {
					reagentList: reagentVol,
				});
				const res = await axiosi.post("/usedReagent/add", {
					sampleNo: customerDetails.sample,
					sampleId: customerDetails.sampleId,
					usedReagent: reagentVol,
				});
				setUsedReagents();
				setMessage("Reagent Deducted Sucessfully");
				setStatus("success");
				handleClick();
				handleOpenReport();
			} else {
				console.log("insuf reagent", reagents);
				setMessage("Insufficient reagent(" + reagents.toString() + ")");
				setStatus("error");
				handleClick();
			}
		} catch (e) {
			setMessage(e.response);
			setStatus("error");
			handleClick();
		}
	};

	const handleCompareReduce = async () => {
		try {
			const res = await axiosi.post("/reagent/increase/", {
				reagentList: usedReagents[0].usedReagent,
			});
			const { flag, reagents } = compareReagent();
			if (!flag) {
				const resp = await axiosi.post("/reagent/reduce", {
					reagentList: reagentVol,
				});
				console.log("usedReagent Id", usedReagents[0]._id);
				const resUpdate = await axiosi.put(
					`/usedReagent/update/${usedReagents[0]._id}`,
					{
						usedReagent: reagentVol,
					},
				);
				setMessage("Reagent Deducted Sucessfully");
				setStatus("success");
				handleClick();
				handleOpenReport();
			} else {
				console.log("insuf reagent", reagents);
				setMessage("Insufficient reagent(" + reagents.toString() + ")");
				setStatus("error");
				handleClick();
			}
		} catch (e) {
			setMessage("error occured here");
			setStatus("error");
			handleClick();
		}
	};

	const handleOpenReport = () => {
		props.history.push({ pathname: "/report", state: { ...data, tests } });
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
		<React.Fragment>
			<div
				style={{
					padding: "1em 2em 2em 2em",
					margin: "8em 2em 2em 2em",
					// height: "100em",
				}}
				// elevation={3}
			>
				<div>
					<Chip
						label="Customer Name"
						color="primary"
						style={{ marginRight: 5 }}
					/>
					<Chip
						label={customerDetails.name}
						color="secondary"
						style={{ marginRight: "4em" }}
					/>
					<Chip label="Pet Name" color="primary" style={{ marginRight: 5 }} />
					<Chip
						label={data.petName}
						color="secondary"
						style={{ marginRight: "4em" }}
					/>
					<Chip
						label="Sample Type"
						color="primary"
						style={{ marginRight: 5 }}
					/>
					<Chip
						label={sampleType.toString()}
						color="secondary"
						style={{ marginRight: "4em" }}
					/>
					<Chip label="Sample No" color="primary" style={{ marginRight: 5 }} />
					<Chip
						label={customerDetails.sample}
						color="secondary"
						style={{ marginRight: 5 }}
					/>
				</div>
				<div style={{ marginTop: "2em" }}>
					<Chip label="Test Name" color="primary" style={{ marginRight: 5 }} />
					<Chip
						aria-owns={open ? "mouse-over-popover" : undefined}
						aria-haspopup="true"
						onMouseEnter={handlePopoverOpen}
						onMouseLeave={handlePopoverClose}
						label={alltest.toString()}
						color="secondary"
						style={{ marginRight: "4em" }}
					/>
					<Popover
						id="mouse-over-popover"
						className={classes.popover}
						classes={{
							paper: classes.paper,
						}}
						open={opens}
						anchorEl={anchorEl}
						anchorOrigin={{
							vertical: "bottom",
							horizontal: "left",
						}}
						transformOrigin={{
							vertical: "top",
							horizontal: "left",
						}}
						onClose={handlePopoverClose}
						disableRestoreFocus
					>
						{testrequest.length > 0 &&
							testrequest[0].toTest.map((item) => {
								let testName = `${item.testName}:`;
								item.parameter.map(({ parameters, ...rest }, index) => {
									index === item.parameter.length - 1
										? (testName += `${parameters}`)
										: (testName += `${parameters}, `);
								});
								return <Typography>{testName}</Typography>;
							})}
					</Popover>
				</div>
				<div>
					{tableData.length ? (
						<React.Fragment>
							<MaterialTable
								showEmptyDataSourceMessage={false}
								title="Reagent Used"
								columns={columns}
								icons={tableIcons}
								data={tableData}
								options={{
									headerStyle: { background: "transparent" },
									paging: false,
								}}
								components={{
									Container: (props) => <div {...props} />,

									// Cell: (props) => <div {...props} />,
								}}
							/>
							<Button
								variant="contained"
								color="primary"
								className={classes.saveButton}
								onClick={() => {
									console.log("used reagent of button", usedReagents);
									if (
										usedReagents.length > 0 &&
										usedReagents[0].usedReagent.length > 0
									) {
										console.log("comparereduce");
										handleCompareReduce();
									} else {
										console.log("reduce");
										handleReduce();
									}
								}}
							>
								Generate Report
							</Button>
						</React.Fragment>
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
		</React.Fragment>
	);
};

export default GenerateReport;
