import React from 'react'

import { FranquiaList } from './franquiaList'

export const Main = ({ franquias, onOpenDetailsModal }) => {
    return(
        <FranquiaList 
            Franquias={franquias}
            onOpenDetailsModal={onOpenDetailsModal}
        />
    )
}