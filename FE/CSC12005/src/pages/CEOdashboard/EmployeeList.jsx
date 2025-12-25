import React from 'react';
import { Table } from 'reactstrap';

const EmployeeList = () => {

const employees = [
    { id: 1, name: 'John Doe', department: 'HR' },
    { id: 2, name: 'Jane Smith', department: 'Engineering' },
    // More employees
];

return (
    <Table>
    <thead>
        <tr>
        <th>Name</th>
        <th>Department</th>
        </tr>
    </thead>
    <tbody>
        {employees.map((employee) => (
        <tr key={employee.id}>
            <td>{employee.name}</td>
            <td>{employee.department}</td>
        </tr>
        ))}
    </tbody>
    </Table>
);
};

export default EmployeeList;
