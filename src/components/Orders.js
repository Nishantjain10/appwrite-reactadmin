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
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const OrdersStats = () => {
    // Mock data for the graph
    const graphData = monthNames.map(month => ({
        name: month,
        value: Math.floor(Math.random() * 100) + 20
    }));

    return (
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            {/* Stats Cards */}
            <Box sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{ p: 3, bgcolor: '#fff', borderRadius: 1, border: '1px solid #EDEDF0', minWidth: 200 }}>
                    <Typography variant="body2" color="#6B7280" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                        Total orders
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 600, color: '#111827', mb: 0.5 }}>
                        9,700
                    </Typography>
                    <Typography variant="body2" color="#6B7280">
                        Orders
                    </Typography>
                </Box>
                <Box sx={{ p: 3, bgcolor: '#fff', borderRadius: 1, border: '1px solid #EDEDF0', minWidth: 200 }}>
                    <Typography variant="body2" color="#6B7280" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                        New orders this month
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 600, color: '#111827', mb: 0.5 }}>
                        487
                    </Typography>
                    <Typography variant="body2" color="#10B981">
                        +25% from last month
                    </Typography>
                </Box>
            </Box>

            {/* Graph */}
            <Box sx={{ flex: 1, bgcolor: '#fff', borderRadius: 1, border: '1px solid #EDEDF0', p: 2 }}>
                <ResponsiveContainer width="100%" height={120}>
                    <BarChart data={graphData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EDEDF0" />
                        <XAxis 
                            dataKey="name" 
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6B7280', fontSize: 12 }}
                        />
                        <YAxis 
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6B7280', fontSize: 12 }}
                        />
                        <Bar 
                            dataKey="value" 
                            fill="#111827"
                            radius={[2, 2, 0, 0]}
                            barSize={16}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </Box>
        </Box>
    );
};

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

    return (
        <>
            <Datagrid
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
                <TextField source="id" label="Order ID" />
                <TextField source="date" label="Date" />
                <TextField source="customerId" label="Customer ID" />
                <TextField 
                    source="totalPrice" 
                    label="Total price"
                    render={record => `$${record.totalPrice}`}
                />
                <TextField 
                    source="status" 
                    label="Delivery status"
                    render={record => (
                        <Typography
                            component="span"
                            sx={{
                                color: record.status === 'Shipped' ? '#10B981' : '#6B7280',
                                bgcolor: record.status === 'Shipped' ? '#ECFDF5' : 'transparent',
                                px: record.status === 'Shipped' ? 2 : 0,
                                py: record.status === 'Shipped' ? 1 : 0,
                                borderRadius: 1,
                            }}
                        >
                            {record.status}
                        </Typography>
                    )}
                />
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

const Orders = () => {
    // Mock data for the orders
    const mockOrders = [
        { id: '6823419057', date: 'October 29, 2024 at 1:46 pm', customerId: '6823419057', totalPrice: 150, status: 'To be shipped' },
        { id: '9576384210', date: 'October 29, 2024 at 1:46 pm', customerId: '9576384210', totalPrice: 33, status: 'To be shipped' },
        { id: '7839204581', date: 'October 29, 2024 at 1:46 pm', customerId: '7839204581', totalPrice: 234, status: 'To be shipped' },
        { id: '5927041839', date: 'October 29, 2024 at 1:46 pm', customerId: '5927041839', totalPrice: 4, status: 'To be shipped' },
        { id: '8546102379', date: 'October 29, 2024 at 1:46 pm', customerId: '8546102379', totalPrice: 45, status: 'To be shipped' },
        { id: '6712984350', date: 'October 29, 2024 at 1:46 pm', customerId: '6712984350', totalPrice: 6, status: 'To be shipped' },
        { id: '9837461025', date: 'October 29, 2024 at 1:46 pm', customerId: '9837461025', totalPrice: 90, status: 'To be shipped' },
        { id: '4021756893', date: 'October 29, 2024 at 1:46 pm', customerId: '4021756893', totalPrice: 120, status: 'Shipped' },
        { id: '5764932180', date: 'October 29, 2024 at 1:46 pm', customerId: '5764932180', totalPrice: 30, status: 'Shipped' },
        { id: '2049817365', date: 'October 29, 2024 at 1:46 pm', customerId: '2049817365', totalPrice: 4, status: 'To be shipped' },
    ];

    return (
        <Box sx={{ p: '28px', bgcolor: '#FAFAFB', minHeight: '100vh' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, color: '#111827' }}>
                    Orders
                </Typography>
                <MuiTextField
                    placeholder="Search orders"
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

            <OrdersStats />

            <List
                resource="orders"
                component="div"
                actions={null}
                sx={{
                    '& .RaList-content': {
                        boxShadow: 'none',
                        backgroundColor: 'transparent',
                        border: '1px solid #EDEDF0',
                        borderRadius: 1,
                        overflow: 'hidden',
                    }
                }}
            >
                <CustomDatagrid />
            </List>
        </Box>
    );
};

export default Orders; 