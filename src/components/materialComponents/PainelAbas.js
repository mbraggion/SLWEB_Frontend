import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import { GREY_PRIMARY } from '../../misc/colors'

export default function PainelAbas(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (typeof props.activeTab !== 'undefined') {
      setValue(props.activeTab)
    }
  }, [props.activeTab])

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Tabs
          className={classes.header}
          value={value}
          onChange={handleChange}
          variant="fullWidth"
        >
          {props.titles.map((title, i) => (
            <Tab
              label={title}
              style={{ fontWeight: 'bold' }}
              {...a11yProps(i)}
              key={i}
            />
          ))}
        </Tabs>
      </AppBar>
      {props.children.map((component, i) => (
        <TabPanel
          value={value}
          index={i}
          key={i}
        >
          {component}
        </TabPanel>
      ))}
    </div>
  );
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
  header: {
    backgroundColor: GREY_PRIMARY
  }
}));