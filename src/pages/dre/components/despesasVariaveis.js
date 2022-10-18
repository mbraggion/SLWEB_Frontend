import React from 'react';

import { Accordion, AccordionDetails, AccordionSummary, Button, Typography } from '@material-ui/core';
import { Add as AddIcon, ExpandMore as ExpandMoreIcon } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';

import { LinhaVariavel } from './linhaVariavel';

export const DespesasVariaveis = ({ DesV, onAddNewLine, AllowAddNewLine, onChangeValue, onUpdateLine, editavel }) => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} >
          <Typography className={classes.heading}>Despesas Variáveis</Typography>
        </AccordionSummary>
        <AccordionDetails className={classes.content}>
          <div className={classes.innerContent}>
            {DesV.map(d =>
              <LinhaVariavel
                key={d.DOVCod}
                linha={d}
                onChangeValue={onChangeValue}
                onUpdateLine={onUpdateLine}
                editavel={editavel}
              />
            )}
          </div>
          <Button
            className={classes.button}
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={onAddNewLine}
            disabled={!AllowAddNewLine || !editavel}
          >
            Nova Despesa Variável
          </Button>
        </AccordionDetails>
      </Accordion>
    </div>
  )
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    margin: '8px 0px 0px 8px',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    height: '100%',
    width: '100%',
    padding: '8px 0px 8px 0px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    // margin: '8px',
    marginRight: '8px',
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerContent: {
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    width: '100%',
    padding: '8px 0px 0px 0px',
    borderRadius: '6px',
    // border: '1px solid #ccc',
    // margin: '8px 0px 0px 8px',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  button: {
    margin: '0px',
    width: '98%'
  }
}))