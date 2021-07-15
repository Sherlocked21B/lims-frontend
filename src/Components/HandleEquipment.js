import React, { useState, useRef, useEffect } from "react";
import "./myStyle.css";
import { TextField, Paper, makeStyles, Button } from "@material-ui/core";
import axios from "axios";
import axiosi from "../api";

import Autocomplete from "@material-ui/lab/Autocomplete";
import { handleEquipmentValidator } from "../validation/validator";
import SnackBar from "./SnackBar";
const styles = makeStyles({
	paper: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		flexDirection: "column",
		height: "100%",
		width: "100%",
		margin: "30",
		padding: "5",
		// backgroundColor: "#f7f7f7",
	},
	input: {
		display: "flex",
		flexDirection: "column",
		justifyContent: "space-around",
	},
	items: {
		height: "80%",
	},
	button: {
		marginTop: "2rem",
	},
	space: {
		marginTop: "2rem",
	},
});

const ImportReagent = () => {
	const classes = styles();
	let cancelToken = useRef("");
	const autoC = useRef(null);

	const [quantity, setQuantity] = useState("");
	const [description, setDescription] = useState("Select Equipment");
	const [inputValue, setInputValue] = React.useState("");
	const [open, setOpen] = React.useState(false);
	const [options, setOptions] = useState([]);
	const [value, setValue] = useState({});
	const [message, setMessage] = React.useState("");
	const [status, setStatus] = React.useState("");

	useEffect(() => {
		if (inputValue) {
			fetchSearchResult();
		} else {
			setOptions([]);
		}
	}, [inputValue]);

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
		autoC.current
			.getElementsByClassName("MuiAutocomplete-clearIndicator")[0]
			.click();
		setDescription("Select Equipment");
		setQuantity("");
	};

	const fetchSearchResult = async () => {
		if (cancelToken.current) {
			cancelToken.current.cancel();
		}
		cancelToken.current = axios.CancelToken.source();
		try {
			const { data } = await axiosi.get(`/equipment/search/${inputValue}`, {
				cancelToken: cancelToken.current.token,
			});
			console.log("search complete");
			setOptions(data);
		} catch (e) {
			console.log(e);
		}
	};
	const handleSubmit = async () => {
		const { error } = handleEquipmentValidator({
			equipmentName: value,
			quantity: quantity,
		});
		if (error) {
			setMessage(error.details[0].message);
			setStatus("error");
			handleClick();
		}
		if (!error) {
			try {
				const { data } = await axiosi.put(`/equipment/import/${value._id}`, {
					quantity: quantity,
				});
				setMessage(data);
				setStatus("success");
				handleClick();
				handleReset();
			} catch (e) {
				setMessage(e.response);
				setStatus("error");
				handleClick();
				handleReset();
			}
		}
	};

	const handleExport = async () => {
		const { error } = handleEquipmentValidator({
			equipmentName: value,
			quantity: quantity,
		});
		if (error) {
			setMessage(error.details[0].message);
			setStatus("error");
			handleClick();
		}
		if (!error) {
			if (quantity > value.quantity) {
				setMessage("Insufficient quantity in inventory");
				setStatus("error");
				handleClick();
				handleReset();
			} else {
				try {
					const { data } = await axiosi.put(`/equipment/use/${value._id}`, {
						quantity: quantity,
					});
					setMessage(data);
					setStatus("success");
					handleClick();
					handleReset();
				} catch (e) {
					setMessage(e.response);
					setStatus("error");
					handleClick();
					handleReset();
				}
			}
		}
	};
	// const handleChange = (event) => {
	//     setRole(event.target.value);
	//   };
	return (
		<div>
			<React.Fragment>
				<div style={{ height: "100vh" }}>
					<div className={classes.paper}>
						<div className={classes.input}>
							<Autocomplete
								ref={autoC}
								id="combo-box-demo"
								getOptionLabel={(option) => option.equipmentName}
								getOptionSelected={(option, value) => option._id === value._id}
								inputValue={inputValue}
								onChange={(event, newValue) => {
									setValue(newValue);
									if (newValue) {
										setDescription(newValue.description);
									} else {
										setDescription("Select Equipment");
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
										label="Equipment Name"
										variant="outlined"
									/>
								)}
							/>
							<TextField
								className={classes.space}
								id="filled-read-only-input"
								value={description}
								label="Unit"
								// defaultValue="Select Reagent"
								InputProps={{
									readOnly: true,
								}}
								variant="outlined"
							/>
							<TextField
								className={classes.space}
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
								onClick={handleSubmit}
								className={classes.button}
								variant="contained"
								color="primary"
							>
								Purchase
							</Button>
							<Button
								onClick={handleExport}
								className={classes.button}
								variant="contained"
								color="primary"
							>
								Sell/Disposal
							</Button>
						</div>
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

export default ImportReagent;
