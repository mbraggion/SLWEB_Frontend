import React from 'react';

import { makeStyles, Tooltip, Typography } from '@material-ui/core';

import { useConsumo } from '../../../hooks/useConsumo';
import { RED_PRIMARY, RED_SECONDARY } from '../../../misc/colors';

export const DosesList = () => {
  const classes = useStyles()
  const { data: { Detalhes }, actions: { onOpenReceitaModal } } = useConsumo()

  return (
    <div className={classes.root}>
      <Typography variant='h6' className={classes.tableTitle}>
        Doses
      </Typography>
      <table className={classes.table}>
        <thead>
          <tr>
            <th className={classes.header}>Sel</th>
            <th>Produto</th>
            <th>Receita</th>
            <th>Cont. inicial</th>
            <th>Cont. final</th>
            <th>Consumido</th>
            <th>Cont. teste inicial</th>
            <th>Cont. teste final</th>
            <th>Teste</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(Detalhes)
            ? Detalhes.map(d => (
              <tr>
                <td className={classes.cell} style={{ padding: '1rem 2rem' }}>
                  {d.PvpSel}
                </td>
                <Tooltip
                  title={
                    <div style={{
                      fontSize: "14px",
                      color: "#FFF",
                      lineHeight: "20px"
                    }} >
                      Código do produto: {d.ProdId}
                    </div>
                  }
                  placement="top"
                  arrow={true}
                >
                  <td className={classes.cell} style={{ color: '#000' }}>
                    {d.Produto}
                  </td>
                </Tooltip>
                <td className={classes.cell} >
                  <label className={classes.cellLink} onClick={() => onOpenReceitaModal(d.RecId)}>"{d.RecDesc}"</label>
                </td>
                <td className={classes.cell} >
                  {d.QtdI}
                </td>
                <td className={classes.cell} >
                  {d.QtdF}
                </td>
                <Tooltip
                  title={
                    <div style={{
                      fontSize: "14px",
                      color: "#FFF",
                      lineHeight: "20px",
                      whiteSpace: 'nowrap'
                    }} >
                      Contador final - Contador inicial
                    </div>
                  }
                  placement="top"
                  arrow={true}
                >
                  <td className={classes.cell} style={{ color: RED_PRIMARY, fontWeight: 'bold' }}>
                    {d.QtdF - d.QtdI}
                  </td>
                </Tooltip>
                <td className={classes.cell} >
                  {d.TstI}
                </td>
                <td className={classes.cell} >
                  {d.TstF}
                </td>
                <Tooltip
                  title={
                    <div style={{
                      fontSize: "14px",
                      color: "#FFF",
                      lineHeight: "20px",
                      whiteSpace: 'nowrap'
                    }} >
                      Contador teste final - Contador teste inicial
                    </div>
                  }
                  placement="top"
                  arrow={true}
                >
                  <td className={classes.cell} style={{ color: RED_PRIMARY, fontWeight: 'bold' }}>
                    {d.TstF - d.TstI}
                  </td>
                </Tooltip>
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
    marginRight: '0.5%',
    background: '#FFF',
    overflowY: 'auto',
    boxShadow: "0 2px 2px 0 rgb(0 0 0 / 14%), 0 3px 1px -2px rgb(0 0 0 / 12%), 0 1px 5px 0 rgb(0 0 0 / 20%)",
    alignItems: 'center',
    justifyContent: 'flex-start',

    '@media (max-width: 1080px)': {
      width: '100%',
      margin: '0px'
    }
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
  },
  cellLink: {
    color: 'blue',
    // whiteSpace: 'nowrap',
    // overflow: 'hidden',
    // textOverflow: 'ellipsis',

    '&:hover': {
      cursor: 'pointer',
      borderBottom: '1px solid blue'
    }

  },
  tableTitle: {
    width: '100%',
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: '8px',
    borderBottom: `1px dashed ${RED_SECONDARY}`,
    color: RED_SECONDARY
  }
}));