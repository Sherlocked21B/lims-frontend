import React, { useState} from "react";
import {
    TextField,
    makeStyles,
    Button,
   TableContainer,
   Table,
   TableHead,
   TableRow,
   TableCell,
   TableBody
} from "@material-ui/core";
import SearchIcon from '@material-ui/icons/Search';

const styles = makeStyles({
    paper: {
        marginTop: "7%",
        marginLeft: "5%",
        marginBottom: "2%",
        display: "flex",
        justifyContent:"space-between"
    },
    items:{
     flex:"1 1 1 1 auto",
     width:"20em",
    },
    button: {
        margin: "13px 12px 12px 10px",
        backgroundColor:"#27E208"
    },
    tables: {
        height: "380px",
      },
      table: {
        marginTop:"5%",
        marginLeft: "3%",
      },
});

const AllSample = () => {
    const classes = styles();
    const [sampleFields,setSampleFields] = React.useState({
        customerName:"",
        date:"",
        sampleId:""
    })
    return (
        <React.Fragment>
                <div className={classes.paper}>
                    <TextField
                            name="CustomerName"
                            label="Customer Name"
                            // value={sampleFields.customerName}
                            variant="filled" 
                            className={classes.items}
                        />
                        <TextField
                            // type="password"
                            name="Date"
                            // value={sampleFields.date}
                            variant="filled"
                            type="date"
                            className={classes.items}
                        />
                           <TextField
                            name="SampleId"
                            label="Sample Id"
                            // value={sampleFields.sampleId}
                            variant="filled" 
                            className={classes.items}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            className={classes.items}
                        >
                            <SearchIcon/>
                            Search
                        </Button>
                    </div>
                    <div className={classes.table}>
                    <TableContainer className={classes.tables}>
        <Table stickyHeader aria-label="sticky table">
        <TableHead>
          <TableRow>
            <TableCell>Sample Id</TableCell>
            <TableCell>Test</TableCell>
            <TableCell>Customer Name</TableCell>
            <TableCell>Due Date</TableCell>
            <TableCell>Payment</TableCell>
            <TableCell>Collected By</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
            <TableRow>
                <TableCell>101</TableCell>
                <TableCell>Urine Test</TableCell>
                <TableCell>Rajesh</TableCell>
                <TableCell>2020/01/20</TableCell>
                <TableCell>1500</TableCell>
                <TableCell>Ravish</TableCell>
                <TableCell >Pending</TableCell>
                <TableCell>
                <Button
                          className={classes.button}
                            variant="contained"
                            color="black-text"
                        >
                           Generate Report
                        </Button>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell>101</TableCell>
                <TableCell>Urine Test</TableCell>
                <TableCell>Rajesh</TableCell>
                <TableCell>2020/01/20</TableCell>
                <TableCell>1500</TableCell>
                <TableCell>Ravish</TableCell>
                <TableCell >Done</TableCell>
                <TableCell>
                <Button
                        className={classes.button}
                            variant="contained"
                            color="black-text"
                        >
                           Show Info
                        </Button>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell>101</TableCell>
                <TableCell>Urine Test</TableCell>
                <TableCell>Rajesh</TableCell>
                <TableCell>2020/01/20</TableCell>
                <TableCell>1500</TableCell>
                <TableCell>Ravish</TableCell>
                <TableCell >Pending</TableCell>
                <TableCell>
                <Button
                        className={classes.button}
                            variant="contained"
                            color="black-text"
                        >
                           Generate Report
                        </Button>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell>101</TableCell>
                <TableCell>Urine Test</TableCell>
                <TableCell>Rajesh</TableCell>
                <TableCell>2020/01/20</TableCell>
                <TableCell>1500</TableCell>
                <TableCell>Ravish</TableCell>
                <TableCell >Pending</TableCell>
                <TableCell>
                <Button
                        className={classes.button}
                            variant="contained"
                            color="black-text"
                        >
                           Generate Report
                        </Button>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell>101</TableCell>
                <TableCell>Urine Test</TableCell>
                <TableCell>Rajesh</TableCell>
                <TableCell>2020/01/20</TableCell>
                <TableCell>1500</TableCell>
                <TableCell>Ravish</TableCell>
                <TableCell >Pending</TableCell>
                <TableCell>
                <Button
                        className={classes.button}
                            variant="contained"
                            color="black-text"
                        >
                           Generate Report
                        </Button>
                </TableCell>
            </TableRow>
        </TableBody>
        </Table>
        </TableContainer>
        </div>
        </React.Fragment>
    )
}

export default AllSample;
