import React, { useState, useRef, useEffect } from "react";
import "./myStyle.css";
import {
	makeStyles,
	Button,
	Checkbox,
	FormControlLabel,
	MenuItem,
	FormControl,
	InputLabel,
	Select,
	TextField,
} from "@material-ui/core";

import axios from "../api";
import SnackBar from "./SnackBar";
import { paymentDoneValidator } from "../validation/validator";

const useStyles = makeStyles((theme) => ({
	paper: {
		padding: "1em 2em 2em 2em",
		margin: "8em 2em 2em 2em",
		// height: "95em",
	},
	button: {
		padding: "10px 30px 10px 30px",
		margin: "15px 8px 5px 5px",
	},
	payment: {
		display: "flex",
		justifyContent: "space-between",
		width: "90%",
		margin: "15px 8px 5px 5px",
	},
	paymentDone: {
		display: "flex",
		justifyContent: "space-between",
		width: "32%",
		margin: "15px 8px 5px 5px",
	},
}));

const TestRequestForm = (props) => {
	const classes = useStyles();
	const sampleData = props.location.state;
	const [sampleTypes, setSampleTypes] = useState([
		{ name: "Blood", checked: false },
		{ name: "Urine", checked: false },
		{ name: "Fluid", checked: false },
		{ name: "Skin Scrape", checked: false },
		{ name: "Swab", checked: false },
		{ name: "Hair pluck", checked: false },
		{ name: "Stool", checked: false },
	]);
	const [paymentAmount, setPaymentAmount] = React.useState(0);
	const [fullPayment, setFullPayment] = React.useState(false);
	const [testCheckbox, setTestCheckbox] = useState([]);
	const [healthPackage, setHealthPackage] = useState([]);
	const [testFee, setTestFee] = useState(0);
	const [meansOfPayment, setMeansOfPayment] = React.useState("");
	const [updateVariable, setUpdateVariable] = React.useState({
		shouldUpdate: false,
		_id: "",
	});
	const [open, setOpen] = React.useState(false);
	const [message, setMessage] = React.useState("");
	const [status, setStatus] = React.useState("");
	// const [refData, setRefData] = React.useState([]);

	const handleClose = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}

		setOpen(false);
	};

	const handleClick = () => {
		setOpen(true);
	};

	React.useEffect(() => {
		handleReferenceRange();
	}, []);

	React.useEffect(() => {
		let nonHealthPackageCost = 0;
		let healthPackageCost = 0;
		testCheckbox.map((item) => {
			if (item.testChecked === true) {
				item.parameter.map((param) => {
					if (param.checked === true) {
						nonHealthPackageCost += param.cost;
					}
				});
			}
		});
		healthPackage.map((item) => {
			if (item.testChecked === true) {
				item.parameter.map((param) => {
					healthPackageCost += param.cost;
				});
			}
		});
		setTestFee(nonHealthPackageCost + healthPackageCost);
	}, [testCheckbox, healthPackage]);

	const handleReferenceRange = async () => {
		try {
			const referenceTable = await axios.get(
				`/reference/find/${sampleData.animal}`,
			);
			handleFirstLoad(referenceTable.data);
		} catch (e) {
			console.log(e);
		}
	};

	const handleFirstLoad = async (refData) => {
		try {
			let newTest = [];
			const prevTestForm = await axios.get(
				`/testRequest/find/${sampleData._id}`,
			);
			if (prevTestForm.data.length > 0) {
				// newTest = prevTestForm.data[0].toTest;
				setUpdateVariable({
					shouldUpdate: true,
					_id: prevTestForm.data[0]._id,
				});
				setSampleTypes([...prevTestForm.data[0].sampleType]);
				setMeansOfPayment(prevTestForm.data[0].means);
				setPaymentAmount(prevTestForm.data[0].paymentAmount);
			}
			const testSchema = await axios.get("/test/getAll");
			newTest = testSchema.data.map((item) => {
				const refTestIndex =
					refData.length > 0
						? refData.findIndex((x) => x.testName === item.name)
						: -1;
				const testIndex =
					prevTestForm.data.length > 0
						? prevTestForm.data[0].toTest.findIndex(
								(x) => x.testName === item.name,
						  )
						: -1;
				// console.log(refTestIndex >= 0 && refData[refTestIndex].refTable);
				// console.log(refData);
				return {
					package: item.package,
					_id: item._id,
					testName: item.name,
					testChecked:
						testIndex >= 0
							? prevTestForm.data[0].toTest[testIndex].testChecked
							: false,
					checkedAll:
						testIndex >= 0
							? prevTestForm.data[0].toTest[testIndex].checkedAll
							: false,
					parameter: item.parameter.map((param) => {
						const refIndex =
							refTestIndex >= 0
								? refData[refTestIndex].refTable.findIndex(
										(x) => x.parameters === param.parameters,
								  )
								: -1;
						const paramIndex =
							testIndex >= 0 &&
							prevTestForm.data[0].toTest[testIndex].parameter.findIndex(
								(x) => x._id === param._id,
							);

						return {
							_id: param._id,
							parameters: param.parameters,
							units: param.units,
							cost: param.cost,
							checked:
								paramIndex >= 0 && testIndex >= 0
									? prevTestForm.data[0].toTest[testIndex].parameter[paramIndex]
											.checked
									: false,
							referenceRange:
								refTestIndex >= 0 && refIndex >= 0
									? refData[refTestIndex].refTable[refIndex].referenceRange
									: "-",
						};
					}),
				};
			});
			const HealthPackageClone = newTest.filter(
				(item) => item.package === true,
			);
			const nonHealthPackage = newTest.filter((item) => item.package !== true);
			// console.log(HealthPackageClone);
			setHealthPackage([...HealthPackageClone]);
			setTestCheckbox([...nonHealthPackage]);
		} catch (e) {
			setMessage(e.response);
			setStatus("error");
			handleClick();
		}
	};

	const handleSubmit = async () => {
		try {
			const reportHealthPackage = healthPackage.filter(
				(x) => x.testChecked === true,
			);
			const reportTestCheckbox = testCheckbox.filter(
				(x) => x.testChecked === true,
			);
			reportTestCheckbox.forEach((x) => {
				let filterParameter;
				x.checkedAll
					? (filterParameter = x.parameter)
					: (filterParameter = x.parameter.filter(
							(param) => param.checked === true,
					  ));

				return (x.parameter = filterParameter);
			});
			const testRequestForm = {
				customerId: sampleData.customerId,
				customerName: sampleData.customerName,
				sampleId: sampleData._id,
				testFee: testFee,
				means: meansOfPayment,
				sampleType: sampleTypes,
				animalName: sampleData.animal,
				toTest: [...reportTestCheckbox, ...reportHealthPackage],
			};
			if (updateVariable.shouldUpdate) {
				const updateRes = await axios.put(
					`/testRequest/update/${updateVariable._id}`,
					testRequestForm,
				);
				handleFirstLoad(updateRes.data);
				setMessage("Data update successfully");
				setStatus("success");
				handleClick();
			} else {
				const res = await axios.post("/testRequest/add", testRequestForm);
				setUpdateVariable({
					shouldUpdate: true,
					_id: res.data._id,
				});
				setMessage("Data Added successfully");
				setStatus("success");
				handleClick();
			}
		} catch (e) {
			setMessage(e.response);
			setStatus("error");
			handleClick();
		}
	};

	const handleFullPayment = (event) => {
		setFullPayment(event.target.checked);
		event.target.checked ? setPaymentAmount(testFee) : setPaymentAmount(0);
	};

	const handlePaymentSubmit = async () => {
		const { error } = paymentDoneValidator({ paymentAmount }, testFee);
		if (error) {
			setMessage(error.details[0].message);
			setStatus("error");
			handleClick();
		}
		if (!error) {
			try {
				const paymentInfo = {
					sampleNo: sampleData.sampleNo,
					petName: sampleData.petName,
					customerName: sampleData.customerName,
					amount: paymentAmount,
				};
			} catch (e) {
				setMessage(e.response);
				setStatus("error");
				handleClick();
			}
		}
	};

	return (
		<div className={classes.paper}>
			<h4>Sample Type</h4>
			{sampleTypes.map((item) => (
				<FormControlLabel
					className={classes.checkbox}
					key={item.name}
					control={
						<Checkbox
							checked={item.checked}
							onChange={(event) => {
								const index = sampleTypes.findIndex(
									(x) => x.name === item.name,
								);
								const sampleTypesClone = sampleTypes;
								sampleTypesClone[index].checked = event.target.checked;
								setSampleTypes([...sampleTypesClone]);
							}}
							name="testCompleted"
							color="primary"
						/>
					}
					label={item.name}
				/>
			))}

			<h4>Tests</h4>
			{testCheckbox.map((item) => (
				<React.Fragment key={item._id}>
					<h5>{item.testName}</h5>
					<FormControlLabel
						className={classes.checkbox}
						control={
							<Checkbox
								checked={item.checkedAll}
								onChange={(event) => {
									const testIndex = testCheckbox.findIndex(
										(x) => x.testName === item.testName,
									);
									const testCheckboxClone = testCheckbox;
									testCheckboxClone[testIndex].parameter.map((param) => {
										param.checked = event.target.checked;
									});
									testCheckboxClone[testIndex].checkedAll =
										event.target.checked;
									testCheckboxClone[testIndex].testChecked =
										event.target.checked;
									console.log(testCheckboxClone);
									setTestCheckbox([...testCheckboxClone]);
								}}
								name="testCompleted"
								color="primary"
							/>
						}
						label="All"
					/>
					{item.parameter.map((param) => (
						<FormControlLabel
							className={classes.checkbox}
							key={param._id}
							control={
								<Checkbox
									checked={param.checked}
									onChange={(event) => {
										let count = 0;
										const testIndex = testCheckbox.findIndex(
											(x) => x.testName === item.testName,
										);
										const index = item.parameter.findIndex(
											(x) => x.parameters === param.parameters,
										);
										const testCheckboxClone = testCheckbox;
										testCheckboxClone[testIndex].parameter[index].checked =
											event.target.checked;
										testCheckboxClone[testIndex].parameter.map((param) => {
											if (param.checked) {
												count = count + 1;
											}
										});
										if (count > 0) {
											testCheckboxClone[testIndex].testChecked = true;
										} else {
											testCheckboxClone[testIndex].testChecked = false;
										}
										if (
											count === testCheckboxClone[testIndex].parameter.length
										) {
											testCheckboxClone[testIndex].checkedAll = true;
										} else {
											testCheckboxClone[testIndex].checkedAll = false;
										}
										setTestCheckbox([...testCheckboxClone]);
									}}
									name="testCompleted"
									color="primary"
								/>
							}
							label={param.parameters}
						/>
					))}
				</React.Fragment>
			))}

			<h4>Health Packages</h4>
			{healthPackage.map((item) => (
				<React.Fragment key={item._id}>
					<FormControlLabel
						className={classes.checkbox}
						key={item._id}
						control={
							<Checkbox
								checked={item.testChecked}
								onChange={(event) => {
									const testIndex = healthPackage.findIndex(
										(x) => x.testName === item.testName,
									);
									const healthPackageClone = healthPackage;
									healthPackageClone[testIndex].testChecked =
										event.target.checked;
									healthPackageClone[testIndex].parameter.map((param) => {
										param.checked = event.target.checked;
									});
									healthPackageClone[testIndex].checkedAll =
										event.target.checked;
									setHealthPackage([...healthPackageClone]);
								}}
								name="testCompleted"
								color="primary"
							/>
						}
						label={item.testName}
					/>
				</React.Fragment>
			))}
			<div className={classes.payment}>
				<h4>Total Cost::{testFee}</h4>
				<FormControl className={classes.formControl}>
					<InputLabel id="demo-simple-select-label">
						Means Of Payment
					</InputLabel>
					<Select
						style={{ width: "180px" }}
						labelId="demo-simple-select-label"
						id="demo-simple-select"
						value={meansOfPayment}
						onChange={(event) => {
							setMeansOfPayment(event.target.value);
						}}
					>
						<MenuItem value="Cash">Cash</MenuItem>
						<MenuItem value="Cheque">Cheque</MenuItem>
						<MenuItem value="E-payment">E-payment</MenuItem>
					</Select>
				</FormControl>
				<div className={classes.paymentDone}>
					<TextField
						label="Payment Amount"
						value={paymentAmount}
						variant="filled"
						className={classes.items}
						onChange={(event) => {
							setPaymentAmount(event.target.value);
						}}
						type="number"
					/>
					<FormControlLabel
						className={classes.checkbox}
						control={
							<Checkbox
								checked={fullPayment}
								onChange={handleFullPayment}
								name="testCompleted"
								color="primary"
							/>
						}
						label="Full Payment"
					/>
				</div>
			</div>
			<Button
				className={classes.tableButton}
				className={classes.button}
				variant="contained"
				color="primary"
				style={{ width: "140px" }}
				onClick={handleSubmit}
			>
				Save
			</Button>

			<Button
				className={classes.tableButton}
				className={classes.button}
				variant="contained"
				color="primary"
				style={{ width: "140px" }}
				onClick={handlePaymentSubmit}
			>
				Debug
			</Button>

			<SnackBar
				messege={message}
				open={open}
				handleClose={handleClose}
				status={status}
			/>
		</div>
	);
};

export default TestRequestForm;
