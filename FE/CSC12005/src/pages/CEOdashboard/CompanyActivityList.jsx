import React, { useEffect, useState } from 'react';
import { Button } from 'reactstrap';
import { ActivityService } from '../../services/ActivityService';

const CompanyActivityList = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await ActivityService.getActivities();
                setActivities(data.content || []);
            } catch (err) {
                setError(err.message);
                console.error('Error fetching activities:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchActivities();
    }, []);

    if (loading) {
        return <div>Loading activities...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            {activities.length > 0 ? (
                activities.map((activity) => (
                    <div key={activity.id}>
                        <h3>{activity.activityName}</h3>
                        <p>{activity.description}</p>
                        <Button>View Details</Button>
                    </div>
                ))
            ) : (
                <div>No activities found.</div>
            )}
        </div>
    );
};

export default CompanyActivityList;
