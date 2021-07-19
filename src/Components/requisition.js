import React, { useState, useRef, useEffect } from "react";
import "./myStyle.css";
import { TextField, Paper, makeStyles, Button } from "@material-ui/core";
import axios from "axios";
import axiosi from "../api";

import Autocomplete from "@material-ui/lab/Autocomplete";
import { importReagentValidator } from "../validation/validator";
import { handleEquipmentValidator } from "../validation/validator";
import SnackBar from "./SnackBar";
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
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import MaterialTable, { MTableToolbar } from "material-table";

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

const styles = makeStyles({
	paper: {
		display: "flex",
		marginTop: "7em",
		flexDirection: "column",
		height: "100%",
		width: "100%",
	},
	input: {
		display: "flex",
		width: "90%",
		justifyContent: "space-between",
		marginTop: "2em",
		marginLeft: "4em",
	},
	items: {
		height: "80%",
	},
	table: {
		marginTop: "7%",
		marginLeft: "10%",
		marginRight: "10%",
	},
	saveButton: {
		marginTop: "2em",
	},
});

const Requisition = () => {
	const classes = styles();
	const [columns, setColumns] = React.useState([
		{ title: "Name", field: "name" },
		{ title: "Units/Description", field: "unit" },
		{ title: "Qunatity", field: "quantity" },
	]);

	let cancelToken = useRef("");
	const autoC = useRef(null);
	let equcancelToken = useRef("");
	const autoEqC = useRef(null);

	const [volume, setVolume] = useState("");
	const [unit, setUnit] = useState("Select Reagent");
	const [inputValue, setInputValue] = useState("");
	const [equinputValue, setEquInputValue] = useState("");
	const [open, setOpen] = useState(false);
	const [options, setOptions] = useState([]);
	const [equoptions, setEquOptions] = useState([]);
	const [value, setValue] = useState({});
	const [message, setMessage] = useState("");
	const [status, setStatus] = useState("");

	const [data, setData] = useState([]);

	const [equvalue, setEquValue] = useState({});

	const [quantity, setQuantity] = useState("");
	const [description, setDescription] = useState("Select Equipment");

	useEffect(() => {
		if (inputValue) {
			fetchSearchResult();
		} else {
			setOptions([]);
		}
	}, [inputValue]);

	useEffect(() => {
		if (equinputValue) {
			fetchSearchEquResult();
		} else {
			setOptions([]);
		}
	}, [equinputValue]);

	const handleClick = () => {
		setOpen(true);
	};

	const handleClose = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}

		setOpen(false);
	};

	const handleReset = (type) => {
		if (type === "reagent") {
			autoC.current
				.getElementsByClassName("MuiAutocomplete-clearIndicator")[0]
				.click();
			setUnit("Select Reagent");
			setVolume("");
		} else {
			autoEqC.current
				.getElementsByClassName("MuiAutocomplete-clearIndicator")[0]
				.click();
			setDescription("Select equipment");
			setQuantity("");
		}
	};

	const fetchSearchResult = async () => {
		if (cancelToken.current) {
			cancelToken.current.cancel();
		}
		cancelToken.current = axios.CancelToken.source();
		try {
			const { data } = await axiosi.get(`/reagent/search/${inputValue}`, {
				cancelToken: cancelToken.current.token,
			});
			console.log("search complete");
			setOptions(data);
		} catch (e) {
			console.log(e);
		}
	};

	const fetchSearchEquResult = async () => {
		if (equcancelToken.current) {
			equcancelToken.current.cancel();
		}
		equcancelToken.current = axios.CancelToken.source();
		try {
			const { data } = await axiosi.get(`/equipment/search/${equinputValue}`, {
				equcancelToken: equcancelToken.current.token,
			});
			console.log("search complete");
			setEquOptions(data);
		} catch (e) {
			console.log(e);
		}
	};
	const handleReagentSubmit = async () => {
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
			setData([
				...data,
				{ name: value.reagentName, unit: value.unit, quantity: volume },
			]);
			handleReset("reagent");
		}
	};

	const handleEquipmentSubmit = async () => {
		const { error } = handleEquipmentValidator({
			equipmentName: equvalue,
			quantity: quantity,
		});
		if (error) {
			setMessage(error.details[0].message);
			setStatus("error");
			handleClick();
		}
		if (!error) {
			setData([
				...data,
				{
					name: equvalue.equipmentName,
					unit: equvalue.description,
					quantity: quantity,
				},
			]);
			handleReset("eq");
		}
	};

	const handleSave = async () => {
		if (!data.length > 0) {
			setMessage("Add the data to submit");
			setStatus("error");
			handleClick();
			return;
		}
		try {
			const res = await axiosi.post("/requisition/add", { request: data });
			setMessage("Requisition form saved successfully");
			setStatus("success");
			handleClick();
		} catch (e) {
			setMessage("Error saving requisition form !! Please try again");
			setStatus("error");
			handleClick();
		}
	};
	return (
		<div>
			<div style={{ minHeight: "100vh" }}>
				<div className={classes.paper}>
					<div className={classes.input}>
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
									setVolume("");
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
									{...params}
									label="Reagent Name"
									variant="outlined"
								/>
							)}
						/>
						<TextField
							id="filled-read-only-input"
							value={unit}
							label="Unit"
							// defaultValue="Select Reagent"
							InputProps={{
								readOnly: true,
							}}
							variant="outlined"
						/>
						<TextField
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
							variant="contained"
							color="primary"
							onClick={handleReagentSubmit}
						>
							Add
						</Button>
					</div>
					<div className={classes.input}>
						<Autocomplete
							ref={autoEqC}
							id="combo-box-demo"
							getOptionLabel={(option) => option.equipmentName}
							getOptionSelected={(option, value) => option._id === value._id}
							inputValue={equinputValue}
							onChange={(event, newValue) => {
								setEquValue(newValue);
								if (newValue) {
									setDescription(newValue.description);
								} else {
									setDescription("Select Equipment");
									setQuantity("");
								}
								//   if (!newValue) {
								//     setData([]);
								//   }
								//   setValue(newValue);
								//   fetchAllSample(newValue);
							}}
							onInputChange={(event, newInputValue) => {
								setEquInputValue(newInputValue);
							}}
							options={equoptions}
							style={{ width: 300 }}
							renderInput={(params) => (
								<TextField
									{...params}
									label="Equipment Name"
									variant="outlined"
								/>
							)}
						/>
						<TextField
							id="filled-read-only-input"
							value={description}
							label="Description"
							// defaultValue="Select Reagent"
							InputProps={{
								readOnly: true,
							}}
							variant="outlined"
						/>
						<TextField
							value={quantity}
							id="outlined-number"
							label="Quantity"
							type="number"
							InputLabelProps={{
								shrink: true,
							}}
							variant="outlined"
							onChange={(event) => setQuantity(event.target.value)}
						/>

						<Button
							variant="contained"
							color="primary"
							onClick={handleEquipmentSubmit}
						>
							Add
						</Button>
					</div>
				</div>
				<div className={classes.table}>
					{data.length ? (
						<div>
							<MaterialTable
								showEmptyDataSourceMessage={false}
								title="Add Request"
								icons={tableIcons}
								columns={columns}
								data={data}
								options={{
									search: false,
									headerStyle: { background: "transparent" },
									paging: false,
									// searchAutoFocus: true
								}}
								components={{
									Container: (props) => <div {...props} />,
								}}
								editable={{
									onRowDelete: (oldData) =>
										new Promise((resolve, reject) => {
											try {
												const name = oldData.name;
												const filterdParameter = data.filter(
													(item) => item.name !== name,
												);
												setData([...filterdParameter]);
												resolve();
											} catch (e) {
												console.log(e);
												reject();
											}
										}),
								}}
							/>
							<div>
								<Button
									variant="contained"
									color="primary"
									className={classes.saveButton}
									onClick={handleSave}
								>
									save
								</Button>
							</div>
						</div>
					) : null}
				</div>
			</div>
			<SnackBar
				messege={message}
				open={open}
				handleClose={handleClose}
				status={status}
			/>
		</div>
	);
};

export default Requisition;
