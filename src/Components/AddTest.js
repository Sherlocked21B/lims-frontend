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
import {addTestValidator,addParameterValidator} from "../validation/validator";

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
    const [addParameter,setAddparameter]= React.useState({
        parameters:"",
        units:"",
        refrenceRange:""
    })
    const [parameter,setParameter] =React.useState([]);

    const handleChange = (input) => (event) => {
        setAddTest({ ...addTest, [input]: event.target.value });
      };

    const handleParameters = (input) => (event) => {
        setAddparameter({ ...addParameter, [input]: event.target.value});
      };

    const handleAdd=()=>{

     const testError = addTestValidator(addTest);
     const parameterError = addParameterValidator(addParameter);
     if (testError.error){
         console.log(testError.error.details[0].message);
     }
     if (parameterError.error){
         console.log(parameterError.error.details[0].message)
     }
    if (!testError.error && !parameterError.error){
        setParameter([
            ...parameter,addParameter
        ])
    }
    console.log(parameter);
    }

    const handleDelete=(name)=>{
        // const getIndex= parameter.indexOf(name);
       let filterdParameter = parameter.filter(item=>item.parameters !== name);
       setParameter([...filterdParameter]);
    }

    return (
        <div className={classes.body}>
            <React.Fragment> 
                <h4>Test Details</h4>
            <div className={classes.root}>
                <TextField
                    label="Test Name"
                    variant="outlined"
                    value={addTest.testName}
                    style={{ width: 80 }}
                    className={classes.position}
                    type = "string"
                    onChange={handleChange("testName")}
                />
                  <TextField
                    label="Test Amount"
                    variant="outlined"
                    value={addTest.testAmount}
                    style={{ width: 80 }}
                    className={classes.position}
                    type="number"
                    onChange={handleChange("testAmount")}
                /> 
                </div>
                <h4>Bio-Chemical Parameters</h4>
            <div className={classes.root}>
                <TextField
                    label="Parameter"
                    variant="outlined"
                    value={addParameter.parameters}
                    style={{ width: 80 }}
                    className={classes.position}
                    type = "string"
                    onChange={handleParameters("parameters")}
                />
                  <TextField
                    label="unit"
                    variant="outlined"
                    value={addParameter.units}
                    style={{ width: 80 }}
                    className={classes.position}
                    type="string"
                    onChange={handleParameters("units")}
                /> 
                  <TextField
                    label="Refrence Range"
                    variant="outlined"
                    value={addParameter.refrenceRange}
                    style={{ width: 80 }}
                    className={classes.position}
                    type="string"
                    onChange={handleParameters("refrenceRange")}
                />
                <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    onClick={handleAdd}
                >
                  Add
                </Button>
                </div>
            </React.Fragment>
        </div>
    )
}

export default AddTest;