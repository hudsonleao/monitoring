import * as React from "react";
import { List, Edit, Filter, Create, SimpleForm, ReferenceInput, TextInput, SelectInput, Datagrid, TextField, EditButton, required} from 'react-admin';
import { useMediaQuery } from '@material-ui/core';

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
    const isSmall = useMediaQuery(theme => theme.breakpoints.down('sm'));
    return (<List filters={<PlansFilter />} {...props}>
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
                    <TextField source="description" />
                    <TextField source="users_limit" />
                    <TextField source="applications_limit" />
                    <TextField source="servers_limit" />
                    <EditButton />
                </Datagrid>
            )}
    </List>
    )
}

export const PlansEdit = props => (
    <Edit title={<PlansTitle />} {...props}>
        <SimpleForm>
            <TextInput disabled source="id" />
            <TextInput source="name" validate={[required()]}/>
            <TextInput source="description" />
            <TextInput source="users_limit" validate={[required()]}/>
            <TextInput source="applications_limit" validate={[required()]}/>
            <TextInput source="servers_limit" validate={[required()]}/>

        </SimpleForm>
    </Edit>
);

export const PlansCreate = props => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="name" validate={[required()]}/>
            <TextInput source="description" />
            <TextInput source="users_limit" validate={[required()]}/>
            <TextInput source="applications_limit" validate={[required()]}/>
            <TextInput source="servers_limit" validate={[required()]}/>
        </SimpleForm>
    </Create>
);