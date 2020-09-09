import * as React from "react";
import { List, Edit, Filter, Create, SimpleForm, ReferenceInput, TextInput, SelectInput, Datagrid, TextField, EditButton } from 'react-admin';

const ApplicationsTitle = ({ record }) => {
    return <span>Edit application: {record ? `"${record.description}"` : ''}</span>;
};

const ApplicationsFilter = (props) => (
    <Filter {...props}>
        <TextInput label="Search" source="q" alwaysOn />
        <ReferenceInput label="Application" source="Applicationid" reference="aplications" allowEmpty>
            <SelectInput optionText="description" />
        </ReferenceInput>
    </Filter>
);

export const ApplicationsList = (props) => {
    return (<List filters={<ApplicationsFilter />} {...props}>
        <Datagrid rowClick="edit">
            <TextField source="id" />
            <TextField source="description" />
            <TextField source="url" />
            <TextField source="ip" />
            <TextField source="port" />
            <TextField source="last_status" />
            <TextField source="last_check" />
            <EditButton />
        </Datagrid>
    </List>
    )
}

export const ApplicationsEdit = props => (
    <Edit title={<ApplicationsTitle />} {...props}>
        <SimpleForm>
            <TextInput disabled source="id" />
            <TextInput source="description"/>
            <SelectInput source="protocol" choices={[
                { id: 'https', name: 'https' },
                { id: 'http', name: 'http' },
            ]}/>
            <TextInput source="url" />
            <TextInput source="ip" />
            <TextInput source="port" />
        </SimpleForm>
    </Edit>
);

export const ApplicationsCreate = props => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="description"/>
            <SelectInput source="protocol" choices={[
                { id: 'https', name: 'https' },
                { id: 'http', name: 'http' },
            ]}/>
            <TextInput source="url" />
            <TextInput source="ip" />
            <TextInput source="port" />
        </SimpleForm>
    </Create>
);