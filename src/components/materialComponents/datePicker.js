import React, { useEffect, useState } from "react";
import "moment";
import MomentUtils from "@date-io/moment";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";

export default function MaterialUIPickers({ min, onChange, defaultValue, disabled, label, style }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const hoje = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0, 0, 0);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    if (min) {
      onChange(date !== null && date._d >= hoje ? date : "");
    } else {
      onChange(date !== null ? date : "");
    }
  };

  useEffect(() => {
    if (defaultValue !== null) {
      setSelectedDate(defaultValue)
    }
    // eslint-disable-next-line
  }, [defaultValue])

  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <KeyboardDatePicker
        style={{ width: "170px", ...style }}
        disabled={disabled}
        disableToolbar
        disablePast={min ? true : false}
        autoOk
        invalidDateMessage="Data inválida"
        minDateMessage={min ? "Data anteior ao dia de hoje" : 'Data não suportada'}
        minDate={min ? hoje : new Date('1900-01-01')}
        variant="inline"
        format="DD/MM/YYYY"
        margin="normal"
        id="date-picker-inline"
        label={label}
        value={selectedDate}
        onChange={handleDateChange}
        KeyboardButtonProps={{
          "aria-label": "change date",
        }}
      />
    </MuiPickersUtilsProvider>
  );
}
