import React, { useState, useEffect, useRef, forwardRef } from "react";
import axios from "axios";
import { TextField, makeStyles, Button } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Grid from "@material-ui/core/Grid";
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
import MaterialTable from "material-table";
import axiosi from "../api";
import SnackBar from "./SnackBar";
import { importReagentValidator } from "../validation/validator";

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

const styles = makeStyles((theme) => ({
	root: {
		marginTop: "7em",
		marginRight: "2em",
		marginLeft: "2em",
	},
	formControl: {
		minWidth: 160,
	},
	table: {
		marginLeft: "2em",
		marginTop: "2em",
		marginRight: "4em",
	},
	buttonContainer: {
		width: "85%",
		marginTop: "3em",
	},
	saveButton: {
		float: "right",
		width: "100px",
		marginBottom: "2em",
	},
	reagentRoot: {
		display: "flex",
		marginBottom: theme.spacing(5),
		marginTop: theme.spacing(6),
		justifyContent: "space-between",
		marginLeft: "10%",
		width: "70%",
	},
	position: {
		// marginLeft: theme.spacing(4),
		flex: "1 1 1 auto",
		width: "80%",
		marginRight: theme.spacing(4),
	},
	button: {
		margin: "5px 10px 5px 5px",
	},
}));

const columns = [
	{ title: "Reagent", field: "reagentName", editable: "never" },
	{ title: "unit", field: "unit", editable: "never" },
	{ title: "Volume", field: "volume" },
];

const ReagentUsage = () => {
	const classes = styles();
	const [testName, setTestName] = useState("");
	const [testOptions, setTestOptions] = useState([]);
	const [testValue, setTestValue] = useState(null);
	const [parameter, setParameter] = useState("");
	const [tableFields, setTableFields] = useState([]);
	const [referenceId, setReferenceId] = useState("");
	const [message, setMessage] = React.useState("");
	const [status, setStatus] = React.useState("");
	const [open, setOpen] = React.useState(false);

	const [volume, setVolume] = useState(0);
	const [unit, setUnit] = useState("Select Reagent");
	const [inputValue, setInputValue] = React.useState("");
	const [options, setOptions] = useState([]);
	const [value, setValue] = useState({});
	const autoC = useRef(null);

	let testcancelToken = useRef("");
	let cancelToken = useRef("");

	useEffect(() => {
		if (testName) {
			fetchTestSearchResult();
		} else {
			setTestOptions([]);
		}
	}, [testName]);

	useEffect(() => {
		if (inputValue) {
			fetchSearchResult();
		} else {
			setOptions([]);
		}
	}, [inputValue]);

	useEffect(() => {
		if (testValue && parameter) {
			fetchReference();
		}
	}, [testValue, parameter]);

	const fetchSearchResult = async () => {
		if (cancelToken.current) {
			cancelToken.current.cancel();
		}
		cancelToken.current = axios.CancelToken.source();
		try {
			const { data } = await axiosi.get(`/reagent/search/${inputValue}`, {
				cancelToken: cancelToken.current.token,
			});
			setOptions(data);
		} catch (e) {
			setMessage(e.response);
			setStatus("error");
			handleClick();
		}
	};
	const fetchReference = async () => {
		try {
			const { data } = await axiosi.get("/reagentUsage", {
				params: {
					testName: testValue.name,
					parameter: parameter.parameters,
				},
			});
			console.log(data);
			data.length && handleFetchReference(data[0]);
		} catch (e) {
			console.log(e);
		}
	};

	const handleFetchReference = (data) => {
		setReferenceId(data._id);
		setTableFields(data.reagentTable);
	};

	const fetchTestSearchResult = async () => {
		if (testcancelToken.current) {
			testcancelToken.current.cancel();
		}

		testcancelToken.current = axios.CancelToken.source();
		try {
			const { data } = await axiosi.get(`/test/search/${testName}`, {
				cancelToken: testcancelToken.current.token,
			});
			setTestOptions(data);
		} catch (e) {
			console.log(e);
		}
	};

	const handleChange = (event) => {
		setParameter(event.target.value);
		if (!event.target.value) {
			setTableFields([]);
		}
	};

	const handleAdd = () => {
		const { error } = importReagentValidator({
			reagentName: value,
			volume: volume,
		});
		if (error) {
			setMessage(error.details[0].message);
			setStatus("error");
			handleClick();
		}
		if (!error) {
			let isPresent = false;
			tableFields.map((item) => {
				if (item.reagentName === value.reagentName) {
					isPresent = true;
				}
			});
			if (!isPresent) {
				setTableFields([
					...tableFields,
					{ reagentName: value.reagentName, unit: value.unit, volume },
				]);
			} else {
				setMessage(
					"Reagent is already present in table!!!!Delete it first to add another.",
				);
				setStatus("error");
				handleClick();
			}
		}
	};

	const handleSave = async () => {
		if (referenceId) {
			try {
				const saveReference = await axiosi.put(
					`/reagentUsage/update/${referenceId}`,
					{
						testName: testValue.name,
						parameter: parameter.parameters,
						reagentTable: tableFields,
					},
				);
				setMessage("Reagent Usage updated successfully");
				setStatus("success");
				handleClick();
			} catch (e) {
				setMessage(e.response.message);
				setStatus("error");
				handleClick();
			}
		} else {
			try {
				const saveReference = await axiosi.post("/reagentUsage/add", {
					testName: testValue.name,
					parameter: parameter.parameters,
					reagentTable: tableFields,
				});
				setReferenceId(saveReference.data._id);
				setMessage("Reagent Usage Saved successfully");
				setStatus("success");
				handleClick();
			} catch (e) {
				setMessage(e.response.message);
				setStatus("error");
				handleClick();
			}
		}
	};
	//for snackbar
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
		<>
			<Grid
				container
				direction="row"
				justify="center"
				spacing={3}
				className={classes.root}
			>
				<Grid item xs={12} sm={6} md={4}>
					<Autocomplete
						id="combo-box-demo"
						inputValue={testName}
						onInputChange={(event, newInputValue) => {
							setTestName(newInputValue);
						}}
						options={testOptions}
						getOptionSelected={(option, value) => option.id === value.id}
						getOptionLabel={(option) => option.name}
						onChange={(event, newValue) => {
							if (!newValue) {
								setTableFields([]);
								setParameter("");
							}
							// newValue ? ReferenceFields(newValue) : setTableFields(newValue);
							setTestValue(newValue);
						}}
						style={{ width: 300 }}
						renderInput={(params) => (
							<TextField {...params} label="Test Name" variant="outlined" />
						)}
					/>
				</Grid>
				<Grid item xs={12} sm={6} md={4}>
					<FormControl className={classes.formControl}>
						<InputLabel id="demo-simple-select-label">
							Select Parameter
						</InputLabel>
						<Select
							labelId="demo-simple-select-label"
							id="demo-simple-select"
							value={parameter}
							onChange={handleChange}
						>
							<MenuItem value="">
								<em>None</em>
							</MenuItem>
							{testValue &&
								(Object.keys(testValue).length != 0
									? testValue.parameter.map((item) => (
											<MenuItem key={item} value={item}>
												{item.parameters}
											</MenuItem>
									  ))
									: null)}
						</Select>
					</FormControl>
				</Grid>
			</Grid>
			{parameter && testValue.name && (
				<div>
					<div className={classes.reagentRoot}>
						<Autocomplete
							ref={autoC}
							id="combo-box-demo"
							getOptionLabel={(option) => option.reagentName}
							getOptionSelected={(option, value) => option._id === value._id}
							inputValue={inputValue}
							onChange={(event, newValue) => {
								setValue(newValue);
								if (newValue) {
									setUnit(newValue.unit);
								} else {
									setUnit("Select Reagent");
								}
								//   if (!newValue) {
								//     setData([]);
								//   }
								//   setValue(newValue);
								//   fetchAllSample(newValue);
							}}
							onInputChange={(event, newInputValue) => {
								setInputValue(newInputValue);
							}}
							options={options}
							style={{ width: 300 }}
							renderInput={(params) => (
								<TextField
									className={classes.postion}
									{...params}
									label="Reagent Name"
									variant="outlined"
								/>
							)}
						/>
						<TextField
							className={classes.postion}
							id="filled-read-only-input"
							value={unit}
							label="Unit"
							InputProps={{
								readOnly: true,
							}}
							variant="outlined"
						/>
						<TextField
							className={classes.postion}
							value={volume}
							id="outlined-number"
							label="Volume"
							type="number"
							InputLabelProps={{
								shrink: true,
							}}
							variant="outlined"
							onChange={(event) => setVolume(event.target.value)}
						/>
						<Button
							onClick={handleAdd}
							className={classes.button}
							variant="contained"
							color="primary"
						>
							Add
						</Button>
					</div>
					<div className={classes.table}>
						{/* {tableFields.length ? ( */}
						<>
							<MaterialTable
								showEmptyDataSourceMessage={false}
								title="Add Reference"
								columns={columns}
								icons={tableIcons}
								data={tableFields}
								options={{
									paging: false,
									search: false,
									headerStyle: { background: "transparent" },
								}}
								components={{
									Container: (props) => <div {...props} />,

									// Cell: (props) => <div {...props} />,
								}}
								editable={{
									onRowDelete: (oldData) =>
										new Promise((resolve, reject) => {
											try {
												const name = oldData.reagentName;
												const filterdReagent = tableFields.filter(
													(item) => item.reagentName !== name,
												);
												setTableFields([...filterdReagent]);
												resolve();
											} catch (e) {
												console.log(e);
												reject();
											}
										}),
								}}
								cellEditable={{
									onCellEditApproved: (
										newValue,
										oldValue,
										rowData,
										columnDef,
									) => {
										return new Promise(async (resolve, reject) => {
											try {
												const copy = [...tableFields];
												copy[rowData.tableData.id][columnDef.field] = newValue;
												setTableFields([...copy]);
												resolve();
											} catch (e) {
												console.log(e);
											}
										});
									},
								}}
							/>
							<div className={classes.buttonContainer}>
								<Button
									variant="contained"
									color="primary"
									className={classes.saveButton}
									onClick={handleSave}
								>
									Save
								</Button>
							</div>
						</>
						{/* ) : null} */}
					</div>
				</div>
			)}
			<div>
				<SnackBar
					messege={message}
					open={open}
					handleClose={handleClose}
					status={status}
				/>
			</div>
		</>
	);
};

export default ReagentUsage;
