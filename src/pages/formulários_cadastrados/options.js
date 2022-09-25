import React, { useState } from 'react';

import { Checkbox, Divider, FormControlLabel, IconButton, InputBase, makeStyles, Paper, Tooltip } from '@material-ui/core';

import { Close as CloseIcon, Search as SearchIcon } from '@material-ui/icons';

export const FormsListOptions = ({ onChangeFiltro, mostrarIncompletos, switchIncompletos }) => {
  const classes = useStyles()
  const [filterWord, setFilterWord] = useState('')

  return (
    <div className={classes.container}>
      <div style={{ width: '171.55px' }} />
      <div>
        <Paper component="form" className={classes.root}>
          <InputBase
            className={classes.input}
            placeholder="Buscar formulário"
            inputProps={{ 'aria-label': 'buscar formulário' }}
            onChange={e => {
              onChangeFiltro('')
              setFilterWord(e.target.value)
            }}
            value={filterWord}
            disabled={false}
          />
          <Tooltip
            title={
              <label
                style={{
                  fontSize: "14px",
                  color: "#FFF",
                  lineHeight: "20px"
                }}
              >
                Buscar
              </label>
            }
            placement="top"
            arrow={true}
          >
            <IconButton
              type='submit'
              className={classes.iconButton}
              aria-label="buscar"
              onClick={(e) => {
                e.preventDefault()
                onChangeFiltro(filterWord)
              }}
            >
              <SearchIcon />
            </IconButton>
          </Tooltip>
          <Divider
            className={classes.divider}
            orientation="vertical"
          />
          <Tooltip
            title={
              <label
                style={{
                  fontSize: "14px",
                  color: "#FFF",
                  lineHeight: "20px"
                }}
              >
                Limpar busca
              </label>
            }
            placement="right"
            arrow={true}
          >
            <IconButton
              className={classes.iconButton}
              aria-label="directions"
              color="primary"
              onClick={() => {
                onChangeFiltro('')
                setFilterWord('')
              }}
            >
              <CloseIcon />
            </IconButton>
          </Tooltip>
        </Paper>
        <FormControlLabel
          control={
            <Checkbox
              className={classes.checkbox}
              checked={mostrarIncompletos}
              onChange={(e) => switchIncompletos(e.target.checked)}
              style={{ marginLeft: '8px' }}
            />
          }
          label="Mostrar formulários incompletos"
        />
      </div>
      <div style={{ width: '171.55px' }} />
    </div>
  )
}

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: 400,
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    height: '100px',
    background: 'unset',
    alignItems: 'flex-start',
    justifyContent: 'space-between',

    '@media (max-width: 800px)': {
      height: '150px',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    }
  },
  checkbox: {
    transform: "scale(0.3)",
  },
  button: {
    height: '46px',

    '@media (max-width: 800px)': {
      width: '400px',
    }
  }
}))