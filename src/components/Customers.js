import React from 'react';
import { 
    List,
    Datagrid,
    TextField,
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

const CustomersStats = () => {
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
                        Total customers
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 600, color: '#111827', mb: 0.5 }}>
                        9,700
                    </Typography>
                    <Typography variant="body2" color="#6B7280">
                        Unique users
                    </Typography>
                </Box>
                <Box sx={{ p: 3, bgcolor: '#fff', borderRadius: 1, border: '1px solid #EDEDF0', minWidth: 200 }}>
                    <Typography variant="body2" color="#6B7280" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                        New customers this month
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

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
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
                <TextField source="name" label="Name" />
                <TextField source="email" label="Email" />
                <TextField source="username" label="Username" />
                <TextField source="id" label="Customer ID" />
                <TextField
                    source="id"
                    label=""
                    render={(record) => (
                        <IconButton
                            size="small"
                            onClick={(e) => handleClick(e)}
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

const Customers = () => {
    const mockCustomers = [
        { id: '6823419057', name: 'Walter O\'Brien', email: 'walterob@email.com', username: '@walterob' },
        { id: '9576384210', name: 'Lee Robinson', email: 'leerobinson@email.com', username: '@leeRob' },
        { id: '7839204581', name: 'Olivia Thompson', email: 'olivia.thompson@email.com', username: '@oliviaT91' },
        { id: '5927041839', name: 'Ethan Miller', email: 'ethan.miller@email.com', username: '@ethanM02' },
        { id: '8546102379', name: 'Isabella Johnson', email: 'isabella.johnson@email.com', username: '@isabellaJ77' },
        { id: '6712984350', name: 'Liam Williams', email: 'liam.williams@email.com', username: '@liamW88' },
        { id: '9837461025', name: 'Ava Brown', email: 'ava.brown@email.com', username: '@avaB62' },
        { id: '4021756893', name: 'Noah Clark', email: 'noah.clark@email.com', username: '@noahC11' },
        { id: '5764932180', name: 'Sophia Martinez', email: 'sophia.martinez@email.com', username: '@sophiaM55' },
        { id: '2049817365', name: 'James Garcia', email: 'james.garcia@email.com', username: '@jamesG33' },
        { id: '6823419057', name: 'Charlotte Harris', email: 'charlotte.harris@email.com', username: '@charlotteH84' },
    ];

    return (
        <Box sx={{ p: '28px', bgcolor: '#FAFAFB', minHeight: '100vh' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, color: '#111827' }}>
                    Customers
                </Typography>
                <MuiTextField
                    placeholder="Search Users"
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

            <CustomersStats />

            <List
                resource="customers"
                data={mockCustomers}
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

export default Customers; 