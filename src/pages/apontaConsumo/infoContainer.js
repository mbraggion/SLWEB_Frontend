import React from 'react'

import { makeStyles } from '@material-ui/core'

import { DosesList } from './components/dosesContainer'
import { ConsumoList } from './components/totalConsumo'

export const InfoContainer = () => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <DosesList />
      <ConsumoList />
    </div>
  )
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    height: 'calc(100% - 120px)',
    padding: '1% 0px 0px 0px',
    background: 'rgba(0,0,0,0.08)',

    '@media (max-width: 1080px)': {
      flexDirection: 'column',
      height: 'auto'
    }
  }
}));