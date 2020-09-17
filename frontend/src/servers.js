import * as React from "react";
import { List, Edit, Filter, Create, PasswordInput, SimpleForm, ReferenceInput, TextInput, SelectInput, Datagrid, TextField, EditButton } from 'react-admin';

const ServersTitle = ({ record }) => {
    return <span>Edit server: {record ? `"${record.name}"` : ''}</span>;
};

const ServersFilter = (props) => (
    <Filter {...props}>
        <TextInput label="Search" source="name" alwaysOn />
        <ReferenceInput label="Servers" source="name" reference="servers" allowEmpty>
            <SelectInput optionText="description" />
        </ReferenceInput>
    </Filter>
);

export const ServersList = (props) => {
    return (<List filters={<ServersFilter />} {...props}>
        <Datagrid rowClick="edit">
            <TextField source="id" />
            <TextField source="description" />
            <TextField source="ip" />
            <TextField source="ssh_key" />
            <EditButton />
        </Datagrid>
    </List>
    )
}

export const ServersEdit = props => (
    <Edit title={<ServersTitle />} {...props}>
        <SimpleForm>
            <TextInput disabled source="id" />
            <TextInput source="description" />
            <TextInput source="ip" />
            <TextInput source="ssh_key" />
        </SimpleForm>
    </Edit>
);

export const ServersCreate = props => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="description" />
            <TextInput source="ip" />
            <TextInput source="ssh_key" />
        </SimpleForm>
    </Create>
);