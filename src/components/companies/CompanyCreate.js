import React from 'react';
import {
    Create,
    SimpleForm,
    TextInput,
    DateInput,
    required,
} from 'react-admin';

export const CompanyCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source="name" validate={[required()]} />
            <TextInput source="industry" validate={[required()]} />
            <TextInput source="size" />
            <TextInput 
                source="website" 
                validate={[required()]}
                type="url"
            />
            <DateInput source="createdAt" defaultValue={new Date()} />
        </SimpleForm>
    </Create>
); 