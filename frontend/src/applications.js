import * as React from "react";
import { List, Edit, Create, FunctionField, DateField, SimpleForm, ReferenceInput, TextInput, SelectInput, Datagrid, TextField, EditButton, required } from 'react-admin';
import { useMediaQuery } from '@material-ui/core';

const ApplicationsTitle = ({ record }) => {
    return <span>Edit application: {record ? `"${record.name}"` : ''}</span>;
};

export const ApplicationsList = (props) => {
    const isSmall = useMediaQuery(theme => theme.breakpoints.down('sm'));
    return (
        <List {...props}>
            {isSmall ? (
                <Datagrid>
                    <TextField source="name" />
                    <FunctionField label="Last status" render={
                        record => {
                            if (record.last_status === "success") {
                                return (
                                    <div style={{ background: '#008000', borderRadius: '10px', }}>
                                        <p style={{ color: "white", textAlign: "center" }}>Online</p>
                                    </div>)
                            } else if (record.last_status === "error") {
                                return (
                                    <div style={{ background: '#FF0000', borderRadius: '10px', }}>
                                        <p style={{ color: "white", textAlign: "center" }}>Offline</p>
                                    </div>)
                            } else {
                                return (
                                    <div style={{ background: '#D3D3D3', borderRadius: '10px', }}>
                                        <p style={{ color: "black", textAlign: "center" }}>Unchecked</p>
                                    </div>)
                            }
                        }} />
                    <EditButton />
                </Datagrid>
            ) : (
                    <Datagrid>
                        <TextField source="id" />
                        <TextField source="name" />
                        <TextField label="Telegram" source="users_telegram_id" />
                        <TextField label="Trigger" source="triggers_id" />
                        <TextField label="Server" source="servers_id" />
                        <FunctionField label="Last status" render={
                            record => {
                                if (record.last_status === "success") {
                                    return (
                                        <div style={{ background: '#008000', borderRadius: '10px', }}>
                                            <p style={{ color: "white", textAlign: "center" }}>Online</p>
                                        </div>)
                                } else if (record.last_status === "error") {
                                    return (
                                        <div style={{ background: '#FF0000', borderRadius: '10px', }}>
                                            <p style={{ color: "white", textAlign: "center" }}>Offline</p>
                                        </div>)
                                } else {
                                    return (
                                        <div style={{ background: '#D3D3D3', borderRadius: '10px', }}>
                                            <p style={{ color: "black", textAlign: "center" }}>Unchecked</p>
                                        </div>)
                                }
                            }} />
                        <DateField showTime source="last_check" />
                        <EditButton />
                    </Datagrid>
                )}
        </List>
    )
}

export const ApplicationsEdit = props => (
    <Edit title={<ApplicationsTitle />} {...props}>
        <SimpleForm>
            <TextInput disabled source="id" />
            <TextInput source="name" validate={[required()]} />
            <ReferenceInput label="Telegram" source="users_telegram_id" reference="telegram">
                <SelectInput optionText="name" />
            </ReferenceInput>
            <ReferenceInput label="Trigger" source="triggers_id" reference="triggers">
                <SelectInput optionText="name" />
            </ReferenceInput>
            <ReferenceInput label="Server" source="servers_id" reference="servers">
                <SelectInput optionText="name" />
            </ReferenceInput>
            <SelectInput source="protocol" choices={[
                { id: 'https', name: 'https' },
                { id: 'http', name: 'http' },
            ]} validate={[required()]} />
            <TextInput source="url_or_ip" validate={[required()]} />
            <TextInput source="port" />
            <TextInput source="correct_request_status" />
            <SelectInput source="check_interval" choices={[
                { id: '60000', name: '1 minute' },
                { id: '120000', name: '2 minutes' },
                { id: '180000', name: '3 minutes' },
                { id: '300000', name: '5 minutes' },
                { id: '600000', name: '10 minutes' },
                { id: '900000', name: '15 minutes' },
                { id: '1800000', name: '30 minutes' },
                { id: '3600000', name: '1 hour' },
                { id: '7200000', name: '2 hours' },
                { id: '10800000', name: '3 hours' },
                { id: '36000000', name: '10 hours' },
                { id: '54000000', name: '15 hours' },
                { id: '86400000', name: '1 day' },
            ]} validate={[required()]} />
            <SelectInput source="attempts_limit" choices={[
                { id: '1', name: '1' },
                { id: '2', name: '2' },
                { id: '3', name: '3' },
                { id: '4', name: '4' },
                { id: '5', name: '5' },
                { id: '6', name: '6' },
                { id: '7', name: '7' },
                { id: '8', name: '8' },
                { id: '9', name: '9' },
                { id: '10', name: '10' }
            ]} validate={[required()]} />
        </SimpleForm>
    </Edit>
);

export const ApplicationsCreate = props => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="name" validate={[required()]} />
            <ReferenceInput label="Telegram" source="users_telegram_id" reference="telegram">
                <SelectInput optionText="name" />
            </ReferenceInput>
            <ReferenceInput label="Trigger" source="triggers_id" reference="triggers">
                <SelectInput optionText="name" />
            </ReferenceInput>
            <ReferenceInput label="Server" source="servers_id" reference="servers">
                <SelectInput optionText="name" />
            </ReferenceInput>
            <SelectInput source="protocol" choices={[
                { id: 'https', name: 'https' },
                { id: 'http', name: 'http' },
            ]} validate={[required()]} />
            <TextInput source="url_or_ip" validate={[required()]} />
            <TextInput source="port" />
            <TextInput source="correct_request_status" />
            <SelectInput source="check_interval" choices={[
                { id: '60000', name: '1 minute' },
                { id: '120000', name: '2 minutes' },
                { id: '180000', name: '3 minutes' },
                { id: '300000', name: '5 minutes' },
                { id: '600000', name: '10 minutes' },
                { id: '900000', name: '15 minutes' },
                { id: '1800000', name: '30 minutes' },
                { id: '3600000', name: '1 hour' },
                { id: '7200000', name: '2 hours' },
                { id: '10800000', name: '3 hours' },
                { id: '36000000', name: '10 hours' },
                { id: '54000000', name: '15 hours' },
                { id: '86400000', name: '1 day' },
            ]} validate={[required()]} />
            <SelectInput source="attempts_limit" choices={[
                { id: '1', name: '1' },
                { id: '2', name: '2' },
                { id: '3', name: '3' },
                { id: '4', name: '4' },
                { id: '5', name: '5' },
                { id: '6', name: '6' },
                { id: '7', name: '7' },
                { id: '8', name: '8' },
                { id: '9', name: '9' },
                { id: '10', name: '10' }
            ]} validate={[required()]} />
        </SimpleForm>
    </Create>
);