import React,{ useState, useMemo, Suspense } from "react";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Paper from "@mui/material/Paper";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import LiquorIcon from "@mui/icons-material/Liquor";
import InventoryIcon from "@mui/icons-material/Inventory";
import SportsBarIcon from "@mui/icons-material/SportsBar";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { useQuery } from "@apollo/client";
import { ME } from "../utils/queries";

// Lazy load heavy components
const AddManager = React.lazy(() => import("./AddManager"));
const AddLiquor = React.lazy(() => import("./AddLiquor"));
const Empty = React.lazy(() => import("./Empty"));
const DashboardHome = React.lazy(() => import("./DashboardHome"));
const EmptyRecords = React.lazy(() => import("./EmptyRecords"));

export default function FixedBar() {
    const [selectedComponent, setSelectedComponent] = useState('home');
    const { loading, error, data } = useQuery(ME);

    // Always initialize user data, even if it's null or undefined
    const user = useMemo(() => data?.me || null, [data]);

    // Always initialize adminActions regardless of user.role
    const adminActions = useMemo(() => {
        return user?.role === 'admin' ? [
            <BottomNavigationAction
                key="add-liquor"
                label="Add Liquor"
                value="liquor"
                icon={<SportsBarIcon style={{ width: 24, height: 24 }} />}
            />,
            <BottomNavigationAction
                key="add-manager"
                label="Add Manager"
                value="manager"
                icon={<PersonAddAltIcon style={{ width: 24, height: 24 }} />}
            />,
            <BottomNavigationAction
                key="empty-records"
                label="Empty Records"
                value="record"
                icon={<InventoryIcon style={{ width: 24, height: 24 }} />}
            />,
        ] : [];
    }, [user?.role]);

    // Memoize the selected component
    const selectedComponentContent = useMemo(() => {
        switch (selectedComponent) {
            case 'liquor':
                return <AddLiquor />;
            case 'manager':
                return <AddManager />;
            case 'empty':
                return <Empty />;
            case 'home':
                return <DashboardHome />;
            case 'record':
                return <EmptyRecords />;
            default:
                return null;
        }
    }, [selectedComponent]);

    if (loading) return <h1>Loading...</h1>;
    if (error) return <h1>{error.message}</h1>;

    return (
        <div>
            <div style={{ minHeight: 'calc(100vh - 60px)' }}>
                <Suspense fallback={<h1>Loading Component...</h1>}>
                    {selectedComponentContent}
                </Suspense>
            </div>
            <Paper
                sx={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 60, // Fixed height to prevent layout shifts
                }}
                elevation={3}
            >
                <BottomNavigation
                    value={selectedComponent}
                    onChange={(event, newValue) => setSelectedComponent(newValue)}
                    showLabels
                >
                    {adminActions}
                    <BottomNavigationAction
                        label="Update Bottles"
                        value="empty"
                        icon={<LiquorIcon style={{ width: 24, height: 24 }} />}
                    />
                    <BottomNavigationAction
                        label="Dashboard"
                        value="home"
                        icon={<DashboardIcon style={{ width: 24, height: 24 }} />}
                    />
                </BottomNavigation>
            </Paper>
        </div>
    );
}