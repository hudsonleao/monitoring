import * as React from "react";
import { List, Edit, Filter, Create, SimpleForm, ReferenceInput, TextInput, SelectInput, Datagrid, TextField, EditButton, required } from 'react-admin';
import { useMediaQuery } from '@material-ui/core';

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
    const isSmall = useMediaQuery(theme => theme.breakpoints.down('sm'));
    return (<List filters={<CustomersFilter />} {...props}>
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
                    <TextField source="plans_id" />
                    <TextField source="address" />
                    <TextField source="city" />
                    <TextField source="phone_number" />
                    <TextField source="document" />
                    <EditButton />
                </Datagrid>
            )}
    </List>
    )
}

export const CustomersEdit = (props) => {
    return (<Edit title={<CustomersTitle />} {...props}>
        <SimpleForm>
            <TextInput disabled source="id" />
            <ReferenceInput label="Plans" source="plans_id" reference="plans" validate={[required()]}>
                <SelectInput optionText="name" />
            </ReferenceInput>
            <TextInput source="name" validate={[required()]}/>
            <TextInput source="email" validate={[required()]}/>
            <TextInput source="address"/>
            <TextInput source="city"/>
            <TextInput source="phone_number"/>
            <TextInput source="document"/>
        </SimpleForm>
    </Edit>
    )
};

export const CustomersCreate = props => (
    <Create {...props}>
        <SimpleForm>
            <ReferenceInput label="Plans" source="plans_id" reference="plans" validate={[required()]}>
                <SelectInput optionText="name" />
            </ReferenceInput>
            <TextInput source="name" validate={[required()]}/>
            <TextInput source="email" validate={[required()]}/>
            <TextInput source="address"/>
            <TextInput source="city"/>
            <TextInput source="phone_number"/>
            <TextInput source="document"/>
        </SimpleForm>
    </Create>
);