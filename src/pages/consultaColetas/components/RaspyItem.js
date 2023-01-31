import React from 'react'

import { Accordion, AccordionSummary, Divider, ListItemText } from '@material-ui/core'

export const RaspyItem = ({ Selecao, expandedSel, onExpandSel }) => {
  return (
    <Accordion
      expanded={false}
      TransitionProps={{ unmountOnExit: true }}
    >
      <AccordionSummary
      // onClick={() => onExpandSel(Selecao.Sel)}
      >
        <ListItemText
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-start'
          }}
          primary={
            <>
              <strong>{Selecao.Produto ?? 'Desconhecido'}</strong>
            </>
          }
          secondary={
            <>
              Seleção [{Selecao.Sel ?? '???'}]
            </>
          }
        />
        <ListItemText
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-end'
        }}
          primary={
            <>
              <strong>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Selecao.Vlr)}</strong>
            </>
          }
          secondary={
            <>
              <strong>(x{Selecao.Qtd} vendas)</strong>
            </>
          }
        />
      </AccordionSummary>

      <Divider />

    </Accordion>
  )
}
