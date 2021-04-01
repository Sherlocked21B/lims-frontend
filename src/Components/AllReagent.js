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
import TableHead from "@material-ui/core/TableHead";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { TextField, Chip } from "@material-ui/core";

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
  table: { marginTop: "1%" },
});

export default function AllReagent() {
  const classes = useStyles();
  const [rows, setRows] = React.useState([]);
  const [total, setTotal] = React.useState(0);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [inputValue, setInputValue] = React.useState("");
  const [value, setValue] = React.useState("");
  const [options, setOptions] = React.useState([]);
  const [columns, setColumns] = React.useState([
    { id: "reagentName", label: "Reagent Name", minWidth: 170 },
    {
      id: "unit",
      label: "Unit",
    },
    {
      id: "volume",
      label: "Volume",
      minWidth: 100,
      format: (value) => {
        return value > 20 ? (
          <Chip label={value} color="primary" style={{ marginRight: 5 }} />
        ) : (
          <Chip label={value} color="secondary" style={{ marginRight: 5 }} />
        );
      },
    },
  ]);
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

  const fetchSearchResult = async () => {
    if (cancelToken.current) {
      cancelToken.current.cancel();
    }
    cancelToken.current = axios.CancelToken.source();
    try {
      const { data } = await axiosi.get(`/reagent/search/${inputValue}`, {
        cancelToken: cancelToken.current.token,
      });
      console.log("search complete");
      setOptions(data);
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
          const { data } = await axiosi.get("/reagent", {
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
      const { data } = await axiosi.get("/reagent", {
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
    <React.Fragment>
      <div className={classes.paper}>
        <Autocomplete
          id="combo-box-demo"
          getOptionLabel={(option) => option.reagentName}
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
            setValue(newValue);
          }}
          onInputChange={(event, newInputValue) => {
            setInputValue(newInputValue);
          }}
          options={options}
          style={{ width: 300 }}
          renderInput={(params) => (
            <TextField {...params} label="Reagent Name" variant="outlined" />
          )}
        />
      </div>
      <div className={classes.table}>
        <TableContainer>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
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
            </TableHead>
            <TableBody>
              {rows.length
                ? rows
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      return (
                        <TableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={row._id}
                        >
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
                    })
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
    </React.Fragment>
  );
}
