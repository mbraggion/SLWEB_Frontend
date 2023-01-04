import React from 'react'

import { Accordion, AccordionActions, AccordionDetails, AccordionSummary, Divider, ListItemText, makeStyles } from '@material-ui/core'
import { ExpandMore as ExpandMoreIcon } from '@material-ui/icons'

import { RaspyListHistList } from './RaspyListHistList'

export const RaspyItem = ({ Selecao, expandedSel, onExpandSel }) => {
  const classes = useStyles()

  return (
    <Accordion
      expanded={expandedSel === Selecao.Sel}
      TransitionProps={{ unmountOnExit: true }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />} onClick={() => onExpandSel(Selecao.Sel)}>
        <ListItemText
          primary={
            <>
              <strong>[{Selecao.Sel ?? '???'}]</strong> {Selecao.Produto ?? 'Desconhecido'}
            </>
          }
          secondary={
            <>
              <strong>Total: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Selecao.Vlr)}</strong> (x{Selecao.Qtd} vendas)
            </>
          }
        />
      </AccordionSummary>
      <AccordionDetails className={classes.details}>
        <RaspyListHistList Hist={Selecao.Hist} />
      </AccordionDetails>
      <Divider />
      <AccordionActions>

      </AccordionActions>
    </Accordion>
  )
}

const useStyles = makeStyles((theme) => ({
  heading: {
    fontSize: theme.typography.pxToRem(15),
  },
  details: {
    alignItems: 'center',
  },
  jusInput: {
    width: '100%',
    maxWidth: '400px',
    marginLeft: '8px',

    '&:nth-child(2) > div > input': {
      marginLeft: '8px'
    },
  },
  actionsContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',

    '& > div': {
      display: 'flex',
      flexDirection: 'row',
      width: '100%'
    }
  },

}));