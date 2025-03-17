import React from 'react';
import {
    Create,
    SimpleForm,
    TextInput,
    DateInput,
    required,
    email,
} from 'react-admin';

export const ContactCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source="name" validate={[required()]} />
            <TextInput source="email" validate={[required(), email()]} />
            <TextInput source="phone" />
            <TextInput source="company" />
            <DateInput source="createdAt" defaultValue={new Date()} />
        </SimpleForm>
    </Create>
); 