import * as React from "react";
import { List, Edit, Filter, Create, SimpleForm, ReferenceInput, TextInput, SelectInput, Datagrid, TextField, EditButton } from 'react-admin';

const PlansTitle = ({ record }) => {
    return <span>Edit application: {record ? `"${record.description}"` : ''}</span>;
};

const PlansFilter = (props) => (
    <Filter {...props}>
        <TextInput label="Search" source="q" alwaysOn />
        <ReferenceInput label="Application" source="Applicationid" reference="aplications" allowEmpty>
            <SelectInput optionText="description" />
        </ReferenceInput>
    </Filter>
);

export const PlansList = (props) => {
    return (<List filters={<PlansFilter />} {...props}>
        <Datagrid rowClick="edit">
            <TextField source="id" />
            <TextField source="name" />
            <TextField source="description" />
            <TextField source="users_limit" />
            <TextField source="applications_limit" />
            <TextField source="servers_limit" />
            <EditButton />
        </Datagrid>
    </List>
    )
}

export const PlansEdit = props => (
    <Edit title={<PlansTitle />} {...props}>
        <SimpleForm>
            <TextInput disabled source="id" />
            <TextInput source="name" />
            <TextInput source="description" />
            <TextInput source="users_limit" />
            <TextInput source="applications_limit" />
            <TextInput source="servers_limit" />

        </SimpleForm>
    </Edit>
);

export const PlansCreate = props => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="name" />
            <TextInput source="description" />
            <TextInput source="users_limit" />
            <TextInput source="applications_limit" />
            <TextInput source="servers_limit" />
        </SimpleForm>
    </Create>
);