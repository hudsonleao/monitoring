import * as React from "react";
import { List, Edit, Create, SimpleForm, FunctionField, TextInput, Datagrid, TextField, EditButton, required } from 'react-admin';
import { useMediaQuery } from '@material-ui/core';
const TelegramTitle = ({ record }) => {
    return <span>Edit telegram: {record ? `"${record.name}"` : ''}</span>;
};

export const TelegramList = (props) => {
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
                    <TextField source="telegram_chat_id" />
                    <FunctionField label="Message success" render={
                        record => {
                            if (record.message_success) {
                                let Message = record.message_success.slice(0, 30) + "..."
                                return (
                                    Message
                                )
                            }
                        }} />
                        <FunctionField label="Message error" render={
                        record => {
                            if (record.message_error) {
                                let Message = record.message_error.slice(0, 30) + "..."
                                return (
                                    Message
                                )
                            }
                        }} />
                    <EditButton />
                </Datagrid>
            )}
    </List>
    )
}

export const TelegramEdit = props => (
    <Edit title={<TelegramTitle />} {...props}>
        <SimpleForm>
            <TextInput disabled source="id" />
            <TextInput source="name" validate={[required()]} />
            <TextInput source="bot_id" validate={[required()]} />
            <TextInput source="telegram_chat_id" validate={[required()]} />
            <TextInput source="message_success" validate={[required()]} />
            <TextInput source="message_error" validate={[required()]} />
        </SimpleForm>
    </Edit>
);

export const TelegramCreate = props => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="name" validate={[required()]} />
            <TextInput source="bot_id" validate={[required()]} />
            <TextInput source="telegram_chat_id" validate={[required()]} />
            <TextInput source="message_success" validate={[required()]} />
            <TextInput source="message_error" validate={[required()]} />
        </SimpleForm>
    </Create>
);