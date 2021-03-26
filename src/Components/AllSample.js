import React, { useState,useEffect,useRef} from "react";
import {
    TextField,
    makeStyles,
    useTheme,
    Button,
   TableContainer,
   Table,
   TableHead,
   TableRow,
   TableCell,
   TableBody,
   Chip,
   IconButton,
   TablePagination,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import SearchIcon from '@material-ui/icons/Search';
import axiosi from '../api';
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
        justifyContent:"space-between"
    },
    items:{
     flex:"1 1 1 1 auto",
     width:"20em",
    },
    button: {
        margin: "13px 12px 12px 10px",
        backgroundColor:"#27E208"
    },
    tables: {
        height: "500px",
      },
      table: {
        marginTop:"5%",
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
  { id: "sampleNo", label: "Sample Number", minWidth: 170 },
  {
    id: "customerName",
    label: "Customer Name",
  },
  { id: "testName", label: "Test Name", minWidth: 100 },
  {
    id: "created_at",
    label: "Created At",
    // minWidth: 170,
    // align: 'right',
    format: (value) => {
      return  value.substring(0, 10);
    },
  },
  {
    id: "dueDate",
    label: "Due Date",
    // minWidth: 170,
    // align: 'right',
    format: (value) => {
      return  value.substring(0, 10);
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

const AllSample = () => {
    const classes = styles();
    const [sampleFields,setSampleFields] = React.useState({
        date:"",
        sampleId:""
    });
    const [rows, setRows] = React.useState([]);
    const [total, setTotal] = React.useState(0);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const [options, setOptions] = useState([]);
    const [value, setValue] = React.useState({});
    const [inputValue, setInputValue] = React.useState("");
    const [customer,setCustomer] = React.useState({
      _id:""
    });
    let cancelToken = useRef("");

    React.useEffect(() => {
      handleFirstload();
  },[rowsPerPage]);

    React.useEffect(() => {
      if (inputValue) {
        fetchSearchResult();
      } else {
        setOptions([]);
      }
    }, [inputValue]);

  const handleFirstload = async() =>{
        try{
        const {data} = await axiosi.get("/sample/",{
          params:{page: page, limit: rowsPerPage, sampleId: sampleFields.sampleId , Customer:customer._id , Date :sampleFields.date },
        });
        setRows([...data.rows]);
        setTotal(data.total);
        console.log("data");
        }

        catch(e){
            console.log(e)
        }
    }

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

    const handleChangeInput=(input)=>(event)=>{
        setSampleFields({...sampleFields,[input]:event.target.value});
    }

    const handleSearch =async ()=>{
      console.log(customer._id);
        try{
            let {data} = await axiosi.get("/sample/",{
                params:{page: page, limit: rowsPerPage, sampleId: sampleFields.sampleId , Customer:customer._id , Date : sampleFields.date},
            });
        setRows([...data.rows]);
        setTotal(data.total);
        }
        catch(e){
            console.log(e)
        }
    }

    function TablePaginationActions (props) {
        const classes = useStyles1();
        const theme = useTheme();

        const handleBackButtonClick = (event) => {
            handleChangePage(event, page - 1);
          };

        const handleNextButtonClick = async (event) => {
            if (rows.length !== total) {
              try {
                const { data } = await axiosi.get("/sample/", {
                  params:{page: page+1, limit: rowsPerPage, sampleId: sampleFields.sampleId , Customer:customer._id, Date : sampleFields.date},
                });
                setRows([...rows,...data.rows]);
              } catch (e) {
                console.log(e);
              }
            }
            handleChangePage(event, page + 1)
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
                              option.firstName + " " + option.lastName
                            }
                            getOptionSelected={(option, value) => option.id === value.id}
                            inputValue={inputValue}
                            onChange={(event, newValue) => {
                             newValue ? setCustomer({_id:newValue._id}): setCustomer({_id:""});
                            }}
                            onInputChange={(event, newInputValue) => {
                              setInputValue(newInputValue);
                            }}
                            options={options}
                            style={{ width: 300 }}
                            renderInput={(params) => (
                              <TextField {...params} label="Customer Name" variant="outlined" />
                            )}
                          />
                        <TextField
                            name="Date"
                            value={sampleFields.date}
                            variant="filled"
                            type="date"
                            className={classes.items}
                            onChange={handleChangeInput("date")}
                        />
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
                            <SearchIcon/>
                            Search
                        </Button>
                    </div>
                    <div className={classes.table}>
                    <TableContainer className={classes.tables}>
        <Table stickyHeader aria-label="sticky table">
        <TableHead>
          <TableRow>
        {columns.map(item =>
        <TableCell
        key={item.id}
        align={item.align}
        style={{ minWidth: item.minWidth }}
        >
            {item.label}</TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
        {rows
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
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
        <TablePagination
         rowsPerPageOptions={[5,10,100]}
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
    )
};

export default AllSample ;
