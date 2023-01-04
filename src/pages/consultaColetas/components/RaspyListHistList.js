import React from 'react'

import { RaspyListHistItem } from './RaspyListHistItem'

export const RaspyListHistList = ({ Hist }) => {
    return (
        <div style={{ width: '100%' }}>
            <RaspyListHistItem Hist={null} header={true} />
            {Hist.map(h => <RaspyListHistItem Hist={h} header={false} />)}
        </div>
    )
}