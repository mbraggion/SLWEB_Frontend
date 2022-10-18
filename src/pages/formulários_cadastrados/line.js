import React from 'react';

import { makeStyles, Typography } from '@material-ui/core';
import { KeyboardArrowRight as KeyboardArrowRightIcon } from '@material-ui/icons';


import moment from 'moment';
import { GREY_PRIMARY, RED_PRIMARY } from "../../misc/colors";

export const Line = ({ Form, onOpenModal }) => {
  const classes = useStyles({ finalizado: !Form.FormOpen })

  return (
    <div key={Form.Cod} className={classes.formContainer} onClick={() => onOpenModal(Form)}>
      <div className={classes.formInfoContainer}>

        <div className={classes.infoLine1}>
          <Typography><strong>Solicitante:</strong> {Form.Email}</Typography>
          <Typography><strong>Fomulário:</strong> {Form.FormName}</Typography>
        </div>

        <div className={classes.infoLine2}>
          <Typography className={classes.secondLineText}><strong>Código:</strong> {Form.Cod} |</Typography>
          <Typography className={classes.secondLineText}><strong>Status:</strong> {Form.FormOpen ? 'Em Andamento': 'Finalizado'} |</Typography>
          <Typography className={classes.secondLineText}><strong>{Form.FormOpen ? 'Solicitado': 'Finalizado'}:</strong> {Form.FormOpen ? moment(Form.FormDtRequest).format('L') : moment(Form.FormDtFulfilled).format('L')}</Typography>
        </div>

      </div>
      <KeyboardArrowRightIcon />
    </div>
  )
}

const useStyles = makeStyles((theme) => ({
  formContainer: (props) => ({
    display: "flex",
    flexDirection: 'row',
    width: '100%',
    border: `2px solid ${props.finalizado ? RED_PRIMARY : GREY_PRIMARY}`,
    color: '#000',
    background: '#FFF',
    borderRadius: '5px',
    padding: '8px 0px 8px 8px',
    transition: "background 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
    marginBottom: '8px',
    alignItems: 'center',

    '&:hover': {
      transition: "background 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
      background: props.finalizado ? RED_PRIMARY : GREY_PRIMARY,
      color: '#FFF',
      cursor: 'pointer'
    }
  }),
  formInfoContainer: (props) => ({
    display: "flex",
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    borderRight: `1px solid ${props.finalizado ? RED_PRIMARY : GREY_PRIMARY}`,
    transition: "150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",

    '&:hover': {
      transition: "150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
      borderRight: `1px solid #FFF`,
    }
  }),
  infoLine1: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: '0px 0px 8px 0px',
    padding: '0px 8px 0px 0px'
  },
  infoLine2: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  secondLineText: {
    margin: '0px 8px 0px 0px'
  }
}))