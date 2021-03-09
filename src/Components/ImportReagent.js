import React, { useState } from "react";
import "./myStyle.css";
import {
    TextField,
    Paper,
    makeStyles,
    Button,
   Select,
   MenuItem,
   InputLabel,
   FormControl
} from "@material-ui/core";
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
        justifyContent:"space-around"
    },
    items:{
     height:"80%"
    },
    button: {
        marginTop: "2rem",
    }
});


const ImportReagent = () => {
    const classes = styles();
    const [importReagent,setImportReagent] = React.useState({
        reagent:"",
        unit:"",
        vloume:""
    })

    // const handleChange = (event) => {
    //     setRole(event.target.value);
    //   };
    return (
        <div>
                   <React.Fragment>
        <Paper style={{ height: "100vh" }}>
                <div className={classes.paper}>
                    <div className={classes.input}>
                        <FormControl className={classes.formControl}>
                         <InputLabel id="demo-customized-select-label">Name Of Reagent</InputLabel>
                         <Select
                        labelId="demo-customized-select-label"
                        id="demo-customized-select"
                        // value={reagent}
                        // onChange={handleChange}
                        >
                        <MenuItem value="hcl">Hcl</MenuItem>
                        <MenuItem value="H2so4">H2SO4</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl className={classes.formControl}>
                         <InputLabel id="demo-customized-select-label">Unit Of Reagent</InputLabel>
                         <Select
                        labelId="demo-customized-select-label"
                        id="demo-customized-select"
                        // value={unit}
                        // onChange={handleChange}
                        >
                        <MenuItem value="ml">ml</MenuItem>
                        <MenuItem value="l">l</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                            name="voume"
                            label="Volume"
                            // value={voulme}
                            variant="filled"     
                        />

                        <Button
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
        </div>
    )
}
export default ImportReagent;