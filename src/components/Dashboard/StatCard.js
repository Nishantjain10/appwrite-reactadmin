import React from 'react';
import { Card, CardContent, Box, Typography } from '@mui/material';
import { TrendingUp } from '@mui/icons-material';

export const StatCard = ({ icon, title, value, trend, color, details }) => (
    <Card sx={{ 
        height: '100%',
        transition: 'transform 0.2s',
        '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: 3
        }
    }}>
        <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box sx={{ color: color || 'primary.main' }}>{icon}</Box>
                <Box textAlign="right">
                    <Typography variant="h4" component="div">
                        {value}
                    </Typography>
                    <Typography color="textSecondary" variant="body2">
                        {title}
                    </Typography>
                    {trend && (
                        <Typography
                            variant="body2"
                            color={trend >= 0 ? 'success.main' : 'error.main'}
                            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}
                        >
                            {trend >= 0 ? '+' : ''}{trend}% 
                            <TrendingUp sx={{ ml: 0.5, fontSize: '1rem' }} />
                        </Typography>
                    )}
                </Box>
            </Box>
            {details && (
                <Box mt={2} pt={2} borderTop={1} borderColor="divider">
                    {details}
                </Box>
            )}
        </CardContent>
    </Card>
); 