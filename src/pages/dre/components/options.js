import React from 'react'
import moment from 'moment'

import { InputLabel, Typography, MenuItem, Tooltip, IconButton, Select, FormControl, } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { Refresh as RefreshIcon, Save as SaveIcon } from '@material-ui/icons'

import ExcelLogo from '../../../assets/svg/EXCEL.svg';

export const Options = ({ onChange, selectedRef, refList, onReload, onSave, onDownloadExcel }) => {
  const classes = useStyles();

  return (
    <>
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
        <IconButton disabled={selectedRef === ''} onClick={() => onDownloadExcel('BASE')} aria-label="Excel">
          <img
            src={ExcelLogo}
            width='23px'
            height='23px'
            alt='Excel Icon'
          />
        </IconButton>
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
        <IconButton disabled={selectedRef === ''} onClick={() => onDownloadExcel('DRE')} aria-label="Excel" color='primary'>
          <img
            src={ExcelLogo}
            width='23px'
            height='23px'
            alt='Excel Icon'
          />
        </IconButton>
      </Tooltip>
      {/* <Tooltip
        title={
          <div
            style={{ fontSize: "14px", color: "#FFF", lineHeight: "20px" }}
          >
            <Typography color="inherit">
              Salvar alterações
            </Typography>
          </div>
        }
        placement="top"
        arrow={true}
      >
        <IconButton disabled={selectedRef === ''} onClick={onSave} aria-label="save" color='primary'>
          <SaveIcon />
        </IconButton>
      </Tooltip> */}
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
        <IconButton disabled={selectedRef === ''} onClick={() => onReload(moment(selectedRef).get('year'), moment(selectedRef).add(3, 'hours').get('month') + 1)} aria-label="refresh">
          <RefreshIcon />
        </IconButton>
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
    </>
  )
}

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));