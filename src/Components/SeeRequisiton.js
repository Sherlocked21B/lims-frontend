import React, { useRef, useEffect } from "react";
import axiosi from "../api";
import axios from "axios";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import TableHead from "@material-ui/core/TableHead";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { TextField } from "@material-ui/core";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import Box from "@material-ui/core/Box";
import Collapse from "@material-ui/core/Collapse";
import Typography from "@material-ui/core/Typography";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import SnackBar from "./SnackBar";
import SearchIcon from "@material-ui/icons/Search";

const useStyles1 = makeStyles((theme) => ({
	root: {
		flexShrink: 0,
		marginLeft: theme.spacing(2.5),
	},

	container: {
		marginTop: "20%",
	},
}));

const useStyles = makeStyles({
	root: {
		width: "100%",
		marginTop: "7%",
	},
	container: {
		maxHeight: 440,
	},
	paper: {
		display: "flex",
		marginTop: "7%",
		marginLeft: "5%",
	},
	items: {
		flex: "1 1 1 1 auto",
		width: "20em",
		marginLeft: "4%",
	},
	table: { marginTop: "4%" },
	rowStyle: {
		"& > *": {
			borderBottom: "unset",
		},
	},
	subTable: {
		width: "30%",
	},
});
function Row(props) {
	const { row } = props;

	const [open, setOpen] = React.useState(false);
	const classes = useStyles();
	const localDate = row.created_at.slice(0, 10);

	const formatDate = (date) => {
		let time = "am";
		let gmtDate = new Date(date);
		let hours = gmtDate.getHours();
		if (hours > 12) {
			hours = hours - 12;
			time = "pm";
		}
		let minutes = gmtDate.getMinutes();
		let seconds = gmtDate.getSeconds();
		return { hours, minutes, seconds, time };
	};
	let { hours, minutes, seconds, time } = formatDate(row.createdAt);

	return (
		<React.Fragment>
			<TableRow className={classes.rowStyle}>
				<TableCell>
					<IconButton
						aria-label="expand row"
						size="small"
						onClick={() => setOpen(!open)}
					>
						{open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
					</IconButton>
				</TableCell>
				<TableCell component="th" scope="row">
					{localDate}
				</TableCell>
				<TableCell component="th" scope="row">
					{hours}:{minutes}:{seconds} {time}
				</TableCell>
			</TableRow>
			<TableRow>
				<TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
					<Collapse in={open} timeout="auto" unmountOnExit>
						<Box margin={1}>
							<Typography variant="h6" gutterBottom component="div">
								Request
							</Typography>
							<Table
								size="small"
								aria-label="purchases"
								className={classes.subTable}
							>
								<TableHead>
									<TableRow>
										<TableCell>Name</TableCell>
										<TableCell>Unit/Description</TableCell>
										<TableCell align="right">Quantity</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{row.request.map((request) => (
										<TableRow key={request._id}>
											<TableCell component="th" scope="row">
												{request.name}
											</TableCell>
											<TableCell>{request.unit}</TableCell>
											<TableCell align="right">{request.quantity}</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</Box>
					</Collapse>
				</TableCell>
			</TableRow>
		</React.Fragment>
	);
}

export default function AllTest(props) {
	const classes = useStyles();
	const [open, setOpen] = React.useState(false);
	const [message, setMessage] = React.useState();
	const [status, setStatus] = React.useState();
	const [openD, setOpenD] = React.useState(false);
	const [rows, setRows] = React.useState([]);
	const [total, setTotal] = React.useState(0);
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(5);
	const [date, setDate] = React.useState("");

	React.useEffect(() => {
		hadleFirstLoad();
	}, [rowsPerPage]);

	const handleClick = () => {
		setOpen(true);
	};

	const handleCloses = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}

		setOpen(false);
	};

	const handleClose = () => {
		setOpenD(false);
	};

	const hadleFirstLoad = async () => {
		try {
			const { data } = await axiosi.get("/requisition/", {
				params: { page: page, limit: rowsPerPage },
			});
			setRows([...data.rows]);
			console.log(data.total);
			setTotal(data.total);
		} catch (e) {
			console.log(e);
		}
	};

	const handleSearch = async () => {
		console.log(date);
		try {
			const { data } = await axiosi.get("/requisition/search/date", {
				params: {
					page: page,
					limit: rowsPerPage,
					date: date,
				},
			});
			setRows([...data.rows]);
			setTotal(data.total);
			console.log("data");
		} catch (e) {
			console.log(e);
		}
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
					const { data } = await axiosi.get("/test", {
						params: { page: page + 1, limit: rowsPerPage },
					});
					setRows([...rows, ...data.rows]);

					console.log(rows);
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
				<TextField
					name="date"
					type="date"
					// label="Date"
					value={date}
					variant="filled"
					className={classes.items}
					onChange={(e) => setDate(e.target.value)}
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
				<TableContainer>
					<Table aria-label="collapsible table">
						<TableRow>
							<TableCell />
							<TableCell>Date</TableCell>
							<TableCell>Time</TableCell>
						</TableRow>
						<TableBody>
							{rows.length
								? rows
										.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
										.map((row) => <Row key={row._id} row={row} />)
								: null}
						</TableBody>
					</Table>
				</TableContainer>
			</div>
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
			<SnackBar
				messege={message}
				open={open}
				handleClose={handleCloses}
				status={status}
			/>
		</React.Fragment>
	);
}
