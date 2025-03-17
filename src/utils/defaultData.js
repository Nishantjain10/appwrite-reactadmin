import { ID, Permission, Role, Query } from 'appwrite';

const generateRandomDate = (start, end) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString();
};

export const createDefaultDocuments = async (databases, userId) => {
    try {
        // Check if required environment variables are present
        if (!process.env.REACT_APP_APPWRITE_DATABASE_ID) {
            console.error('Missing REACT_APP_APPWRITE_DATABASE_ID');
            return;
        }

        if (!process.env.REACT_APP_APPWRITE_COLLECTION_ID_ORDERS ||
            !process.env.REACT_APP_APPWRITE_COLLECTION_ID_CUSTOMERS) {
            console.error('Missing collection IDs in environment variables');
            return;
        }

        // First, ensure userId attribute exists in contacts collection
        try {
            await databases.createStringAttribute(
                process.env.REACT_APP_APPWRITE_DATABASE_ID,
                process.env.REACT_APP_APPWRITE_COLLECTION_ID_CONTACTS,
                'userId',
                255,
                true,
                userId,
                false
            );
        } catch (error) {
            console.log('userId attribute might already exist in contacts');
        }

        // Ensure userId attribute exists in companies collection
        try {
            await databases.createStringAttribute(
                process.env.REACT_APP_APPWRITE_DATABASE_ID,
                process.env.REACT_APP_APPWRITE_COLLECTION_ID_COMPANIES,
                'userId',
                255,
                true,
                userId,
                false
            );
        } catch (error) {
            console.log('userId attribute might already exist in companies');
        }

        // Wait for attributes to be ready
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Check if default contact exists for this user
        const contactsResponse = await databases.listDocuments(
            process.env.REACT_APP_APPWRITE_DATABASE_ID,
            process.env.REACT_APP_APPWRITE_COLLECTION_ID_CONTACTS,
            [Query.equal('userId', userId)]
        );

        if (contactsResponse.total === 0) {
            // Create one default contact
            await databases.createDocument(
                process.env.REACT_APP_APPWRITE_DATABASE_ID,
                process.env.REACT_APP_APPWRITE_COLLECTION_ID_CONTACTS,
                ID.unique(),
                {
                    name: "Example Contact",
                    email: "example.contact@example.com",
                    phone: "+1 (555) 123-4567",
                    company: "Example Company",
                    createdAt: new Date().toISOString(),
                    userId: userId
                }
            );
        }

        // Check if default company exists for this user
        const companiesResponse = await databases.listDocuments(
            process.env.REACT_APP_APPWRITE_DATABASE_ID,
            process.env.REACT_APP_APPWRITE_COLLECTION_ID_COMPANIES,
            [Query.equal('userId', userId)]
        );

        if (companiesResponse.total === 0) {
            // Create one default company
            await databases.createDocument(
                process.env.REACT_APP_APPWRITE_DATABASE_ID,
                process.env.REACT_APP_APPWRITE_COLLECTION_ID_COMPANIES,
                ID.unique(),
                {
                    name: "Example Company",
                    industry: "Technology",
                    size: "Medium",
                    website: "https://www.example.com",
                    createdAt: new Date().toISOString(),
                    userId: userId
                }
            );
        }

        // Create default customers
        const customers = [
            { name: 'John Smith', email: 'john.smith@example.com', type: 'VIP', orders: 15, totalSpent: '2,450.00' },
            { name: 'Emma Wilson', email: 'emma.w@example.com', type: 'Regular', orders: 8, totalSpent: '1,280.00' },
            { name: 'Michael Brown', email: 'm.brown@example.com', type: 'New', orders: 2, totalSpent: '350.00' },
            { name: 'Sarah Davis', email: 'sarah.d@example.com', type: 'Regular', orders: 6, totalSpent: '890.00' },
            { name: 'James Johnson', email: 'j.johnson@example.com', type: 'VIP', orders: 12, totalSpent: '1,890.00' },
            { name: 'Lisa Anderson', email: 'l.anderson@example.com', type: 'Regular', orders: 4, totalSpent: '620.00' },
            { name: 'David Miller', email: 'd.miller@example.com', type: 'VIP', orders: 20, totalSpent: '3,150.00' },
            { name: 'Emily Clark', email: 'e.clark@example.com', type: 'New', orders: 1, totalSpent: '150.00' },
            { name: 'Robert Wilson', email: 'r.wilson@example.com', type: 'Regular', orders: 7, totalSpent: '980.00' },
            { name: 'Jennifer Lee', email: 'j.lee@example.com', type: 'VIP', orders: 18, totalSpent: '2,890.00' }
        ];

        // Create default orders
        const orders = [
            { orderId: '67cd7773002fd0789226', customerId: 'CUST001', totalPrice: '299.99', deliveryStatus: 'Delivered', date: generateRandomDate(new Date(2023, 0, 1), new Date()) },
            { orderId: '89ef9995004fd0791234', customerId: 'CUST002', totalPrice: '159.99', deliveryStatus: 'Pending', date: generateRandomDate(new Date(2023, 0, 1), new Date()) },
            { orderId: '45ab3331006fd0795678', customerId: 'CUST003', totalPrice: '499.99', deliveryStatus: 'Shipped', date: generateRandomDate(new Date(2023, 0, 1), new Date()) },
            { orderId: '12cd4442008fd0799012', customerId: 'CUST004', totalPrice: '89.99', deliveryStatus: 'Delivered', date: generateRandomDate(new Date(2023, 0, 1), new Date()) },
            { orderId: '34ef5553010fd0792345', customerId: 'CUST005', totalPrice: '199.99', deliveryStatus: 'Cancelled', date: generateRandomDate(new Date(2023, 0, 1), new Date()) },
            { orderId: '78gh8864012fd0795678', customerId: 'CUST006', totalPrice: '399.99', deliveryStatus: 'Shipped', date: generateRandomDate(new Date(2023, 0, 1), new Date()) },
            { orderId: '90ij9975014fd0791234', customerId: 'CUST007', totalPrice: '129.99', deliveryStatus: 'Delivered', date: generateRandomDate(new Date(2023, 0, 1), new Date()) },
            { orderId: '23kl2286016fd0797890', customerId: 'CUST008', totalPrice: '749.99', deliveryStatus: 'Pending', date: generateRandomDate(new Date(2023, 0, 1), new Date()) },
            { orderId: '56mn5597018fd0793456', customerId: 'CUST009', totalPrice: '279.99', deliveryStatus: 'Shipped', date: generateRandomDate(new Date(2023, 0, 1), new Date()) },
            { orderId: '89op8808020fd0799012', customerId: 'CUST010', totalPrice: '189.99', deliveryStatus: 'Delivered', date: generateRandomDate(new Date(2023, 0, 1), new Date()) },
            { orderId: '12qr1119022fd0794567', customerId: 'CUST001', totalPrice: '459.99', deliveryStatus: 'Pending', date: generateRandomDate(new Date(2023, 0, 1), new Date()) },
            { orderId: '34st3330024fd0790123', customerId: 'CUST002', totalPrice: '679.99', deliveryStatus: 'Shipped', date: generateRandomDate(new Date(2023, 0, 1), new Date()) },
            { orderId: '67uv6641026fd0795678', customerId: 'CUST003', totalPrice: '899.99', deliveryStatus: 'Delivered', date: generateRandomDate(new Date(2023, 0, 1), new Date()) },
            { orderId: '89wx8852028fd0791234', customerId: 'CUST004', totalPrice: '229.99', deliveryStatus: 'Cancelled', date: generateRandomDate(new Date(2023, 0, 1), new Date()) },
            { orderId: '12yz1163030fd0796789', customerId: 'CUST005', totalPrice: '319.99', deliveryStatus: 'Shipped', date: generateRandomDate(new Date(2023, 0, 1), new Date()) }
        ];

        // Create customers
        for (const customer of customers) {
            try {
                await databases.createDocument(
                    process.env.REACT_APP_APPWRITE_DATABASE_ID,
                    process.env.REACT_APP_APPWRITE_COLLECTION_ID_CUSTOMERS,
                    ID.unique(),
                    {
                        ...customer,
                        userId,
                        createdAt: new Date().toISOString(),
                    },
                    [
                        Permission.read(Role.user(userId)),
                        Permission.update(Role.user(userId)),
                        Permission.delete(Role.user(userId))
                    ]
                );
            } catch (error) {
                console.error('Error creating customer:', error);
            }
        }

        // Create orders
        for (const order of orders) {
            try {
                await databases.createDocument(
                    process.env.REACT_APP_APPWRITE_DATABASE_ID,
                    process.env.REACT_APP_APPWRITE_COLLECTION_ID_ORDERS,
                    ID.unique(),
                    {
                        ...order,
                        userId,
                        createdAt: new Date().toISOString(),
                    },
                    [
                        Permission.read(Role.user(userId)),
                        Permission.update(Role.user(userId)),
                        Permission.delete(Role.user(userId))
                    ]
                );
            } catch (error) {
                console.error('Error creating order:', error);
            }
        }

        console.log('Default documents created successfully');
    } catch (error) {
        console.error('Error creating default documents:', error);
        // Don't throw the error to prevent blocking the signup process
    }
}; 