import React from "react";
import { TextField, makeStyles, Button, Typography } from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import main from "../assets/1stPartLogo.jpg";
import second from "../assets/2ndPartLogo.jpg";
import "./style.css";

const styles = makeStyles((theme) => ({
	root: {
		marginTop: "6em",
		marginRight: "8em",
		marginLeft: "8em",
	},
	header: {
		display: "flex",
		justifyContent: "space-between",
	},
	img: {
		height: "70px",
		width: "70px",
	},
	imgsec: {
		width: "150px",
		height: "60px",
	},
	slogan: {
		marginLeft: "70px",
	},
	right: {
		marginTop: "50px",
		color: "#000c66",
	},

	secheader: {
		display: "flex",
		justifyContent: "space-between",
		marginBottom: "2em",
		marginTop: "2em",
	},
	buttonContainer: {
		width: "85%",
		marginTop: "2em",
	},
	print: {
		width: "10em",
		float: "right",
	},
}));

const columns = [
	{
		id: "createdAt",
		label: "Date",
		format: (value) => {
			return value.substring(0, 10);
		},
	},
	{ label: "Sample No", id: "sampleNo" },
	{ label: "Amount", id: "amount" },
];

export default function PrintStatement({ location }) {
	const data = location.state;
	const classes = styles();

	const subtotal = (items) => {
		return items.map(({ amount }) => amount).reduce((sum, i) => sum + i, 0);
	};
	const total = data.data ? subtotal(data.data) : 0;
	return (
		<div className={classes.root}>
			<style>{`@media screen {.no-show{display: none;}}`}</style>
			<div className="no-show">
				<div className={classes.header}>
					<div className={classes.left}>
						<div className={classes.logo}>
							<img src={main} className={classes.img} />
							<img src={second} className={classes.imgsec} />
						</div>
						<div className="helo">
							<i>Diagnostic you can rely on</i>
						</div>
					</div>
					<div className={classes.right}>
						<Typography>
							Fifth floor,Bira Housing Complex,Tripushwor-11, Kathmandu,
							Tel:977-1-15904984
						</Typography>
						<Typography>Email:info@vdrl.com.np,www.vdrl.com.np</Typography>
					</div>
				</div>
			</div>
			<div className={classes.secheader}>
				<div>
					<Typography>
						To: {data.customer.firstName} {data.customer.lastName}
					</Typography>
					<Typography>&emsp;&ensp;{data.customer.address}</Typography>
					<Typography>&emsp;&ensp;{data.customer.contactNumber}</Typography>
				</div>
				<div>
					<Typography>
						Statement Date: {new Date().toISOString().slice(0, 10)}
					</Typography>
				</div>
			</div>
			<h4>Account Activity</h4>
			<TableContainer>
				<Table stickyHeader aria-label="sticky table">
					<TableRow>
						{columns.map((column) => (
							<TableCell
								key={column.id}
								align={column.align}
								style={{ minWidth: column.minWidth }}
							>
								{column.label}
							</TableCell>
						))}
					</TableRow>
					<TableBody>
						{data.data.map((row) => {
							return (
								<TableRow hover role="checkbox" tabIndex={-1} key={row._id}>
									{columns.map((column) => {
										const value = row[column.id];
										return (
											<TableCell key={column.id} align={column.align}>
												{column.format ? column.format(value) : value}
											</TableCell>
										);
									})}
								</TableRow>
							);
						})}
						<TableRow>
							<TableCell rowSpan={3} />
						</TableRow>
						<TableRow>
							<TableCell align="left">
								<b>Total</b>
							</TableCell>
							<TableCell align="left">{total}</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</TableContainer>
			<div className={[classes.buttonContainer, "no-print"].join(" ")}>
				<Button
					variant="contained"
					color="primary"
					className={classes.print}
					onClick={() => {
						window.print();
					}}
				>
					Print
				</Button>
			</div>
		</div>
	);
}
