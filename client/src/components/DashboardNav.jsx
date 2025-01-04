import { useState } from "react";
import { BottomNavigation, BottomNavigationAction, Paper} from "@mui/material";
import AddManager from "./AddManager";
import AddLiquor from "./AddLiquor";
import Empty from "./Empty";
import UpdateStock from './UpdateStock'
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import LiquorIcon from '@mui/icons-material/Liquor';
import InventoryIcon from '@mui/icons-material/Inventory';
import SportsBarIcon from '@mui/icons-material/SportsBar';
import DashboardHome from "./DashboardHome";
import DashboardIcon from '@mui/icons-material/Dashboard';

export default function FixedBar(){
    const [selectedComponent, setSelectedComponent] = useState('home')

    return (
        <div>
            {selectedComponent === 'liquor' && <AddLiquor/>}
            {selectedComponent === 'manager' && <AddManager/>}
            {selectedComponent === 'empty' && <Empty/>}
            {selectedComponent === 'update' && <UpdateStock/>}
            {selectedComponent === 'home' && <DashboardHome/>}
        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
        <BottomNavigation
            value={selectedComponent}
            onChange={(event, newValue)=> {
                setSelectedComponent(newValue)
            }}
            showLabels
        >
            <BottomNavigationAction
                label="Add Liquor"
                value='liquor'
                icon={<SportsBarIcon/>}
            />
            <BottomNavigationAction
                label='Add Manager'
                value='manager'
                icon={<PersonAddAltIcon/>}
            />
            <BottomNavigationAction
                label='Update Bottles'
                value='empty'
                icon={<LiquorIcon/>}
            />
            <BottomNavigationAction 
                label='Update Stock'
                value='update'
                icon={<InventoryIcon/>}
            />
            <BottomNavigationAction
                label='Dashboard'
                value='home'
                icon={<DashboardIcon/>}
            />
            
            

        </BottomNavigation>
        </Paper>
        </div>
    )
}