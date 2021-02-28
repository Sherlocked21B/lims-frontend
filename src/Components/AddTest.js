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
} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
    body:{
        padding: "1em 2em 2em 2em",
        margin: "4em 2em 2em 2em"
    },
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
        marginLeft: theme.spacing(6),
        width: "200px",
        paddingLeft:"20px",
        height: "3.3em"
    }
}));

const AddTest = () => {
    const classes = useStyles();
    const [addTest,setAddTest]=React.useState({
        testName:"",
        testAmount:"",
    });
    const [parameters,setParameters] =React.useState({
        parameter:[],
        unit:[],
        refrenceRange:[]
    })
    return (
        <div className={classes.body}>
            <React.Fragment> 
                <h4>Test Details</h4>
            <div className={classes.root}>
                <TextField
                    label="Test Name"
                    variant="outlined"
                    // value={addTest.testName}
                    style={{ width: 80 }}
                    className={classes.position}
                    type = "string"
                />
                  <TextField
                    label="Test Amount"
                    variant="outlined"
                    // value={addTest.testAmount}
                    style={{ width: 80 }}
                    className={classes.position}
                    type="number"
                /> 
                </div>
                <h4>Bio-Chemical Parameters</h4>
            <div className={classes.root}>
                <TextField
                    label="Parameter"
                    variant="outlined"
                    // value={parameters.parameter}
                    style={{ width: 80 }}
                    className={classes.position}
                    type = "string"
                />
                  <TextField
                    label="unit"
                    variant="outlined"
                    // value={parameters.unit}
                    style={{ width: 80 }}
                    className={classes.position}
                    type="string"
                /> 
                  <TextField
                    label="Refrence Range"
                    variant="outlined"
                    // value={parameters.refrenceRange}
                    style={{ width: 80 }}
                    className={classes.position}
                    type="string"
                />
                <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                >
                  Add
                </Button>
                </div>
            </React.Fragment>
        </div>
    )
}

export default AddTest;