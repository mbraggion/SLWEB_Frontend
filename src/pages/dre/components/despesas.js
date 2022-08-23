import React from 'react';

import { makeStyles } from '@material-ui/styles'
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@material-ui/core'
import { ExpandMore as ExpandMoreIcon } from '@material-ui/icons'

import { LinhaEditavel } from './linhaEditavel'

export const Despesas = ({ Des, pRef, onChangeValue, onUpdateLine }) => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} >
          <Typography className={classes.heading}>Despesas</Typography>
        </AccordionSummary>
        <AccordionDetails className={classes.content}>
          {Des.filter(d => d.DreCod !== 34 && d.DreCod !== 30 && d.DreCod !== 35).map(d =>
            <LinhaEditavel
              key={d.DreCod}
              linha={d}
              pRef={pRef}
              onChangeValue={onChangeValue}
              onUpdateLine={onUpdateLine}
            />
          )}
          {Des.filter(d => d.DreCod === 34 || d.DreCod === 30 || d.DreCod === 35).map(d =>
            <LinhaEditavel
              linha={d}
              pRef={pRef}
              onChangeValue={onChangeValue}
              onUpdateLine={onUpdateLine}
              editavel={false}
            />
          )}
        </AccordionDetails>
      </Accordion>
    </div>
  )
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    margin: '8px',
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
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}))