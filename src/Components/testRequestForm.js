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
} from "@material-ui/core";

import axios from "../api";
import SnackBar from "./SnackBar";

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
		width: "40%",
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
	const [prevData, setPrevData] = useState([]);
	const [testCheckbox, setTestCheckbox] = useState([]);
	const [healthPackage, setHealthPackage] = useState([]);
	const [testFee, setTestFee] = useState(0);
	const [meansOfPayment, setMeansOfPayment] = React.useState("");
	const [updateVariable, setUpdateVariable] = React.useState({
		shouldUpdate: false,
		_id: "",
	});

	React.useEffect(() => {
		handleFirstLoad();
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

	const handleFirstLoad = async () => {
		try {
			let newTest = [];
			const prevTestForm = await axios.get(
				`/testRequest/find/${sampleData._id}`,
			);
			if (prevTestForm.data.length > 0) {
				newTest = prevTestForm.data[0].toTest;
				setUpdateVariable({
					shouldUpdate: true,
					_id: prevTestForm.data[0]._id,
				});
				setSampleTypes([...prevTestForm.data[0].sampleType]);
				setMeansOfPayment(prevTestForm.data[0].means);
			} else {
				const testSchema = await axios.get("/test/getAll");
				newTest = testSchema.map((item) => {
					return {
						package: item.package,
						_id: item._id,
						testName: item.name,
						testChecked: false,
						checkedAll: false,
						parameter: item.parameter.map((param) => {
							return {
								_id: param._id,
								parameters: param.parameters,
								units: param.units,
								cost: param.cost,
								checked: false,
							};
						}),
					};
				});
			}
			const HealthPackageClone = newTest.filter(
				(item) => item.package === true,
			);
			const nonHealthPackage = newTest.filter((item) => item.package !== true);
			// console.log(HealthPackageClone);
			setHealthPackage([...HealthPackageClone]);
			setTestCheckbox([...nonHealthPackage]);
		} catch (e) {
			console.log(e);
		}
	};

	const handleSubmit = async () => {
		try {
			const testRequestForm = {
				customerId: sampleData.customerId,
				customerName: sampleData.customerName,
				sampleId: sampleData._id,
				testFee: testFee,
				means: meansOfPayment,
				sampleType: sampleTypes,
				toTest: [...testCheckbox, ...healthPackage],
			};
			if (updateVariable.shouldUpdate) {
				const updateRes = await axios.put(
					`/testRequest/update/${updateVariable._id}`,
					testRequestForm,
				);
				console.log(updateRes);
			} else {
				const res = await axios.post("/testRequest/add", testRequestForm);
				console.log(res);
			}
		} catch (e) {
			console.log();
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
								// console.log(sampleTypes);
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
		</div>
	);
};

export default TestRequestForm;
