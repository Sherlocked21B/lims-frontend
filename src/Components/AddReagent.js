import React, { useState, forwardRef } from "react";
import MaterialTable from "material-table";
import { TextField, Button, CssBaseline } from "@material-ui/core";
import axios from "../api";
import { addReagentValidator } from "../validation/validator.js";
import SnackBar from "./SnackBar";
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

const columns = [
  { title: "Reagent", field: "reagentName" },
  {
    title: "Unit",
    field: "unit",
  },
  { title: "In Stock", field: "volume", type: "numeric" },
];
const AddReagent = () => {
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [status, setStatus] = React.useState("");
  const [reagent, setReagent] = React.useState({
    reagentName: "",
    unit: "",
    volume: "",
  });
  const [reset, setReset] = React.useState(Object.assign({}, reagent));
  const [query, setQuery] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [rows, setRows] = React.useState([]);

  const runSearch = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/reagent/search/${query}`);
      setRows([...data]);
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  };
  React.useEffect(() => {
    if (query) {
      runSearch();
    } else {
      setRows([]);
    }
  }, [query]);

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
    setReagent({ ...reset });
  };

  const handleChange = (input) => (event) => {
    setReagent({ ...reagent, [input]: event.target.value });
  };
  const handleSubmit = async () => {
    const { error } = addReagentValidator(reagent);
    if (error) {
      setMessage(error.details[0].message);
      setStatus("error");
      handleClick();
    }
    if (!error) {
      try {
        const res = await axios.post("/reagent/add", { ...reagent });
        if (query) {
          setRows([res.data.data]);
        } else {
          setRows([{ ...res.data.data }, ...rows]);
        }
        console.log(rows);
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
  return (
    <CssBaseline>
      <div style={Styles.inputfiled}>
        <TextField
          style={Styles.inputfileds}
          id="reagentName"
          label="Name Of Reagent"
          type="string"
          variant="outlined"
          style={Styles.inputfileds}
          value={reagent.reagentName}
          onChange={handleChange("reagentName")}
        />
        <TextField
          style={Styles.inputfileds}
          label="Unit Of Reagent"
          variant="outlined"
          value={reagent.unit}
          onChange={handleChange("unit")}
        />
        <TextField
          style={Styles.inputfileds}
          label="Volume"
          variant="outlined"
          type="number"
          value={reagent.volume}
          onChange={handleChange("volume")}
        />

        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          style={Styles.button}
        >
          Add
        </Button>
      </div>
      <div style={Styles.table}>
        <MaterialTable
          icons={tableIcons}
          title="Reagents"
          data={rows}
          columns={columns}
          onSearchChange={setQuery}
          options={{
            debounceInterval: 500,
            paging: false,
            // searchAutoFocus: true
          }}
          editable={{
            onRowUpdate: (newData, oldData) =>
              new Promise(async (resolve, reject) => {
                try {
                  let { _id, ...req } = newData;
                  const res = await axios.put(
                    `/reagent/update/${oldData._id}`,
                    req
                  );
                  const dataUpdate = [...rows];
                  const index = oldData.tableData.id;
                  dataUpdate[index] = res.data;
                  setRows([...dataUpdate]);
                  resolve();
                } catch (e) {
                  console.log(e);
                  reject();
                }
              }),
            onRowDelete: (oldData) =>
              new Promise(async (resolve, reject) => {
                try {
                  const res = await axios.delete(
                    `/reagent/delete/${oldData._id}`
                  );
                  const dataDelete = [...rows];
                  const index = oldData.tableData.id;
                  dataDelete.splice(index, 1);
                  setRows([...dataDelete]);
                  resolve();
                } catch (e) {
                  console.log(e);
                  reject();
                }
              }),
          }}
          localization={{
            toolbar: {
              searchPlaceholder: "Search Reagent",
            },
          }}
          isLoading={loading}
        />
      </div>
      <SnackBar
        messege={message}
        open={open}
        handleClose={handleClose}
        status={status}
      />
    </CssBaseline>
  );
};

const Styles = {
  inputfiled: {
    marginTop: "6%",
    marginLeft: "5%",
    display: "flex",
  },
  inputfileds: {
    marginTop: "3%",
    marginLeft: "3%",
  },
  button: {
    marginTop: "3%",
    marginLeft: "5%",
    height: 50,
  },
  tables: {
    height: "380px",
  },
  table: {
    marginTop: "5%",
    marginButton: "20%",
    marginLeft: "10%",
    marginRight: "10%",
  },
};

export default AddReagent;
