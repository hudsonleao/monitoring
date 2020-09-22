import * as React from "react";
import { List, Edit, Filter, Create, SimpleForm, FunctionField, ReferenceInput, TextInput, SelectInput, Datagrid, TextField, EditButton, required } from 'react-admin';
import { useMediaQuery } from '@material-ui/core';

const TelegramTitle = ({ record }) => {
    return <span>Edit telegram: {record ? `"${record.name}"` : ''}</span>;
};

const TelegramFilter = (props) => (
    <Filter {...props}>
        <TextInput label="Search" source="name" alwaysOn />
        <ReferenceInput label="Telegram" source="name" reference="users" allowEmpty>
            <SelectInput optionText="name" />
        </ReferenceInput>
    </Filter>
);

export const TelegramList = (props) => {
    const isSmall = useMediaQuery(theme => theme.breakpoints.down('sm'));
    return (<List filters={<TelegramFilter />} {...props}>
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
            <TextField source="telegram_channel_id" />
            <FunctionField label="Message" render={
                        record => {
                            let Message = record.message.slice(0, 30) + "..."
                            return (
                                Message
                            )
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
            <TextInput source="name" validate={[required()]}/>
            <TextInput source="telegram_channel_id" validate={[required()]}/>
            <TextInput source="message" validate={[required()]}/>
        </SimpleForm>
    </Edit>
);

export const TelegramCreate = props => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="name" validate={[required()]}/>
            <TextInput source="telegram_channel_id" validate={[required()]}/>
            <TextInput source="message" validate={[required()]}/>
        </SimpleForm>
    </Create>
);