import moment from 'moment'
import React from 'react'

import {
  Typography,
  FormControl,
  InputLabel,
  makeStyles,
  MenuItem,
  Select
} from '@material-ui/core'

export const RaspyOptions = ({ selectedAnx, leiturasDisponiveis, onUpdateMargem, margemSelecionada }) => {
  const classes = useStyles()

  return (
    <section className={classes.root}>
      <Typography 
      variant='h6' 
      style={{ marginLeft: '8px' }}
      >
        Período de apuração:
        </Typography>

      <div>
        <FormControl variant="outlined" className={classes.formControl}>
          <InputLabel id="simple-select-outlined-label">De</InputLabel>
          <Select
            labelId="simple-select-outlined-label"
            id="simple-select-outlined"
            value={margemSelecionada.de}
            onChange={(e) =>
              onUpdateMargem(oldState => ({
                ...oldState,
                de: e.target.value
              }))
            }
            label="De"
            disabled={selectedAnx === null}
          >
            <MenuItem value={null}>
              <em>Nenhuma</em>
            </MenuItem>
            {leiturasDisponiveis
              .filter(ld => {
                if (margemSelecionada.ate === null || ld.PedidoId < margemSelecionada.ate) {
                  return true
                } else {
                  return false
                }
              })
              .map(leitura =>
                <MenuItem
                  key={leitura.PedidoId}
                  value={leitura.PedidoId}
                >
                  {moment(leitura.DtVenda).add(3, 'hours').format('L')}
                </MenuItem>
              )
            }
          </Select>
        </FormControl>

        <FormControl variant="outlined" className={classes.formControl}>
          <InputLabel id="simple-select-outlined-label">Até</InputLabel>
          <Select
            labelId="simple-select-outlined-label"
            id="simple-select-outlined"
            value={margemSelecionada.ate}
            onChange={(e) =>
              onUpdateMargem(oldState => ({
                ...oldState,
                ate: e.target.value
              }))
            }
            label="Até"
            disabled={selectedAnx === null}
          >
            <MenuItem value={null}>
              <em>Nenhuma</em>
            </MenuItem>
            {leiturasDisponiveis
              .filter(ld => {
                if (margemSelecionada.de === null || ld.PedidoId > margemSelecionada.de) {
                  return true
                } else {
                  return false
                }
              })
              .map(
                leitura =>
                  <MenuItem
                    key={leitura.PedidoId}
                    value={leitura.PedidoId}
                  >
                    {moment(leitura.DtVenda).add(3, 'hours').format('L')}
                  </MenuItem>
              )
            }
          </Select>
        </FormControl>
      </div>
    </section>
  )
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    height: '70px',
    width: '100%',
    borderBottom: '1px solid #ccc',
    alignItems: 'center',
    justifyContent: 'space-between',

    '@media(max-width: 1080px)': {
      height: 'auto'
    }
  },
  formControl: {
    margin: '10px 10px 10px 0px',
    minWidth: 120,
  },
  infoContainer: {
    display: 'flex',
    flexDirection: 'row',
    height: '63px',
    width: '100%',
    flexWrap: 'nowrap',
    alignItems: 'center',
    justifyContent: 'space-between'
  }
}));
