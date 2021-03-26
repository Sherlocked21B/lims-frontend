import React, { useState, useEffect, useRef } from "react";
import { forwardRef } from "react";
import { TextField, makeStyles, Button } from "@material-ui/core";
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
import Autocomplete from "@material-ui/lab/Autocomplete";
import axiosi from "../api";
import axios from "axios";
import MaterialTable from "material-table";
import { MTableBodyRow } from "material-table";
import Chip from "@material-ui/core/Chip";

import SnackBar from "./SnackBar";
import { addSampleValidaiton } from "../validation/validator";

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
  paper: {
    display: "flex",
    marginBottom: theme.spacing(2),
    padding: "1em 2em 2em 2em",
    margin: "6em 2em 2em 2em",
  },
  item: {
    width: "15em",
  },
  papers: {
    display: "flex",
    marginBottom: theme.spacing(3),
    marginRight: theme.spacing(5),
  },
  items: {
    marginLeft: theme.spacing(8),
    flex: "1 auto",
  },
  buttons: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(120),
  },
  button: {
    margin: "5px 3px 5px 5px",
  },
  tables: {
    height: "380px",
  },
  table: {
    marginTop: "7%",
    marginLeft: "10%",
    marginRight: "10%",
  },
}));

const AddSample = () => {
  const classes = styles();
  const [open, setOpen] = React.useState(false);

  const [message, setMessage] = React.useState("");
  const [status, setStatus] = React.useState("");
  const [columns, setColumns] = useState([
    { title: "Sample Number", field: "sampleNo" },
    {
      title: "Test Name",
      field: "testName",
    },
    { title: "Due Date", field: "dueDate", type: "date" },
    { title: "Collected By", field: "collectedBy" },
    { title: "Payment", field: "paymentStatus", type: "numeric" },
    {
      title: "status",
      field: "status",
      editable: "never",
      render: (rowData) =>
        rowData.status ? (
          <Chip color="primary" label="done" />
        ) : (
          <Chip color="secondary" label="pending" />
        ),
    },
  ]);

  const [data, setData] = useState([]);
  const [addSample, setAddSample] = React.useState({
    sampleNo: "",
    dueDate: new Date(),
    collectedBy: "",
    paymentStatus: 0,
    testName: "",
  });
  const [reset, setReset] = React.useState(Object.assign({}, addSample));
  const [options, setOptions] = useState([]);
  const [value, setValue] = React.useState({});
  const [inputValue, setInputValue] = React.useState("");
  let cancelToken = useRef("");
  useEffect(() => {
    if (inputValue) {
      fetchSearchResult();
    } else {
      setOptions([]);
    }
  }, [inputValue]);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };
  const handleReset = () => {
    setAddSample({ ...reset });
  };

  const handleSubmit = async () => {
    console.log(addSample.dueDate);
    const { error } = addSampleValidaiton(addSample);
    if (error) {
      setMessage(error.details[0].message);
      setStatus("error");
      handleClick();
    }
    if (!error) {
      try {
        const res = await axiosi.post("/sample/add", {
          ...addSample,
          customerId: value._id,
          customerName: value.firstName + " " + value.lastName,
        });
        setData([{ ...res.data.data }, ...data]);
        setMessage(res.data.message);
        setStatus("success");
        handleClick();
        handleReset();
      } catch (e) {
        console.log(e.response);
        setMessage(e.response.data);
        setStatus("error");
        handleClick();
        handleReset();
      }
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

  const fetchAllSample = async (newValue) => {
    try {
      const res = await axiosi.get(`/sample/find/${newValue._id}`);
      setData([...data, ...res.data]);
    } catch (e) {
      console.log(e);
    }
  };

  const handleChange = (input) => (event) => {
    setAddSample({ ...addSample, [input]: event.target.value });
  };

  return (
    <div>
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
              if (!newValue) {
                setData([]);
              }
              setValue(newValue);
              fetchAllSample(newValue);
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
        </div>
        <div className={classes.papers}>
          <TextField
            name="sample_no"
            label="Sample NO"
            value={addSample.sampleNo}
            variant="filled"
            className={classes.items}
            onChange={handleChange("sampleNo")}
            type="string"
          />
          <TextField
            name="Due_Date"
            value={addSample.dueDate}
            variant="filled"
            className={classes.items}
            type="date"
            onChange={handleChange("dueDate")}
          />
          <TextField
            name="Collected_By"
            label="Collected By"
            value={addSample.collectedBy}
            variant="filled"
            className={classes.items}
            type="string"
            onChange={handleChange("collectedBy")}
          />
        </div>
        <div className={classes.papers}>
          <TextField
            name="payment"
            label="Payment"
            value={addSample.paymentStatus}
            variant="filled"
            className={classes.items}
            type="number"
            onChange={handleChange("paymentStatus")}
          />
          <TextField
            name="test_name"
            label="Test Name"
            value={addSample.testName}
            variant="filled"
            className={classes.items}
            type="string"
            onChange={handleChange("testName")}
          />

          <Button
            className={classes.button}
            variant="contained"
            color="primary"
            className={classes.items}
            onClick={handleSubmit}
          >
            Add
          </Button>
        </div>
        <div className={classes.table}>
          {data.length ? (
            <MaterialTable
              showEmptyDataSourceMessage={false}
              icons={tableIcons}
              title="All tests"
              columns={columns}
              data={data}
              options={{
                search: false,
              }}
              editable={{
                onRowUpdate: (newData, oldData) =>
                  new Promise(async (resolve, reject) => {
                    try {
                      let { _id, ...req } = newData;
                      const res = await axiosi.put(
                        `/sample/update/${oldData._id}`,
                        req
                      );
                      const dataUpdate = [...data];
                      const index = oldData.tableData.id;
                      dataUpdate[index] = res.data;
                      setData([...dataUpdate]);
                      resolve();
                    } catch (e) {
                      console.log(e);
                      reject();
                    }
                  }),
                onRowDelete: (oldData) =>
                  new Promise(async (resolve, reject) => {
                    try {
                      const res = await axiosi.delete(
                        `/sample/delete/${oldData._id}`
                      );
                      const dataDelete = [...data];
                      const index = oldData.tableData.id;
                      dataDelete.splice(index, 1);
                      setData([...dataDelete]);
                      resolve();
                    } catch (e) {
                      console.log(e);
                      reject();
                    }
                  }),
              }}
            />
          ) : null}
        </div>
      </React.Fragment>
      <SnackBar
        messege={message}
        open={open}
        handleClose={handleClose}
        status={status}
      />
    </div>
  );
};

export default AddSample;
