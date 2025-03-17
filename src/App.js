import React, { useEffect, useState } from "react";
import { Client, Account, Databases, ID, Permission, Role, Query } from 'appwrite';
import {
  appWriteDataProvider,
  appWriteAuthProvider,
} from 'ra-appwrite';
import {
  Admin,
  EditGuesser,
  ListGuesser,
  Resource,
  Layout,
  Loading,
} from "react-admin";
import { MyAuthPage } from './components/AuthPages';
import { CustomLayout } from './components/CustomLayout';
import { defaultTheme } from 'react-admin';
import { indigo, pink, grey, blueGrey } from '@mui/material/colors';
import Dashboard from './components/Dashboard';
import { ContactList } from './components/contacts/ContactList';
import { CompanyList } from './components/companies/CompanyList';
import { People, Business, ShoppingCart, Inventory as ProductsIcon } from '@mui/icons-material';
import { ContactCreate } from './components/contacts/ContactCreate';
import { ContactEdit } from './components/contacts/ContactEdit';
import { CompanyCreate } from './components/companies/CompanyCreate';
import { CompanyEdit } from './components/companies/CompanyEdit';
import { createDefaultDocuments } from './utils/defaultData';
import { Route } from 'react-router-dom';
import { CustomRoute } from './components/CustomRoute';
import UsersList from './components/Dashboard';
import Overview from './components/Overview';
import Orders from './components/Orders';
import Customers from './components/Customers';
import Products from './components/Products';

// Add this at the top of your file, after the imports
console.log('Env check:', {
    endpoint: process.env.REACT_APP_APPWRITE_ENDPOINT,
    projectId: process.env.REACT_APP_APPWRITE_PROJECT_ID,
    databaseId: process.env.REACT_APP_APPWRITE_DATABASE_ID,
});

// Initialize Appwrite client
const client = new Client();

// Make sure client is properly configured before using it
client
    .setEndpoint(process.env.REACT_APP_APPWRITE_ENDPOINT)
    .setProject(process.env.REACT_APP_APPWRITE_PROJECT_ID);

// Add this after your client initialization
console.log('Client config:', {
    endpoint: client.config.endpoint,
    project: client.config.project,
});

// Initialize services
const account = new Account(client);
const databases = new Databases(client);

// Add this after database initialization
console.log('Database config:', {
    databaseId: process.env.REACT_APP_APPWRITE_DATABASE_ID,
    contactsCollection: process.env.REACT_APP_APPWRITE_COLLECTION_ID_CONTACTS,
    companiesCollection: process.env.REACT_APP_APPWRITE_COLLECTION_ID_COMPANIES,
});

// Custom auth provider with improved session handling
const authProvider = {
    login: async ({ email, password }) => {
        try {
            // Create session
            await account.createEmailPasswordSession(email, password);
            
            // Get user data
            const user = await account.get();
            
            // Create default documents after successful login
            try {
                await createDefaultDocuments(databases, user.$id);
            } catch (error) {
                console.log('Error creating default documents:', error);
                // Don't fail login if document creation fails
            }

            return Promise.resolve();
        } catch (error) {
            console.error('Login error:', error);
            return Promise.reject(error);
        }
    },

    logout: async () => {
        try {
            // Get all sessions and delete them
            const sessions = await account.listSessions();
            const deletionPromises = sessions.sessions.map(session => 
                account.deleteSession(session.$id)
            );
            await Promise.all(deletionPromises);
            
            localStorage.removeItem('user');
            return Promise.resolve();
        } catch (error) {
            console.error('Logout error:', error);
            // Even if there's an error, clear local storage
            localStorage.removeItem('user');
            return Promise.resolve();
        }
    },

    checkAuth: async () => {
        try {
            // Check if there's an active session
            const session = await account.getSession('current');
            if (!session) {
                return Promise.reject();
            }
            // Verify the session is valid by getting user data
            await account.get();
            return Promise.resolve();
        } catch (error) {
            localStorage.removeItem('user');
            return Promise.reject();
        }
    },

    getIdentity: async () => {
        try {
            const user = await account.get();
            return Promise.resolve({
                id: user.$id,
                fullName: user.name || user.email,
                email: user.email,
                avatar: null,
            });
        } catch (error) {
            return Promise.reject(error);
        }
    },

    getPermissions: async () => {
        try {
            const user = await account.get();
            return Promise.resolve(user.labels || []);
        } catch {
            return Promise.resolve([]);
        }
    },

    checkError: (error) => {
        const status = error.status;
        if (status === 401 || status === 403) {
            localStorage.removeItem('user');
            return Promise.reject();
        }
        return Promise.resolve();
    },
};

// First, create a custom data provider
const createAppwriteDataProvider = () => {
    // Helper function to transform Appwrite document to React Admin format
    const transformDocument = (doc) => ({
        ...doc,
        id: doc.$id, // Map Appwrite's $id to id
    });

    return {
        getList: async (resource, params) => {
            try {
                const user = await account.get();
                const response = await databases.listDocuments(
                    process.env.REACT_APP_APPWRITE_DATABASE_ID,
                    resource === 'contacts' 
                        ? process.env.REACT_APP_APPWRITE_COLLECTION_ID_CONTACTS
                        : process.env.REACT_APP_APPWRITE_COLLECTION_ID_COMPANIES,
                    [
                        // Use Query class for filters
                        Query.equal('userId', user.$id)
                    ]
                );

                return {
                    data: response.documents.map(transformDocument),
                    total: response.total
                };
            } catch (error) {
                console.error('Error in getList:', error);
                throw error;
            }
        },

        getOne: async (resource, params) => {
            const response = await databases.getDocument(
                process.env.REACT_APP_APPWRITE_DATABASE_ID,
                resource === 'contacts' 
                    ? process.env.REACT_APP_APPWRITE_COLLECTION_ID_CONTACTS
                    : process.env.REACT_APP_APPWRITE_COLLECTION_ID_COMPANIES,
                params.id
            );
            return { data: transformDocument(response) };
        },

        create: async (resource, params) => {
            const user = await account.get();
            const response = await databases.createDocument(
                process.env.REACT_APP_APPWRITE_DATABASE_ID,
                resource === 'contacts' 
                    ? process.env.REACT_APP_APPWRITE_COLLECTION_ID_CONTACTS
                    : process.env.REACT_APP_APPWRITE_COLLECTION_ID_COMPANIES,
                ID.unique(),
                {
                    ...params.data,
                    userId: user.$id // Add user ID to new documents
                },
                [
                    Permission.read(Role.user(user.$id)),
                    Permission.update(Role.user(user.$id)),
                    Permission.delete(Role.user(user.$id))
                ]
            );
            return { data: transformDocument(response) };
        },

        update: async (resource, params) => {
            const response = await databases.updateDocument(
                process.env.REACT_APP_APPWRITE_DATABASE_ID,
                resource === 'contacts' 
                    ? process.env.REACT_APP_APPWRITE_COLLECTION_ID_CONTACTS
                    : process.env.REACT_APP_APPWRITE_COLLECTION_ID_COMPANIES,
                params.id,
                params.data
            );
            return { data: transformDocument(response) };
        },

        delete: async (resource, params) => {
            await databases.deleteDocument(
                process.env.REACT_APP_APPWRITE_DATABASE_ID,
                resource === 'contacts' 
                    ? process.env.REACT_APP_APPWRITE_COLLECTION_ID_CONTACTS
                    : process.env.REACT_APP_APPWRITE_COLLECTION_ID_COMPANIES,
                params.id
            );
            return { data: params.previousData };
        },

        deleteMany: async (resource, params) => {
            const promises = params.ids.map(id => 
                databases.deleteDocument(
                    process.env.REACT_APP_APPWRITE_DATABASE_ID,
                    resource === 'contacts' 
                        ? process.env.REACT_APP_APPWRITE_COLLECTION_ID_CONTACTS
                        : process.env.REACT_APP_APPWRITE_COLLECTION_ID_COMPANIES,
                    id
                )
            );
            await Promise.all(promises);
            return { data: [] };
        },

        getMany: async (resource, params) => {
            const promises = params.ids.map(id =>
                databases.getDocument(
                    process.env.REACT_APP_APPWRITE_DATABASE_ID,
                    resource === 'contacts' 
                        ? process.env.REACT_APP_APPWRITE_COLLECTION_ID_CONTACTS
                        : process.env.REACT_APP_APPWRITE_COLLECTION_ID_COMPANIES,
                    id
                )
            );
            const responses = await Promise.all(promises);
            return { data: responses.map(transformDocument) };
        },

        getManyReference: async (resource, params) => {
            // Implement if needed
            return { data: [], total: 0 };
        },

        updateMany: async (resource, params) => {
            const promises = params.ids.map(id =>
                databases.updateDocument(
                    process.env.REACT_APP_APPWRITE_DATABASE_ID,
                    resource === 'contacts' 
                        ? process.env.REACT_APP_APPWRITE_COLLECTION_ID_CONTACTS
                        : process.env.REACT_APP_APPWRITE_COLLECTION_ID_COMPANIES,
                    id,
                    params.data
                )
            );
            await Promise.all(promises);
            return { data: [] };
        },

        duplicate: async (resource, params) => {
            try {
                // Get the original record
                const response = await databases.getDocument(
                    process.env.REACT_APP_APPWRITE_DATABASE_ID,
                    resource === 'contacts' 
                        ? process.env.REACT_APP_APPWRITE_COLLECTION_ID_CONTACTS
                        : process.env.REACT_APP_APPWRITE_COLLECTION_ID_COMPANIES,
                    params.id
                );

                // Remove Appwrite system fields and prepare data for duplication
                const { $id, $createdAt, $updatedAt, $permissions, $collectionId, $databaseId, ...dataToClone } = response;

                // Create new record with same data but new ID
                const duplicatedResponse = await databases.createDocument(
                    process.env.REACT_APP_APPWRITE_DATABASE_ID,
                    resource === 'contacts' 
                        ? process.env.REACT_APP_APPWRITE_COLLECTION_ID_CONTACTS
                        : process.env.REACT_APP_APPWRITE_COLLECTION_ID_COMPANIES,
                    ID.unique(),
                    {
                        ...dataToClone,
                        name: `${dataToClone.name} (Copy)`,
                        createdAt: new Date().toISOString(),
                        // For contacts, ensure email is unique
                        ...(resource === 'contacts' && {
                            email: `copy.${dataToClone.email}`,
                        })
                    }
                );

                console.log('Duplicated document:', duplicatedResponse);
                return { data: transformDocument(duplicatedResponse) };
            } catch (error) {
                console.error('Duplication error:', error);
                throw error;
            }
        },
    };
};

// Use the custom data provider
const dataProvider = createAppwriteDataProvider();

// Add error handling to the data provider
const enhancedDataProvider = {
    ...dataProvider,
    getList: async (resource, params) => {
        try {
            console.log('Getting list for resource:', resource, 'with params:', params);
            const result = await dataProvider.getList(resource, params);
            console.log('List result:', result);
            return result;
        } catch (error) {
            console.error('Error in getList:', error);
            throw error;
        }
    }
};

// Define a custom theme that extends the default theme
const theme = {
    ...defaultTheme,
    palette: {
        mode: 'light',
        primary: {
            main: '#F02E65',
            light: '#FF4081',
            dark: '#C2185B',
            contrastText: '#fff',
        },
        secondary: {
            main: indigo[500],
            light: indigo[300],
            dark: indigo[700],
            contrastText: '#fff',
        },
        background: {
            default: '#f5f5f9',
            paper: '#fff',
        },
        text: {
            primary: grey[900],
            secondary: grey[700],
            disabled: grey[500],
        },
    },
    shape: {
        borderRadius: 8,
    },
    typography: {
        fontFamily: [
            'Inter',
            'system-ui',
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
        ].join(','),
        h1: {
            fontWeight: 600,
            fontSize: '1.75rem',
        },
        h2: {
            fontWeight: 600,
            fontSize: '1.5rem',
        },
        h3: {
            fontWeight: 600,
            fontSize: '1.25rem',
        },
    },
    components: {
        MuiPaper: {
            styleOverrides: {
                root: {
                    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: '12px',
                    boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.08)',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '8px',
                    textTransform: 'none',
                    fontWeight: 600,
                },
                contained: {
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                    },
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: '#fff',
                    color: grey[900],
                    boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.05)',
                },
            },
        },
        RaSidebar: {
            styleOverrides: {
                root: {
                    backgroundColor: '#fff',
                    borderRight: '1px solid',
                    borderColor: grey[200],
                },
            },
        },
        RaMenuItemLink: {
            styleOverrides: {
                root: {
                    borderRadius: '6px',
                    margin: '4px 8px',
                    padding: '8px 12px',
                    '&.RaMenuItemLink-active': {
                        backgroundColor: pink[50],
                        color: pink[700],
                        '& .RaMenuItemLink-icon': {
                            color: pink[700],
                        },
                    },
                },
            },
        },
        RaDatagrid: {
            styleOverrides: {
                root: {
                    '& .RaDatagrid-headerCell': {
                        backgroundColor: grey[50],
                    },
                    '& .RaDatagrid-row': {
                        '&:hover': {
                            backgroundColor: grey[50],
                        },
                    },
                },
            },
        },
    },
};

const App = () => {
    const [authState, setAuthState] = useState({
        isLoading: true,
        isAuthenticated: false,
        checked: false
    });

    useEffect(() => {
        let mounted = true;

        const initializeApp = async () => {
            if (authState.checked) return;

            try {
                const session = await account.getSession('current');
                if (mounted) {
                    const user = await account.get();
                    // Create default documents after successful authentication with user ID
                    await createDefaultDocuments(databases, user.$id);
                    
                    setAuthState({
                        isLoading: false,
                        isAuthenticated: true,
                        checked: true
                    });
                }
            } catch (error) {
                console.log('No active session:', error);
                if (mounted) {
                    setAuthState({
                        isLoading: false,
                        isAuthenticated: false,
                        checked: true
                    });
                }
            }
        };

        initializeApp();

        return () => {
            mounted = false;
        };
    }, [authState.checked]);

    if (authState.isLoading) {
        return <Loading />;
    }

    return (
    <Admin
        dataProvider={dataProvider}
        authProvider={authProvider}
            loginPage={() => <MyAuthPage isLogin={true} />}
            requireAuth
            layout={CustomLayout}
            ready={authState.checked}
            theme={theme}
            darkTheme={false}
            defaultTheme="light"
            dashboard={Orders}
        >
            <Resource 
                name="orders" 
                list={Orders}
                icon={ShoppingCart}
                options={{ 
                    label: 'Orders',
                }}
            />
            <Resource 
                name="customers" 
                list={Customers}
                icon={People}
                options={{ 
                    label: 'Customers',
                }}
            />
            <Resource 
                name="products" 
                list={Products}
                icon={ProductsIcon}
                options={{ 
                    label: 'Products',
                }}
            />
  </Admin>
);
};

export default App;