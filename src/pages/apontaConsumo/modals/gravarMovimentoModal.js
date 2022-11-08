import moment from 'moment';
import React from 'react';

import { Accordion, AccordionDetails, AccordionSummary, Button, Dialog, DialogActions, DialogContent, DialogTitle as MuiDialogTitle, IconButton, Typography, useMediaQuery } from '@material-ui/core/';
import { makeStyles, useTheme, withStyles } from '@material-ui/core/styles';
import { Close as CloseIcon, ExpandMore as ExpandMoreIcon, Save as SaveIcon } from '@material-ui/icons';

import { useConsumo } from '../../../hooks/useConsumo';
import { ConsumoALancar } from '../components/consumoALancar';
import { ConsumoLancado } from '../components/consumoLancado';

export const MovimentoModal = () => {
  const theme = useTheme();
  const classes = useStyles();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const {
    uiControl: { isLaunchModalOpen, jaLancouInventario },
    actions: { onCloseLancamentoModal, onGravarConsumo, onRetrocederConsumo },
    data: { Consumo, EquipList, selectedEquip, selectedRef, ConsumoJaLancado, Zerada, selectedL1, selectedL2, leituras }
  } = useConsumo()

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
          <Typography gutterBottom variant='body1'>{jaLancouInventario ? 'Uma movimentação deste despósito dentro deste período já foi feita.' : 'A movimentação dos insumos abaixo será lançada em inventário.'}</Typography>
          <Typography variant='subtitle1'>Depósito: <strong>{EquipList.filter(eq => eq.EquiCod === selectedEquip)[0] ? EquipList.filter(eq => eq.EquiCod === selectedEquip)[0].DepNome : 'Indefinido'}</strong></Typography>
          <Typography variant='subtitle1'>Referencia: <strong>{moment(selectedRef).add(3, 'hours').format('MM/YYYY')}</strong></Typography>
          <Typography variant='subtitle1'>Período: <strong>{selectedL1 !== null ? moment(leituras.filter(l => l.LeituraId === selectedL1)[0].DataLeitura).format('DD/MM/YYYY hh:mm:ss') : null}</strong> &#x2192; <strong>{selectedL2 !== null ? moment(leituras.filter(l => l.LeituraId === selectedL2)[0].DataLeitura).format('DD/MM/YYYY hh:mm:ss') : null}</strong></Typography>


          {!jaLancouInventario
            ? (
              <ConsumoALancar
                Consumo={Consumo}
                Zerada={Zerada}
              />
            )
            : null}

          {
            Array.isArray(ConsumoJaLancado)
              ? <Accordion defaultExpanded={false}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}

                >
                  <Typography variant='caption'>Lançamentos anteriores</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <div className='YAlign'>
                    {ConsumoJaLancado.length > 0
                      ? ConsumoJaLancado.map(C =>
                        <ConsumoLancado
                          Consumo={C}
                          onDeleteLancamento={onRetrocederConsumo}
                        />
                      )
                      : <Typography variant='h6'>Nenhum lançamento de consumo anterior gravado.</Typography>
                    }
                  </div>
                </AccordionDetails>
              </Accordion>
              : null
          }
        </div>
      </DialogContent>

      <DialogActions>
        {jaLancouInventario
          ? null
          : <Button
            variant='contained'
            color='primary'
            disabled={jaLancouInventario}
            onClick={() => onGravarConsumo()}
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
    alignItems: 'center'
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
  },
  historyBox: {
    marignBottom: '8px',
    borderBottom: '1px dashed #CCC',
    fontSize: '0.5rem'
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
