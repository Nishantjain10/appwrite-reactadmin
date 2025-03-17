import React from 'react';
import {
    Edit,
    SimpleForm,
    TextInput,
    DateInput,
    required,
} from 'react-admin';

export const CompanyEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="name" validate={[required()]} />
            <TextInput source="industry" validate={[required()]} />
            <TextInput source="size" />
            <TextInput 
                source="website" 
                validate={[required()]}
                type="url"
            />
            <DateInput source="createdAt" />
        </SimpleForm>
    </Edit>
); 