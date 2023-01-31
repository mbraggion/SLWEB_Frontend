import React, { useState } from 'react'
import { api } from '../../../services/api'

import { Button } from '@material-ui/core'
import { Close, Check } from '@material-ui/icons'

import { Toast } from '../../../components/toasty'

export const Franqueado = ({ Req, onClose, onRefresh }) => {
  const [wait, setWait] = useState(false)

  const handleManagement = async (action) => {
    setWait(true);
    let toastId = null

    try {
      toastId = Toast('Aguarde...', 'wait')
      await api.put("/equip/requests/validate", {
        OSID: Req.OSCId,
        action: action,
        reject: null,
        prev: null,
      });

      Toast('Atualização gravada', 'update', toastId, 'success')
      onClose();
      onRefresh()
    } catch (err) {
      Toast('Falha ao atualizar', 'update', toastId, 'error')
      setWait(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width: "100%",
      }}
    >
      <div
        className="YAlign"
        style={{
          justifyContent: "flex-start",
          alignItems: "flex-start",
          width: "100%",
        }}
      >
        <Button
          disabled={wait}
          style={{
            margin: "0px 0px 8px 0px",
            width: "100%",
            border: "1px solid #000",
          }}
          onClick={() => handleManagement("accept")}
        >
          <Check />
          Confirmar Recebimento
        </Button>

        <Button
          style={{ width: "100%", border: "1px solid #000" }}
          disabled={wait}
          onClick={() => handleManagement("reject")}
        >
          <Close />
          Cancelar OS
        </Button>
      </div>
    </div>
  )
}