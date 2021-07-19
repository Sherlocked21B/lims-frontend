import React, { useEffect } from "react";
import "./myStyle.css";
import { makeStyles, Button, Typography } from "@material-ui/core";
import axios from "../api";
import { useBarcode } from "react-barcodes";
import MaterialTable from "material-table";
import { forwardRef } from "react";
import AddBox from "@material-ui/icons/AddBox";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import Check from "@material-ui/icons/Check";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Clear from "@material-ui/icons/Clear";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import Edit from "@material-ui/icons/Edit";
import FilterList from "@material-ui/icons/FilterList";
import FirstPage from "@material-ui/icons/FirstPage";
import LastPage from "@material-ui/icons/LastPage";
import Remove from "@material-ui/icons/Remove";
import SaveAlt from "@material-ui/icons/SaveAlt";
import Search from "@material-ui/icons/Search";
import ViewColumn from "@material-ui/icons/ViewColumn";
import main from "../assets/1stPartLogo.jpg";
import second from "../assets/2ndPartLogo.jpg";
import "./style.css";
import { CSVLink, CSVDownload } from "react-csv";

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
	paper: {
		padding: "1em 2em 2em 2em",
		margin: "0em 2em 2em 2em",
		height: "95em",
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
	printButton: {
		marginLeft: "60%",
		marginTop: "5%",
		width: "200px",
		paddingLeft: "20px",
		height: "3.3em",
	},
	csv: {
		marginLeft: "2%",
		marginTop: "5%",
		width: "200px",
		paddingLeft: "20px",
		height: "3.3em",
	},
	parent: {
		display: "flex",
		justifyContent: "space-around",
		marginRight: "2em",
		marginTop: "2em",
	},
	second: {
		display: "flex",
		marginTop: "1em",
	},
	table: {
		flex: 1,
		marginLeft: "5em",
		marginRight: "3em",
	},
	barcode: {
		marginTop: "10em",
	},
	// Button: {
	// 	display: "flex",
	// 	marginRight: "10em",
	// },
	words: {
		// width: "100%",
		display: "flex",
		flexDirection: "column",
		marginTop: "2em",
		alignItems: "center",
		justifyContent: "center",
	},
}));

export default function Bill(props) {
	const classes = useStyles();
	const sampleDetails = props.location.state;
	const { inputRef } = useBarcode({
		value: sampleDetails.sampleNo,
		options: {
			width: 1,
			height: 40,
			displayValue: false,
		},
	});
	const [rows, setRows] = React.useState([]);
	const [totalCost, setTotalCost] = React.useState(0);
	const [prevPayment, setPrevPayment] = React.useState(0);
	const [columns, setColumns] = React.useState([
		{
			title: "S.No.",
			field: "sn",
			cellStyle: {
				whiteSpace: "nowrap",
			},
		},
		{
			title: "Tests",
			field: "testName",
			cellStyle: {
				whiteSpace: "nowrap",
			},
		},
		{
			title: "Rate",
			field: "testCost",
			cellStyle: {
				whiteSpace: "nowrap",
			},
		},
		{
			title: "Quantity",
			field: "quantity",
			cellStyle: {
				whiteSpace: "nowrap",
			},
		},
		{
			title: "Amount",
			field: "amount",
			cellStyle: {
				whiteSpace: "nowrap",
			},
		},
	]);

	useEffect(() => {
		handleFirstLoad();
		handlePaymentInfo();
	}, []);
	const NumInWords = (number) => {
		const first = [
			"",
			"One ",
			"Two ",
			"Three ",
			"Four ",
			"Five ",
			"Six ",
			"Seven ",
			"Eight ",
			"Nine ",
			"Ten ",
			"Eleven ",
			"Twelve ",
			"Thirteen ",
			"Fourteen ",
			"Fifteen ",
			"Sixteen ",
			"Seventeen ",
			"Eighteen ",
			"Nineteen ",
		];
		const tens = [
			"",
			"",
			"Twenty",
			"Thirty",
			"Forty",
			"Fifty",
			"Sixty",
			"Seventy",
			"Eighty",
			"Ninety",
		];
		const mad = ["", "Thousand", "Million", "Billion", "Trillion"];
		let word = "";

		for (let i = 0; i < mad.length; i++) {
			let tempNumber = number % (100 * Math.pow(1000, i));
			if (Math.floor(tempNumber / Math.pow(1000, i)) !== 0) {
				if (Math.floor(tempNumber / Math.pow(1000, i)) < 20) {
					word =
						first[Math.floor(tempNumber / Math.pow(1000, i))] +
						mad[i] +
						" " +
						word;
				} else {
					word =
						tens[Math.floor(tempNumber / (10 * Math.pow(1000, i)))] +
						"-" +
						first[Math.floor(tempNumber / Math.pow(1000, i)) % 10] +
						mad[i] +
						" " +
						word;
				}
			}

			tempNumber = number % Math.pow(1000, i + 1);
			if (Math.floor(tempNumber / (100 * Math.pow(1000, i))) !== 0)
				word =
					first[Math.floor(tempNumber / (100 * Math.pow(1000, i)))] +
					"Hundred " +
					word;
		}
		return "In Words [NPR] " + word + "Only";
	};
	const formatDate = () => {
		let date = new Date().toLocaleDateString();
		let time = "am";
		let gmtDate = new Date();
		let hours = gmtDate.getHours();
		if (hours > 12) {
			hours = hours - 12;
			time = "pm";
		}
		let minutes = gmtDate.getMinutes();
		let seconds = gmtDate.getSeconds();
		return { date, hours, minutes, seconds, time };
	};

	const { date, hours, minutes, seconds, time } = formatDate();

	const handleFirstLoad = async () => {
		try {
			const { data } = await axios.get(
				`/testRequest/find/${sampleDetails._id}`,
			);
			let sn = 0;
			let Total = 0;
			const rowInfo = data[0].toTest.map((item) => {
				let testCost = 0;
				item.parameter.map((param) => {
					testCost += param.cost;
				});
				Total = Total + testCost;
				sn++;
				return {
					sn: sn,
					quantity: 1,
					testName: item.testName,
					testCost: testCost,
					amount: testCost,
				};
			});
			console.log();

			rowInfo.push({ quantity: "Total", amount: Total });

			setRows([...rowInfo]);
			setTotalCost(Total);
		} catch (e) {
			console.log(e);
		}
	};

	const handlePaymentInfo = async () => {
		try {
			try {
				let previouslyPaid = 0;
				const res = await axios.get("/statement/sample", {
					params: { sampleNo: sampleDetails.sampleNo },
				});
				if (res.data.length > 0) {
					res.data.map((item) => {
						previouslyPaid += item.amount;
					});
				}
				setPrevPayment(previouslyPaid);
			} catch (e) {
				console.log(e);
			}
		} catch (e) {
			console.log(e);
		}
	};
	return (
		<div className={classes.paper}>
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
			<div className={classes.parent}>
				<div>
					<Typography>
						Date : {date}-{hours}:{minutes}:{seconds} {time}
					</Typography>
				</div>
				<div className={classes.center}>
					<Typography variant="h6">Receipt</Typography>
				</div>
				<div>
					<Typography>PAN NO: 609747456</Typography>
				</div>
			</div>
			<div className={classes.second}>
				<div className={classes.barcode}>
					<svg ref={inputRef} />
					<Typography>Sample Number : {sampleDetails.sampleNo}</Typography>
					<Typography>Name : {sampleDetails.customerName}</Typography>
					<Typography>Pet Name: {sampleDetails.petName}</Typography>
				</div>

				{/* TableSpace */}
				{rows.length > 0 ? (
					<div className={classes.table}>
						<MaterialTable
							showEmptyDataSourceMessage={false}
							icons={tableIcons}
							columns={columns}
							data={rows}
							options={{
								search: false,
								headerStyle: { background: "transparent" },
								paging: false,
								showTitle: false,
								tableLayout: "fixed",
								// searchAutoFocus: true
							}}
							components={{
								Container: (props) => <div {...props} />,
							}}
						/>
						<div className={classes.words}>
							{NumInWords(totalCost)}
							<br />
							<br />
							<b>**We wish your pet a good health **</b>
						</div>
						<div className="no-print">
							<div className={classes.Button}>
								<Button
									variant="contained"
									color="primary"
									className={classes.printButton}
									onClick={() => {
										window.print();
									}}
								>
									Print
								</Button>
								<Button variant="text" color="primary" className={classes.csv}>
									<CSVLink
										data={rows.map(({ tableData, ...rest }) => ({
											...rest,
										}))}
									>
										Export as Excel
									</CSVLink>
								</Button>
							</div>
						</div>
					</div>
				) : (
					<h2>Add Test Details !!!!</h2>
				)}
			</div>
		</div>
	);
}
