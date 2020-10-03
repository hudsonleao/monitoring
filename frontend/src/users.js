import * as React from "react";
import { List, Edit, Create, PasswordInput, SimpleForm, ReferenceInput, TextInput, SelectInput, Datagrid, TextField, EditButton, required } from 'react-admin';
import { useMediaQuery } from '@material-ui/core';

const UsersTitle = ({ record }) => {
    return <span>Edit user: {record ? `"${record.name}"` : ''}</span>;
};

export const UsersList = (props) => {
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
                    <TextField source="user" />
                    <EditButton />
                </Datagrid>
            )}
    </List>
    )
}

export const UsersEdit = (props) => (
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