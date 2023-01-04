import React from 'react'

import { Typography } from '@material-ui/core'

export const RaspyListHistItem = ({ Hist, header }) => {
    return !header
        ? (
            <div style={{ width: '100%', display: 'flex', marginBottom: '8px' }}>
                <Typography style={{ width: '100%' }}>{`${Hist.Dia}`.padStart(2, '0')}/{`${Hist.Mes}`.padStart(2, '0')}/{Hist.Ano}</Typography>
                <Typography style={{ flexBasis: '33.33%', textAlign: 'end', maxWidth: '100px', padding: '0px 8px 0px 0px' }}>x{`${Hist.Qtd}`.padStart(2, '0')}</Typography>
                <Typography style={{ flexBasis: '33.33%', textAlign: 'end', maxWidth: '100px' }}>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Hist.Vlr)}</Typography>
            </div>
        )
        : (
            <div style={{ width: '100%', display: 'flex' }}>
                <Typography style={{ width: '100%' }}><strong>Data</strong></Typography>
                <Typography style={{ flexBasis: '33.33%', textAlign: 'end', maxWidth: '100px' }}><strong>Quantidade</strong></Typography>
                <Typography style={{ flexBasis: '33.33%', textAlign: 'end', maxWidth: '100px' }}><strong>Valor</strong></Typography>
            </div>
        )
}