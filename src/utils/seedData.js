import { Client, Databases, ID } from "appwrite";

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('677bd5cc003630d0aea1');

const databases = new Databases(client);

export const seedData = async () => {
    try {
        // First, verify we have a valid session
        const session = localStorage.getItem('user');
        if (!session) {
            throw new Error('No active session. Please login first.');
        }

        // Add a contact
        const contact = await databases.createDocument(
            '67c5cbfb00223e74a63d',  // Database ID
            '67c5cc06000f228369fe',  // Contacts Collection ID
            ID.unique(),
            {
                name: 'John Smith',
                email: 'john.smith@example.com',
                phone: '+1-555-123-4567',
                company: 'Tech Corp',
                createdAt: new Date().toISOString()
            }
        );
        console.log('Contact created:', contact);

        // Add a company
        const company = await databases.createDocument(
            '67c5cbfb00223e74a63d',  // Database ID
            '67c5cc1b001b55c7d99b',  // Companies Collection ID
            ID.unique(),
            {
                name: 'Tech Corp',
                industry: 'Technology',
                size: '500+',
                website: 'https://techcorp.example.com',
                createdAt: new Date().toISOString()
            }
        );
        console.log('Company created:', company);

        // Refresh the page to see the new data
        window.location.reload();

    } catch (error) {
        console.error('Error adding data:', error);
        if (error.response) {
            console.error('Appwrite error:', error.response.message);
        }
        alert('Error creating documents. Check console for details.');
    }
}; 