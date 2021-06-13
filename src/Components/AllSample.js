import React, { useState, useEffect, useRef } from "react";
import {
	TextField,
	makeStyles,
	useTheme,
	Button,
	TableContainer,
	Table,
	TableRow,
	TableCell,
	TableBody,
	Chip,
	IconButton,
	TablePagination,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import SearchIcon from "@material-ui/icons/Search";
import axiosi from "../api";
import axios from "axios";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";

const styles = makeStyles({
	paper: {
		marginTop: "7%",
		marginLeft: "5%",
		marginBottom: "2%",
		marginRight: "3%",
		display: "flex",
		justifyContent: "space-between",
	},
	items: {
		flex: "1 1 1 1 auto",
		width: "20em",
		marginLeft: "10px",
	},
	button: {
		margin: "13px 12px 12px 10px",
		backgroundColor: "#27E208",
	},
	tables: {
		height: "500px",
	},
	table: {
		marginTop: "5%",
		marginLeft: "3%",
	},
});

const useStyles1 = makeStyles((theme) => ({
	root: {
		flexShrink: 0,
		marginLeft: theme.spacing(2.5),
	},
}));

const columns = [
	{ label: "Sample Number", id: "sampleNo" },
	{
		id: "customerName",
		label: "Customer Name",
	},
	{
		label: "Pet Name",
		id: "petName",
	},
	{
		id: "samplingDate",
		label: "Sampling Date",
		// minWidth: 170,
		// align: 'right',
		format: (value) => {
			return value.substring(0, 10);
		},
	},
	{ label: "Category", id: "category", editable: "never" },
	{ label: "Animal", id: "animal", editable: "never" },
	{
		label: "Sample submitted By",
		id: "sampleSubmittedBy",
		align: "right",
	},
	{ label: "Age", id: "age" },
	{ label: "Breed", id: "breed" },
	{
		label: "Gender",
		id: "gender",
	},
	{
		id: "status",
		label: "Status",
		minWidth: 100,
		format: (value) =>
			value ? (
				<Chip color="primary" label="done" />
			) : (
				<Chip color="secondary" label="pending" />
			),
	},
	{ id: "Action", label: "Report", minWidth: 100 },
	{ id: "Bill", label: "Bill", minWidth: 100 },
];

const AllSample = (props) => {
	const classes = styles();
	const [sampleFields, setSampleFields] = React.useState({
		// date: "",
		sampleId: "",
	});
	const [rows, setRows] = React.useState([]);
	const [total, setTotal] = React.useState(0);
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(5);

	const [options, setOptions] = useState([]);
	// const [value, setValue] = React.useState({});
	const [inputValue, setInputValue] = React.useState("");
	const [petInputValue, setPetInputValue] = React.useState("");
	const [customer, setCustomer] = React.useState({
		_id: "",
	});
	const [pet, setPet] = React.useState({
		petName: "",
	});
	const [petOptions, setPetOptions] = useState([]);
	let petCancelToken = useRef("");
	let cancelToken = useRef("");

	React.useEffect(() => {
		handleFirstload();
	}, [rowsPerPage]);

	React.useEffect(() => {
		if (inputValue) {
			fetchSearchResult();
		} else {
			setOptions([]);
		}
	}, [inputValue]);

	React.useEffect(() => {
		if (petInputValue) {
			fetchSearchPetResult();
		} else {
			setPetOptions([]);
		}
	}, [petInputValue]);

	const handleFirstload = async () => {
		try {
			const { data } = await axiosi.get("/sample/", {
				params: {
					page: page,
					limit: rowsPerPage,
					sampleId: sampleFields.sampleId,
					Customer: customer._id,
					Pet: pet.petName,
				},
			});
			setRows([...data.rows]);
			setTotal(data.total);
			console.log("data");
		} catch (e) {
			console.log(e);
		}
	};

	const fetchSearchResult = async () => {
		if (cancelToken.current) {
			cancelToken.current.cancel();
		}
		cancelToken.current = axios.CancelToken.source();
		try {
			const { data } = await axiosi.get(`/customer/search/${inputValue}`, {
				cancelToken: cancelToken.current.token,
			});
			console.log("search complete");
			setOptions(data);
		} catch (e) {
			console.log(e);
		}
	};

	const fetchSearchPetResult = async () => {
		if (petCancelToken.current) {
			petCancelToken.current.cancel();
		}
		petCancelToken.current = axios.CancelToken.source();
		try {
			const { data } = await axiosi.get(`/sample/search/${petInputValue}`, {
				cancelToken: petCancelToken.current.token,
			});
			console.log("search complete");
			setPetOptions(data);
		} catch (e) {
			console.log(e);
		}
	};

	const handleChangeInput = (input) => (event) => {
		setSampleFields({ ...sampleFields, [input]: event.target.value });
	};

	const handleSearch = async () => {
		try {
			let { data } = await axiosi.get("/sample/", {
				params: {
					page: 0,
					limit: rowsPerPage,
					sampleId: sampleFields.sampleId,
					Customer: customer._id,
					Pet: pet.petName,
				},
			});
			setTotal(data.total);
			setPage(0);
			setRows([...data.rows]);
		} catch (e) {
			console.log(e);
		}
	};

	const openReport = (row) => {
		props.history.push({ pathname: "/generateReport", state: row });
	};

	const openBill = (row) => {
		props.history.push({ pathname: "/generateBill", state: row });
	};

	function TablePaginationActions(props) {
		const classes = useStyles1();
		const theme = useTheme();

		const handleBackButtonClick = (event) => {
			handleChangePage(event, page - 1);
		};

		const handleNextButtonClick = async (event) => {
			if (rows.length !== total) {
				try {
					const { data } = await axiosi.get("/sample/", {
						params: {
							page: page + 1,
							limit: rowsPerPage,
							sampleId: sampleFields.sampleId,
							Customer: customer._id,
							Pet: pet.petName,
						},
					});
					setRows([...rows, ...data.rows]);
				} catch (e) {
					console.log(e);
				}
			}
			handleChangePage(event, page + 1);
		};

		return (
			<div className={classes.root}>
				<IconButton
					onClick={handleBackButtonClick}
					disabled={page === 0}
					aria-label="previous page"
				>
					{theme.direction === "rtl" ? (
						<KeyboardArrowRight />
					) : (
						<KeyboardArrowLeft />
					)}
				</IconButton>
				<IconButton
					onClick={handleNextButtonClick}
					disabled={page >= Math.ceil(total / rowsPerPage) - 1}
					aria-label="next page"
				>
					{theme.direction === "rtl" ? (
						<KeyboardArrowLeft />
					) : (
						<KeyboardArrowRight />
					)}
				</IconButton>
			</div>
		);
	}

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(event.target.value);
		setPage(0);
	};

	return (
		<React.Fragment>
			<div className={classes.paper}>
				<Autocomplete
					id="combo-box-demo"
					getOptionLabel={(option) =>
						option.firstName +
						" " +
						option.lastName +
						"(" +
						option.contactNumber +
						")"
					}
					getOptionSelected={(option, value) => option.id === value.id}
					inputValue={inputValue}
					onChange={(event, newValue) => {
						newValue
							? setCustomer({ _id: newValue._id })
							: setCustomer({ _id: "" });
					}}
					onInputChange={(event, newInputValue) => {
						setInputValue(newInputValue);
					}}
					options={options}
					style={{ width: 300 }}
					renderInput={(params) => (
						<TextField
							{...params}
							label="Customer Name"
							className={classes.items}
							variant="outlined"
						/>
					)}
				/>
				<Autocomplete
					id="combo-box-demo"
					getOptionLabel={(option) => option.petName}
					getOptionSelected={(option, value) => option.id === value.id}
					inputValue={petInputValue}
					onChange={(event, newValue) => {
						newValue
							? setPet({ petName: newValue.petName })
							: setPet({ petName: "" });
					}}
					onInputChange={(event, newInputValue) => {
						setPetInputValue(newInputValue);
					}}
					options={petOptions}
					style={{ width: 300 }}
					renderInput={(params) => (
						<TextField
							{...params}
							label="Pet Name"
							className={classes.items}
							variant="outlined"
						/>
					)}
				/>
				{/* <TextField
					name="Date"
					value={sampleFields.date}
					variant="filled"
					type="date"
					className={classes.items}
					onChange={handleChangeInput("date")}
				/> */}
				<TextField
					name="SampleId"
					label="Sample Id"
					value={sampleFields.sampleId}
					variant="filled"
					className={classes.items}
					onChange={handleChangeInput("sampleId")}
				/>
				<Button
					variant="contained"
					color="primary"
					className={classes.items}
					onClick={handleSearch}
				>
					<SearchIcon />
					Search
				</Button>
			</div>
			<div className={classes.table}>
				<TableContainer className={classes.tables}>
					<Table stickyHeader aria-label="sticky table">
						<TableRow>
							{columns.map((item) => (
								<TableCell
									key={item.id}
									align={item.align}
									style={{ minWidth: item.minWidth }}
								>
									{item.label}
								</TableCell>
							))}
						</TableRow>
						<TableBody>
							{rows
								.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
								.map((row) => {
									return (
										<TableRow hover role="checkbox" tabIndex={-1} key={row._id}>
											{columns.map((column) => {
												if (column.id != "Action" && column.id != "Bill") {
													const value = row[column.id];
													return (
														<React.Fragment>
															<TableCell key={column.id} align={column.align}>
																{column.format ? column.format(value) : value}
															</TableCell>
														</React.Fragment>
													);
												}
											})}
											<TableCell>
												<Button
													key={row._id}
													onClick={() => openReport(row)}
													variant="contained"
													color="primary"
												>
													Report
												</Button>
											</TableCell>
											<TableCell>
												<Button
													key={row._id}
													onClick={() => openBill(row)}
													variant="contained"
													color="primary"
												>
													Bill
												</Button>
											</TableCell>
										</TableRow>
									);
								})}
						</TableBody>
					</Table>
				</TableContainer>
				<TablePagination
					rowsPerPageOptions={[5, 10, 100]}
					component="div"
					count={total}
					rowsPerPage={rowsPerPage}
					page={page}
					onChangePage={handleChangePage}
					onChangeRowsPerPage={handleChangeRowsPerPage}
					ActionsComponent={TablePaginationActions}
				/>
			</div>
		</React.Fragment>
	);
};

export default AllSample;
