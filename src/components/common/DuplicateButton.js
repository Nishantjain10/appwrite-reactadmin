import React from 'react';
import { Button, useNotify, useRefresh, useRecordContext, useDataProvider } from 'react-admin';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

export const DuplicateButton = ({ resource }) => {
    const record = useRecordContext();
    const notify = useNotify();
    const refresh = useRefresh();
    const dataProvider = useDataProvider();

    if (!record) return null;

    const handleClick = async (e) => {
        e.stopPropagation(); // Prevent row click event
        try {
            await dataProvider.duplicate(resource, { id: record.id });
            notify('Record duplicated successfully', { type: 'success' });
            refresh();
        } catch (error) {
            console.error('Duplication error:', error);
            notify('Error duplicating record: ' + error.message, { type: 'error' });
        }
    };

    return (
        <Button
            label="Duplicate"
            onClick={handleClick}
            color="primary"
            size="small"
            sx={{ 
                minWidth: 'auto',
                '& .MuiButton-startIcon': { margin: 0 }
            }}
        >
            <ContentCopyIcon />
        </Button>
    );
}; 