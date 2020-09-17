import * as React from "react";
import { List, Datagrid, TextField } from 'react-admin';

export const UsersLevelList = (props) => {
    return (<List {...props}>
        <Datagrid>
            <TextField source="id" />
            <TextField source="name" />
        </Datagrid>
    </List>
    )
}