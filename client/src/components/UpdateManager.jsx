import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { RESTAURANT } from '../utils/queries';
import { UPDATE_MANAGER, REMOVE_MANAGER } from '../utils/mutations';

export default function UpdateManager() {
    const { data: restaurantData, loading, error } = useQuery(RESTAURANT);
    const [updateManager] = useMutation(UPDATE_MANAGER);
    const [removeManager] = useMutation(REMOVE_MANAGER);
    const [selectedManagerId, setSelectedManagerId] = useState('');
    const [managerDetails, setManagerDetails] = useState({
        email: '',
        username: '',
        role: '',
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error loading restaurant data</p>;

    const restaurant = restaurantData?.getRestaurant;
    const managers = restaurant?.managers || [];
    const restaurantId = restaurant?._id;

    // Handle selecting a manager for update
    const handleManagerSelect = (e) => {
        const managerId = e.target.value;
        setSelectedManagerId(managerId);

        // Find the selected manager's details
        const selectedManager = managers.find((manager) => manager._id === managerId);
        if (selectedManager) {
            setManagerDetails({
                email: selectedManager.email || '',
                username: selectedManager.username || '',
                role: selectedManager.role || '',
            });
        } else {
            setManagerDetails({ email: '', username: '', role: '' });
        }
    };

    // Handle removing a manager and deleting the user
    const handleRemove = async (e) => {
        e.preventDefault();
        if (!selectedManagerId) {
            alert('Please select a manager to remove.');
            return;
        }
        try {
            const { data } = await removeManager({
                variables: {
                    restaurantId,
                    userId: selectedManagerId,
                },
            });
            console.log('Manager removed and user deleted:', data);
            alert('Manager removed successfully.');
            setSelectedManagerId(''); // Clear selection
            setManagerDetails({ email: '', username: '', role: '' });
        } catch (err) {
            console.error('Error removing manager:', err);
            alert('Failed to remove manager.');
        }
    };

    // Handle updating manager details
    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!selectedManagerId) {
            alert('Please select a manager to update.');
            return;
        }
        try {
            const { data } = await updateManager({
                variables: {
                    restaurantId,
                    userId: selectedManagerId,
                    email: managerDetails.email,
                    username: managerDetails.username,
                    role: managerDetails.role,
                },
            });
            console.log('Manager updated:', data);
            alert('Manager updated successfully.');
            setManagerDetails({ email: '', username: '', role: '' }); // Clear input fields
        } catch (err) {
            console.error('Error updating manager:', err);
            alert('Failed to update manager.');
        }
    };

    const handleDetailsChange = (e) => {
        const { name, value } = e.target;
        setManagerDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value,
        }));
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.heading}>Manage Restaurant Managers</h1>

            {/* Select Manager to Update */}
            <form style={styles.form}>
                <label htmlFor="currentManager" style={styles.label}>
                    Current Managers
                </label>
                <select
                    id="currentManager"
                    value={selectedManagerId}
                    onChange={handleManagerSelect}
                    style={styles.select}
                >
                    <option value="" disabled>
                        Select a manager to remove or update
                    </option>
                    {managers.map((manager) => (
                        <option key={manager._id} value={manager._id}>
                            {manager.username}
                        </option>
                    ))}
                </select>
            </form>

            {/* Remove Manager */}
            <form onSubmit={handleRemove} style={styles.form}>
                <button type="submit" style={styles.buttonRemove}>
                    Remove Manager
                </button>
            </form>

            {/* Update Manager Details */}
            <form onSubmit={handleUpdate} style={styles.form}>
                <label htmlFor="managerDetails" style={styles.label}>
                    Update Manager Details
                </label>
                <div style={styles.inputGroup}>
                    <input
                        type="text"
                        name="username"
                        placeholder="New Username"
                        value={managerDetails.username}
                        onChange={handleDetailsChange}
                        style={styles.input}
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="New Email"
                        value={managerDetails.email}
                        onChange={handleDetailsChange}
                        style={styles.input}
                    />
                    <select
                        name="role"
                        value={managerDetails.role}
                        onChange={handleDetailsChange}
                        style={styles.select}
                    >
                        <option value="" disabled>
                            Select New Role
                        </option>
                        <option value="manager">Manager</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <button type="submit" style={styles.buttonUpdate}>
                    Update Manager
                </button>
            </form>
        </div>
    );
}

const styles = {
    container: {
        padding: '20px',
        maxWidth: '600px',
        margin: '0 auto',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    },
    heading: {
        textAlign: 'center',
        marginBottom: '20px',
        color: '#333',
    },
    form: {
        marginBottom: '20px',
    },
    label: {
        display: 'block',
        marginBottom: '8px',
        fontWeight: 'bold',
        color: '#555',
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
    },
    input: {
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        width: '100%',
    },
    select: {
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        width: '100%',
    },
    buttonRemove: {
        marginTop: '10px',
        padding: '10px',
        backgroundColor: '#dc3545',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    buttonUpdate: {
        marginTop: '10px',
        padding: '10px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
};