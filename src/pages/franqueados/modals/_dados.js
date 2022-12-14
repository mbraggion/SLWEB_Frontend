import React, { useEffect, useState } from 'react'
import moment from 'moment'

import { TextField, Divider, Tooltip, Typography, makeStyles } from '@material-ui/core'
import { RED_SECONDARY, GREEN_SECONDARY } from '../../../misc/colors'

import { api } from '../../../services/api'

export const Dados = ({ grpven }) => {
    const [franquia, setFranquia] = useState(null)
    const [loading, setLoading] = useState(true)

    const classes = useStyles();

    useEffect(() => {
        LoadData(grpven)
    }, [])

    const LoadData = async (grpven) => {
        setLoading(true)

        try {
            const response = await api.get(`/administrar/franquia/${grpven}/dados`)

            setFranquia(response.data)
            setLoading(false)
        } catch (err) {
            setLoading(false)
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
                        Dados
                    </Typography>
                </li>

                <div className={classes.dadosContainer}>
                    {franquia.PF.map((pf, i) => (
                        <>
                            <TextField
                                className={classes.letItBeWideWithMargin}
                                variant="outlined"
                                label={`Franqueado (${i + 1})`}
                                disabled={true}
                                value={pf.Nome}
                                onChange={() => { }}
                            />
                            <TextField
                                className={classes.letItBeWideWithMargin}
                                variant="outlined"
                                label={`CPF (${i + 1})`}
                                disabled={true}
                                value={pf.CPF}
                                onChange={() => { }}
                            />
                            <TextField
                                className={classes.letItBeWideWithMargin}
                                variant="outlined"
                                label={`Email (${i + 1})`}
                                disabled={true}
                                value={pf.Email}
                                onChange={() => { }}
                            />
                            <TextField
                                className={classes.letItBeWideWithMargin}
                                variant="outlined"
                                label={`Telefone (${i + 1})`}
                                disabled={true}
                                value={pf.Telefone}
                                onChange={() => { }}
                            />
                            <TextField
                                className={classes.letItBeWide}
                                variant="outlined"
                                multiline
                                label={`Endereço (${i + 1})`}
                                disabled={true}
                                value={montaEndereco(pf)}
                                onChange={() => { }}
                            />
                        </>
                    ))}
                </div>

                <div className={classes.dadosContainer}>
                    {franquia.PJ.map(pj => (
                        <>
                            <TextField
                                className={classes.letItBeWideWithMargin}
                                variant="outlined"
                                label='Empresa'
                                disabled={true}
                                value={pj.RazaoSocial}
                                onChange={() => { }}
                            />
                            <TextField
                                className={classes.letItBeWideWithMargin}
                                variant="outlined"
                                label='CNPJ'
                                disabled={true}
                                value={pj.CNPJ}
                                onChange={() => { }}
                            />
                            <TextField
                                className={classes.letItBeWideWithMargin}
                                variant="outlined"
                                label='Email'
                                disabled={true}
                                value={pj.Email}
                                onChange={() => { }}
                            />
                            <TextField
                                className={classes.letItBeWideWithMargin}
                                variant="outlined"
                                label='Telefone'
                                disabled={true}
                                value={pj.Telefone}
                                onChange={() => { }}
                            />
                            <TextField
                                className={classes.letItBeWide}
                                variant="outlined"
                                multiline
                                label='Endereço'
                                disabled={true}
                                value={montaEndereco(pj)}
                                onChange={() => { }}
                            />
                        </>
                    ))}
                </div>


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
                        Carteira
                    </Typography>
                </li>

                <Typography>
                    Clientes cadastrados: {franquia.CAR.Clientes.reduce((acc, t) => {
                        return acc + Number(t.Qtd)
                    }, 0)} [{franquia.CAR.Clientes.filter(t => t.Status === 'A')[0].Qtd} Ativos]
                </Typography>
                {franquia.CAR.AtivosDist.map(ad => (
                    <Typography>{ad.PdvStatus === 'Max' ? 'Máquinas na filial' : ad.PdvStatus === 'A' ? 'Máquinas instaladas' : 'Máquinas não instaladas'}: {ad.Qtd}</Typography>
                ))}

                <Divider
                    className={classes.divider}
                    component="li"
                    variant="inset"
                />

                <div
                    className='XAlign'
                    style={{
                        marginTop: '8px'
                    }}
                >
                    <Tooltip
                        classes={{ tooltip: classes.noMaxWidth }}
                        title={
                            <div style={{ fontSize: "14px", color: "#FFF", lineHeight: "20px" }} >
                                {franquia.CAR.AtivosStatus.filter(AS => AS.LeitOk.trim() === 'OK').map(AS => (
                                    <Typography color="inherit" style={{ whiteSpace: 'nowrap' }}>{AS.EquiCod} -&gt; {montaEndereco(AS)}</Typography>
                                ))}
                            </div>
                        }
                        placement="top"
                        arrow={true}
                    >
                        <div
                            style={{
                                padding: '8px',
                                border: `2px solid ${GREEN_SECONDARY}`,
                                borderRadius: '5px 0px 0px 5px',
                                width: '50%',
                                textAlign: 'center'
                            }}
                        >

                            <Typography>Telemetria OK: {franquia.CAR.AtivosStatus.filter(AS => AS.LeitOk.trim() === 'OK').length}</Typography>
                        </div>
                    </Tooltip>
                    <Tooltip
                        classes={{ tooltip: classes.noMaxWidth }}
                        title={
                            <div style={{ fontSize: "14px", color: "#FFF", lineHeight: "20px" }} >
                                {franquia.CAR.AtivosStatus.filter(AS => AS.LeitOk.trim() === 'KO').map(AS => (
                                    <Typography color="inherit" style={{ whiteSpace: 'nowrap' }}>{AS.EquiCod} -&gt; {montaEndereco(AS)}</Typography>
                                ))}
                            </div>
                        }
                        placement="top"
                        arrow={true}
                    >
                        <div
                            style={{
                                padding: '8px',
                                border: `2px solid ${RED_SECONDARY}`,
                                borderRadius: '0px 5px 5px 0px',
                                width: '50%',
                                textAlign: 'center'
                            }}
                        >
                            <Typography>Telemetria KO: {franquia.CAR.AtivosStatus.filter(AS => AS.LeitOk.trim() === 'KO').length}</Typography>
                        </div>
                    </Tooltip>
                </div>


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
                        Faturamento
                    </Typography>
                </li>

                <Typography>
                    Pode emitir nota: <strong>{franquia.FIN.EmiteNF === 'S' ? 'Sim' : 'Não'}</strong>
                </Typography>

                <Typography>
                    Limite de compra: <strong>{new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    }).format(franquia.FIN.Limite)}</strong>
                </Typography>

                <Typography>
                    Limite extra de: <strong>{new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    }).format(franquia.FIN.LimiteExtra)}</strong> {franquia.FIN.DtExtraConcedido !== null ? `[válido apenas em ${moment(franquia.FIN.DtExtraConcedido).format('L')}]` : null}
                </Typography>

                <Typography>
                    Mínimo de compra: <strong>{new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    }).format(franquia.FIN.MinCompra)}</strong>
                </Typography>

                <Typography>
                    Confiável: <strong>{franquia.FIN.Confiavel === true ? 'Sim' : 'Não'}</strong>
                </Typography>

                <Typography>
                    Pode retirar: <strong>{franquia.FIN.PodeRetirar === 'S' ? 'Sim' : 'Não'}</strong>
                </Typography>

                <Typography>
                    Bloqueado: <strong>{franquia.FIN.Bloqueado === 'S' ? 'Sim' : 'Não'}</strong>
                </Typography>

                <Typography>
                    Condição de pagamento: <strong>{franquia.FIN.CondicaoPagPadrao}</strong>
                </Typography>
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
    }
}));

const montaEndereco = (cli) => {
    let res = ''

    if (cli.Logradouro !== null && String(cli.Logradouro).trim() !== '') {
        res.length > 0 ? res = res.concat(`, ${cli.Logradouro}`).trim() : res = res.concat(cli.Logradouro).trim()
    }

    if (cli.Numero !== null && String(cli.Numero).trim() !== '') {
        res.length > 0 ? res = res.concat(`, ${cli.Numero}`).trim() : res = res.concat(cli.Numero).trim()
    }

    if (cli.Complemento !== null && String(cli.Complemento).trim() !== '') {
        res.length > 0 ? res = res.concat(`, ${cli.Complemento}`).trim() : res = res.concat(cli.Complemento).trim()
    }

    if (cli.Bairro !== null && String(cli.Bairro).trim() !== '') {
        res.length > 0 ? res = res.concat(`, ${cli.Bairro}`).trim() : res = res.concat(cli.Bairro).trim()
    }

    if (cli.Municipio !== null && String(cli.Municipio).trim() !== '') {
        res.length > 0 ? res = res.concat(`, ${cli.Municipio}`).trim() : res = res.concat(cli.Municipio).trim()
    }

    if (cli.UF !== null && String(cli.UF).trim() !== '') {
        res.length > 0 ? res = res.concat(`, ${cli.UF}`).trim() : res = res.concat(cli.UF).trim()
    }

    if (cli.CEP !== null && String(cli.CEP).trim() !== '') {
        res.length > 0 ? res = res.concat(`, ${cli.CEP}`).trim() : res = res.concat(cli.CEP).trim()
    }

    return res
}