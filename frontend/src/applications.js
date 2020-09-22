import * as React from "react";
import { List, Edit, Filter, Create, FunctionField, DateField, SimpleForm, ReferenceInput, TextInput, SelectInput, Datagrid, TextField, EditButton, required } from 'react-admin';
import { useMediaQuery } from '@material-ui/core';

const ApplicationsTitle = ({ record }) => {
    return <span>Edit application: {record ? `"${record.name}"` : ''}</span>;
};

const ApplicationsFilter = (props) => (
    <Filter {...props}>
        <TextInput label="Search" source="q" alwaysOn />
        <ReferenceInput label="Application" source="Applicationid" reference="aplications" allowEmpty>
            <SelectInput optionText="name" />
        </ReferenceInput>
    </Filter>
);

export const ApplicationsList = (props) => {
    const isSmall = useMediaQuery(theme => theme.breakpoints.down('sm'));
    return (
        <List filters={<ApplicationsFilter />} {...props}>
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
                                } else {
                                    return (
                                        <div style={{ background: '#FF0000', borderRadius: '10px', }}>
                                            <p style={{ color: "white", textAlign: "center" }}>Offline</p>
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
                        <FunctionField label="Last status" render={
                            record => {
                                if (record.last_status === "success") {
                                    return (
                                        <div style={{ background: '#008000', borderRadius: '10px', }}>
                                            <p style={{ color: "white", textAlign: "center" }}>Online</p>
                                        </div>)
                                } else {
                                    return (
                                        <div style={{ background: '#FF0000', borderRadius: '10px', }}>
                                            <p style={{ color: "white", textAlign: "center" }}>Offline</p>
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
            <TextInput source="name" validate={[required()]}/>
            <ReferenceInput label="Telegram" source="users_telegram_id" reference="telegram">
                <SelectInput optionText="name" />
            </ReferenceInput>
            <ReferenceInput label="Trigger" source="triggers_id" reference="triggers">
                <SelectInput optionText="name" />
            </ReferenceInput>
            <SelectInput source="protocol" choices={[
                { id: 'https', name: 'https' },
                { id: 'http', name: 'http' },
            ]} validate={[required()]}/>
            <TextInput source="url_or_ip" validate={[required()]} />
            <TextInput source="port" />
        </SimpleForm>
    </Edit>
);

export const ApplicationsCreate = props => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="name" validate={[required()]}/>
            <ReferenceInput label="Telegram" source="users_telegram_id" reference="telegram">
                <SelectInput optionText="name" />
            </ReferenceInput>
            <ReferenceInput label="Trigger" source="triggers_id" reference="triggers">
                <SelectInput optionText="name" />
            </ReferenceInput>
            <SelectInput source="protocol" choices={[
                { id: 'https', name: 'https' },
                { id: 'http', name: 'http' },
            ]} validate={[required()]}/>
            <TextInput source="url_or_ip" validate={[required()]} />
            <TextInput source="port" />
        </SimpleForm>
    </Create>
);