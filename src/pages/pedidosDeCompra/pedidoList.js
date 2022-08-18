import React, { useState } from 'react'

import { makeStyles, Typography } from '@material-ui/core';

import { PedidoItem } from './pedidoItem'

export const PedidoList = ({ Pedidos, onUpdatePedido, Transportadoras }) => {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(null)

  return (
    <div className={classes.root}>
      {Pedidos.length > 0 ?
        Pedidos.map(p => (
          <PedidoItem
            key={p.PedidoID}
            Pedido={p}
            ExpandedID={expanded}
            handleChangeExpandedAccordion={setExpanded}
            onUpdatePedido={onUpdatePedido}
            Transportadoras={Transportadoras}
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