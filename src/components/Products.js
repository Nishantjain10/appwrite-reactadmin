import React from 'react';
import { 
    List,
    Datagrid,
    TextField,
    useGetList,
} from 'react-admin';
import { 
    Box, 
    Typography,
    IconButton,
    InputAdornment,
    TextField as MuiTextField,
    Menu,
    MenuItem,
} from '@mui/material';
import {
    Search as SearchIcon,
    MoreHoriz as MoreIcon,
} from '@mui/icons-material';

const CustomDatagrid = () => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [selectedId, setSelectedId] = React.useState(null);

    const handleClick = (event, id) => {
        setAnchorEl(event.currentTarget);
        setSelectedId(id);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setSelectedId(null);
    };

    // Mock data for products
    const mockProducts = [
        { id: '6823419057', name: 'Jogging pants', price: '$999', totalSales: 150 },
        { id: '9576384210', name: 'T-shirt', price: '$80', totalSales: 33 },
        { id: '7839204581', name: 'Jeans', price: '$80', totalSales: 234 },
        { id: '5927041839', name: 'Socks', price: '$80', totalSales: 4 },
        { id: '8546102379', name: 'Classic shoes', price: '$80', totalSales: 45 },
        { id: '6712984350', name: 'Black sneakers', price: '$80', totalSales: 6 },
        { id: '9837461025', name: 'Grey sneakers', price: '$80', totalSales: 90 },
        { id: '4021756893', name: 'Long sleeve', price: '$80', totalSales: 120 },
        { id: '5764932180', name: 'Sweater', price: '$80', totalSales: 30 },
        { id: '2049817365', name: 'Hoodie', price: '$80', totalSales: 4 },
        { id: '6823419057', name: 'Sunglasses', price: '$80', totalSales: 90 },
        { id: '9576384210', name: 'Sweatshirt', price: '$80', totalSales: 120 },
    ];

    return (
        <>
            <Datagrid
                data={mockProducts}
                bulkActionButtons={false}
                sx={{
                    '& .RaDatagrid-headerCell': {
                        backgroundColor: '#fff',
                        fontWeight: 500,
                        color: '#6B7280',
                        borderBottom: '1px solid #EDEDF0',
                        padding: '12px 16px',
                    },
                    '& .RaDatagrid-row': {
                        backgroundColor: '#fff',
                        '&:hover': {
                            backgroundColor: '#F9FAFB',
                        }
                    },
                    '& .MuiTableCell-root': {
                        borderBottom: '1px solid #EDEDF0',
                        padding: '12px 16px',
                        color: '#111827',
                    },
                }}
            >
                <TextField source="name" label="Name" />
                <TextField source="price" label="Price" />
                <TextField source="totalSales" label="Total sales" />
                <TextField source="id" label="ID" />
                <TextField
                    source="id"
                    label=""
                    render={(record) => (
                        <IconButton
                            size="small"
                            onClick={(e) => handleClick(e, record.id)}
                        >
                            <MoreIcon fontSize="small" />
                        </IconButton>
                    )}
                />
            </Datagrid>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                PaperProps={{
                    sx: {
                        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
                        border: '1px solid #EDEDF0',
                    }
                }}
            >
                <MenuItem onClick={handleClose}>Edit</MenuItem>
                <MenuItem onClick={handleClose} sx={{ color: '#EF4444' }}>Delete</MenuItem>
            </Menu>
        </>
    );
};

const Products = () => {
    return (
        <Box sx={{ p: '28px', bgcolor: '#FAFAFB', minHeight: '100vh' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, color: '#111827' }}>
                    Products
                </Typography>
                <MuiTextField
                    placeholder="Search products"
                    variant="outlined"
                    size="small"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon sx={{ color: '#9CA3AF' }} />
                            </InputAdornment>
                        ),
                    }}
                    sx={{
                        width: 240,
                        '& .MuiOutlinedInput-root': {
                            backgroundColor: '#fff',
                            '& fieldset': {
                                borderColor: '#E5E7EB',
                            },
                            '&:hover fieldset': {
                                borderColor: '#D1D5DB',
                            },
                        }
                    }}
                />
            </Box>

            <Box
                sx={{
                    bgcolor: '#fff',
                    border: '1px solid #EDEDF0',
                    borderRadius: 1,
                    overflow: 'hidden',
                }}
            >
                <CustomDatagrid />
            </Box>
        </Box>
    );
};

export default Products; 