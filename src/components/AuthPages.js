import React, { useState, useEffect } from 'react';
import { useLogin, useNotify } from 'react-admin';
import { Client, Account, ID, Databases } from 'appwrite';
import { createDefaultDocuments } from '../utils/defaultData';
import { 
    Box, 
    TextField, 
    Button, 
    Typography, 
    CircularProgress,
    InputAdornment,
    IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const client = new Client()
    .setEndpoint(process.env.REACT_APP_APPWRITE_ENDPOINT)
    .setProject(process.env.REACT_APP_APPWRITE_PROJECT_ID);
const account = new Account(client);
const databases = new Databases(client);

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const NavBar = ({ isLogin, onToggle }) => (
    <Box
        sx={{
            height: 64,
            px: '28px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #EDEDF0',
            bgcolor: '#FFFFFF',
        }}
    >
        <Typography 
            variant="body1" 
            sx={{ 
                color: '#000',
                fontWeight: 600,
                fontSize: '1.125rem',
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
            }}
        >
            <Box 
                component="span" 
                sx={{ 
                    width: 32, 
                    height: 32, 
                    bgcolor: '#000', 
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '1.25rem',
                }} 
            >
                A
            </Box>
            Acme Inc.
        </Typography>
        <Button
            onClick={onToggle}
            sx={{
                bgcolor: '#000',
                color: '#fff',
                textTransform: 'none',
                borderRadius: '20px',
                px: 3,
                py: 1,
                height: 36,
                fontSize: '0.875rem',
                fontWeight: 500,
                '&:hover': {
                    bgcolor: '#333',
                }
            }}
        >
            {isLogin ? 'Create account' : 'Sign in'}
        </Button>
    </Box>
);

export const MyAuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const login = useLogin();
    const notify = useNotify();
    const navigate = useNavigate();

    useEffect(() => {
        const checkSession = async () => {
            try {
                const session = await account.getSession('current');
                if (session) {
                    navigate('/');
                }
            } catch (error) {
                console.log('No active session');
            } finally {
                setLoading(false);
            }
        };

        checkSession();
    }, [navigate]);

    const signup = async ({ email, password, name }) => {
        try {
            // First check if there's an active session and delete it
            try {
                const sessions = await account.listSessions();
                const deletionPromises = sessions.sessions.map(session => 
                    account.deleteSession(session.$id)
                );
                await Promise.all(deletionPromises);
            } catch (error) {
                console.log('No active sessions to clear');
            }

            // Create user account
            const response = await account.create(
                ID.unique(),
                email,
                password,
                name
            );

            // If account creation is successful, create a new session
            if (response) {
                await account.createEmailPasswordSession(email, password);
                
                // Get user data after successful login
                const user = await account.get();
                
                // Create default documents for the new user
                await createDefaultDocuments(databases, user.$id);
                
                // After successful signup and document creation, log in using react-admin's login
                await login({ email, password });
                
                return response;
            }
        } catch (error) {
            console.error('Signup error:', error);
            throw error;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isLogin) {
                // For login, first clear any existing sessions
                try {
                    const sessions = await account.listSessions();
                    const deletionPromises = sessions.sessions.map(session => 
                        account.deleteSession(session.$id)
                    );
                    await Promise.all(deletionPromises);
                } catch (error) {
                    console.log('No active sessions to clear');
                }

                // Now proceed with login
                await login({ email, password });
                notify('Login successful', { type: 'success' });
                navigate('/'); // Add explicit navigation
            } else {
                // Validation checks
                if (!name) {
                    notify('Name is required', { type: 'error' });
                    setLoading(false);
                    return;
                }
                if (!EMAIL_REGEX.test(email)) {
                    notify('Please enter a valid email address', { type: 'error' });
                    setLoading(false);
                    return;
                }
                if (password.length < 8) {
                    notify('Password must be at least 8 characters long', { type: 'error' });
                    setLoading(false);
                    return;
                }

                try {
                    await signup({ email, password, name });
                    notify('Sign up successful', { type: 'success' });
                    navigate('/'); // Add explicit navigation
                } catch (error) {
                    if (error.type === 'user_already_exists' || 
                        error.message.includes('There was an error processing your request')) {
                        notify('This email is already registered. Please try logging in instead.', { type: 'warning' });
                    } else {
                        notify(error.message || 'Sign up failed. Please try again.', { type: 'error' });
                    }
                    setLoading(false);
                    return;
                }
            }
        } catch (error) {
            console.error('Auth error:', error);
            notify(
                error.message === 'Invalid credentials'
                    ? 'Invalid email or password'
                    : error.message || 'Authentication failed',
                { type: 'error' }
            );
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    bgcolor: '#FAFAFB',
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                bgcolor: '#FAFAFB',
            }}
        >
            <NavBar isLogin={isLogin} onToggle={() => setIsLogin(!isLogin)} />
            
            <Box
                sx={{
                    flex: 1,
                    display: 'grid',
                    gridTemplateColumns: {
                        xs: '1fr',
                        md: '1fr 1fr'
                    },
                }}
            >
                {/* Left Side - Dark Image */}
                <Box
                    sx={{
                        background: 'url(/images/auth-bg.png) center/cover',
                        backgroundColor: '#000',
                        display: { xs: 'none', md: 'block' }
                    }}
                />

                {/* Right Side - Login Form */}
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        p: { xs: '24px', sm: '40px', md: '64px' },
                    }}
                >
                    <Box
                        sx={{
                            width: '100%',
                            maxWidth: '440px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Typography 
                            variant="h1" 
                            sx={{ 
                                fontWeight: 500,
                                fontSize: { xs: '24px', sm: '28px' },
                                color: '#111827',
                                mb: 4,
                                textAlign: 'center',
                                width: '100%'
                            }}
                        >
                            {isLogin ? 'Welcome to Acme Inc.' : 'Create your account'}
                        </Typography>

                        <Box 
                            component="form" 
                            onSubmit={handleSubmit}
                            sx={{
                                width: '100%',
                                bgcolor: '#fff',
                                borderRadius: 3,
                                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
                                p: { xs: 3, sm: 4 },
                            }}
                        >
                            {!isLogin && (
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="body1" sx={{ mb: 1, fontWeight: 500, color: '#374151' }}>
                                        Name
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        placeholder="Enter name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        variant="outlined"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                bgcolor: '#fff',
                                                '& fieldset': {
                                                    borderColor: '#E5E7EB',
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: '#D1D5DB',
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#9CA3AF',
                                                },
                                            },
                                            '& .MuiOutlinedInput-input': {
                                                padding: '14px 16px',
                                            }
                                        }}
                                    />
                                </Box>
                            )}
                            
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="body1" sx={{ mb: 1, fontWeight: 500, color: '#374151' }}>
                                    Email
                                </Typography>
                                <TextField
                                    fullWidth
                                    placeholder="Enter email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    variant="outlined"
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            bgcolor: '#fff',
                                            '& fieldset': {
                                                borderColor: '#E5E7EB',
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#D1D5DB',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#9CA3AF',
                                            },
                                        },
                                        '& .MuiOutlinedInput-input': {
                                            padding: '14px 16px',
                                        }
                                    }}
                                />
                            </Box>

                            <Box sx={{ mb: 3 }}>
                                <Typography variant="body1" sx={{ mb: 1, fontWeight: 500, color: '#374151' }}>
                                    Password
                                </Typography>
                                <TextField
                                    fullWidth
                                    placeholder="Enter your password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    variant="outlined"
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton 
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    edge="end"
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            bgcolor: '#fff',
                                            '& fieldset': {
                                                borderColor: '#E5E7EB',
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#D1D5DB',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#9CA3AF',
                                            },
                                        },
                                        '& .MuiOutlinedInput-input': {
                                            padding: '14px 16px',
                                        }
                                    }}
                                />
                            </Box>

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                disabled={loading}
                                sx={{
                                    height: '46px',
                                    textTransform: 'none',
                                    bgcolor: '#E5E7EB',
                                    color: '#374151',
                                    fontWeight: 500,
                                    boxShadow: 'none',
                                    '&:hover': {
                                        bgcolor: '#D1D5DB',
                                        boxShadow: 'none',
                                    },
                                    '&.Mui-disabled': {
                                        bgcolor: '#F3F4F6',
                                        color: '#9CA3AF',
                                    }
                                }}
                            >
                                {loading ? <CircularProgress size={24} /> : 'Get started'}
                            </Button>

                            <Typography 
                                variant="body2" 
                                align="center" 
                                sx={{ 
                                    my: 3,
                                    color: '#6B7280',
                                    fontSize: '0.875rem',
                                }}
                            >
                                OR SIGN IN WITH
                            </Typography>

                            {['Google', 'Apple', 'GitHub'].map((provider) => (
                                <Button
                                    key={provider}
                                    fullWidth
                                    variant="outlined"
                                    sx={{
                                        mb: 2,
                                        height: '46px',
                                        textTransform: 'none',
                                        borderColor: '#E5E7EB',
                                        color: '#374151',
                                        fontWeight: 500,
                                        '&:hover': {
                                            borderColor: '#D1D5DB',
                                            bgcolor: '#F9FAFB',
                                        },
                                    }}
                                >
                                    <img 
                                        src={`https://${provider.toLowerCase()}.com/favicon.ico`}
                                        alt={provider}
                                        style={{ width: 20, height: 20, marginRight: 8 }}
                                    />
                                    {provider}
                                </Button>
                            ))}
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};