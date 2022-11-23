import React, { useState } from 'react';

import { makeStyles, Typography } from '@material-ui/core';
import { PedidosDeVendaListItem } from './pedidosDeVendaListItem';

export const PedidosDeVendaList = ({ pedidos }) => {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(null)

  return (
    <div className={classes.root}>
      {pedidos.length > 0 ?
        pedidos.map(p => (
          <PedidosDeVendaListItem
          key={p.PedidoID}
            pedido={p}
            ExpandedID={expanded}
            handleChangeExpandedAccordion={setExpanded}
          />
        ))
        :
        <Typography variant='h6' align='center'>
          Nenhum pedido aguardando integração
        </Typography>
      }
    </div>
  )
}

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
    maxWidth: '1000px',
    maxHeight: 'calc(100% - 100px)',
    overflowY: 'auto',
    border: '1px solid #CCC',
    padding: '8px',
    borderRadius: '4px'
  },
}));