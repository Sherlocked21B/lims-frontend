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
const styles = makeStyles({
    paper: {
        marginTop: "10%",
        marginLeft: "5%",
        marginBottom: "2%",
        display: "flex",
        justifyContent:"space-between"
    },
    items:{
     flex:"1 1 1 1 auto",
     width:"20em"
    },
    button: {
        margin: "13px 12px 12px 10px",
    },
    tables: {
        height: "380px",
      },
      table: {
        marginTop:"7%",
        marginLeft: "3%",
      },
});


const Register = () => {
    const classes = styles();
    const [username, setUsername] = useState("");
    const [password , setPassword] = useState("");
    const [role , setRole] = useState("");
    const [open, setOpen] = React.useState(false);

  const handleChange = (event) => {
    setRole(event.target.value);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };
    return (
        <React.Fragment>
                <div className={classes.paper}>
                    <TextField
                            name="Username"
                            label="Username"
                            // value={username}
                            variant="filled" 
                            className={classes.items}
                        />
                        <TextField
                            // type="password"
                            name="password"
                            label="Password"
                            // value={password}
                            variant="filled"
                            className={classes.items}
                        />
                         <FormControl className={classes.formControl}>
                        <InputLabel id="demo-controlled-open-select-label">Roles</InputLabel>
                        <Select
                        labelId="demo-controlled-open-select-label"
                        id="demo-controlled-open-select"
                        open={open}
                        onClose={handleClose}
                        onOpen={handleOpen}
                        value={role}
                        onChange={handleChange}
                        className={classes.items}
                        >
                        <MenuItem value="staff">Staff</MenuItem>
                        <MenuItem value="inventory_manager">Inventory Manager</MenuItem>
                        <MenuItem value="accountant">Accountant</MenuItem>
                        </Select>
                    </FormControl>

                        <Button
                            className={classes.button}
                            variant="contained"
                            color="primary"
                            className={classes.items}
                        >
                            Register
                        </Button>
                    </div>
                    <div className={classes.table}>
        <TableContainer className={classes.tables}>
        <Table stickyHeader aria-label="sticky table">
        <TableHead>
          <TableRow>
            <TableCell>UserName</TableCell>
            <TableCell>Password</TableCell>
            <TableCell>Roles</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
            <TableRow>
                <TableCell>Ramesh</TableCell>
                <TableCell>1234</TableCell>
                <TableCell>Inventory Manager</TableCell>
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
                <TableCell>Ramesh</TableCell>
                <TableCell>1234</TableCell>
                <TableCell>Inventory Manager</TableCell>
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
                <TableCell>Ramesh</TableCell>
                <TableCell>1234</TableCell>
                <TableCell>Inventory Manager</TableCell>
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

export default Register;