import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import axiosi from '../api';
import { TextField, makeStyles, Button, Typography } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import SearchIcon from '@material-ui/icons/Search';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import CircularProgress from '@material-ui/core/CircularProgress';

import _ from 'lodash';

import SnackBar from './SnackBar';

const styles = makeStyles((theme) => ({
	root: {
		marginTop: '8em',
		marginRight: '5em',
		marginLeft: '5em',
		display: 'flex',
		justifyContent: 'space-around',
	},
	button: {
		width: '14em',
	},
	container: {
		marginTop: '4em',
		marginRight: '4em',
		marginLeft: '4em',
	},
	loading: {
		display: 'flex',
		marginTop: '2em',
		alignItems: 'center',
		justifyContent: 'center',
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

export default function Statement({ history }) {
	const classes = styles();
	const [customer, setCustomer] = useState(null);
	const [customerInputValue, setCustomerInputValue] = useState('');
	const [customerOptions, setCustomerOptions] = useState([]);
	let customerCancelToken = useRef('');
	const [searchData, setSearchData] = useState({
		petName: '',
		startDate: new Date().toISOString().slice(0, 10),
		endDate: new Date().toISOString().slice(0, 10),
	});
	const [fields, setfields] = useState([]);
	const [loading, setLoading] = useState(false);
	const [noresult, setNoResult] = useState(false);

	//for snackbar
	const [open, setOpen] = React.useState(false);
	const [message, setMessage] = React.useState('');
	const [status, setStatus] = React.useState('');

	useEffect(() => {
		customerInputValue && fetchCustomerSearchResult();
	}, [customerInputValue]);

	const fetchCustomerSearchResult = async () => {
		if (customerCancelToken.current) {
			customerCancelToken.current.cancel();
		}
		customerCancelToken.current = axios.CancelToken.source();
		try {
			const { data } = await axiosi.get(
				`/customer/search/${customerInputValue}`,
				{
					cancelToken: customerCancelToken.current.token,
				}
			);
			console.log('search complete');
			setCustomerOptions(data);
		} catch (e) {
			console.log(e);
		}
	};
	const handleChange = (input) => (event) => {
		setSearchData({ ...searchData, [input]: event.target.value });
	};

	const handleFeeSearch = _.memoize(async (sampleId) => {
		const { data } = await axiosi.get(`/testRequest/find/${sampleId}`);
		return data[0].testFee;
	});
	const handleTableFields = async (data) => {
		const result = data.map(async ({ sampleId, updatedAt, ...rest }) => {
			const cost = await handleFeeSearch(sampleId);
			return { ...rest, testFee: cost };
		});
		const field = await Promise.all(result);

		setfields(field);
		setLoading(false);
	};

	const handleSearch = async () => {
		if (!customer) {
			setMessage('Customer name is required');
			setStatus('error');
			handleClick();
			return;
		}
		try {
			setNoResult(false);
			const { data } = await axiosi.get('/statement/find', {
				params: {
					customerName: customer
						? customer.firstName + ' ' + customer.lastName
						: '',
					petName: searchData.petName,
					startDate: searchData.startDate,
					endDate: searchData.endDate,
				},
			});
			if (data.length > 0) {
				setLoading(true);
				handleTableFields(data);
			} else {
				setNoResult(true);
				setfields(data);
			}
		} catch (e) {
			console.log(e);
		}
	};

	//for snackbar
	const handleClick = () => {
		setOpen(true);
	};

	const handleClose = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}

		setOpen(false);
	};

	return (
		<>
			<div className={classes.root}>
				<Autocomplete
					id="combo-box-demo"
					getOptionLabel={(option) =>
						option.firstName +
						' ' +
						option.lastName +
						'(' +
						option.contactNumber +
						')'
					}
					getOptionSelected={(option, value) => option.id === value.id}
					inputValue={customerInputValue}
					onChange={(event, newValue) => {
						!newValue && setfields([]);
						setCustomer(newValue);
					}}
					onInputChange={(event, newInputValue) => {
						setCustomerInputValue(newInputValue);
					}}
					options={customerOptions}
					style={{ width: 300 }}
					renderInput={(params) => (
						<TextField {...params} label="Customer Name" variant="outlined" />
					)}
				/>
				<TextField
					name="pet_name"
					label="Pet Name"
					value={searchData.petName}
					variant="outlined"
					className={classes.items}
					type="string"
					onChange={handleChange('petName')}
				/>

				<TextField
					name="Start_Date"
					label="From"
					value={searchData.startDate}
					variant="outlined"
					className={classes.items}
					type="date"
					onChange={handleChange('startDate')}
				/>
				<TextField
					label="To"
					name="End_Date"
					value={searchData.endDate}
					variant="outlined"
					className={classes.items}
					type="date"
					onChange={handleChange('endDate')}
				/>
				<Button
					className={classes.button}
					variant="contained"
					color="primary"
					onClick={handleSearch}
				>
					<SearchIcon />
					Search
				</Button>
				<SnackBar
					messege={message}
					open={open}
					handleClose={handleClose}
					status={status}
				/>
			</div>
			{loading ? (
				<div className={classes.loading}>
					<CircularProgress size={50} />
				</div>
			) : noresult ? (
				<div className={classes.loading}>
					<Typography>No result found...</Typography>
				</div>
			) : fields.length > 0 ? (
				<div className={classes.container}>
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
								{fields.map((row) => {
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
					<div className={classes.buttonContainer}>
						<Button
							variant="contained"
							color="primary"
							className={classes.print}
							onClick={() =>
								history.push({
									pathname: '/printStatement',
									state: { customer: customer, data: fields },
								})
							}
						>
							Print
						</Button>
					</div>
				</div>
			) : null}
		</>
	);
}
