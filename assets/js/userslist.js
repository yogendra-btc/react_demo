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
                <tr className="title">
                    <th>ID</th>
                    <th>USERNAME</th>
                    <th>EMAIL</th>
                </tr>
                </thead>
                <tbody>
                    {Object.keys(data.users).map(function(key, index) {
                    return (<tr><td>{data.users[key]['username']}</td>
                    <td>{data.users[key]['username']}</td>
                    <td>{data.users[key]['email']}</td></tr>);
                })}
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
    if(value == 'users'){
        ReactDOM.render(<Demo />, document.getElementById('users'));
    }