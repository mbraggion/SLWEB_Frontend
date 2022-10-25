import clsx from "clsx";
import PropTypes from "prop-types";
import React from "react";
import NumberFormat from "react-number-format";

import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";

function NumberFormatCustom(props) {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      style={{
        paddingLeft: '8px'
      }}
      onValueChange={(values) => onChange(values)}
      decimalScale={2}
      thousandSeparator="."
      decimalSeparator=","
      fixedDecimalScale={true}
      isNumericString
      prefix=""
      allowNegative={true}
    />
  );
}

NumberFormatCustom.propTypes = {
  inputRef: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export function AjusteInput({ ajuste, onChangeAjuste, wait }) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <TextField
        label='Ajuste'
        name='Ajuste'
        disabled={wait}
        className={clsx(classes.margin, classes.textField)}
        onChange={onChangeAjuste}
        InputProps={{
          inputComponent: NumberFormatCustom,
        }}
        variant="outlined"
        value={ajuste}
      />
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    maxWidth: '80px',
  },
  margin: {
    margin: '0px',
  },
  withoutLabel: {
    marginTop: theme.spacing(3),
  },
  textField: {
    width: "100%",
    "& #outlined-start-adornment": {
      border: "none",
      borderBottom: "none",
    },
    "& #outlined-start-adornment:focus": {
      border: "none  ",
      borderBottom: "none  ",
    },
  },
}));