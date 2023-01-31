import React from 'react';
// import moment from 'moment'
import { Link } from "react-router-dom";

import { ErrorOutline, PlaylistAddCheck, Add } from '@material-ui/icons'
import { Typography, Button } from '@material-ui/core';

import { GREY_SECONDARY } from '../../misc/colors'

const Header = (props) => {
  const shouldEnableConfirmButtom = true
  
  return (
    <div
      className="XAlign"
      style={{
        width: '100%',
        minHeight: '200px',
        backgroundColor: GREY_SECONDARY,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: '8px 16px',
        borderRadius: '8px 8px 0 0',
      }}>

      <div className="YAlign" style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Button
          style={{ marginBottom: '8px', width: '230px' }}
          color="primary"
          variant="contained"
          disabled={false}
          onClick={() => props.onOpenReportModal()}
          startIcon={<ErrorOutline />}
        >
          Reportar problema
        </Button>
        {/* <Button
          style={{ marginBottom: '8px', width: '230px' }}
          color="primary"
          variant="contained"
          disabled={true}
          onClick={() => props.onOpenMiFixModal()}
          startIcon={<Room />}
        >
          Chamados MiFix
        </Button> */}
        <Button
          style={{ marginBottom: '8px', width: '230px' }}
          color="primary"
          variant="contained"
          disabled={!shouldEnableConfirmButtom}
          onClick={() => props.onOpenConfirmModal()}
          startIcon={<PlaylistAddCheck />}
        >
          Confirmar instalações
        </Button>
      </div>

      <div className="YAlign" style={{ justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <Typography
          variant="h4"
          style={{ color: '#fff' }}
          gutterBottom
        >
          Equipamentos: {props.EquipamentosTotal}
        </Typography>
        <Typography
          variant="h4"
          style={{ color: '#fff' }}
          gutterBottom
        >
          Aguardando instalação: {props.EquipamentosStandyBy}
        </Typography>
        <Link to="/solicitacao">
          <Button
            style={{ width: '230px' }}
            color="primary"
            variant="contained"
            startIcon={<Add />}
          >
            Solicitar Equipamento
          </Button>
        </Link>
      </div>

    </div>
  );
}

export default Header;