import React, { useState} from "react";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper
} from "@material-ui/core";

const AllReagent = () => {
    return (
        <div>
          <Paper style={Styles.Paper} elevation="2">
             <div style={Styles.table}>
        <TableContainer style={Styles.tables}>
        <Table stickyHeader aria-label="sticky table">
        <TableHead>
          <TableRow>
            <TableCell>Reagent Name</TableCell>
            <TableCell>Unit</TableCell>
            <TableCell>Volume</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
            <TableRow>
                <TableCell>Hcl</TableCell>
                <TableCell>ml</TableCell>
                <TableCell>1000</TableCell>
            </TableRow>
            <TableRow>
                <TableCell>Hcl</TableCell>
                <TableCell>ml</TableCell>
                <TableCell>2000</TableCell>
            </TableRow>
        </TableBody>
        </Table>
        </TableContainer>
        </div>
        </Paper>
        </div>
    )
}

const Styles = {
    tables: {
        height: "380px",
      },
      table: {
        marginTop:"7%",
        // marginLeft: "3%",
      },
      Paper:{
        marginTop:"7%",
        marginLeft: "3%",
        marginRight: "3%"
      }
}

export default AllReagent;