import React from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';

import { SetColetaCarga } from '../../../global/actions/VendasAction'

const BillingModal = ({ open, onClose, BillingDetails, BillingConfig, ...props }) => {
  const history = useHistory()
  const { SetColetaCarga } = props;

  const handleBill = (dadosMinimo, coleta) => {
    let diferenca = null

    if (
      Number(dadosMinimo.CalcFatId) < 255 &&
      (String(dadosMinimo.AnxFatMinimo).trim() === 'S' || String(dadosMinimo.PdvConsMin).trim() === 'S')
    ) {
      let minimoColeta = 0

      if (String(dadosMinimo.AnxTipMin) === 'D') {
        //calculo de doses na coleta
        coleta.Detalhes.forEach((item) => {
          minimoColeta = minimoColeta + Number(item.FfdQtdFaturar)
        })
      } else {
        //calculo de R$ na coleta
        coleta.Detalhes.forEach((item) => {
          minimoColeta = minimoColeta + (Number(item.FfdQtdFaturar) * Number(item.PvpVvn1))
        })
      }

      if (String(dadosMinimo.AnxTipMin) === 'D' && Number(dadosMinimo.PdvConsDose) > minimoColeta) {
        //se o minimo por dose não for atingido
        if (dadosMinimo.AnxMinMoeda === 'S') {
          //considerar já pago para calculo do minimo
          diferenca = {
            ProdId: 12708,
            VVenda: dadosMinimo.AnxCalcMinPor === 'A' ? Number(dadosMinimo.AnxVlrUnitMin) : Number(dadosMinimo.PdvConsValor),
            QVenda: Number(dadosMinimo.PdvConsDose) - minimoColeta,
            DVenda: 0
          }
        } else {
          //desconsiderar já pago para calculo do minimo
          diferenca = {
            ProdId: 12708,
            VVenda: dadosMinimo.AnxCalcMinPor === 'A' ? Number(dadosMinimo.AnxVlrUnitMin) : Number(dadosMinimo.PdvConsValor),
            QVenda: Number(dadosMinimo.PdvConsDose),
            DVenda: 0
          }
        }
      } else if (String(dadosMinimo.AnxTipMin) === 'R' && (Number(dadosMinimo.PdvConsDose) * (dadosMinimo.AnxCalcMinPor === 'A' ? Number(dadosMinimo.AnxVlrUnitMin) : Number(dadosMinimo.PdvConsValor))) > minimoColeta) {
        //se o minimo em R$ não for atingido
        if (dadosMinimo.AnxMinMoeda === 'S') {
          //considerar já pago para calculo do minimo
          diferenca = {
            ProdId: 12708,
            VVenda: (Number(dadosMinimo.PdvConsDose) * (dadosMinimo.AnxCalcMinPor === 'A' ? Number(dadosMinimo.AnxVlrUnitMin) : Number(dadosMinimo.PdvConsValor))) - minimoColeta,
            QVenda: 1,
            DVenda: 0
          }
        } else {
          //desconsiderar já pago para calculo do minimo
          diferenca = {
            ProdId: 12708,
            VVenda: Number(dadosMinimo.PdvConsDose) * (dadosMinimo.AnxCalcMinPor === 'A' ? Number(dadosMinimo.AnxVlrUnitMin) : Number(dadosMinimo.PdvConsValor)),
            QVenda: 1,
            DVenda: 0
          }
        }
      }
    }

    let carga = {
      Cliente: coleta.CNPJ,
      Items: []
    }

    coleta.Detalhes.forEach((item) => {
      let repetido = false

      //verifico se tem um mesmo produto em mais de uma posição, e se tiver eu somo as QTDs com o que já tem
      carga.Items.forEach((cargaItem, index) => {
        if (cargaItem.ProdId === item.ProdId) {
          repetido = true
          carga.Items[index] = {
            ...cargaItem,
            QVenda: cargaItem.QVenda + item.FfdQtdFaturar,
          }
        }
      })

      //se não for um produto repetido adiciono ele a carga
      if (!repetido) {
        carga.Items.push({
          ProdId: item.ProdId,
          VVenda: item.PvpVvn1,
          QVenda: item.FfdQtdFaturar,
          DVenda: 0
        })
      }
    })

    if (diferenca !== null) {
      carga.Items.push(diferenca)
    }

    carga.Items = carga.Items.filter(item => item.QVenda > 0)

    SetColetaCarga(carga)
    history.push('/vendas')
  }

  return (
    <div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted={false}
        onClose={onClose}
      >
        <DialogTitle>Configurações de Faturamento</DialogTitle>
        <DialogContent>
          <p>Faturamento: <strong>{displayFatTipo(BillingConfig.CalcFatId)}</strong></p>
          <p>Máquina tem mínimo? <strong>{String(BillingConfig.AnxFatMinimo).trim() === 'S' || String(BillingConfig.PdvConsMin).trim() === 'S' ? 'Sim' : 'Não'}</strong></p>

          {String(BillingConfig.AnxFatMinimo).trim() === 'S' || String(BillingConfig.PdvConsMin).trim() === 'S'
            ? <>
              <p>Tipo de mínimo: <strong>{String(BillingConfig.AnxTipMin) === 'D' ? 'Doses' : 'Reais'}</strong></p>
              <p>Consumo:
                <strong>
                  {
                    String(BillingConfig.AnxTipMin) === 'D'
                      ? BillingDetails.Detalhes?.reduce((oldValue, item) => {
                        return oldValue + Number(item.FfdQtdFaturar)
                      }, 0) + ' doses'
                      : 'R$' + BillingDetails.Detalhes?.reduce((oldValue, item) => {
                        return oldValue + (Number(item.FfdQtdFaturar) * Number(item.PvpVvn1))
                      }, 0)
                  }
                </strong>
              </p>

              <p>Mínimo:
                <strong>
                  {
                    String(BillingConfig.AnxTipMin) === 'D' ? Number(BillingConfig.PdvConsDose) + ' doses' : 'R$ ' + Number(BillingConfig.PdvConsDose) * (BillingConfig.AnxCalcMinPor === 'A' ? Number(BillingConfig.AnxVlrUnitMin) : Number(BillingConfig.PdvConsValor))
                  }
                </strong>
              </p>
              <p>
                Considerar valor já pago para calculo de mínimo?
                <strong>
                  {BillingConfig.AnxMinMoeda === 'S' ? ' Sim' : ' Não'}
                </strong>
              </p>
            </>
            : <p>Consumo:
              <strong>
                {
                  String(BillingConfig.AnxTipMin) === 'D'
                    ? BillingDetails.Detalhes?.reduce((oldValue, item) => {
                      return oldValue + Number(item.FfdQtdFaturar)
                    }, 0) + ' doses'
                    : 'R$' + BillingDetails.Detalhes?.reduce((oldValue, item) => {
                      return oldValue + (Number(item.FfdQtdFaturar) * Number(item.PvpVvn1))
                    }, 0)
                }
              </strong>
            </p>
          }

        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary">
            Fechar
          </Button>
          <Button onClick={() => handleBill(BillingConfig, BillingDetails)} color="primary">
            Faturar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

const mapStateToProps = (store) => ({
  State: store.VendaState,
})

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      SetColetaCarga
    }
    , dispatch
  )

export const BillingModalWithRedux = connect(mapStateToProps, mapDispatchToProps)(BillingModal);


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const displayFatTipo = (fat) => {
  switch (fat) {
    case 1:
      return 'ALUGUEL';
    case 2:
      return 'COMODATO';
    case 3:
      return 'Comodato com mínimo por máquina';
    case 4:
      return 'Comodato com mínimo global';
    case 5:
      return 'Comodato com preço compartilhado';
    case 6:
      return 'Comodato por faixa de consumo';
    case 255:
      return 'Venda de insumos';
    default:
      return 'Indefinido'
  }
}