import React, { useState } from "react";
import {
    TextField,
    Paper,
    makeStyles,
    Button,
   Select,
   MenuItem,
   InputLabel,
   FormControl,
   TableContainer,
   Table,
   TableHead,
   TableRow,
   TableCell,
   TableBody
} from "@material-ui/core";
const styles = makeStyles(theme => ({
    paper: {
        display: "flex",
        marginBottom: theme.spacing(2),
        padding: "1em 2em 2em 2em",
        margin: "6em 2em 2em 2em"
    },
    item:{
        width:"15em"
    },
    papers:{
    display:"flex",
    marginBottom: theme.spacing(3),
    marginRight: theme.spacing(5)
    },
    items: {
        marginLeft: theme.spacing(8),
        flex : "1 auto",
    },
    buttons: {
        marginTop: theme.spacing(3),
        marginLeft: theme.spacing(120)
    },
    button:{
        margin:"5px 3px 5px 5px"
    },
    tables: {
        height: "380px",
      },
      table: {
        marginTop:"7%",
        marginLeft: "3%",
      },
}));


const AddSample = () => {
    const classes = styles();
    const [addSample , setAddSample] = React.useState({
        customerName:"",
        sampleNo:"",
        dueDate:new Date(),
        collectedBy:"",
        payment:undefined,
        testName:"",
    })

    const handleChange = (input) => event => {
        setAddSample({ ...addSample, [input]: event.target.value });
    };

    return (
        <React.Fragment>
            <div className={classes.paper}>
            <FormControl className={classes.formControl}>
                        <InputLabel id="demo-controlled-open-select-label">Customer Name</InputLabel>
                        <Select
                        labelId="demo-controlled-open-select-label"
                        id="demo-controlled-open-select"
                        // value={role}
                        onChange={handleChange("customerName")}
                        className={classes.item}
                        >
                        <MenuItem value="staff">Ramesh</MenuItem>
                        <MenuItem value="inventory_manager">Rajesh</MenuItem>
                        <MenuItem value="accountant">Rojesh</MenuItem>
                        </Select>
                    </FormControl>
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
                            value={addSample.payment}
                            variant="filled"
                            className={classes.items}
                            type="number"
                            onChange={handleChange("payment")}
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
                        >
                            Add
                        </Button>
                    </div>
                    <div className={classes.table}>
        <TableContainer className={classes.tables}>
        <Table stickyHeader aria-label="sticky table">
        <TableHead>
          <TableRow>
            <TableCell>Sample No</TableCell>
            <TableCell>Due Date</TableCell>
            <TableCell>Collected By</TableCell>
            <TableCell>Payment</TableCell>
            <TableCell>Test Name</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
            <TableRow>
                <TableCell>A12B31</TableCell>
                <TableCell>2021/04/24</TableCell>
                <TableCell>Ramesh Parajuli</TableCell>
                <TableCell>700</TableCell>
                <TableCell>Blood Test</TableCell>
                <Button
                            className={classes.button}
                            variant="contained"
                            color="primary"
                        >
                            Edit
                        </Button>
                        <Button
                            className={classes.button}
                            variant="contained"
                            color="secondary"
                        >
                            Delete
                        </Button>
            </TableRow>
            <TableRow>
            <TableCell>A12B31</TableCell>
                <TableCell>2021/04/24</TableCell>
                <TableCell>Ramesh Parajuli</TableCell>
                <TableCell>700</TableCell>
                <TableCell>Blood Test</TableCell>
                <Button
                            className={classes.button}
                            variant="contained"
                            color="primary"
                        >
                            Edit
                        </Button>
                        <Button
                            className={classes.button}
                            variant="contained"
                            color="secondary"
                        >
                            Delete
                        </Button>
            </TableRow>
            <TableRow>
            <TableCell>A12B31</TableCell>
                <TableCell>2021/04/24</TableCell>
                <TableCell>Ramesh Parajuli</TableCell>
                <TableCell>700</TableCell>
                <TableCell>Blood Test</TableCell>
                <Button
                            className={classes.button}
                            variant="contained"
                            color="primary"
                        >
                            Edit
                        </Button>
                        <Button
                            className={classes.button}
                            variant="contained"
                            color="secondary"
                        >
                            Delete
                        </Button>
            </TableRow>
        </TableBody>
        </Table>
        </TableContainer>
        </div>
        </React.Fragment>
    )
}

export default AddSample;