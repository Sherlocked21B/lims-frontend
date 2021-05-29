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

const useStyles = makeStyles((theme) => ({
	paper: {
		padding: "1em 2em 2em 2em",
		margin: "8em 2em 2em 2em",
		// height: "95em",
	},
}));

const TestRequestForm = (props) => {
	const classes = useStyles();
	// const sampleData = props.location.state;
	const [sampleTypes, setSampleTypes] = useState([
		{ name: "Blood", checked: false },
		{ name: "Urine", checked: false },
		{ name: "Fluid", checked: false },
		{ name: "Skin Scrape", checked: false },
		{ name: "Swab", checked: false },
		{ name: "Hair pluck", checked: false },
		{ name: "Stool", checked: false },
	]);
	const [testCheckbox, setTestCheckbox] = useState([]);
	const [healthPackage, setHealthPackage] = useState([]);

	React.useEffect(() => {
		handleFirstLoad();
	}, []);

	const handleFirstLoad = async () => {
		try {
			const { data } = await axios.get("/test/getAll");
			const newTest = data.map((item) => {
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
										const testIndex = testCheckbox.findIndex(
											(x) => x.testName === item.testName,
										);
										const index = item.parameter.findIndex(
											(x) => x.parameters === param.parameters,
										);
										const testCheckboxClone = testCheckbox;
										testCheckboxClone[testIndex].parameter[index].checked =
											event.target.checked;

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
			{/* <Button
				className={classes.tableButton}
				variant="contained"
				color="primary"
				style={{ width: "100px" }}
				onClick={() => {
					console.log(testCheckbox);
				}}
			>
				Debug
			</Button> */}
		</div>
	);
};

export default TestRequestForm;
