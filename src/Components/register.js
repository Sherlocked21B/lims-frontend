import React, { useState, forwardRef } from 'react';
import {
	TextField,
	Paper,
	makeStyles,
	Button,
	Select,
	MenuItem,
	InputLabel,
	FormControl,
	TableContainer,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	IconButton,
	InputAdornment,
} from '@material-ui/core';
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { registervalidation } from '../validation/validator';
import SnackBar from './SnackBar';
import axios from '../api';
import MaterialTable from 'material-table';

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

const styles = makeStyles({
	paper: {
		marginTop: '10%',
		marginRight: '5%',
		marginLeft: '5%',
		marginBottom: '2%',
		display: 'flex',
		justifyContent: 'space-between',
	},
	items: {
		flex: '1 1 1 1 auto',
		width: '20em',
	},
	button: {
		margin: '13px 50px 12px 10px',
	},
	tables: {
		height: '380px',
	},
	table: {
		marginTop: '5%',
		marginLeft: '10%',
		marginRight: '10%',
	},
	buttons: {
		marginRight: '5%',
	},
});

const Register = () => {
	const classes = styles();
	const [userName, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [role, setRole] = useState('');
	const [open, setOpen] = React.useState(false);
	const [openS, setOpenS] = React.useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [message, setMessage] = React.useState('');
	const [status, setStatus] = React.useState('');
	const [data, setData] = React.useState([]);
	const [columns, setColumns] = useState([
		{ title: 'Username', field: 'userName' },
		{
			title: 'Role',
			field: 'role',
		},
	]);
	React.useEffect(() => {
		handleLoad();
	}, []);

	const handleLoad = async () => {
		try {
			const res = await axios.get('/users');
			setData(res.data);
		} catch (e) {
			console.log(e);
		}
	};

	const handleClick = () => {
		setOpenS(true);
	};

	const handleReset = () => {
		setUsername('');
		setPassword('');
		setRole('');
	};

	const handleCloses = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}
		setOpenS(false);
	};

	const handleClickShowPassword = () => setShowPassword(!showPassword);
	const handleMouseDownPassword = () => setShowPassword(!showPassword);

	const handleSubmit = async () => {
		const { error } = registervalidation({ userName, password, role });
		if (error) {
			setMessage(error.details[0].message);
			setStatus('error');
			handleClick();
		}
		if (!error) {
			try {
				const res = await axios.post('/register', { userName, password, role });
				setData([{ ...res.data.data }, ...data]);
				setMessage(res.data.message);
				setStatus('success');
				handleClick();
				handleReset();
			} catch (e) {
				console.log(e);
				setMessage(e.response.data);
				setStatus('error');
				handleClick();
				handleReset();
			}
		}
	};

	const handleChange = (event) => {
		setRole(event.target.value);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleOpen = () => {
		setOpen(true);
	};
	return (
		<React.Fragment>
			<div className={classes.paper}>
				<TextField
					name="Username"
					label="Username"
					value={userName}
					onChange={(e) => setUsername(e.target.value)}
					variant="filled"
					className={classes.items}
				/>
				<TextField
					type={showPassword ? 'text' : 'password'}
					name="password"
					label="Password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					variant="filled"
					className={classes.items}
					InputProps={{
						endAdornment: (
							<InputAdornment position="end">
								<IconButton
									aria-label="toggle password visibility"
									onClick={handleClickShowPassword}
									onMouseDown={handleMouseDownPassword}
								>
									{showPassword ? <Visibility /> : <VisibilityOff />}
								</IconButton>
							</InputAdornment>
						),
					}}
				/>
				<FormControl className={classes.formControl}>
					<InputLabel id="demo-controlled-open-select-label">Roles</InputLabel>
					<Select
						labelId="demo-controlled-open-select-label"
						id="demo-controlled-open-select"
						open={open}
						onClose={handleClose}
						onOpen={handleOpen}
						value={role}
						onChange={handleChange}
						className={classes.items}
					>
						<MenuItem value="staff">Staff</MenuItem>
						<MenuItem value="inventory_manager">Inventory Manager</MenuItem>
						<MenuItem value="accountant">Accountant</MenuItem>
						<MenuItem value="admin">Admin</MenuItem>
					</Select>
				</FormControl>

				<Button
					className={classes.button}
					variant="contained"
					color="primary"
					className={classes.items}
					onClick={handleSubmit}
				>
					Register
				</Button>
			</div>
			<div className={classes.table}>
				{data.length ? (
					<MaterialTable
						showEmptyDataSourceMessage={false}
						icons={tableIcons}
						title="All Users"
						columns={columns}
						data={data}
						options={{
							search: false,
							headerStyle: { background: 'transparent' },
						}}
						components={{
							Container: (props) => <div {...props} />,

							// Cell: (props) => <div {...props} />,
						}}
						editable={{
							onRowDelete: (oldData) =>
								new Promise(async (resolve, reject) => {
									try {
										const res = await axios.delete(
											`/user/delete/${oldData._id}`
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
			<SnackBar
				messege={message}
				open={openS}
				handleClose={handleCloses}
				status={status}
			/>
		</React.Fragment>
	);
};

export default Register;
