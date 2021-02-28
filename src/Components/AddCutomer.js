import React from 'react';
import "./myStyle.css";
import {
    makeStyles,
    Select,
    InputLabel,
    Button,
    FormControl,
    TextField,
    MenuItem,
    theme,
    CircularProgress,
    Paper,
} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
    root: {
        display: "flex",
        
    },
    position: {
        marginLeft: theme.spacing(8),
        flex : "1 auto",
    },
    buttons: {
        marginTop: theme.spacing(6),
        marginLeft: theme.spacing(120)
    },
    button:{
        margin:"5px 10px 5px 5px"
    }
}));

const AddCutomer = () => {
    const classes = useStyles();
    const [addCustomer,setAddCustomer]=React.useState({
        customerName:"",
        age:"",
        gender:"",
        contactNumber:"",
        test:"",
        dueDate:"",
        sampleId:"",
        collectedBy:"",
        payment:""
    });

    return (
        <div>
           <React.Fragment>
           <Paper
                style={{
                    padding: "1em 2em 2em 2em",
                    margin: "8em 2em 2em 2em"
                }}
                elevation={3}
            >
            <h1 align="center">Customer Registration Page</h1>
           <h4>Customer Details</h4>
            <div className={classes.root}>
                <TextField
                    label="Customer Name"
                    variant="outlined"
                    // value={addCustomer.customerName}
                    style={{ width: 80 }}
                    className={classes.position}
                    type = "string"
                />
                  <TextField
                    label="Age"
                    variant="outlined"
                    // value={addCustomer.age}
                    style={{ width: 80 }}
                    className={classes.position}
                    type="number"
                />
                  <FormControl className={classes.formControl}>
                  <InputLabel htmlFor="age-native-simple">Gender</InputLabel>
                        <Select
                        labelId="demo-controlled-open-select-label"
                        id="demo-controlled-open-select"
                        // value={addCustomer.gender}
                        label="Gender"
                        className={classes.position}
                        style={{ width: 120}}
                        >
                        <MenuItem value="male">Male</MenuItem>
                        <MenuItem value="female">Female</MenuItem>
                        <MenuItem value="others">Others</MenuItem>
                        </Select>
                    </FormControl>
                <TextField
                    label="Contact Number"
                    variant="outlined"
                    // value={addCustomer.contactNumber}
                    style={{ width: 80 }}
                    className={classes.position}
                    type="number"
                />
                
            </div>
            <h4>Laboratory Details</h4>
            <div className={classes.root}>
                <TextField
                    label="Test Name"
                    variant="outlined"
                    // value={addCustomer.test}
                    style={{ width: 80 }}
                    className={classes.position}
                    type = "string"
                />
              <TextField
                    id="date"
                    label="Due_Date"
                    type="date"
                    // value={addCustomer.dueDate}
                    className={classes.position}
                    InputLabelProps={{
                    shrink: true,
                    }}
                />
                <TextField
                    label="Sample Id"
                    variant="outlined"
                    // value={addCustomer.sampleid}
                    style={{ width: 80 }}
                    className={classes.position}
                    type="string"
                />
                 <TextField
                    label="Collected By"
                    variant="outlined"
                    // value={addCustomer.collectedBy}
                    style={{ width: 80 }}
                    className={classes.position}
                    type="string"
                />
                <TextField
                    label="Payment"
                    variant="outlined"
                    // value={addCustomer.payment}
                    style={{ width: 80 }}
                    className={classes.position}
                    type="number"
                />
                
            </div>
            <div>
            <div className={classes.buttons}>
                <Button
                    variant="contained"
                    style={{ width: "200px",paddingLeft:"20px" }}
                    color="primary"
                    className={classes.button}
                >
                  Add
                </Button>
                <Button
                    variant="contained"
                    style={{ width: "200px" ,paddingRight:"20px"}}
                    color="secondary"
                    className={classes.button}
                >
                    Reset
                </Button>
            </div>
            </div>
            </Paper>
            </React.Fragment>
        </div>
    )
}

export default AddCutomer;