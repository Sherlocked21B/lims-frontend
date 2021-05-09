import React from 'react';
import './myStyle.css';
import { makeStyles, Button, TextField, Chip } from '@material-ui/core';
import { forwardRef } from 'react';
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
import MaterialTable, { MTableToolbar } from 'material-table';
import {
	addTestValidator,
	addParameterValidator,
} from '../validation/validator';
import axios from '../api';
import SnackBar from './SnackBar';

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

const useStyles = makeStyles((theme) => ({
	body: {
		padding: '1em 2em 2em 2em',
		// margin: "4em 2em 2em 2em",
		marginTop: '7%',
		marginRight: '2em',
		marginLeft: '2em',
	},
	root: {
		display: 'flex',
		marginTop: '1em',
		marginBottom: '2em',
	},
	position: {
		marginLeft: theme.spacing(8),
		flex: '1 auto',
	},
	buttons: {
		marginTop: theme.spacing(6),
		marginLeft: theme.spacing(120),
	},
	button: {
		marginLeft: theme.spacing(6),
		width: '200px',
		paddingLeft: '20px',
		height: '3.3em',
	},
	table: {
		marginTop: '7%',
		marginLeft: '10%',
		marginRight: '10%',
	},
	saveButton: {
		marginLeft: '90%',
		marginTop: '5%',
		width: '200px',
		paddingLeft: '20px',
		height: '3.3em',
		background: '#28B463',
		color: 'white',
	},
}));

const AddTest = (props) => {
	const { location } = props;
	const classes = useStyles();
	const [addTest, setAddTest] = React.useState({
		testName: location.state ? location.state.name : '',
		testAmount: location.state ? location.state.amount : '',
	});
	const [addParameter, setAddparameter] = React.useState({
		parameters: '',
		units: '',
		referenceRange: '',
	});
	const [parameter, setParameter] = React.useState(
		location.state ? location.state.parameter : []
	);

	const [columns, setColumns] = React.useState([
		{ title: 'Parameters', field: 'parameters' },
		{ title: 'Units', field: 'units' },
		{ title: 'Reference Range', field: 'referenceRange' },
	]);
	const [message, setMessage] = React.useState();
	const [status, setStatus] = React.useState();
	const [open, setOpen] = React.useState(false);

	const handleClick = () => {
		setOpen(true);
	};

	const handleClose = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}

		setOpen(false);
	};

	const handleChange = (input) => (event) => {
		setAddTest({ ...addTest, [input]: event.target.value });
	};

	const handleParameters = (input) => (event) => {
		setAddparameter({ ...addParameter, [input]: event.target.value });
	};

	const handleAdd = () => {
		const testError = addTestValidator(addTest);
		const parameterError = addParameterValidator(addParameter);
		if (testError.error) {
			setMessage(testError.error.details[0].message);
			setStatus('error');
			handleClick();
		}
		if (parameterError.error) {
			setMessage(parameterError.error.details[0].message);
			setStatus('error');
			handleClick();
		}
		if (!testError.error && !parameterError.error) {
			setParameter([...parameter, addParameter]);
			setAddparameter({ parameters: '', units: '', referenceRange: '' });
		}
	};

	const handleSave = async () => {
		try {
			const test = {
				name: addTest.testName,
				amount: addTest.testAmount,
				parameter: parameter,
			};
			if (!location.state._id) {
				props.history.push('/');
			}
			const res = await axios.put(`/test/update/${location.state._id}`, test);
			props.history.push({
				pathname: '/allTest',
				state: res.data,
			});
		} catch (e) {
			setMessage(e.Error);
			setStatus('error');
			handleClick();
			console.log(e);
		}
	};

	return (
		<div className={classes.body}>
			<React.Fragment>
				<h4>Test Details</h4>
				<div className={classes.root}>
					<TextField
						label="Test Name"
						variant="outlined"
						value={addTest.testName}
						style={{ width: 80 }}
						className={classes.position}
						type="string"
						onChange={handleChange('testName')}
					/>
					<TextField
						label="Test Amount"
						variant="outlined"
						value={addTest.testAmount}
						style={{ width: 80 }}
						className={classes.position}
						type="number"
						onChange={handleChange('testAmount')}
					/>
				</div>
				<h4>Bio-Chemical Parameters</h4>
				<div className={classes.root}>
					<TextField
						label="Parameter"
						variant="outlined"
						value={addParameter.parameters}
						style={{ width: 80 }}
						className={classes.position}
						type="string"
						onChange={handleParameters('parameters')}
					/>
					<TextField
						label="unit"
						variant="outlined"
						value={addParameter.units}
						style={{ width: 80 }}
						className={classes.position}
						type="string"
						onChange={handleParameters('units')}
					/>
					<TextField
						label="Reference Range"
						variant="outlined"
						value={addParameter.referenceRange}
						style={{ width: 80 }}
						className={classes.position}
						type="string"
						onChange={handleParameters('referenceRange')}
					/>
					<Button
						variant="contained"
						color="primary"
						className={classes.button}
						onClick={handleAdd}
					>
						Add
					</Button>
				</div>
				<div className={classes.table}>
					{parameter.length ? (
						<div>
							<MaterialTable
								showEmptyDataSourceMessage={false}
								title="Add tests"
								icons={tableIcons}
								columns={columns}
								data={parameter}
								options={{
									search: false,
									headerStyle: { background: 'transparent' },
								}}
								components={{
									Toolbar: (props) => (
										<div>
											<MTableToolbar {...props} />
											<div style={{ padding: '0px 10px' }}>
												<Chip
													label="Test Name"
													color="primary"
													style={{ marginRight: 5 }}
												/>
												<Chip
													label={addTest.testName}
													color="secondary"
													style={{ marginRight: 50 }}
												/>
												<Chip
													label="Test Amount"
													color="primary"
													style={{ marginRight: 5 }}
												/>
												<Chip
													label={addTest.testAmount}
													color="secondary"
													style={{ marginRight: 5 }}
												/>
											</div>
										</div>
									),
									Container: (props) => <div {...props} />,
								}}
								editable={{
									onRowUpdate: (newData, oldData) =>
										new Promise(async (resolve, reject) => {
											try {
												const dataUpdate = [...parameter];
												const index = oldData.tableData.id;
												dataUpdate[index] = newData;
												setParameter([...dataUpdate]);
												resolve();
											} catch (e) {
												console.log(e);
												reject();
											}
										}),
									onRowDelete: (oldData) =>
										new Promise((resolve, reject) => {
											try {
												const name = oldData.parameters;
												const filterdParameter = parameter.filter(
													(item) => item.parameters !== name
												);
												setParameter([...filterdParameter]);
												resolve();
											} catch (e) {
												console.log(e);
												reject();
											}
										}),
								}}
							/>
							<div>
								<Button
									variant="contained"
									color="primary"
									className={classes.saveButton}
									onClick={handleSave}
								>
									save
								</Button>
							</div>
						</div>
					) : null}
				</div>
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
};

export default AddTest;
