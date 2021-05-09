import React from "react";
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
import TableHead from "@material-ui/core/TableHead";
import axios from "../api";
import Chip from "@material-ui/core/Chip";
import Button from "@material-ui/core/Button";

const useStyles1 = makeStyles((theme) => ({
	root: {
		flexShrink: 0,
		marginLeft: theme.spacing(2.5),
	},
}));

const columns = [
	{ id: "sampleNo", label: "Sample Number", minWidth: 170 },
	{
		id: "customerName",
		label: "Customer Name",
	},
	{ id: "testName", label: "Test Name", minWidth: 100 },
	{
		id: "dueDate",
		label: "Due Date",
		// minWidth: 170,
		// align: 'right',
		format: (value) => {
			return value.substring(0, 10);
		},
	},
	{
		id: "paymentStatus",
		label: "Payment",
		minWidth: 170,
		// align: 'right',
		// format: (value) => value.toLocaleString('en-US'),
	},
	{
		id: "collectedBy",
		label: "Collected By",
		minWidth: 170,
		// align: 'right',
		// format: (value) => value.toFixed(2),
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
	{
		id: "action",
		label: "",
		format: () => (
			<Button variant="contained" color="primary">
				Generate Report
			</Button>
		),
		// align: 'right',
		// format: (value) => value.toFixed(2),
	},
];

const useStyles = makeStyles({
	root: {
		width: "100%",
		marginTop: "7%",
	},
	container: {
		maxHeight: 440,
	},
});

export default function PendingSample(props) {
	const classes = useStyles();
	const [rows, setRows] = React.useState([]);
	const [total, setTotal] = React.useState(0);
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(5);

	const token = localStorage.getItem("token");

	React.useEffect(() => {
		hadleFirstLoad();
	}, [rowsPerPage]);

	function TablePaginationActions(props) {
		const classes = useStyles1();
		const theme = useTheme();

		const handleBackButtonClick = (event) => {
			handleChangePage(event, page - 1);
		};

		const handleNextButtonClick = async (event) => {
			if (rows.length !== total) {
				try {
					const { data } = await axios.get("/sample/paginate", {
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

	const hadleFirstLoad = async () => {
		try {
			const { data } = await axios.get("/sample/paginate", {
				params: { page: page, limit: rowsPerPage },
			});
			setRows([...data.rows]);
			console.log(data.total);
			setTotal(data.total);
		} catch (e) {
			console.log(e);
		}
	};

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(event.target.value);
		setPage(0);
	};

	return (
		<div className={classes.root}>
			<TableContainer className={classes.container}>
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
						{rows
							.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
							.map((row) => {
								return (
									<TableRow hover role="checkbox" tabIndex={-1} key={row._id}>
										{columns.map((column) => {
											if (column.id === "action") {
												return (
													<TableCell key={column.id} align={column.align}>
														<Button
															variant="contained"
															color="primary"
															onClick={() =>
																props.history.push({
																	pathname: "/generateReport",
																	state: row,
																})
															}
														>
															Generate Report
														</Button>
													</TableCell>
												);
											} else {
												const value = row[column.id];
												return (
													<TableCell key={column.id} align={column.align}>
														{column.format ? column.format(value) : value}
													</TableCell>
												);
											}
										})}
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
	);
}
