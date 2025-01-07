import { useState } from "react";
import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import AddManager from "./AddManager";
import AddLiquor from "./AddLiquor";
import Empty from "./Empty";
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import LiquorIcon from '@mui/icons-material/Liquor';
import InventoryIcon from '@mui/icons-material/Inventory';
import SportsBarIcon from '@mui/icons-material/SportsBar';
import DashboardHome from "./DashboardHome";
import DashboardIcon from '@mui/icons-material/Dashboard';
import EmptyRecords from "./EmptyRecords";
import { ME } from '../utils/queries';
import { useQuery } from "@apollo/client";

export default function FixedBar() {
    const [selectedComponent, setSelectedComponent] = useState('home');
    const { loading, error, data } = useQuery(ME);
    const user = data?.me;

    if (error) return <h1>{error.message}</h1>;
    if (loading) return <h1>Loading...</h1>;

    // Define the admin-only actions
    const adminActions = user?.role === 'admin' ? [
        <BottomNavigationAction
            key="add-liquor"
            label="Add Liquor"
            value="liquor"
            icon={<SportsBarIcon />}
        />,
        <BottomNavigationAction
            key="add-manager"
            label="Add Manager"
            value="manager"
            icon={<PersonAddAltIcon />}
        />,
        <BottomNavigationAction
            key="empty-records"
            label="Empty Records"
            value="record"
            icon={<InventoryIcon />}
        />,
    ] : [];

    return (
        <div>
            {selectedComponent === 'liquor' && <AddLiquor />}
            {selectedComponent === 'manager' && <AddManager />}
            {selectedComponent === 'empty' && <Empty />}
            {selectedComponent === 'home' && <DashboardHome />}
            {selectedComponent === 'record' && <EmptyRecords />}
            <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
                <BottomNavigation
                    value={selectedComponent}
                    onChange={(event, newValue) => {
                        setSelectedComponent(newValue);
                    }}
                    showLabels
                >
                    {adminActions}
                    <BottomNavigationAction
                        label="Update Bottles"
                        value="empty"
                        icon={<LiquorIcon />}
                    />
                    <BottomNavigationAction
                        label="Dashboard"
                        value="home"
                        icon={<DashboardIcon />}
                    />
                </BottomNavigation>
            </Paper>
        </div>
    );
}