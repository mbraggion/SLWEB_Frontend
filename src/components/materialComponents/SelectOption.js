import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';

export default function SelectOption(props) {
	return <MenuItem {...props.value}>{props.children}</MenuItem>;
}
