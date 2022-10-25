import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';

import { AppBar, Dialog, IconButton, makeStyles, Slide, Toolbar, Typography, useMediaQuery } from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';

import { InventarioList } from './components/invList';
import { InventarioOptions } from './components/invOptions';

export const InventarioContainer = ({ selectedDepId, selectedDepName, onChangeSelectedDep }) => {
  const classes = useStyles();
  const isMdUp = useMediaQuery('@media (min-width: 1080px)');

  const [fetching, setFetching] = useState(false)
  const [refs, setRefs] = useState([])
  const [inventario, setInventario] = useState(null)
  const [selectedRef, setSelectedRefs] = useState('')

  const loadRefs = async () => {
    try {
      const response = await api.get(`/referencia`)

      setRefs(response.data.Referencias)
    } catch (err) {
      setRefs([])
    }
  }

  const loadInventory = async () => {
    setFetching(true)
    setInventario(null)

    try {
      const response = await api.get(`/inventario/${selectedDepId}/${encodeURI(selectedRef)}`)

      setInventario(response.data.Inventario)
      setFetching(false)
    } catch (err) {
      setInventario(null)
      setFetching(false)
      setSelectedRefs('')
    }
  }

  useEffect(() => {
    loadRefs()
  }, [])

  useEffect(() => {
    setInventario(null)
    
    if (selectedRef !== '') {
      loadInventory()
    }
    
    // eslint-disable-next-line
  }, [selectedRef])

  useEffect(() => {
    setInventario(null)
    setSelectedRefs('')
    setFetching(false)
  }, [selectedDepId])

  const handleClose = () => {
    onChangeSelectedDep(null)
  }

  const ContainerContent = () => (
    <div className={classes.root}>
      <InventarioOptions
        selectedRef={selectedRef}
        availableRefs={refs}
        onUpdateRef={setSelectedRefs}
        isDepositSelected={selectedDepId !== null}
        Inventario={inventario}
        updateInventory={loadInventory}
        selectedDepId={selectedDepId} 
      />
      <InventarioList
        Inventario={inventario}
        isFetching={fetching}
        updateInventory={loadInventory}
        isRefSelected={selectedDepId !== null}
        selectedDepId={selectedDepId} 
        selectedRef={selectedRef}
      />
    </div>
  )

  return isMdUp
    ? (
      <ContainerContent />
    )
    : (
      <Dialog
        fullScreen
        TransitionComponent={Transition}
        open={selectedDepId !== null}
        onClose={handleClose}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Depósito {selectedDepName}
            </Typography>
          </Toolbar>
        </AppBar>
        <ContainerContent />
      </Dialog >
    )
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%',
    margin: '0px 0px 0px 8px',
    boxShadow: "0 2px 2px 0 rgb(0 0 0 / 14%), 0 3px 1px -2px rgb(0 0 0 / 12%), 0 1px 5px 0 rgb(0 0 0 / 20%)"
  },
  appBar: {
    position: 'relative',
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});