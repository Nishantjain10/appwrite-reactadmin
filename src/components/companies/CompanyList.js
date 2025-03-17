import React from 'react';
import {
    List,
    Datagrid,
    TextField,
    DateField,
    EditButton,
    DeleteButton,
    TextInput,
    FilterButton,
    CreateButton,
    ExportButton,
    TopToolbar,
    UrlField,
} from 'react-admin';
import { DuplicateButton } from '../common/DuplicateButton';
import { DuplicateCollectionButton } from '../common/DuplicateCollectionButton';

const CompanyFilters = [
    <TextInput source="q" label="Search" alwaysOn />,
    <TextInput source="name" />,
    <TextInput source="industry" />,
];

const CompanyListActions = ({ client }) => (
    <TopToolbar>
        <FilterButton />
        <CreateButton />
        <ExportButton />
        <DuplicateCollectionButton resource="companies" client={client} />
    </TopToolbar>
);

export const CompanyList = ({ client }) => (
    <List
        filters={CompanyFilters}
        actions={<CompanyListActions client={client} />}
        perPage={25}
        sort={{ field: 'name', order: 'ASC' }}
    >
        <Datagrid rowClick="edit">
            <TextField source="name" />
            <TextField source="industry" />
            <TextField source="size" />
            <UrlField source="website" />
            <DateField source="createdAt" />
            <EditButton />
            <DuplicateButton resource="companies" />
            <DeleteButton />
        </Datagrid>
    </List>
); 