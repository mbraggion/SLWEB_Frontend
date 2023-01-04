import React from 'react'
import PropTypes from 'prop-types';

import { Panel } from '../../components/commom_in'

import { makeStyles } from '@material-ui/core/styles';
import { Paper, Tabs, Tab } from '@material-ui/core/';
import { EmojiFoodBeverage as EmojiFoodBeverageIcon, AttachMoney as AttachMoneyIcon } from '@material-ui/icons'

import { Leituras } from './leituras'
import { SLRaspy } from './slraspy'

const ConsultaColetas = ({ match }) => {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Panel
      style={{
        padding: "0px",
      }}
    >
      {/* <Paper className={classes.root}>
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="Coletas" {...a11yProps(0)} icon={<EmojiFoodBeverageIcon />} />
          <Tab label="SLRaspy" {...a11yProps(1)} icon={<AttachMoneyIcon />} />
        </Tabs>
        <TabPanel value={value} index={0}> */}
          <Leituras match={match} />
        {/* </TabPanel>
        <TabPanel value={value} index={1}>
          <SLRaspy match={match} />
        </TabPanel>
      </Paper> */}
    </Panel>
  )
}

export default ConsultaColetas


const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    width: '100%',
    height: '100%',
    padding: '8px'
  },
});

function TabPanel(props) {
  const { children, value, index } = props;

  return value === index
        ? children
        : null
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}