
import { Suspense } from "react";
import FixedBar from "../components/DashboardNav";



export default function Dashboard() {
    
    return (
        <div>
            <Suspense fallback={<div>Loading...</div>}>
            <FixedBar/>
            </Suspense>
        </div>
    );
}