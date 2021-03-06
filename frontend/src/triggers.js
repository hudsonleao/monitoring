import * as React from "react";
import { List, Edit, Create, SimpleForm, FunctionField, TextInput, Datagrid, TextField, EditButton, required } from 'react-admin';
import { useMediaQuery } from '@material-ui/core';

const TriggersTitle = ({ record }) => {
    return <span>Edit trigger: {record ? `"${record.name}"` : ''}</span>;
};

export const TriggersList = (props) => {
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
            <FunctionField label="Command" render={
                        record => {
                            let Command = record.command.slice(0, 30) + "..."
                            return (
                                Command
                            )
                        }} />
            <EditButton />
        </Datagrid>
        )}
    </List>
    )
}

export const TriggersEdit = props => (
    <Edit title={<TriggersTitle />} {...props}>
        <SimpleForm>
            <TextInput disabled source="id" />
            <TextInput source="name" validate={[required()]}/>
            <TextInput source="command" validate={[required()]}/>
        </SimpleForm>
    </Edit>
);

export const TriggersCreate = props => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="name" validate={[required()]}/>
            <TextInput source="command" validate={[required()]}/>
        </SimpleForm>
    </Create>
);