import * as React from "react";
import { List, Edit, Create, SimpleForm, ReferenceInput, TextInput, SelectInput, Datagrid, TextField, EditButton, required} from 'react-admin';
import { useMediaQuery } from '@material-ui/core';

const ServersTitle = ({ record }) => {
    return <span>Edit server: {record ? `"${record.name}"` : ''}</span>;
};

export const ServersList = (props) => {
    const isSmall = useMediaQuery(theme => theme.breakpoints.down('sm'));
    return (<List {...props}>
        {isSmall ? (
            <Datagrid>
            <TextField source="id" />
            <TextField source="name" />
            <EditButton />
        </Datagrid>
        ) : (
        <Datagrid>
            <TextField source="id" />
            <TextField source="name" />
            <TextField source="server_user" />
            <TextField source="server_ip" />
            <TextField source="server_ssh_port" />
            <TextField source="ssh_key_id" />
            <EditButton />
        </Datagrid>
        )}
    </List>
    )
}

export const ServersEdit = props => (
    <Edit title={<ServersTitle />} {...props}>
        <SimpleForm>
            <TextInput disabled source="id" />
            <TextInput source="name" validate={[required()]}/>
            <TextInput source="server_user"/>
            <TextInput source="server_ip" validate={[required()]}/>
            <TextInput source="server_ssh_port"/>
            <ReferenceInput label="SSH Key" source="ssh_key_id" reference="ssh_key" validate={[required()]}>
                <SelectInput optionText="name" />
            </ReferenceInput>
        </SimpleForm>
    </Edit>
);

export const ServersCreate = props => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="name" validate={[required()]}/>
            <TextInput source="server_user"/>
            <TextInput source="server_ip" validate={[required()]}/>
            <TextInput source="server_ssh_port"/>
            <ReferenceInput label="SSH Key" source="ssh_key_id" reference="ssh_key"validate={[required()]}>
                <SelectInput optionText="name" />
            </ReferenceInput>
        </SimpleForm>
    </Create>
);