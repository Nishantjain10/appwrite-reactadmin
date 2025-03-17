import React from 'react';
import { useLogout, useGetIdentity } from 'react-admin';
import { 
    Box, 
    Typography, 
    Button,
    Avatar,
    Drawer,
} from '@mui/material';
import {
    ShoppingCart,
    People,
    Inventory as ProductsIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const CustomAppBar = () => {
    const logout = useLogout();
    const { identity, isLoading } = useGetIdentity();

    return (
        <Box
            sx={{
                width: '100%',
                height: '48px',
                backgroundColor: '#FFFFFF',
                color: '#111827',
                borderBottom: '1px solid #EDEDF0',
                padding: '0 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                position: 'fixed',
                top: 0,
                zIndex: 1200,
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box 
                    component="span" 
                    sx={{ 
                        width: 24, 
                        height: 24, 
                        bgcolor: '#000', 
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontWeight: 600,
                        fontSize: '14px',
                    }} 
                >
                    A
                </Box>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    Acme Inc.
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {!isLoading && identity && (
                    <>
                        <Typography 
                            variant="body2" 
                            sx={{ 
                                color: '#6B7280',
                                fontWeight: 500 
                            }}
                        >
                            {identity.email}
                        </Typography>
                        <Button
                            variant="outlined"
                            onClick={() => logout()}
                            sx={{
                                color: '#6B7280',
                                textTransform: 'none',
                                fontWeight: 500,
                                border: '1px solid #E5E7EB',
                                '&:hover': {
                                    border: '1px solid #D1D5DB',
                                    backgroundColor: '#F9FAFB'
                                }
                            }}
                        >
                            Sign out
                        </Button>
                        <Avatar 
                            sx={{ 
                                width: 28, 
                                height: 28,
                                bgcolor: '#111827',
                                fontSize: '14px',
                                color: '#FFFFFF',
                            }}
                        >
                            {identity.fullName?.charAt(0).toUpperCase()}
                        </Avatar>
                    </>
                )}
            </Box>
        </Box>
    );
};

const CustomMenu = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { path: '/orders', label: 'Orders', icon: <ShoppingCart sx={{ fontSize: 20 }} /> },
        { path: '/customers', label: 'Customers', icon: <People sx={{ fontSize: 20 }} /> },
        { path: '/products', label: 'Products', icon: <ProductsIcon sx={{ fontSize: 20 }} /> },
    ];

    return (
        <Box sx={{ width: '100%', pt: 2 }}>
            {menuItems.map((item) => (
                <Button
                    key={item.path}
                    startIcon={item.icon}
                    onClick={() => navigate(item.path)}
                    sx={{
                        width: '100%',
                        justifyContent: 'flex-start',
                        color: location.pathname === item.path ? '#111827' : '#6B7280',
                        padding: '8px 16px',
                        borderRadius: '6px',
                        fontSize: '0.875rem',
                        textTransform: 'none',
                        backgroundColor: location.pathname === item.path ? '#F3F4F6' : 'transparent',
                        '&:hover': {
                            backgroundColor: location.pathname === item.path ? '#F3F4F6' : 'rgba(243, 244, 246, 0.6)',
                        },
                        '& .MuiSvgIcon-root': {
                            color: location.pathname === item.path ? '#111827' : '#6B7280',
                        }
                    }}
                >
                    {item.label}
                </Button>
            ))}
        </Box>
    );
};

const CustomSidebar = () => (
    <Drawer
        variant="permanent"
        sx={{
            width: 201,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
                width: 201,
                boxSizing: 'border-box',
                backgroundColor: '#FFFFFF',
                borderRight: '1px solid #EDEDF0',
                marginTop: '48px',
                paddingRight: 0,
            },
        }}
    >
        <CustomMenu />
    </Drawer>
);

const CustomLayout = ({ children }) => (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <CustomAppBar />
        <CustomSidebar />
        <Box
            component="main"
            sx={{
                flexGrow: 1,
                backgroundColor: '#FAFAFB',
                marginTop: '48px',
                paddingTop: '28px',
                paddingX: '28px',
                paddingBottom: '28px',
            }}
        >
            {children}
        </Box>
    </Box>
);

export { CustomLayout }; 