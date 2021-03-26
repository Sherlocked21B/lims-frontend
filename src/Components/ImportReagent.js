import React, { useState, useRef, useEffect } from "react";
import "./myStyle.css";
import { TextField, Paper, makeStyles, Button } from "@material-ui/core";
import axios from "axios";
import axiosi from "../api";

import Autocomplete from "@material-ui/lab/Autocomplete";
import { importReagentValidator } from "../validation/validator";
import SnackBar from "./SnackBar";
const styles = makeStyles({
  paper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    height: "100%",
    width: "100%",
    margin: "30",
    padding: "5",
    backgroundColor: "#f7f7f7",
  },
  input: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
  },
  items: {
    height: "80%",
  },
  button: {
    marginTop: "2rem",
  },
  space: {
    marginTop: "2rem",
  },
});

const ImportReagent = () => {
  const classes = styles();
  let cancelToken = useRef("");
  const autoC = useRef(null);

  const [volume, setVolume] = useState(0);
  const [unit, setUnit] = useState("Select Reagent");
  const [inputValue, setInputValue] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = useState([]);
  const [value, setValue] = useState({});
  const [message, setMessage] = React.useState("");
  const [status, setStatus] = React.useState("");

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
    autoC.current
      .getElementsByClassName("MuiAutocomplete-clearIndicator")[0]
      .click();
    setUnit("Select Reagent");
    setVolume(0);
  };

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
  const handleSubmit = async () => {
    const { error } = importReagentValidator({
      reagentName: value,
      volume: volume,
    });
    if (error) {
      setMessage(error.details[0].message);
      setStatus("error");
      handleClick();
    }
    if (!error) {
      if (value.volume - volume > 0) {
        try {
          const { data } = await axiosi.put(`/reagent/import/${value._id}`, {
            volume: volume,
          });
          setMessage(data);
          setStatus("success");
          handleClick();
          handleReset();
        } catch (e) {
          setMessage(e.response);
          setStatus("error");
          handleClick();
          handleReset();
        }
      } else {
        setMessage("Maximum import volume exceeded!!!");
        setStatus("error");
        handleClick();
      }
    }
  };
  // const handleChange = (event) => {
  //     setRole(event.target.value);
  //   };
  return (
    <div>
      <React.Fragment>
        <Paper style={{ height: "100vh" }}>
          <div className={classes.paper}>
            <div className={classes.input}>
              <Autocomplete
                ref={autoC}
                id="combo-box-demo"
                getOptionLabel={(option) => option.reagentName}
                getOptionSelected={(option, value) => option._id === value._id}
                inputValue={inputValue}
                onChange={(event, newValue) => {
                  setValue(newValue);
                  if (newValue) {
                    setUnit(newValue.unit);
                  } else {
                    setUnit("Select Reagent");
                  }
                  //   if (!newValue) {
                  //     setData([]);
                  //   }
                  //   setValue(newValue);
                  //   fetchAllSample(newValue);
                }}
                onInputChange={(event, newInputValue) => {
                  setInputValue(newInputValue);
                }}
                options={options}
                style={{ width: 300 }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Reagent Name"
                    variant="outlined"
                  />
                )}
              />
              <TextField
                className={classes.space}
                id="filled-read-only-input"
                value={unit}
                label="Unit"
                defaultValue="Select Reagent"
                InputProps={{
                  readOnly: true,
                }}
                variant="outlined"
              />
              <TextField
                className={classes.space}
                value={volume}
                id="outlined-number"
                label="Volume"
                type="number"
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                onChange={(event) => setVolume(event.target.value)}
              />

              <Button
                onClick={handleSubmit}
                className={classes.button}
                variant="contained"
                color="primary"
              >
                Add
              </Button>
            </div>
          </div>
        </Paper>
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

export default ImportReagent;
