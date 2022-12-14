import React, { useEffect, useState } from 'react'
import moment from 'moment'

import { Divider, Typography, makeStyles, IconButton } from '@material-ui/core'
import { Save as SaveIcon } from '@material-ui/icons'

import { api } from '../../../services/api'
import InputMoney from '../../../components/materialComponents/inputMoney'
import Datepicker from '../../../components/materialComponents/datePicker'
import { Toast } from '../../../components/toasty'

export const Acoes = ({ grpven }) => {
    const [parametros, setParametros] = useState(null)
    const [loading, setLoading] = useState(true)
    const [fetching, setFetching] = useState(false);

    const classes = useStyles();

    useEffect(() => {
        LoadData(grpven)
    }, [])

    const LoadData = async (grpven) => {
        setLoading(true)

        try {
            const response = await api.get(`/administrar/franquia/${grpven}/acoes`)

            setParametros(response.data)
            setLoading(false)
        } catch (err) {
            setLoading(false)
        }
    }

    const handleUpdate = async (type) => {
        let toastId = null

        toastId = Toast('Atualizando...', 'wait')
        setFetching(true)

        try {
            await api.put(`/administrar/franquia/${grpven}/${type}`, {
                payload: parametros
            })

            Toast('Atualizado com sucesso!', 'update', toastId, 'success')
            setFetching(false)
        } catch (err) {
            Toast('Falha ao atualizar', 'update', toastId, 'error')
            setFetching(false)
        }
    }

    return loading
        ? (
            <p>Carregando...</p>
        ) : (
            <div className='YAlign'>
                <Divider
                    className={classes.divider}
                    component="li"
                    variant="inset"
                />
                <li style={{ listStyleType: 'none' }}>
                    <Typography
                        className={classes.dividerInset}
                        color="textSecondary"
                        display="block"
                        variant="caption"
                    >
                        Limites
                    </Typography>
                </li>

                <div className={classes.linha}>
                    <InputMoney
                        decimais={0}
                        onChange={e => setParametros(oldState => ({
                            ...oldState,
                            Limite: e.target.value
                        }))}
                        style={{}}
                        label='Limite de compras'
                        disabled={fetching}
                        value={parametros.Limite}
                    />

                    <IconButton color='primary' onClick={() => handleUpdate('limite')}>
                        <SaveIcon />
                    </IconButton>
                </div>

                <div className={classes.linha} style={{ alignItems: 'baseline' }}>
                    <InputMoney
                        decimais={0}
                        onChange={e => setParametros(oldState => ({
                            ...oldState,
                            LimiteExtra: e.target.value
                        }))}
                        style={{}}
                        label='Limite extra'
                        disabled={fetching}
                        value={parametros.LimiteExtra}
                    />

                    <Datepicker
                        min={false}
                        onChange={e => setParametros(oldState => ({
                            ...oldState,
                            ValidadeLimiteExtra: typeof e == 'string' ? '' : e.toDate()
                        }))}
                        disabled={fetching}
                        label='Validade'
                        style={{
                            marginLeft: '8px'
                        }}
                        focus={false}
                        defaultValue={parametros.ValidadeLimiteExtra !== null ? moment(parametros.ValidadeLimiteExtra).toDate() : moment().toDate()}
                    />
                    <IconButton color='primary' onClick={() => handleUpdate('limiteextra')}>
                        <SaveIcon />
                    </IconButton>
                </div>

            </div>
        )
}

const useStyles = makeStyles((theme) => ({
    divider: {
        width: '100%',
        listStyleType: 'none',
        margin: '8px 0 0 0',
    },
    dividerInset: {
        margin: `5px 0 8px ${theme.spacing(2)}px`,
    },
    noMaxWidth: {
        maxWidth: 'none',
    },
    dadosContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%'
    },
    letItBeWide: {
        width: '100%',
        marginTop: '8px'
    },
    letItBeWideWithMargin: {
        width: '100%',
        marginTop: '8px',

        '& div>input:nth-child(1)': {
            margin: '0px 8px',
        }
    },
    linha: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        flexWrap: 'nowrap',
        marginTop: '8px'
    }
}));