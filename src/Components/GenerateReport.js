import React, { useState, useRef, useEffect } from 'react';
import './myStyle.css';
import { TextField, Paper, makeStyles, Button, Chip } from '@material-ui/core';
import axios from 'axios';
import axiosi from '../api';

import Autocomplete from '@material-ui/lab/Autocomplete';
import { importReagentValidator } from '../validation/validator';
import SnackBar from './SnackBar';
import MaterialTable from 'material-table';
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
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';

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
	root: {
		display: 'flex',
		marginBottom: theme.spacing(5),
		marginTop: theme.spacing(6),
		justifyContent: 'space-between',
		marginleft: theme.spacing(6),
		width: '70%',
	},
	paper: {
		padding: theme.spacing(1),
	},
	popover: {
		pointerEvents: 'none',
	},
	position: {
		// marginLeft: theme.spacing(4),
		flex: '1 1 1 auto',
		width: '80%',
		marginRight: theme.spacing(4),
	},
	buttons: {
		marginTop: theme.spacing(6),
		marginLeft: theme.spacing(120),
	},
	button: {
		margin: '5px 10px 5px 5px',
	},
	label: {
		marginLeft: theme.spacing(9),
	},
	saveButton: {
		marginLeft: '3%',
		marginTop: '5%',
		width: '200px',
		paddingLeft: '20px',
		height: '3.3em',
		background: '#28B463',
		color: 'white',
	},
}));

const columns = [
	{ title: 'Reagent Name', field: 'reagentName' },
	{ title: 'Unit', field: 'unit' },
	{ title: 'Volume', field: 'volume' },
];

const GenerateReport = (props) => {
	const classes = useStyles();
	const data = props.location.state;
	const [customerDetails, SetCustomerDetails] = React.useState({
		name: data ? data.customerName : '',
		sample: data ? data.sampleNo : '',
		sampleId: data ? data._id : '',
	});
	let cancelToken = useRef('');
	const [alltest, setAllTest] = React.useState([]);
	const [anchorEl, setAnchorEl] = React.useState(null);
	const [sampleType, setSampleType] = React.useState([]);
	const autoC = useRef(null);
	const [tests, setTests] = useState([]);
	const [volume, setVolume] = useState(0);
	const [unit, setUnit] = useState('Select Reagent');
	const [inputValue, setInputValue] = React.useState('');
	const [open, setOpen] = React.useState(false);
	const [options, setOptions] = useState([]);
	const [value, setValue] = useState({});
	const [message, setMessage] = React.useState('');
	const [status, setStatus] = React.useState('');
	const [tableData, setTableData] = React.useState([]);
	const [testrequest, setTestRequest] = useState([]);

	const handlePopoverOpen = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handlePopoverClose = () => {
		setAnchorEl(null);
	};

	const opens = Boolean(anchorEl);

	useEffect(() => {
		fetchUsedReagent();
		fetchTestName();
	}, []);

	useEffect(() => {
		if (inputValue) {
			fetchSearchResult();
		} else {
			setOptions([]);
		}
	}, [inputValue]);

	const handleSampleType = (sampletypes) => {
		let sample = [];
		sampletypes.map((item) => {
			item.checked && sample.push(item.name);
		});
		setSampleType(sample);
	};

	const handleReset = () => {
		autoC.current
			.getElementsByClassName('MuiAutocomplete-clearIndicator')[0]
			.click();
		setUnit('Select Reagent');
		setVolume(0);
	};

	const fetchTestName = async () => {
		try {
			const { data } = await axiosi.get(
				`/testRequest/find/${customerDetails.sampleId}`
			);
			handleSampleType(data[0].sampleType);
			setTestRequest(data);
			setAllTest(data[0].toTest.map((test) => test.testName));
		} catch (e) {
			console.log(e);
		}
	};

	const fetchUsedReagent = async () => {
		try {
			const usedReagents = await axiosi.get(
				`/usedReagent/find/${customerDetails.sampleId}`
			);
			setTableData([...usedReagents.data]);
			console.log(usedReagents);
		} catch (e) {
			setMessage(e.response);
			setStatus('error');
			handleClick();
		}
	};

	const fetchSearchResult = async () => {
		if (cancelToken.current) {
			cancelToken.current.cancel();
		}
		cancelToken.current = axios.CancelToken.source();
		try {
			const { data } = await axiosi.get(`/reagent/search/${inputValue}`, {
				cancelToken: cancelToken.current.token,
			});
			setOptions(data);
		} catch (e) {
			setMessage(e.response);
			setStatus('error');
			handleClick();
		}
	};

	const handleAdd = async () => {
		const { error } = importReagentValidator({
			reagentName: value,
			volume: volume,
		});
		if (error) {
			setMessage(error.details[0].message);
			setStatus('error');
			handleClick();
		}
		if (!error) {
			if (volume <= value.volume) {
				try {
					const res = await axiosi.post('/usedReagent/add', {
						reagentName: value.reagentName,
						unit: unit,
						volume: volume,
						sampleNo: customerDetails.sample,
						sampleId: customerDetails.sampleId,
						reagentId: value._id,
					});
					const respose = await axiosi.put(`/reagent/use/${value._id}`, {
						volume: volume,
					});
					setTableData([...tableData, { ...res.data.reagent }]);
					handleReset();
					setMessage('Reagent exported Sucessfully');
					setStatus('success');
					handleClick();
				} catch (e) {
					setMessage(e.response);
					setStatus('error');
					handleClick();
				}
			} else {
				setMessage('Insufficiant Volume');
				setStatus('error');
				handleClick();
			}
		}
	};

	const handleOpenReport = () => {
		props.history.push({ pathname: '/report', state: { ...data, tests } });
	};

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
		<React.Fragment>
			<div
				style={{
					padding: '1em 2em 2em 2em',
					margin: '8em 2em 2em 2em',
					// height: "100em",
				}}
				// elevation={3}
			>
				<div>
					<Chip
						label="Customer Name"
						color="primary"
						style={{ marginRight: 5 }}
					/>
					<Chip
						label={customerDetails.name}
						color="secondary"
						style={{ marginRight: '4em' }}
					/>
					<Chip label="Pet Name" color="primary" style={{ marginRight: 5 }} />
					<Chip
						label={data.petName}
						color="secondary"
						style={{ marginRight: '4em' }}
					/>
					<Chip
						label="Sample Type"
						color="primary"
						style={{ marginRight: 5 }}
					/>
					<Chip
						label={sampleType.toString()}
						color="secondary"
						style={{ marginRight: '4em' }}
					/>
					<Chip label="Sample No" color="primary" style={{ marginRight: 5 }} />
					<Chip
						label={customerDetails.sample}
						color="secondary"
						style={{ marginRight: 5 }}
					/>
				</div>
				<div style={{ marginTop: '2em' }}>
					<Chip label="Test Name" color="primary" style={{ marginRight: 5 }} />
					<Chip
						aria-owns={open ? 'mouse-over-popover' : undefined}
						aria-haspopup="true"
						onMouseEnter={handlePopoverOpen}
						onMouseLeave={handlePopoverClose}
						label={alltest.toString()}
						color="secondary"
						style={{ marginRight: '4em' }}
					/>
					<Popover
						id="mouse-over-popover"
						className={classes.popover}
						classes={{
							paper: classes.paper,
						}}
						open={opens}
						anchorEl={anchorEl}
						anchorOrigin={{
							vertical: 'bottom',
							horizontal: 'left',
						}}
						transformOrigin={{
							vertical: 'top',
							horizontal: 'left',
						}}
						onClose={handlePopoverClose}
						disableRestoreFocus
					>
						{testrequest.length > 0 &&
							testrequest[0].toTest.map((item) => {
								let testName = `${item.testName}:`;
								item.parameter.map(({ parameters, ...rest }, index) => {
									index === item.parameter.length - 1
										? (testName += `${parameters}`)
										: (testName += `${parameters}, `);
								});
								return <Typography>{testName}</Typography>;
							})}
					</Popover>
				</div>
				<div className={classes.root}>
					<Autocomplete
						ref={autoC}
						id="combo-box-demo"
						getOptionLabel={(option) => option.reagentName}
						getOptionSelected={(option, value) => option._id === value._id}
						inputValue={inputValue}
						onChange={(event, newValue) => {
							setValue(newValue);
							if (newValue) {
								setUnit(newValue.unit);
							} else {
								setUnit('Select Reagent');
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
								className={classes.postion}
								{...params}
								label="Reagent Name"
								variant="outlined"
							/>
						)}
					/>
					<TextField
						className={classes.postion}
						id="filled-read-only-input"
						value={unit}
						label="Unit"
						InputProps={{
							readOnly: true,
						}}
						variant="outlined"
					/>
					<TextField
						className={classes.postion}
						value={volume}
						id="outlined-number"
						label="Volume"
						type="number"
						InputLabelProps={{
							shrink: true,
						}}
						variant="outlined"
						onChange={(event) => setVolume(event.target.value)}
					/>
					<Button
						onClick={handleAdd}
						className={classes.button}
						variant="contained"
						color="primary"
					>
						Add
					</Button>
				</div>
				<div>
					{tableData.length ? (
						<React.Fragment>
							<MaterialTable
								showEmptyDataSourceMessage={false}
								title="Reagent Used"
								columns={columns}
								icons={tableIcons}
								data={tableData}
								options={{
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
												console.log(oldData._id);
												let { volume, reagentId } = oldData;
												const del = await axiosi.delete(
													`/usedReagent/delete/${oldData._id}`
												);
												const inc = await axiosi.put(
													`/reagent/import/${reagentId}`,
													{
														volume,
													}
												);
												const dataDelete = [...tableData];
												const index = oldData.tableData.id;
												dataDelete.splice(index, 1);
												setTableData([...dataDelete]);
												setMessage('Used Reagent Deleted Sucessfully');
												setStatus('success');
												handleClick();
												resolve();
											} catch (e) {
												setMessage(e.response);
												setStatus('error');
												handleClick();
												reject();
											}
										}),
								}}
							/>
							<Button
								variant="contained"
								color="primary"
								className={classes.saveButton}
								onClick={handleOpenReport}
							>
								Generate Report
							</Button>
						</React.Fragment>
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
			</div>
		</React.Fragment>
	);
};

export default GenerateReport;
