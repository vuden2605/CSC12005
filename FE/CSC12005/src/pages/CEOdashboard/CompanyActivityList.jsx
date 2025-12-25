import React from 'react';
import { Button } from 'reactstrap';

const CompanyActivityList = () => {
const activities = [
    { id: 1, name: 'Yearly Company Meeting' },
    { id: 2, name: 'Product Launch Event' },
    // More activities
];

return (
    <div>
    {activities.map((activity) => (
        <div key={activity.id}>
        <h3>{activity.name}</h3>
        <Button>View Details</Button>
        </div>
    ))}
    </div>
);
};

export default CompanyActivityList;
