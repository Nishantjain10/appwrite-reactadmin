import React from 'react';
import { Chip, Tooltip } from '@mui/material';
import { 
    List, 
    CheckBox, 
    DateRange, 
    Email, 
    AttachFile, 
    Functions, 
    Image, 
    TextFields, 
    Link,
    Code 
} from '@mui/icons-material';

const fieldIcons = {
    ArrayField: <List fontSize="small" />,
    BooleanField: <CheckBox fontSize="small" />,
    DateField: <DateRange fontSize="small" />,
    EmailField: <Email fontSize="small" />,
    FileField: <AttachFile fontSize="small" />,
    FunctionField: <Functions fontSize="small" />,
    ImageField: <Image fontSize="small" />,
    TextField: <TextFields fontSize="small" />,
    UrlField: <Link fontSize="small" />,
};

export const FieldTypeChip = ({ type }) => (
    <Tooltip title={`${type} Field`}>
        <Chip
            icon={fieldIcons[type] || <Code fontSize="small" />}
            label={type}
            size="small"
            sx={{ m: 0.5 }}
        />
    </Tooltip>
); 