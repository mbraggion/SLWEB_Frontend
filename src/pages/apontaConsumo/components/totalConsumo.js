import React from 'react'

import { makeStyles } from '@material-ui/core'

import { useConsumo } from '../../../hooks/useConsumo'
import { RED_PRIMARY } from '../../../misc/colors'

export const ConsumoList = () => {
  const classes = useStyles()
  const { data: { Consumo } } = useConsumo()

  return (
    <div className={classes.root}>
      <table className={classes.table}>
        <thead>
          <tr>
            <th className={classes.header}>Código</th>
            <th>Produto</th>
            <th>Un.</th>
            <th>Consumido</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(Consumo)
            ? Consumo.map(d => (
              <tr>
                <td className={classes.cell} style={{
                  padding: '1rem 2rem'
                }}>
                  {d.ProdId}
                </td>
                <td className={classes.cell} style={{ color: '#000' }}>
                  {d.Produto}
                </td>
                <td className={classes.cell}>
                  {d.GprdUn}
                </td>
                <td className={classes.cell} style={{ color: RED_PRIMARY, fontWeight: 'bold' }}>
                  {d.Con}
                </td>
              </tr>
            ))
            :
            null
          }
        </tbody>
      </table>
    </div>
  )
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    width: '50%',
    height: '100%',
    padding: '0px 1rem',
    marginLeft: '0.5%',
    background: '#FFF',
    overflowY: 'auto',
    boxShadow: "0 2px 2px 0 rgb(0 0 0 / 14%), 0 3px 1px -2px rgb(0 0 0 / 12%), 0 1px 5px 0 rgb(0 0 0 / 20%)"
  },
  table: {
    width: '100%',
    borderSpacing: '0 0.5rem'
  },
  header: {
    color: '#333',
    fontWeight: '400',
    padding: '1rem 2rem',
    textAlign: 'left',
    lineHeight: '1.5rem'
  },
  cell: {
    padding: '1rem 1rem',
    border: '0',
    background: '#fff',
    color: '#969CB3',
    borderRadius: '0.25rem'
  }
}));