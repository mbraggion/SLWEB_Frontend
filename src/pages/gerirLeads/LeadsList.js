import React from 'react'

import { LeadItem } from './LeadItem'
import { makeStyles } from '@material-ui/core'

export const LeadsList = ({ Leads, onOpenModal }) => {
  const classes = useStyles()

  return (
    <div className={classes.container}>
      {Leads.map((lead, index) =>
        <LeadItem
          key={lead.Id}
          Lead={lead}
          i={index}
          onOpenModal={onOpenModal}
        />
      )}
    </div>
  )
}

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'no-wrap',
    width: '100%',
    maxHeight: 'calc(100% - 100px)',
    maxWidth: '900px',
    background: 'unset',
    overflowY: 'auto',
    overflowX: 'hidden',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderRadius: '0px 0px 4px 4px',
    borderBottom: `5px solid #000`,
    borderLeft: `1px solid #000`,
    borderRight: `1px solid #000`,
    borderTop: `1px solid #CCC`,
    paddingTop: '8px',

    '@media (max-width: 800px)': {
      maxHeight: 'calc(100% - 158px)',
    }
  }
}))