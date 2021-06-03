import React, { useState, useEffect, useRef, forwardRef } from 'react';
import axios from 'axios';
import { TextField, makeStyles, Button } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
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
import MaterialTable from 'material-table';
import axiosi from '../api';
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

const styles = makeStyles((theme) => ({
	root: {
		marginTop: '7em',
		marginRight: '2em',
		marginLeft: '2em',
	},
	formControl: {
		minWidth: 160,
	},
	table: {
		marginLeft: '2em',
		marginTop: '2em',
		marginRight: '4em',
	},
	buttonContainer: {
		width: '85%',
		marginTop: '3em',
	},
	button: {
		float: 'right',
		width: '100px',
		marginBottom: '2em',
	},
}));

const columns = [
	{ title: 'Parameter', field: 'parameters', editable: 'never' },
	{ title: 'Unit', field: 'units', editable: 'never' },
	{ title: 'Reference Range', field: 'referenceRange' },
];

const AddReference = () => {
	const classes = styles();
	const [testName, setTestName] = useState('');
	const [categoryName, setCategoryName] = useState('');
	const [testOptions, setTestOptions] = useState([]);
	const [categoryOptions, setCategoryOptions] = useState([]);
	const [testValue, setTestValue] = useState(null);
	const [categoryValue, setCategoryValue] = useState({});
	const [animal, setAnimal] = useState('');
	const [tableFields, setTableFields] = useState([]);
	const [referenceId, setReferenceId] = useState('');
	const [message, setMessage] = React.useState('');
	const [status, setStatus] = React.useState('');
	const [open, setOpen] = React.useState(false);
	let testcancelToken = useRef('');
	let animalcancelToken = useRef('');

	useEffect(() => {
		if (testName) {
			fetchTestSearchResult();
		} else {
			setTestOptions([]);
		}
	}, [testName]);

	useEffect(() => {
		if (categoryName) {
			fetchCategorySearchResult();
		} else {
			setCategoryOptions([]);
		}
	}, [categoryName]);

	useEffect(() => {
		if (testValue && animal) {
			fetchReference();
		}
	}, [testValue, animal]);

	const fetchTestSearchResult = async () => {
		if (testcancelToken.current) {
			testcancelToken.current.cancel();
		}

		testcancelToken.current = axios.CancelToken.source();
		try {
			const { data } = await axiosi.get(`/test/search/${testName}`, {
				cancelToken: testcancelToken.current.token,
			});
			setTestOptions(data);
		} catch (e) {
			console.log(e);
		}
	};

	const fetchCategorySearchResult = async () => {
		if (animalcancelToken.current) {
			animalcancelToken.current.cancel();
		}

		animalcancelToken.current = axios.CancelToken.source();
		try {
			const { data } = await axiosi.get(`/animal/search/${categoryName}`, {
				cancelToken: animalcancelToken.current.token,
			});
			setCategoryOptions(data);
		} catch (e) {
			console.log(e);
		}
	};

	const fetchReference = async () => {
		try {
			const { data } = await axiosi.get('/reference', {
				params: {
					testName: testValue.name,
					animalName: animal,
				},
			});
			console.log(data);
			data.length ? handleFetchReference(data[0]) : ReferenceFields(testValue);
		} catch (e) {
			console.log(e);
		}
	};

	const handleFetchReference = (data) => {
		setReferenceId(data._id);
		setTableFields(data.refTable);
	};

	const handleChange = (event) => {
		setAnimal(event.target.value);
		if (!event.target.value) {
			setTableFields([]);
		}
	};

	const ReferenceFields = (newValue) => {
		console.log(newValue);
		setTableFields(
			newValue.parameter.map(({ cost, _id, ...item }) => ({
				...item,
				referenceRange: 'Set Reference Range',
			}))
		);
	};

	const handleSave = async () => {
		if (referenceId) {
			try {
				const saveReference = await axiosi.put(
					`/reference/update/${referenceId}`,
					{
						animalName: animal,
						testName: testValue.name,
						refTable: tableFields,
					}
				);
				setMessage('Report Saved successfully');
				setStatus('success');
				handleClick();
			} catch (e) {
				setMessage(e.response.message);
				setStatus('error');
				handleClick();
			}
		} else {
			try {
				const saveReference = await axiosi.post('/reference/add', {
					animalName: animal,
					testName: testValue.name,
					refTable: tableFields,
				});
				setReferenceId(saveReference.data._id);
				setMessage('Report Saved successfully');
				setStatus('success');
				handleClick();
			} catch (e) {
				setMessage(e.response.message);
				setStatus('error');
				handleClick();
			}
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
			<Grid
				container
				direction="row"
				justify="center"
				spacing={3}
				className={classes.root}
			>
				<Grid item xs={12} sm={6} md={4}>
					<Autocomplete
						id="combo-box-demo"
						inputValue={testName}
						onInputChange={(event, newInputValue) => {
							setTestName(newInputValue);
						}}
						options={testOptions}
						getOptionSelected={(option, value) => option.id === value.id}
						getOptionLabel={(option) => option.name}
						onChange={(event, newValue) => {
							if (!newValue) {
								setTableFields([]);
							}
							// newValue ? ReferenceFields(newValue) : setTableFields(newValue);
							setTestValue(newValue);
						}}
						style={{ width: 300 }}
						renderInput={(params) => (
							<TextField {...params} label="Test Name" variant="outlined" />
						)}
					/>
				</Grid>

				<Grid item xs={12} sm={6} md={4}>
					<Autocomplete
						id="combo-box-demo"
						options={categoryOptions}
						getOptionLabel={(option) => option.category}
						inputValue={categoryName}
						getOptionSelected={(option, value) => option.id === value.id}
						onInputChange={(event, newInputValue) => {
							setCategoryName(newInputValue);
						}}
						onChange={(event, newValue) => {
							if (!newValue) {
								setTableFields([]);
								setAnimal('');
							}
							setCategoryValue(newValue);
						}}
						style={{ width: 300 }}
						renderInput={(params) => (
							<TextField
								{...params}
								label="Animal Category"
								variant="outlined"
							/>
						)}
					/>
				</Grid>
				<Grid item xs={12} sm={6} md={4}>
					<FormControl className={classes.formControl}>
						<InputLabel id="demo-simple-select-label">Select Animal</InputLabel>
						<Select
							labelId="demo-simple-select-label"
							id="demo-simple-select"
							value={animal}
							onChange={handleChange}
						>
							<MenuItem value="">
								<em>None</em>
							</MenuItem>
							{categoryValue &&
								(Object.keys(categoryValue).length != 0
									? categoryValue.species.map((item) => (
											<MenuItem key={item} value={item}>
												{item}
											</MenuItem>
									  ))
									: null)}
						</Select>
					</FormControl>
				</Grid>
			</Grid>
			<div className={classes.table}>
				{tableFields.length ? (
					<>
						<MaterialTable
							showEmptyDataSourceMessage={false}
							title="Add Reference"
							columns={columns}
							icons={tableIcons}
							data={tableFields}
							options={{
								paging: false,
								search: false,
								headerStyle: { background: 'transparent' },
							}}
							components={{
								Container: (props) => <div {...props} />,

								// Cell: (props) => <div {...props} />,
							}}
							cellEditable={{
								onCellEditApproved: (
									newValue,
									oldValue,
									rowData,
									columnDef
								) => {
									return new Promise(async (resolve, reject) => {
										try {
											const copy = [...tableFields];
											copy[rowData.tableData.id][columnDef.field] = newValue;
											setTableFields([...copy]);
											resolve();
										} catch (e) {
											console.log(e);
										}
									});
								},
							}}
						/>
						<div className={classes.buttonContainer}>
							<Button
								variant="contained"
								color="primary"
								className={classes.button}
								onClick={handleSave}
							>
								Save
							</Button>
						</div>
					</>
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
		</>
	);
};

export default AddReference;
