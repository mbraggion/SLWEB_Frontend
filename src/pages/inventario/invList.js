import React, { useState } from 'react'

import { CircularProgress, makeStyles } from '@material-ui/core'

import { InvListItem } from './invListItem'

export const InventarioList = ({ Inventario, isFetching, isRefSelected }) => {
  const [expandedProdId, setExpandedProdId] = useState(null)
  const classes = useStyles()

  const handleExpandProd = (expandedId) => {
    console.log('chegou aqui')
    setExpandedProdId(oldState => {
      if (expandedId === oldState) {
        return null
      } else {
        return expandedId
      }
    })
  }

  const whichContentShow = () => {
    if (isFetching) {
      return (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            width: '100%'
          }}
        >
          <CircularProgress />
        </div>
      )
    } else if (isRefSelected && Inventario !== null && Array.isArray(Inventario.InvDetalhes)) {
      return (
        <section className={classes.root}>
          {Inventario.InvDetalhes.map(inv =>
            <InvListItem
              InvItem={inv}
              expandedId={expandedProdId}
              onExpandProd={handleExpandProd}
            />
          )}
        </section>
      )
    } else {
      return null
    }
  }

  return whichContentShow()
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%',
    overflowY: 'auto'
  }
}));

