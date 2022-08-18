import React from 'react'

import { Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

import { RED_PRIMARY } from '../../../misc/colors'

export const LinhaFixa = ({ linha }) => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      {/* <p>{linha.DreCod}</p> */}
      <Typography
        className={classes.desc}
        variant="subtitle1"
      >
        {linha.DreDesc}
      </Typography>
      <div className={classes.valuesDiv}>
        <Typography
          className={classes.values}
          variant="subtitle1"
        >
          <strong>
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }).format(linha.DreVlr)}
          </strong>
        </Typography>
        <Typography
          className={classes.percentages}
          variant="subtitle1"
        >
          <strong style={{ color: RED_PRIMARY }}>
            {String(Number(linha.DrePorc * 100).toFixed(2)).padStart(6, ' ') + '%'}
          </strong>
        </Typography>
      </div>
    </div>
  )
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'nowrap',
    width: '100%',
    height: '25px',
    padding: '0px 16px'
  },
  valuesDiv: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'nowrap',
    height: '25px',
  },
  desc: {
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
  values: {
    padding: '0px 4px 0px 0px',
    width: '100px'
  },
  percentages: {
    padding: '0px 0px 0px 4px',
    width: '70px'
  }
}))