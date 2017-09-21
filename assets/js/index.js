import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import DjangoCSRFToken from 'django-react-csrftoken';
import { Button } from 'react-bootstrap';
import { Table } from 'react-bootstrap';
import './css/style.css';
import './userslist.js';
import './my.js';
import './single_expense.js';


var value = window.location.href.split('/')[window.location.href.split('/').length-2];

var data = JSON.parse(window.initialData);


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {date: new Date()};
      }
    render() {
        var button = React.DOM.button({
            className: "btn btn-lg btn-success",
            children: "Register"
          });
          const tableInstance = (
            <Table responsive>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>USERNAME</th>
                  <th>EMAIL</th>
                </tr>
              </thead>
              <tbody>
                  {Object.keys(data).map(function(key, index) {
                return (<tr><td> {data[key]['id']} </td>
                <td> {data[key]['username']}</td>
                <td> {data[key]['email']} </td></tr>);
                })}
              </tbody>
            </Table>
          );
        return (
        <div >
            {tableInstance}
        </div>);
    }
    }

    if(value != "users" && window.location.href.split('/')[3] != 'users_expenses'){
        ReactDOM.render(< App a1={data}/>, document.getElementById('react-app'));
    }
