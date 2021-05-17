import React from "react";
import "./myStyle.css";
import {
	makeStyles,
	Button,
	TextField,
	Box,
	Collapse,
	IconButton,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from "@material-ui/core";
import SnackBar from "./SnackBar";
import Autocomplete from "@material-ui/lab/Autocomplete";
import axiosi from "../api";
import axios from "axios";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import DeleteIcon from "@material-ui/icons/Delete";
import { categoryValidator, speciesValidator } from "../validation/validator";

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
		marginTop: "7%",
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

function Row(props) {
	const { row, handleFirstload, value, setValue } = props;
	const [open, setOpen] = React.useState(false);
	const classes = useRowStyles();

	const deleteCategory = async (id) => {
		try {
			const res = await axiosi.delete(`/animal/delete/${id}`);
			handleFirstload();
			console.log("res");
		} catch (e) {
			console.log(e);
		}
	};

	const deleteSpecies = async (delItem) => {
		try {
			const speciesClone = [...row.species];
			const index = speciesClone.indexOf(delItem);
			speciesClone.splice(index, 1);
			console.log(speciesClone);
			const res = await axiosi.put(`/animal/update/${row._id}`, {
				species: speciesClone,
			});
			setValue(res.data);
			handleFirstload();
		} catch (e) {
			console.log(e);
		}
	};

	return (
		<React.Fragment>
			<TableRow className={classes.root}>
				<TableCell>
					<IconButton
						aria-label="expand row"
						size="small"
						onClick={() => setOpen(!open)}
					>
						{open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
					</IconButton>
				</TableCell>
				<TableCell component="th" scope="row">
					{row.category}
				</TableCell>
				<TableCell>
					<IconButton onClick={() => deleteCategory(row._id)}>
						<DeleteIcon color="secondary" />
					</IconButton>
				</TableCell>
			</TableRow>
			<TableRow>
				<TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
					<Collapse in={open} timeout="auto" unmountOnExit>
						{row.species.length ? (
							<React.Fragment>
								<Box margin={1}>
									<Typography variant="h6" gutterBottom component="div">
										Animals
									</Typography>
									<Table size="small" aria-label="purchases">
										<TableHead>
											<TableRow>
												<TableCell>Name of the animal</TableCell>
												<TableCell>Action</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{row.species.map((speciesRow) => (
												<TableRow key={speciesRow}>
													<TableCell component="th" scope="row">
														{speciesRow}
													</TableCell>
													<TableCell>
														<IconButton
															onClick={() => deleteSpecies(speciesRow)}
														>
															<DeleteIcon color="secondary" />
														</IconButton>
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								</Box>
							</React.Fragment>
						) : (
							<Box margin={1}>
								<Typography variant="h7" gutterBottom component="div">
									Not any animals added to this category
								</Typography>
							</Box>
						)}
					</Collapse>
				</TableCell>
			</TableRow>
		</React.Fragment>
	);
}

export default function AddAnimal() {
	const classes = useStyles();
	const [addAnimal, setAddAnimal] = React.useState({
		category: "",
		species: "",
	});

	const [data, setData] = React.useState([]);
	const [inputValue, setInputValue] = React.useState("");
	const [value, setValue] = React.useState({});
	const [options, setOptions] = React.useState([]);
	const [rows, setRows] = React.useState([]);
	let cancelToken = React.useRef("");
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
		handleFirstload();
	}, []);

	React.useEffect(() => {
		if (inputValue) {
			fetchSearchResult();
		} else {
			setOptions([]);
		}
	}, [inputValue]);

	const fetchSearchResult = async () => {
		if (cancelToken.current) {
			cancelToken.current.cancel();
		}
		cancelToken.current = axios.CancelToken.source();
		try {
			const { data } = await axiosi.get(`/animal/search/${inputValue}`, {
				cancelToken: cancelToken.current.token,
			});
			console.log("search complete");
			setOptions(data);
		} catch (e) {
			console.log(e);
		}
	};

	const handleFirstload = async () => {
		try {
			const { data } = await axiosi.get("/animal/");
			setRows([...data]);
		} catch (e) {
			console.log(e);
		}
	};

	const handleChange = (input) => (event) => {
		setAddAnimal({ ...addAnimal, [input]: event.target.value });
	};

	const addCategory = async () => {
		const { error } = categoryValidator({ category: addAnimal.category });
		if (error) {
			setMessage(error.details[0].message);
			setStatus("error");
			handleClick();
		}
		if (!error) {
			try {
				const res = await axiosi.post("/animal/add/", {
					category: addAnimal.category,
					species: [],
				});
				setAddAnimal({ category: "" });
				handleFirstload();
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

	const addSpecies = async () => {
		const categoryError = categoryValidator({ category: inputValue });
		const speciesError = speciesValidator({ species: addAnimal.species });
		if (categoryError.error) {
			setMessage(categoryError.error.details[0].message);
			setStatus("error");
			handleClick();
		}
		if (speciesError.error) {
			setMessage(speciesError.error.details[0].message);
			setStatus("error");
			handleClick();
		}
		if (!categoryError.error && !speciesError.error) {
			try {
				const speciesClone = [...value.species];
				speciesClone.push(addAnimal.species);
				const res = await axiosi.put(`/animal/update/${value._id}`, {
					species: speciesClone,
				});
				setValue(res.data);
				setAddAnimal({ species: "" });
				handleFirstload();
				setMessage("Species added successfully");
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
				<h4>Add category</h4>
				<div className={classes.root1}>
					<TextField
						label="Category Name"
						variant="outlined"
						value={addAnimal.category}
						style={{ width: 80 }}
						className={classes.position}
						type="string"
						onChange={handleChange("category")}
					/>
					<Button
						variant="contained"
						color="primary"
						className={classes.button}
						onClick={addCategory}
					>
						Add
					</Button>
				</div>
				<h4>Add Animals</h4>
				<div className={classes.root}>
					<Autocomplete
						id="combo-box-demo"
						getOptionLabel={(option) => option.category}
						getOptionSelected={(option, value) => option.id === value.id}
						inputValue={inputValue}
						onChange={(event, newValue) => {
							if (!newValue) {
								setData([]);
							}
							setValue(newValue);
							console.log("new value is arrived");
							// fetchAllSample(newValue);
						}}
						onInputChange={(event, newInputValue) => {
							setInputValue(newInputValue);
						}}
						options={options}
						style={{ width: 300 }}
						renderInput={(params) => (
							<TextField {...params} label="Category Name" variant="outlined" />
						)}
					/>
					<TextField
						label="Animal name"
						variant="outlined"
						value={addAnimal.species}
						style={{ width: 80 }}
						className={classes.position}
						type="string"
						onChange={handleChange("species")}
					/>
					<Button
						variant="contained"
						color="primary"
						className={classes.button}
						onClick={addSpecies}
					>
						Add
					</Button>
				</div>

				<TableContainer>
					<Table aria-label="collapsible table">
						<TableRow>
							<TableCell />
							<TableCell>Name of Category</TableCell>
							<TableCell>Action</TableCell>
						</TableRow>
						<TableBody>
							{rows.map((row) => (
								<Row
									key={row._id}
									row={row}
									handleFirstload={handleFirstload}
									value={value}
									setValue={setValue}
								/>
							))}
						</TableBody>
					</Table>
				</TableContainer>

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
