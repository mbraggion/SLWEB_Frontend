import React from 'react';

import { makeStyles } from '@material-ui/styles'
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@material-ui/core'
import { ExpandMore as ExpandMoreIcon } from '@material-ui/icons'

import { LinhaFixa } from './linhaFixa'

export const Resumo = ({ Res }) => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Accordion defaultExpanded={Res.length > 0}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} >
          <Typography className={classes.heading}>Movimentações</Typography>
        </AccordionSummary>
        <AccordionDetails className={classes.content}>
          {Res.map(r => <LinhaFixa key={r.DreCod} linha={r} />)}
        </AccordionDetails>
      </Accordion>
    </div>
  )
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    margin: '8px 8px 0px 0px',
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