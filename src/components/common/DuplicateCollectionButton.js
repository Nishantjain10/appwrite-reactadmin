import React from 'react';
import { Button, useNotify, useRefresh } from 'react-admin';
import { Databases, ID } from 'appwrite';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

export const DuplicateCollectionButton = ({ resource, client }) => {
    const notify = useNotify();
    const refresh = useRefresh();
    const databases = new Databases(client);

    const handleDuplicateDocuments = async () => {
        try {
            // Get source collection ID
            const sourceCollectionId = resource === 'contacts' 
                ? process.env.REACT_APP_APPWRITE_COLLECTION_ID_CONTACTS
                : process.env.REACT_APP_APPWRITE_COLLECTION_ID_COMPANIES;

            // Get all documents from source collection
            const response = await databases.listDocuments(
                process.env.REACT_APP_APPWRITE_DATABASE_ID,
                sourceCollectionId
            );

            // Create duplicates of all documents
            const duplicatePromises = response.documents.map(doc => {
                const { $id, $createdAt, $updatedAt, $permissions, $collectionId, $databaseId, ...dataToClone } = doc;
                
                return databases.createDocument(
                    process.env.REACT_APP_APPWRITE_DATABASE_ID,
                    sourceCollectionId,
                    ID.unique(),
                    {
                        ...dataToClone,
                        name: `${dataToClone.name} (Copy)`,
                        createdAt: new Date().toISOString(),
                        // Handle unique fields for contacts
                        ...(resource === 'contacts' && {
                            email: `copy-${Math.random().toString(36).substring(7)}-${dataToClone.email}`
                        })
                    }
                );
            });

            await Promise.all(duplicatePromises);
            notify(`${response.documents.length} documents duplicated successfully`, { type: 'success' });
            refresh();
        } catch (error) {
            console.error('Error duplicating documents:', error);
            notify('Error duplicating documents: ' + error.message, { type: 'error' });
        }
    };

    return (
        <Button
            label="Duplicate All"
            onClick={handleDuplicateDocuments}
            color="primary"
        >
            <ContentCopyIcon />
        </Button>
    );
}; 