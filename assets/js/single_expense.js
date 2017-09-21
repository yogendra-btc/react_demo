import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import DjangoCSRFToken from 'django-react-csrftoken';
import { Button } from 'react-bootstrap';
import { Table } from 'react-bootstrap';

var value = window.location.href.split('/')[window.location.href.split('/').length-2];

var data = JSON.parse(window.initialData)

class Demo extends React.Component {
    render(){
        const tableInstance = (
            <Table responsive>
                <thead>
                <tr>
                <th>ID</th>
                <th>USER_ID</th>
                <th>EXPENSE_COST</th>
                <th>EXPENSE_TYPE</th>
                <th>EXPENSE_DESCRIPTION</th>
                <th>EXPENSE_DATETIME</th>
                </tr>
                </thead>
                <tbody>
                    {
                        <tr><td>{data.users.id}</td>
                        <td>{data.users.user_id}</td>
                        <td>{data.users.expense_cost}</td>
                        <td>{data.users.expense_type}</td>
                        <td>{data.users.expense_description}</td>
                        <td>{data.users.expense_datetime}</td></tr>
                    }
                </tbody>
            </Table>
        );
    return (
    <div >
        {tableInstance}
        {/* <form method="post">
            <DjangoCSRFToken/>
            <input type="text" name="name"/><br/>
            <input type="text" name="age"/><br/>
            <input type="submit" value="submit" />    
        </form> */}
    </div>
);
}
}
    if(value != 'users_expenses' && window.location.href.split('/')[3] == 'users_expenses'){
        ReactDOM.render(<Demo />, document.getElementById('users_expenses'));
    }