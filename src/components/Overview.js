import React from 'react';
import { 
    Box, 
    Typography,
    LinearProgress,
    Avatar,
} from '@mui/material';
import {
    Storage as StorageIcon,
    CloudDownload as DownloadIcon,
    Memory as ComputeIcon,
    Speed as BandwidthIcon,
} from '@mui/icons-material';

const TabButton = ({ active, children }) => (
    <Typography
        sx={{
            px: 2,
            py: 1,
            color: active ? '#111827' : '#6B7280',
            borderBottom: active ? '2px solid #111827' : 'none',
            cursor: 'pointer',
            fontSize: '0.875rem',
        }}
    >
        {children}
    </Typography>
);

const StatCard = ({ icon, title, value, trend }) => (
    <Box sx={{ 
        p: 3, 
        bgcolor: '#fff', 
        borderRadius: 1, 
        border: '1px solid #EDEDF0',
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
    }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {icon}
            <Typography variant="body2" color="#6B7280">
                {title}
            </Typography>
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 600, color: '#111827' }}>
            {value}
        </Typography>
        <Typography variant="body2" color="#10B981">
            {trend}
        </Typography>
    </Box>
);

const UsageBar = ({ icon, label, value, max, percentage }) => (
    <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            {icon}
            <Typography variant="body2" color="#6B7280">
                {label}
            </Typography>
            <Typography 
                variant="body2" 
                color="#6B7280" 
                sx={{ ml: 'auto' }}
            >
                {percentage}%
            </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <LinearProgress
                variant="determinate"
                value={percentage}
                sx={{
                    flex: 1,
                    height: 8,
                    borderRadius: 4,
                    bgcolor: '#F3F4F6',
                    '& .MuiLinearProgress-bar': {
                        bgcolor: '#111827',
                        borderRadius: 4,
                    }
                }}
            />
            <Typography variant="body2" color="#6B7280" sx={{ minWidth: 100 }}>
                {value}GB / {max}GB
            </Typography>
        </Box>
    </Box>
);

const BackupRow = ({ date, size, time }) => (
    <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        py: 1.5,
        borderBottom: '1px solid #EDEDF0',
    }}>
        <Avatar sx={{ 
            width: 24, 
            height: 24, 
            bgcolor: '#111827', 
            fontSize: '12px',
            mr: 2,
        }}>
            WA
        </Avatar>
        <Typography variant="body2" sx={{ flex: 1 }}>
            {date}
        </Typography>
        <Typography variant="body2" color="#6B7280" sx={{ width: 100 }}>
            {size}
        </Typography>
        <Typography variant="body2" color="#6B7280" sx={{ width: 100 }}>
            {time}
        </Typography>
    </Box>
);

const Overview = () => {
    return (
        <Box sx={{ p: '28px', bgcolor: '#FAFAFB', minHeight: '100vh' }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: '#111827' }}>
                Overview
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <TabButton active>Dashboard</TabButton>
                <TabButton>Usage</TabButton>
                <TabButton>Analytics</TabButton>
            </Box>

            {/* Stats Grid */}
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2, mb: 4 }}>
                <StatCard
                    icon={<BandwidthIcon />}
                    title="Queries"
                    value="970.13"
                    trend="queries per second"
                />
                <StatCard
                    icon={<StorageIcon />}
                    title="Backups"
                    value="500"
                    trend="+25% from last month"
                />
                <StatCard
                    icon={<ComputeIcon />}
                    title="Unique users"
                    value="9,700"
                    trend="+25% from last month"
                />
                <StatCard
                    icon={<DownloadIcon />}
                    title="Forks"
                    value="9,560"
                    trend="+4% from last month"
                />
            </Box>

            <Box sx={{ display: 'flex', gap: 4 }}>
                {/* Usage Overview */}
                <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ mb: 3, color: '#111827' }}>
                        Overview
                    </Typography>
                    <UsageBar
                        icon={<BandwidthIcon fontSize="small" />}
                        label="Bandwidth"
                        value={50}
                        max={100}
                        percentage={50}
                    />
                    <UsageBar
                        icon={<StorageIcon fontSize="small" />}
                        label="Storage"
                        value={50}
                        max={100}
                        percentage={20}
                    />
                    <UsageBar
                        icon={<ComputeIcon fontSize="small" />}
                        label="Compute"
                        value={50}
                        max={100}
                        percentage={60}
                    />
                    <UsageBar
                        icon={<DownloadIcon fontSize="small" />}
                        label="Downloads"
                        value={50}
                        max={100}
                        percentage={70}
                    />
                </Box>

                {/* Latest Backups */}
                <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ mb: 3, color: '#111827' }}>
                        Latest backups
                    </Typography>
                    <Box sx={{ bgcolor: '#fff', border: '1px solid #EDEDF0', borderRadius: 1, p: 2 }}>
                        <BackupRow date="23 Aug 2023 10:24:06" size="55.5665 KB" time="4 hours ago" />
                        <BackupRow date="23 Aug 2023 10:24:06" size="55.5665 KB" time="16 hours ago" />
                        <BackupRow date="23 Aug 2023 10:24:06" size="55.5665 KB" time="21 hours ago" />
                        <BackupRow date="23 Aug 2023 10:24:06" size="55.5665 KB" time="1 day ago" />
                        <BackupRow date="23 Aug 2023 10:24:06" size="55.5665 KB" time="16 hours ago" />
                        <BackupRow date="23 Aug 2023 10:24:06" size="55.5665 KB" time="4 hours ago" />
                        <BackupRow date="23 Aug 2023 10:24:06" size="55.5665 KB" time="1 day ago" />
                        <BackupRow date="23 Aug 2023 10:24:06" size="55.5665 KB" time="21 hours ago" />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default Overview; 