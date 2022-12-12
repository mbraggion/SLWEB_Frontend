import React, { useEffect, useState } from 'react'
import moment from 'moment'

import { TextField, Divider, Tooltip, Typography, makeStyles } from '@material-ui/core'

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
            const response = await api.get(`/administrar/franquia/${grpven}`)

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

                {franquia.PF.map(pf => (
                    <div>
                        <TextField
                            variant="outlined"
                            label='Franqueado'
                            disabled={true}
                            value={pf.Nome}
                            onChange={() => { }}
                        />
                        <TextField
                            variant="outlined"
                            label='CPF'
                            disabled={true}
                            value={pf.CPF}
                            onChange={() => { }}
                        />
                        <TextField
                            variant="outlined"
                            label='Email'
                            disabled={true}
                            value={pf.Email}
                            onChange={() => { }}
                        />
                        <TextField
                            variant="outlined"
                            label='Telefone'
                            disabled={true}
                            value={pf.Telefone}
                            onChange={() => { }}
                        />
                        <TextField
                            variant="outlined"
                            multiline
                            label='Endereço'
                            disabled={true}
                            value={montaEndereco(pf)}
                            onChange={() => { }}
                        />
                    </div>
                ))}

                {franquia.PJ.map(pj => (
                    <>
                        <TextField
                            variant="outlined"
                            label='Empresa'
                            disabled={true}
                            value={pj.RazaoSocial}
                            onChange={() => { }}
                        />
                        <TextField
                            variant="outlined"
                            label='CNPJ'
                            disabled={true}
                            value={pj.CNPJ}
                            onChange={() => { }}
                        />
                        <TextField
                            variant="outlined"
                            label='Email'
                            disabled={true}
                            value={pj.Email}
                            onChange={() => { }}
                        />
                        <TextField
                            variant="outlined"
                            label='Telefone'
                            disabled={true}
                            value={pj.Telefone}
                            onChange={() => { }}
                        />
                        <TextField
                            variant="outlined"
                            multiline
                            label='Endereço'
                            disabled={true}
                            value={montaEndereco(pj)}
                            onChange={() => { }}
                        />
                    </>
                ))}

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

                <Typography>Clientes cadastrados: {franquia.CAR.Clientes.reduce((acc, t) => {
                    return acc + Number(t.Qtd)
                }, 0)}[{franquia.CAR.Clientes.filter(t => t.Status === 'A')[0].Qtd} Ativos]</Typography>
                {franquia.CAR.AtivosDist.map(ad => (
                    <Typography>{ad.PdvStatus === 'Max' ? 'Total' : ad.PdvStatus === 'A' ? 'Instaladas' : 'Não instaladas'}: {ad.Qtd}</Typography>
                ))}

                <div>
                    <Tooltip
                        classes={{ tooltip: classes.noMaxWidth }}
                        title={
                            <div style={{ fontSize: "14px", color: "#FFF", lineHeight: "20px" }} >
                                {franquia.CAR.AtivosStatus.filter(AS => AS.LeitOk.trim() === 'OK').map(AS => (
                                    <Typography color="inherit" style={{ whiteSpace: 'nowrap' }}>{AS.EquiCod} -&gt; {montaEndereco(AS)}</Typography>
                                ))}
                            </div>
                        }
                        placement="bottom"
                        arrow={true}
                    >
                        <Typography>Telemetria OK: {franquia.CAR.AtivosStatus.filter(AS => AS.LeitOk.trim() === 'OK').length}</Typography>
                    </Tooltip>
                </div>
                <div>
                    <Tooltip
                        classes={{ tooltip: classes.noMaxWidth }}
                        title={
                            <div style={{ fontSize: "14px", color: "#FFF", lineHeight: "20px" }} >
                                {franquia.CAR.AtivosStatus.filter(AS => AS.LeitOk.trim() === 'KO').map(AS => (
                                    <Typography color="inherit" style={{ whiteSpace: 'nowrap' }}>{AS.EquiCod} -&gt; {montaEndereco(AS)}</Typography>
                                ))}
                            </div>
                        }
                        placement="bottom"
                        arrow={true}
                    >
                        <Typography>Telemetria KO: {franquia.CAR.AtivosStatus.filter(AS => AS.LeitOk.trim() === 'KO').length}</Typography>
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
                    }).format(franquia.FIN.LimiteExtra)}</strong> [válido em {moment(franquia.FIN.DtExtraConcedido).format('L')}]
                </Typography>

                <Typography>
                    Mínimo de compra: <strong>{franquia.FIN.MinCompra}</strong>
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