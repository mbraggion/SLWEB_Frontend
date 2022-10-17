import moment from 'moment';
import React from 'react';

import { Accordion, AccordionDetails, Divider, ListItemText, Paper, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { capitalizeMonthFirstLetter } from '../../misc/commom_functions';


export const Consultas = (props) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Typography
        variant='h5'
        className={classes.title}
      >
        Coletas gravadas
      </Typography>
      <Paper className={classes.root}>
        <Accordion expanded>
          <section
            style={{
              height: '100%',
              overflowY: 'auto'
            }}
          >
            {props.Coletas.length === 0 ?
              <div className='XAlign'>
                <Typography>
                  Nenhuma coleta gravada
                </Typography>
              </div>
              :
              props.Coletas.map(coleta =>
                <>
                  <AccordionDetails
                    onClick={() => props.onOpenColetaDetails(coleta.AnxId, coleta.PdvId, coleta.FfmSeq, coleta)}
                    button
                    className={classes.details}
                  >
                    <ListItemText primary={coleta.Anexo} secondary={coleta.EquiCod} />
                    <div className={classes.helper}>
                      <Typography variant="body2" gutterBottom>
                        <strong>Referencia</strong>
                        <br />
                        {capitalizeMonthFirstLetter(moment(coleta.Ref).utc().format('MMMM YYYY'))}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Sequencia</strong>
                        <br />
                        {coleta.FfmSeq}
                      </Typography>
                    </div>
                  </AccordionDetails>
                  <Divider />
                </>
              )}
          </section>
        </Accordion>
      </Paper>
    </div>
  )
}

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%',
  },
  root: {
    width: '100%',
    height: '100%',
    overflowY: 'auto',

    '&:first-child> div': {
      height: '100%'
    },

    '&:first-child> div > div:last-child': {
      overflowY: 'auto',
      height: 'calc(100% - 70px)',
      minHeight: 'unset !important',

      '@media (max-width: 800px)': {
        height: 'calc(100% - 100px)',
      }
    }
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  icon: {
    verticalAlign: 'bottom',
    height: 20,
    width: 20,
  },
  details: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    '&:hover': {
      transition: "150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
      backgroundColor: "#CCC",
      cursor: "pointer",
    }
  },
  helper: {
    borderLeft: `2px solid ${theme.palette.divider}`,
    padding: theme.spacing(1, 2),
    minWidth: '160px',
  },
  link: {
    color: theme.palette.primary.main,
    textDecoration: 'none',

    '&:hover': {
      textDecoration: 'underline',
    },
  },
  title: {
    margin: '0px 0px 8px 8px'
  }
}));