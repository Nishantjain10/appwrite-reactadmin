import React from 'react';
import { Route, useLocation } from 'react-router-dom';

export const CustomRoute = ({ path, component: Component, noLayout }) => {
    const location = useLocation();
    
    return (
        <Route
            path={path}
            element={<Component />}
        />
    );
}; 