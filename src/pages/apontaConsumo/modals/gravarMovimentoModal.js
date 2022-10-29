import moment from 'moment';
import React, { useState } from 'react';

import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle as MuiDialogTitle, FormControlLabel, IconButton, Typography, useMediaQuery } from '@material-ui/core/';
import { makeStyles, useTheme, withStyles } from '@material-ui/core/styles';
import { Close as CloseIcon, History as HistoryIcon, Save as SaveIcon } from '@material-ui/icons';

import { useConsumo } from '../../../hooks/useConsumo';
import { RED_PRIMARY } from '../../../misc/colors';

export const MovimentoModal = () => {
  const theme = useTheme();
  const classes = useStyles();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const {
    uiControl: { isLaunchModalOpen, jaLancouInventario },
    actions: { onCloseLancamentoModal },
    data: { Consumo, EquipList, selectedEquip, selectedRef }
  } = useConsumo()

  const [zerada, setZerada] = useState(false)

  const handleClose = () => {
    onCloseLancamentoModal()
  }

  return (
    <Dialog
      fullScreen={fullScreen}
      open={isLaunchModalOpen}
      onClose={handleClose}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle
        id="customized-dialog-title"
        onClose={handleClose}
      >
        Gravar consumo no inventário
      </DialogTitle>

      <DialogContent dividers>
        <div className={classes.root}>
          <Typography gutterBottom variant='body1'>{jaLancouInventario ? 'A movimentação deste despósito nesta referencia já foi feita.' : 'A movimentação dos insumos abaixo será lançada em inventário.'}</Typography>
          <Typography variant='subtitle1'>Depósito: <strong>{EquipList.filter(eq => eq.EquiCod === selectedEquip)[0] ? EquipList.filter(eq => eq.EquiCod === selectedEquip)[0].DepNome : 'Indefinido'}</strong></Typography>
          <Typography variant='subtitle1'>Referencia: <strong>{moment(selectedRef).add(3, 'hours').format('MM/YYYY')}</strong></Typography>

          <div className={classes.line}>
            {jaLancouInventario
              ? <div />
              : <FormControlLabel
                control={
                  <Checkbox
                    className={classes.checkbox}
                    checked={zerada}
                    onChange={() => setZerada(!zerada)}
                    name="zerada"
                  />
                }
                label="Lançar como zerada"
              />}


          </div>

          {!jaLancouInventario ?
            <table className={classes.table}>
              <thead>
                <tr>
                  <th className={classes.header}>Código</th>
                  <th>Produto</th>
                  <th>Qtd.</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(Consumo)
                  ? Consumo.map((C, i) => (
                    <tr>
                      <td className={classes.cell} style={{ padding: '1rem 2rem' }}>
                        {C.ProdId}
                      </td>
                      <td className={classes.cell} style={{ color: '#000' }}>
                        {C.Produto}
                      </td>
                      <td className={classes.cell} style={{ color: RED_PRIMARY, fontWeight: 'bold', textAlign: 'end' }}>
                        -{zerada ? C.TotalConsumo : C.Con}
                      </td>
                    </tr>
                  )) : null}
              </tbody>
            </table>
            : null
          }
        </div>
      </DialogContent>

      <DialogActions>
        {jaLancouInventario
          ? <Button
            variant='outlined'
            color='primary'
            disabled={!jaLancouInventario}
            onClick={() => { }}
            startIcon={<HistoryIcon />}
          >
            Reverter lançamento
          </Button>
          : <Button
            variant='contained'
            color='primary'
            disabled={jaLancouInventario}
            onClick={() => { }}
            startIcon={<SaveIcon />}
          >
            Gravar Consumo
          </Button>
        }

      </DialogActions>
    </Dialog>
  );
}

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItem: 'center'
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
    borderRadius: '0.25rem',
  },
  checkbox: {
    transform: "scale(0.3)",
  },
  line: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItem: 'center'
  }
}))

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
    minWidth: '300px'
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});
