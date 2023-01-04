import React, { useState, useEffect } from 'react'
import { api } from '../../services/api'

import Loading from '../../components/loading_screen'

import { makeStyles } from '@material-ui/core'

import { PdvList } from './components/pdvList'
import { RaspyContainer } from './components/slraspyContainer'

export const SLRaspy = () => {
  const [loaded, setLoaded] = useState(false)
  const [anxs, setAnxs] = useState([])
  const [selectedAnx, SetSelectedAnx] = useState(null)

  const classes = useStyles();

  async function LoadData() {
    try {
      const response = await api.get('/raspy')

      setAnxs(response.data.anxs)
      setLoaded(true)
    } catch (err) {
      setAnxs([])
      setLoaded(false)
    }
  }

  useEffect(() => {
    LoadData()
  }, [])

  return !loaded ? (
    <Loading />
  ) : (
    <div className={classes.root}>
      <PdvList
        anxs={anxs}
        onSelectAnx={SetSelectedAnx}
        SelectedAnx={selectedAnx}
      />
      <RaspyContainer
        selectedAnx={selectedAnx}
        onSelectAnx={SetSelectedAnx}
        selectedAnxName={anxs.filter(anx => anx.AnxId === selectedAnx)[0]?.AnxDesc}
      />
    </div>
  )
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    width: '100%',
    // height: '100%'
    height: 'calc(100% - 72px)'
  },
}));