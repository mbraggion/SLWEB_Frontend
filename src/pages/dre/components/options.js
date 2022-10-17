import moment from 'moment'
import React from 'react'

import { FormControl, IconButton, InputLabel, MenuItem, Select, Tooltip, Typography } from '@material-ui/core'
import { Refresh as RefreshIcon } from '@material-ui/icons'
import { makeStyles } from '@material-ui/styles'

import ExcelLogo from '../../../assets/svg/EXCEL.svg'

export const Options = ({ onChange, selectedRef, refList, onReload, onSave, onDownloadExcel }) => {
  const classes = useStyles();
  const mes = moment(selectedRef).add(3, 'hours').month() + 1
  const ano = moment(selectedRef).add(3, 'hours').month() === 0 ? moment(selectedRef).year() + 1 : moment(selectedRef).year()

  return (
    <div className={classes.container}>
      <Tooltip
        title={
          <div
            style={{ fontSize: "14px", color: "#FFF", lineHeight: "20px" }}
          >
            <Typography color="inherit">
              Baixar Excel da base de cálculo dos royalties
            </Typography>
          </div>
        }
        placement="top"
        arrow={true}
      >
        <span>
          <IconButton disabled={selectedRef === ''} onClick={() => onDownloadExcel('BASE')} aria-label="Excel">
            <img
              src={ExcelLogo}
              width='23px'
              height='23px'
              alt='Excel Icon'
            />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip
        title={
          <div
            style={{ fontSize: "14px", color: "#FFF", lineHeight: "20px" }}
          >
            <Typography color="inherit">
              Baixar Excel do DRE
            </Typography>
          </div>
        }
        placement="top"
        arrow={true}
      >
        <span>

          <IconButton disabled={selectedRef === ''} onClick={() => onDownloadExcel('DRE')} aria-label="Excel" color='primary'>
            <img
              src={ExcelLogo}
              width='23px'
              height='23px'
              alt='Excel Icon'
            />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip
        title={
          <div
            style={{ fontSize: "14px", color: "#FFF", lineHeight: "20px" }}
          >
            <Typography color="inherit">
              Atualizar dados
            </Typography>
          </div>
        }
        placement="top"
        arrow={true}
      >
        <span>
          <IconButton disabled={selectedRef === ''} onClick={() => onReload(ano, mes)} aria-label="refresh">
            <RefreshIcon />
          </IconButton>
        </span>
      </Tooltip>
      <FormControl variant="outlined" className={classes.formControl}>
        <InputLabel id="demo-simple-select-outlined-label">Referencia</InputLabel>
        <Select
          labelId="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined"
          value={selectedRef}
          onChange={e => onChange(e.target.value)}
          label="Referencia"
        >
          <MenuItem value="" disabled={true}>
            <em>Selecione...</em>
          </MenuItem>
          {refList.map(r => (
            <MenuItem key={r.Refdt} value={r.Refdt}>{r.RefMes}/{r.RefAno}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  )
}

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottom: '1px dashed #CCC',
    width: '100%',
    paddingBottom: '8px'
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));