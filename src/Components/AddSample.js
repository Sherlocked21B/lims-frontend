import React, { useState, useEffect, useRef } from "react";
import { forwardRef } from "react";
import { TextField, makeStyles, Button } from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
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
import Autocomplete from "@material-ui/lab/Autocomplete";
import axiosi from "../api";
import axios from "axios";
import MaterialTable from "material-table";
import Chip from "@material-ui/core/Chip";

import SnackBar from "./SnackBar";
import { addSampleValidaiton } from "../validation/validator";

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
	paper: {
		display: "flex",
		marginBottom: theme.spacing(2),
		padding: "1em 2em 2em 2em",
		margin: "6em 2em 2em 2em",
	},
	item: {
		width: "7em",
	},
	papers: {
		display: "flex",
		marginBottom: theme.spacing(3),
		marginRight: theme.spacing(5),
	},
	items: {
		marginLeft: theme.spacing(8),
		flex: "1 auto",
	},
	buttons: {
		marginTop: theme.spacing(3),
		marginLeft: theme.spacing(120),
	},
	button: {
		margin: "5px 3px 5px 5px",
	},
	tableButton: {
		padding: "0",
		height: "40px",
	},
	tables: {
		height: "380px",
	},
	table: {
		marginTop: "7%",
		marginLeft: "1%",
		marginRight: "1%",
	},
	itemsp: {
		marginLeft: theme.spacing(8),
		flex: "1 auto",
		marginRight: theme.spacing(10),
	},
}));

const AddSample = (props) => {
	const classes = styles();
	const [open, setOpen] = React.useState(false);

	const [message, setMessage] = React.useState("");
	const [status, setStatus] = React.useState("");
	const [columns, setColumns] = useState([
		{ title: "Sample Number", field: "sampleNo" },
		{
			title: "Pet Name",
			field: "petName",
		},
		{ title: "Category", field: "category", editable: "never" },
		{ title: "Animal", field: "animal", editable: "never" },
		{ title: "Sampling Date", field: "samplingDate", type: "date" },
		{ title: "Sample submitted By", field: "sampleSubmittedBy" },
		{ title: "Age", field: "age" },
		{ title: "Breed", field: "breed" },
		{
			title: "Gender",
			field: "gender",
			lookup: { male: "male", female: "female", others: "others" },
		},
		{
			title: "status",
			field: "status",
			editable: "never",
			render: (rowData) =>
				rowData.status ? (
					<Chip color="primary" label="done" />
				) : (
					<Chip color="secondary" label="pending" />
				),
		},
		{
			title: "Add Test Info",
			field: "testRequestForm",
			editable: "never",
			// width: "30px",
			render: (rowData) =>
				rowData && (
					<Button
						className={classes.tableButton}
						variant="contained"
						color="primary"
						style={{ width: "90px" }}
						onClick={() => {
							props.history.push({
								pathname: "/testRequestForm",
								state: rowData,
							});
						}}
					>
						Add Info
					</Button>
				),
		},
	]);

	const [data, setData] = useState([]);
	const [addSample, setAddSample] = React.useState({
		sampleNo: "",
		samplingDate: new Date(),
		sampleSubmittedBy: "",
		breed: "",
		petName: "",
		gender: "",
		petOwner: "",
	});
	const [reset, setReset] = React.useState(Object.assign({}, addSample));
	const [options, setOptions] = useState([]);
	const [value, setValue] = React.useState({});
	const [inputValue, setInputValue] = React.useState("");
	const [categoryName, setCategoryName] = useState("");
	const [testName, setTestName] = useState([]);
	const [categoryOptions, setCategoryOptions] = useState([]);
	const [categoryValue, setCategoryValue] = useState({});
	const [animal, setAnimal] = useState("");
	const autoC = useRef(null);

	let cancelToken = useRef("");
	let animalcancelToken = useRef("");
	useEffect(() => {
		if (categoryName) {
			fetchCategorySearchResult();
		} else {
			setCategoryOptions([]);
		}
	}, [categoryName]);

	useEffect(() => {
		console.log(addSample.samplingDate);
	}, [addSample.samplingDate]);

	useEffect(() => {
		if (inputValue) {
			fetchSearchResult();
		} else {
			setOptions([]);
		}
	}, [inputValue]);

	// useEffect(() => {
	// 	console.log(addSample.samplingDate);
	// }, [addSample.samplingDate]);

	const handleClick = () => {
		setOpen(true);
	};

	const handleClose = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}
		setOpen(false);
	};
	const handleReset = () => {
		setAddSample({ ...reset });
		autoC.current
			.getElementsByClassName("MuiAutocomplete-clearIndicator")[0]
			.click();
	};

	const handleSubmit = async () => {
		const { error } = addSampleValidaiton({
			...addSample,
			categoryValue: categoryValue,
			animalName: animal,
		});
		if (error) {
			setMessage(error.details[0].message);
			setStatus("error");
			handleClick();
		}
		if (!error) {
			try {
				const res = await axiosi.post("/sample/add", {
					...addSample,
					testName: testName.name,
					customerId: value._id,
					customerName: value.firstName + " " + value.lastName,
					category: categoryValue.category,
					animal: animal.toLowerCase(),
				});
				setData([{ ...res.data.data }, ...data]);
				setMessage(res.data.message);
				setStatus("success");
				handleClick();
				handleReset();
			} catch (e) {
				console.log(e.response);
				setMessage(e.response.data);
				setStatus("error");
				handleClick();
				handleReset();
			}
		}
	};

	const fetchCategorySearchResult = async () => {
		if (animalcancelToken.current) {
			animalcancelToken.current.cancel();
		}

		animalcancelToken.current = axios.CancelToken.source();
		try {
			const { data } = await axiosi.get(`/animal/search/${categoryName}`, {
				cancelToken: animalcancelToken.current.token,
			});
			setCategoryOptions(data);
		} catch (e) {
			console.log(e);
		}
	};

	const fetchSearchResult = async () => {
		if (cancelToken.current) {
			cancelToken.current.cancel();
		}
		cancelToken.current = axios.CancelToken.source();
		try {
			const { data } = await axiosi.get(`/customer/search/${inputValue}`, {
				cancelToken: cancelToken.current.token,
			});
			console.log("search complete");
			setOptions(data);
		} catch (e) {
			console.log(e);
		}
	};

	const fetchAllSample = async (newValue) => {
		try {
			const res = await axiosi.get(`/sample/find/${newValue._id}`);
			setData([...data, ...res.data]);
		} catch (e) {
			console.log(e);
		}
	};
	const handleAnimalChange = (event) => {
		setAnimal(event.target.value);
	};
	const handleChange = (input) => (event) => {
		setAddSample({ ...addSample, [input]: event.target.value });
	};

	return (
		<div>
			<React.Fragment>
				<div className={classes.paper}>
					<Autocomplete
						id="combo-box-demo"
						getOptionLabel={(option) =>
							option.firstName +
							" " +
							option.lastName +
							"(" +
							option.contactNumber +
							")"
						}
						getOptionSelected={(option, value) => option.id === value.id}
						inputValue={inputValue}
						onChange={(event, newValue) => {
							if (!newValue) {
								setData([]);
							}
							setValue(newValue);
							fetchAllSample(newValue);
						}}
						onInputChange={(event, newInputValue) => {
							setInputValue(newInputValue);
						}}
						options={options}
						style={{ width: 300 }}
						renderInput={(params) => (
							<TextField {...params} label="Customer Name" variant="outlined" />
						)}
					/>
				</div>
				<div className={classes.papers}>
					<TextField
						name="sample_no"
						label="Sample NO"
						value={addSample.sampleNo}
						variant="filled"
						className={classes.items}
						onChange={handleChange("sampleNo")}
						type="string"
					/>
					<TextField
						label="Pet Name"
						value={addSample.petName}
						variant="filled"
						className={classes.items}
						onChange={handleChange("petName")}
						type="string"
					/>
					<TextField
						label="Pet Owner"
						value={addSample.age}
						variant="filled"
						className={classes.items}
						onChange={handleChange("petOwner")}
						type="string"
					/>
					<TextField
						name="Due_Date"
						value={addSample.samplingDate}
						variant="filled"
						className={classes.items}
						type="date"
						onChange={handleChange("samplingDate")}
					/>
					<TextField
						name="Collected_By"
						label="Sample Submitted By"
						value={addSample.sampleSubmittedBy}
						variant="filled"
						className={classes.items}
						type="string"
						onChange={handleChange("sampleSubmittedBy")}
					/>
				</div>
				<div className={classes.papers}>
					<TextField
						label="Breed"
						value={addSample.breed}
						variant="filled"
						className={classes.items}
						onChange={handleChange("breed")}
						type="string"
					/>

					<Autocomplete
						id="combo-box-demo"
						ref={autoC}
						className={classes.items}
						options={categoryOptions}
						getOptionLabel={(option) => option.category}
						inputValue={categoryName}
						getOptionSelected={(option, value) => option.id === value.id}
						onInputChange={(event, newInputValue) => {
							setCategoryName(newInputValue);
						}}
						onChange={(event, newValue) => {
							if (!newValue) {
								setAnimal("");
							}
							setCategoryValue(newValue);
						}}
						style={{ width: 300 }}
						renderInput={(params) => (
							<TextField
								{...params}
								label="Animal Category"
								variant="outlined"
							/>
						)}
					/>
					<FormControl className={classes.items}>
						<InputLabel id="demo-simple-select-label">Select Animal</InputLabel>
						<Select
							labelId="demo-simple-select-label"
							id="demo-simple-select"
							value={animal}
							onChange={handleAnimalChange}
						>
							<MenuItem value="">
								<em>None</em>
							</MenuItem>
							{categoryValue &&
								(Object.keys(categoryValue).length != 0
									? categoryValue.species.map((item) => (
											<MenuItem key={item} value={item}>
												{item}
											</MenuItem>
									  ))
									: null)}
						</Select>
					</FormControl>
					<FormControl className={classes.items}>
						<InputLabel className={classes.label}>Gender</InputLabel>
						<Select
							labelId="demo-controlled-open-select-label"
							id="demo-controlled-open-select"
							value={addSample.gender}
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
					<Button
						className={classes.button}
						variant="contained"
						color="primary"
						className={classes.items}
						onClick={handleSubmit}
					>
						Add
					</Button>
				</div>
				<div className={classes.table}>
					{data.length ? (
						<MaterialTable
							showEmptyDataSourceMessage={false}
							icons={tableIcons}
							title="All tests"
							columns={columns}
							data={data}
							options={{
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
											const res = await axiosi.put(
												`/sample/update/${oldData._id}`,
												req,
											);
											const dataUpdate = [...data];
											const index = oldData.tableData.id;
											dataUpdate[index] = res.data;
											setData([...dataUpdate]);
											resolve();
										} catch (e) {
											console.log(e);
											reject();
										}
									}),
								onRowDelete: (oldData) =>
									new Promise(async (resolve, reject) => {
										try {
											const res = await axiosi.delete(
												`/sample/delete/${oldData._id}`,
											);
											const dataDelete = [...data];
											const index = oldData.tableData.id;
											dataDelete.splice(index, 1);
											setData([...dataDelete]);
											resolve();
										} catch (e) {
											console.log(e);
											reject();
										}
									}),
							}}
						/>
					) : null}
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

export default AddSample;
