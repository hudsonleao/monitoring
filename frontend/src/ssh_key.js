import * as React from "react";
import { List, Edit, Create, SimpleForm, DateTimeInput, FunctionField, BooleanInput, TextInput, Datagrid, TextField, DateField, EditButton, required } from 'react-admin';
import './sshkey.css';
import { useMediaQuery } from '@material-ui/core';
const SshKeyTitle = ({ record }) => {
    return <span>Edit SSH key: {record ? `"${record.name}"` : ''}</span>;
};

export const SshKeyList = (props) => {
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
                    <FunctionField label="SSH key" render={
                        record => {
                            if (record.ssh_key) {
                            let sshKey = record.ssh_key.slice(0, 15) + "..."
                            return (
                                <span>{sshKey}<button class="buttonCopy"
                                    onClick={() => { navigator.clipboard.writeText(record.ssh_key); alert("SSH key copied!") }}
                                >Copy
                    </button></span>

                            )
                        }}} />
                    <DateField source="expiration_date" showTime />
                    <EditButton />
                </Datagrid>
            )}
    </List>
    )
}

export const SshKeyEdit = props => (
    <Edit title={<SshKeyTitle />} {...props}>
        <SimpleForm>
            <TextInput disabled source="id" />
            <TextInput disabled source="ssh_key" />
            <BooleanInput label="Generate new ssh key" source="generate_new_ssh_key" />
            <TextInput source="name" validate={[required()]}/>
            <DateTimeInput source="expiration_date" />
        </SimpleForm>
    </Edit>
);

export const SshKeyCreate = props => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="name" validate={[required()]}/>
            <DateTimeInput source="expiration_date" />
        </SimpleForm>
    </Create>
);