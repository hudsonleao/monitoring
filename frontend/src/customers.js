import * as React from "react";
import { List, Edit, Filter, Create, SimpleForm, ReferenceInput, ReferenceField, TextInput, SelectInput, Datagrid, TextField, EditButton } from 'react-admin';

const CustomersTitle = ({ record }) => {
    return <span>Edit customer: {record ? `"${record.description}"` : ''}</span>;
};

const CustomersFilter = (props) => (
    <Filter {...props}>
        <TextInput label="Search" source="q" alwaysOn />
        <ReferenceInput label="Customers" source="Customersid" reference="customers" allowEmpty>
            <SelectInput optionText="description" />
        </ReferenceInput>
    </Filter>
);

export const CustomersList = (props) => {
    return (<List filters={<CustomersFilter />} {...props}>
        <Datagrid rowClick="edit">
            <TextField source="id" />
            <TextField source="plans_id" />
            <TextField source="name" />
            <TextField source="address" />
            <TextField source="city" />
            <TextField source="phone_number" />
            <TextField source="document" />
            <EditButton />
        </Datagrid>
    </List>
    )
}

export const CustomersEdit = (props) => {
    return (<Edit title={<CustomersTitle />} {...props}>
        <SimpleForm>
            <TextInput disabled source="id" />
            <ReferenceInput label="Plans" source="plans_id" reference="plans">
                <SelectInput optionText="name" />
            </ReferenceInput>
            <TextInput source="name" />
            <TextInput source="email" />
            <TextInput source="address" />
            <TextInput source="city" />
            <TextInput source="phone_number" />
            <TextInput source="document" />
        </SimpleForm>
    </Edit>
    )
};

export const CustomersCreate = props => (
    <Create {...props}>
        <SimpleForm>
            <ReferenceInput label="Plans" source="plansId" reference="plans">
                <SelectInput optionText="name" />
            </ReferenceInput>
            <TextInput source="name" />
            <TextInput source="email" />
            <TextInput source="address" />
            <TextInput source="city" />
            <TextInput source="phone_number" />
            <TextInput source="document" />
        </SimpleForm>
    </Create>
);