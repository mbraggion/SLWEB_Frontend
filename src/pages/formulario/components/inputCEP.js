import PropTypes from 'prop-types';
import React from 'react';
import NumberFormat from 'react-number-format';

import {
  makeStyles, TextField
} from '@material-ui/core/';

export const InputCEP = ({ value, onChange, disabled }) => {
  const classes = useStyles()

  return (
    <TextField
    autoFocus
      label='CEP'
      value={value}
      
      variant='outlined'
      className={classes.TextInput}
      onChange={(e) => onChange(e)}
      name="CEP"
      disabled={disabled}
      InputProps={{
        inputComponent: NumberFormatCustom,
      }}
    />
  )
}

const NumberFormatCustom = (props) => {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      isNumericString
      format="##.###-###"
      mask="_"
    />
  );
}

const useStyles = makeStyles(() => ({
  TextInput: {
    width: "100%",
    maxWidth: '413px',
    '&:nth-child(1) > div > input': {
      marginLeft: '8px'
    },
  }
}))

NumberFormatCustom.propTypes = {
  inputRef: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};