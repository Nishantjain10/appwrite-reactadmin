import React from 'react';
import { Route } from 'react-router-dom';

export const CustomRoute = ({ path, component: Component, noLayout }) => {
    return (
        <Route
            path={path}
            element={<Component />}
        />
    );
}; 