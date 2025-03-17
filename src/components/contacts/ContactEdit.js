import React from 'react';
import {
    Edit,
    SimpleForm,
    TextInput,
    DateInput,
    required,
    email,
} from 'react-admin';

export const ContactEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="name" validate={[required()]} />
            <TextInput source="email" validate={[required(), email()]} />
            <TextInput source="phone" />
            <TextInput source="company" />
            <DateInput source="createdAt" />
        </SimpleForm>
    </Edit>
); 