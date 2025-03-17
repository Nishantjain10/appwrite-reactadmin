import React from 'react';
import {
    List,
    Datagrid,
    TextField,
    EmailField,
    DateField,
    EditButton,
    DeleteButton,
    TextInput,
    FilterButton,
    CreateButton,
    ExportButton,
    TopToolbar,
    Empty,
} from 'react-admin';
import { DuplicateButton } from '../common/DuplicateButton';
import { DuplicateCollectionButton } from '../common/DuplicateCollectionButton';

const ContactFilters = [
    <TextInput source="q" label="Search" alwaysOn />,
    <TextInput source="name" />,
    <TextInput source="email" />,
];

const ContactListActions = ({ client }) => (
    <TopToolbar>
        <FilterButton />
        <CreateButton />
        <ExportButton />
        <DuplicateCollectionButton resource="contacts" client={client} />
    </TopToolbar>
);

// Custom Empty component
const CustomEmpty = () => (
    <Empty
        title="No contacts yet"
        message="Click 'Add Dummy Data' on the dashboard or use 'Create' to add contacts"
    />
);

export const ContactList = ({ client }) => (
    <List
        filters={ContactFilters}
        actions={<ContactListActions client={client} />}
        perPage={25}
        sort={{ field: 'name', order: 'ASC' }}
        empty={<CustomEmpty />}
    >
        <Datagrid rowClick="edit">
            <TextField source="name" />
            <EmailField source="email" />
            <TextField source="phone" />
            <TextField source="company" />
            <DateField source="createdAt" />
            <EditButton />
            <DuplicateButton resource="contacts" />
            <DeleteButton />
        </Datagrid>
    </List>
); 