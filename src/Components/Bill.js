import React, { useState, useRef, useEffect } from "react";
import "./myStyle.css";
import {
	makeStyles,
	Button,
	Typography,
	TextareaAutosize,
	Checkbox,
	FormControlLabel,
	TableCell,
	TableRow,
	Table,
	TableContainer,
	TableBody,
	TableHead,
} from "@material-ui/core";
import axios from "../api";
import SnackBar from "./SnackBar";

const useStyles = makeStyles((theme) => ({
	paper: {
		padding: "1em 2em 2em 2em",
		margin: "8em 2em 2em 2em",
		height: "95em",
	},
	printButton: {
		marginLeft: "85%",
		marginTop: "5%",
		width: "200px",
		paddingLeft: "20px",
		height: "3.3em",
	},
	parent: {
		position: "relative",
		width: "100%",
		height: "100px",
	},
	Typo: {
		marginRight: "5",
		marginBottom: "5",
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

export default function Bill(props) {
	const classes = useStyles();
	const sampleDetails = props.location.state;
	const [date, setDate] = React.useState(new Date());
	const [rows, setRows] = React.useState([]);
	const [totalCost, setTotalCost] = React.useState(0);
	const [prevPayment, setPrevPayment] = React.useState(0);

	useEffect(() => {
		handleFirstLoad();
		handlePaymentInfo();
	}, []);

	const handleFirstLoad = async () => {
		try {
			const { data } = await axios.get(
				`/testRequest/find/${sampleDetails._id}`,
			);
			const rowInfo = data[0].toTest.map((item) => {
				let testCost = 0;
				item.parameter.map((param) => {
					testCost += param.cost;
				});
				return {
					testName: item.testName,
					testCost: testCost,
				};
			});
			console.log();
			setRows([...rowInfo]);
			setTotalCost(data[0].testFee);
		} catch (e) {
			console.log(e);
		}
	};

	const handlePaymentInfo = async () => {
		try {
			try {
				let previouslyPaid = 0;
				const res = await axios.get("/statement/sample", {
					params: { sampleNo: sampleDetails.sampleNo },
				});
				if (res.data.length > 0) {
					res.data.map((item) => {
						previouslyPaid += item.amount;
					});
				}
				setPrevPayment(previouslyPaid);
			} catch (e) {
				console.log(e);
			}
		} catch (e) {
			console.log(e);
		}
	};
	return (
		<div className={classes.paper}>
			<div className={classes.parent}>
				<div>
					<Typography className={classes.Typo}>
						Customer Name : {sampleDetails.customerName}
					</Typography>
					<Typography className={classes.Typo}>
						Pet Name : {sampleDetails.petName}
					</Typography>
				</div>
				<div className={classes.center}>
					<Typography className={classes.Typo}>
						Breed: {sampleDetails.breed}
					</Typography>
					<Typography className={classes.Typo}>
						Sample No: {sampleDetails.sampleNo}
					</Typography>
				</div>
				<div className={classes.last}>
					<Typography className={classes.Typo}>
						Date: {date.toLocaleDateString()}
					</Typography>
					<Typography className={classes.Typo}>
						Sampling Date:{" "}
						{new Date(sampleDetails.samplingDate).toLocaleDateString()}
					</Typography>
				</div>
			</div>

			{/* TableSpace */}
			{rows.length > 0 ? (
				<div>
					<TableContainer>
						<Table className={classes.table} aria-label="spanning table">
							<TableHead>
								<TableRow>
									<TableCell align="center">Tests</TableCell>
									<TableCell align="center">Price</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{rows.map((row) => (
									<TableRow key={row.testName}>
										{/* <TableCell>{row.desc}</TableCell> */}
										<TableCell align="center">{row.testName}</TableCell>
										<TableCell align="center">{row.testCost}</TableCell>
									</TableRow>
								))}

								<TableRow>
									<TableCell align="center">
										<b>Total</b>
									</TableCell>
									<TableCell align="center">{totalCost}</TableCell>
								</TableRow>
								<TableRow>
									<TableCell align="center">
										<b>Amount Paid</b>
									</TableCell>
									<TableCell align="center">{prevPayment}</TableCell>
								</TableRow>
								<TableRow>
									<TableCell align="center">
										<b>Due Fee</b>
									</TableCell>
									<TableCell align="center">
										{totalCost - prevPayment}
									</TableCell>
								</TableRow>
							</TableBody>
						</Table>
					</TableContainer>
					<div className="no-print">
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
					</div>
				</div>
			) : (
				<h2>Add Test Details !!!!</h2>
			)}
		</div>
	);
}
