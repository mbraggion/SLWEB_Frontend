import React from 'react'

import { Typography } from '@material-ui/core'

export const Indisponivel = () => {
    return(
        <Typography>
        Não é possivel gerenciar uma solicitação que já foi{" "}
        <strong>Cancelada</strong> ou <strong>Concluída.</strong>
      </Typography>
    )
}