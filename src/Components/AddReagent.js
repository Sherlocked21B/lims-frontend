import React, { useState} from "react";
import {
  TextField,
  Button,
  CssBaseline,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from "@material-ui/core";

const AddReagent=()=>{
    const [reagent , setReagent] = React.useState({
        reagentName:"",
        unit:"",
        voulme:""
    })
    return(
     <CssBaseline>
      <div style={Styles.inputfiled}>
        <TextField
          style={Styles.inputfileds}
          id="reagentName"
          label="Name Of Reagent"
          type="string"
          variant="outlined"
          style={Styles.inputfileds}
        //   value={reagent.reagentName}
        />
        <TextField
          style={Styles.inputfileds}
          label="Unit Of Reagent"
          variant="outlined"
        //   value={reagent.unit}
        />
        <TextField
          style={Styles.inputfileds}
          label="Volume"
          variant="outlined"
          type="number"
        //   value={reagent.voulme}
        />

        <Button
          variant="contained"
          color="primary"
          onClick={()=>{}}
          style={Styles.button}
        >
          Add
        </Button>
        </div>
        <div style={Styles.table}>
        <TableContainer style={Styles.tables}>
        <Table stickyHeader aria-label="sticky table">
        <TableHead>
          <TableRow>
            <TableCell>Reagent Name</TableCell>
            <TableCell>Unit</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
            <TableRow>
                <TableCell>Hcl</TableCell>
                <TableCell>ml</TableCell>

        <Button
          variant="contained"
          color="secondary"
          onClick={()=>{}}
          style={Styles.button}
        >
            Delete
            </Button>
            </TableRow>
            <TableRow>
                <TableCell>Hcl</TableCell>
                <TableCell>ml</TableCell>

        <Button
          variant="contained"
          color="secondary"
          onClick={()=>{}}
          style={Styles.button}
        >
            Delete
            </Button>
            </TableRow>
        </TableBody>
        </Table>
        </TableContainer>
        </div>
    </CssBaseline>
    )
}

const Styles = {
    inputfiled: {
      marginTop: "6%",
      marginLeft: "5%",
      marginBottom: "2%",
      display: "flex",
    },
    inputfileds: {
      marginTop: "3%",
      marginLeft: "3%",
      marginBottom: "2%",
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
      marginLeft: "3%",
    },
  };

export default AddReagent;