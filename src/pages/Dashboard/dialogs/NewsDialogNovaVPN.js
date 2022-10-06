import { saveAs } from "file-saver";
import React, { useEffect, useState } from 'react';
import { api } from '../../../services/api';

import {
  Button,
  Dialog, DialogActions as MuiDialogActions, DialogContent as MuiDialogContent, DialogTitle as MuiDialogTitle, IconButton,
  Typography,
  useMediaQuery
} from '@material-ui/core';
import { useTheme, withStyles } from '@material-ui/core/styles';
import {
  Close as CloseIcon, PermDataSetting as PermDataSettingIcon, VpnLock as VpnLockIcon
} from '@material-ui/icons';
import { Toast } from '../../../components/toasty';
import { toValidString } from '../../../misc/commom_functions';

export const NewVPNModal = ({ open, onClose }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [vpnPin, setVpnPin] = useState(null)

  async function LoadData() {
    try {
      const response = await api.get('/vpn/pin')

      setVpnPin(response.data.vpn_pin)
    } catch (err) {
      console.log(err)
    }
  }
  
  useEffect(() => {
    LoadData()
  }, [])

  const handleRequestVPNFiles = async (type) => {
    let toastId = null

    toastId = Toast('Baixando arquivo, aguarde', 'wait')
    try {
      const response = await api.get(`/vpn/files/${type}`, {
        responseType: "arraybuffer",
      })

      Toast('Download concluído!', 'update', toastId, 'success')

      if (type === 'ovpn') {
        const blob = new Blob([response.data], { type: 'txt' });

        saveAs(blob, `CONFIGURAÇÃO VPN.ovpn`);
      } else if (type === 'pritunl') {
        const blob = new Blob([response.data], { type: 'application/vnd.microsoft.portable-executable' });

        saveAs(blob, `PritUnl.exe`);
      }
    } catch (err) {
      Toast('Falha no download', 'update', toastId, 'error')
    }
  }

  return (
    <div>
      <Dialog
        onClose={onClose}
        fullScreen={fullScreen}
        open={open}
      >
        <DialogTitle
          onClose={onClose}
        >
          Atualização de VPN
        </DialogTitle>
        <DialogContent
          dividers
          style={{
            minWidth: '550px'
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-start'
            }}
          >
            <Typography
              gutterBottom
              style={{
                width: '100%',
                textAlign: 'left'
              }}
            >
              A VPN da Pilão será <strong>atualizada</strong> para uma nova versão e para tal será necessário instalar o <strong>novo gerenciador de VPN</strong> junto a um <strong>novo arquivo de configuração</strong>.
            </Typography>
            <Typography
              gutterBottom
              style={{
                width: '100%',
                textAlign: 'left'
              }}
            >
              Faça o download dos arquivos abaixo e siga o passo a passo no video para completar a instalação.
            </Typography>
            <div
              style={{
                display: 'flex',
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                margin: '0px 0px 8px 0px'
              }}
            >
              <Button
                variant='contained'
                onClick={() => handleRequestVPNFiles('ovpn')}
                color='primary'
                style={{
                  marginRight: '8px'
                }}
                startIcon={
                  <VpnLockIcon />
                }
              >
                Configuração VPN
              </Button>
              <Button
                variant='contained'
                onClick={() => handleRequestVPNFiles('pritunl')}
                color='primary'
                startIcon={
                  <PermDataSettingIcon />
                }
              >
                PritUnl (Gerenciador VPN)
              </Button>
            </div>
            <iframe
              width="504"
              height="283,5"
              src="https://www.youtube.com/embed/dBFv5FX6Ig0"
              title="Instalação PritUnl"
              frameborder="0"
              allow="
            accelerometer; 
            autoplay; 
            clipboard-write; 
            encrypted-media; 
            gyroscope; 
            picture-in-picture
            "
              allowfullscreen
            />
          </div>
          {vpnPin !== null ? toValidString(vpnPin) : ''}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={onClose}
            color="primary"
          >
            Ciente!
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
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

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);