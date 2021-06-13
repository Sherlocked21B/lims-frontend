import React from 'react';
import { TextField, makeStyles, Button, Typography } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';

const styles = makeStyles((theme) => ({
	root: {
		marginTop: '6em',
		marginRight: '8em',
		marginLeft: '8em',
	},
	header: {
		display: 'flex',
		justifyContent: 'space-between',
		marginBottom: '2em',
	},
	buttonContainer: {
		width: '85%',
		marginTop: '2em',
	},
	print: {
		width: '10em',
		float: 'right',
	},
}));

const columns = [
	{
		id: 'createdAt',
		label: 'Date',
		format: (value) => {
			return value.substring(0, 10);
		},
	},
	{ label: 'Sample No', id: 'sampleNo' },
	{ label: 'Amount', id: 'amount' },
	{
		label: 'Test Fee',
		id: 'testFee',
	},
];

export default function PrintStatement({ location }) {
	const data = location.state;
	const classes = styles();
	return (
		<div className={classes.root}>
			<h2>VDRL</h2>
			<div className={classes.header}>
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
					</TableBody>
				</Table>
			</TableContainer>
			<div className={[classes.buttonContainer, 'no-print'].join(' ')}>
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
