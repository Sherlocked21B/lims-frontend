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
  const { row, handleClick, history } = props;

  const [open, setOpen] = React.useState(false);
  const classes = useStyles();

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
          {row.name}
        </TableCell>
        <TableCell>{row.amount}</TableCell>
        <TableCell>
          <IconButton
            onClick={() => {
              handleClick(row);
            }}
          >
            <DeleteIcon color="secondary" />
          </IconButton>
          <IconButton
            onClick={() =>
              history.push({
                pathname: "/editTest",
                state: row,
              })
            }
          >
            <EditIcon color="primary" />
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                Parameters
              </Typography>
              <Table
                size="small"
                aria-label="purchases"
                className={classes.subTable}
              >
                <TableHead>
                  <TableRow>
                    <TableCell>Parameter</TableCell>
                    <TableCell>Unit</TableCell>
                    <TableCell align="right">Reference Range</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.parameter.map((parameter) => (
                    <TableRow key={parameter._id}>
                      <TableCell component="th" scope="row">
                        {parameter.parameters}
                      </TableCell>
                      <TableCell>{parameter.units}</TableCell>
                      <TableCell align="right">
                        {parameter.referenceRange}
                      </TableCell>
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
  const [inputValue, setInputValue] = React.useState("");
  const [value, setValue] = React.useState("");
  const [options, setOptions] = React.useState([]);

  let cancelToken = useRef("");

  useEffect(() => {
    if (inputValue) {
      fetchSearchResult();
    } else {
      setOptions([]);
    }
  }, [inputValue]);

  React.useEffect(() => {
    hadleFirstLoad();
  }, [rowsPerPage]);

  const handleClick = () => {
    setOpen(true);
  };

  React.useEffect(() => {
    if (props.location && props.location.state) {
      setMessage(props.location.state);
      setStatus("success");
      handleClick();
    }
  }, []);

  const handleCloses = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const handleClickOpen = (name) => {
    setValue(name);
    setOpenD(true);
  };

  const handleClose = () => {
    setOpenD(false);
  };

  const fetchSearchResult = async () => {
    if (cancelToken.current) {
      cancelToken.current.cancel();
    }
    cancelToken.current = axios.CancelToken.source();
    try {
      const { data } = await axiosi.get(`/test/search/${inputValue}`, {
        cancelToken: cancelToken.current.token,
      });
      console.log("search complete");
      setOptions(data);
    } catch (e) {
      console.log(e);
    }
  };
  const hadleFirstLoad = async () => {
    try {
      const { data } = await axiosi.get("/test", {
        params: { page: page, limit: rowsPerPage },
      });
      setRows([...data.rows]);
      console.log(data.total);
      setTotal(data.total);
    } catch (e) {
      console.log(e);
    }
  };
  const hadleDeleteLoad = async () => {
    try {
      const { data } = await axiosi.get("/test", {
        params: { page: 0, limit: rowsPerPage },
      });
      setRows([...data.rows]);
      setTotal(data.total);
    } catch (e) {
      console.log(e);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await axiosi.delete(`/test/delete/${value._id}`);
      handleClose();
      setPage(0);
      hadleDeleteLoad();
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
        <Autocomplete
          id="combo-box-demo"
          getOptionLabel={(option) => option.name}
          getOptionSelected={(option, value) => option._id === value._id}
          inputValue={inputValue}
          onChange={(event, newValue) => {
            if (!newValue) {
              setPage(0);
              hadleFirstLoad();
              return;
            }
            setTotal(1);
            setPage(0);
            setRows([newValue]);
          }}
          onInputChange={(event, newInputValue) => {
            setInputValue(newInputValue);
          }}
          options={options}
          style={{ width: 300 }}
          renderInput={(params) => (
            <TextField {...params} label="Test Name" variant="outlined" />
          )}
        />
      </div>
      <div className={classes.table}>
        <TableContainer component={Paper}>
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>Test Name</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.length
                ? rows
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <Row
                        key={row.name}
                        row={row}
                        handleClick={handleClickOpen}
                        history={props.history}
                      />
                    ))
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
      <Dialog
        open={openD}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Are you sure you want to delete "{value.name}"?
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Disagree
          </Button>
          <Button onClick={handleDelete} color="primary" autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
      <SnackBar
        messege={message}
        open={open}
        handleClose={handleCloses}
        status={status}
      />
    </React.Fragment>
  );
}
