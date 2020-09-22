import * as React from "react";
import { List, Edit, Filter, Create, PasswordInput, SimpleForm, ReferenceInput, TextInput, SelectInput, Datagrid, TextField, EditButton } from 'react-admin';
import { useMediaQuery } from '@material-ui/core';

const UsersTitle = ({ record }) => {
    return <span>Edit user: {record ? `"${record.name}"` : ''}</span>;
};

const UsersFilter = (props) => (
    <Filter {...props}>
        <TextInput label="Search" source="name" alwaysOn />
        <ReferenceInput label="Users" source="name" reference="users" allowEmpty>
            <SelectInput optionText="description" />
        </ReferenceInput>
    </Filter>
);

export const UsersList = (props) => {
    const isSmall = useMediaQuery(theme => theme.breakpoints.down('sm'));
    return (<List filters={<UsersFilter />} {...props}>
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
                    <TextField source="user" />
                    <EditButton />
                </Datagrid>
            )}
    </List>
    )
}

export const UsersEdit = props => (
    <Edit title={<UsersTitle />} {...props}>
        <SimpleForm>
            <TextInput disabled source="id" />
            <TextInput source="name" validate={[required()]}/>
            <TextInput source="user" validate={[required()]}/>
            <ReferenceInput label="Level" source="level" reference="userslevel" validate={[required()]}>
                <SelectInput optionText="name" />
            </ReferenceInput>
        </SimpleForm>
    </Edit>
);

export const UsersCreate = props => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="name" validate={[required()]}/>
            <TextInput source="user" validate={[required()]}/>
            <PasswordInput source="password" validate={[required()]}/>
            <ReferenceInput label="Level" source="level" reference="userslevel" validate={[required()]}>
                <SelectInput optionText="name" />
            </ReferenceInput>
        </SimpleForm>
    </Create>
);