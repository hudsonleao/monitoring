import * as React from "react";
import { List, Edit, Filter, Create, FunctionField, DateField, SimpleForm, ReferenceInput, TextInput, SelectInput, Datagrid, TextField, EditButton } from 'react-admin';

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
    return (
            <List filters={<ApplicationsFilter />} {...props}>
                <Datagrid rowClick="edit">
                    <TextField source="id" />
                    <TextField source="description" />
                    <TextField source="url" />
                    <TextField source="ip" />
                    <TextField source="port" />
                    <FunctionField label="Last status" render={
                        record => {if(record.last_status === "success"){
                            return( 
                            <div style={{background: '#008000', borderRadius: '10px',}}>
                            <p style={{ color:"white", textAlign:"center"}}>Online</p>
                            </div>)
                        } else {
                            return( 
                                <div style={{background: '#FF0000', borderRadius: '10px',}}>
                                <p style={{ color:"white", textAlign:"center"}}>Offline</p>
                                </div>)
                        }
                        }}/>
                    <DateField showTime source="last_check" />
                    <EditButton />
                </Datagrid>
            </List>
    )
}

export const ApplicationsEdit = props => (
    <Edit title={<ApplicationsTitle />} {...props}>
        <SimpleForm>
            <TextInput disabled source="id" />
            <TextInput source="description" />
            <SelectInput source="protocol" choices={[
                { id: 'https', name: 'https' },
                { id: 'http', name: 'http' },
            ]} />
            <TextInput source="url" />
            <TextInput source="ip" />
            <TextInput source="port" />
        </SimpleForm>
    </Edit>
);

export const ApplicationsCreate = props => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="description" />
            <SelectInput source="protocol" choices={[
                { id: 'https', name: 'https' },
                { id: 'http', name: 'http' },
            ]} />
            <TextInput source="url" />
            <TextInput source="ip" />
            <TextInput source="port" />
        </SimpleForm>
    </Create>
);