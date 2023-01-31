import React, { useState } from 'react'
import { api } from '../../../services/api'

import { Button, Typography } from '@material-ui/core'
import { Check } from "@material-ui/icons/";

import DatePicker from "../../../components/materialComponents/datePicker";
import { Toast } from '../../../components/toasty'
import { convertData } from "../../../misc/commom_functions";

export const Expedicao = ({ Req, onClose, onRefresh, stage }) => {
    const [wait, setWait] = useState(false)
    const [prevDate, setPrev] = useState(null);

    const handleManagement = async (action) => {
        setWait(true);
        let toastId = null

        try {
            toastId = Toast('Aguarde...', 'wait')
            await api.put("/equip/requests/validate", {
                OSID: Req.OSCId,
                action: action,
                reject: null,
                prev: prevDate,
            });

            Toast('Atualização gravada', 'update', toastId, 'success')
            onClose();
            onRefresh()
        } catch (err) {
            Toast('Falha ao atualizar', 'update', toastId, 'error')
            setWait(false);
        }
    };

    const updateDate = (date) => {
        date instanceof Date && !isNaN(date) ? setPrev(date) : setPrev(null);
    };

    return stage === 4
        ? (
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
                    <div
                        className="XAlign"
                        style={{
                            justifyContent: "space-between",
                            alignItems: "flex-end",
                        }}
                    >
                        <DatePicker
                            label="Data Estimada"
                            onChange={(e) => updateDate(e._d)}
                        />
                        <Button
                            style={{
                                marginBottom: "8px",
                                border:
                                    prevDate !== null && !wait
                                        ? "1px solid #000"
                                        : "1px solid #CCC",
                            }}
                            disabled={prevDate !== null && !wait ? false : true}
                            onClick={(e) => handleManagement("accept")}
                        >
                            <Check />
                            Gravar
                        </Button>
                    </div>

                    <label style={{ all: "unset" }}>
                        Data esperada: {convertData(Req.OSCDtPretendida)}
                    </label>
                </div>
            </div>
        )
        : (
            <Typography>
                Você não pode gerenciar essa solicitação no momento
            </Typography>
        )
}