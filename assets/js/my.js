import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import DjangoCSRFToken from 'django-react-csrftoken';
import { Button } from 'react-bootstrap';
import { Table } from 'react-bootstrap';
import { Panel, FormGroup, ControlLabel, FormControl,Col,Form,InputGroup } from 'react-bootstrap';
import { unmountComponentAtNode } from 'react-dom';

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'  
var value = window.location.href.split('/')[window.location.href.split('/').length - 2];
var data = JSON.parse(window.initialData)

class Demo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            create: false,
            data: data.users,
            total_cost:data.total_cost,
            key:null,
        };
        this.handleClick = this.handleClick.bind(this);
        this.handleState = this.handleState.bind(this);
        this.handlePanel = this.handlePanel.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.newExpense = this.newExpense.bind(this);
    }
    newExpense(){
        axios.post('/users_expenses/',{data:{
            'user_id':this.state.data[0].id,
            "expense_cost":this.state.expense_cost,
            "expense_type":this.state.expense_type,
            "expense_description":this.state.expense_description}})
        
        .then((response) => {
            var arrdata = this.state.data;
            arrdata[arrdata.length] = {"id":response.data.id,"user_id":response.data.user_id,"expense_cost":response.data.expense_cost,"expense_type":response.data.expense_type,"expense_description":response.data.expense_description,"expense_datetime":response.data.expense_datetime} 
            this.setState({data:arrdata})
            var total_cost_data = this.state.total_cost;
            total_cost_data["total_cost"] = parseFloat(total_cost_data["total_cost"]) + parseFloat(response.data.expense_cost);
            this.setState({total_cost:total_cost_data})
            this.setState({create:false}) 
        })
    }

    handleClick(element) {
        var current_element = element.target.closest('tr');
        axios.delete('/users_expenses/',{data:{'pk':element.target.id}})
        .then((response) => {
            if(response.status == 204){
                current_element.remove()
            }
        })
    }
    handleState(element){
        this.setState({key:element.target.closest('tr').id})
        var edit_data = element.target.closest('tr').children;
        // this.setState({ open:true });
        this.setState({ id:edit_data[0].textContent});
        this.setState({ user_id:edit_data[1].textContent});
        this.setState({ expense_cost:edit_data[2].textContent});
        this.setState({ expense_type:edit_data[3].textContent});
        this.setState({ expense_description:edit_data[4].textContent});
        this.setState({ expense_datetime:edit_data[5].textContent});
    }
    handlePanel(){
        this.setState({ open:false });
        this.setState({ key:null });
    }
    handleChange(e) {
        this.setState({[e.target.name]: e.target.value});
    }
    handleSubmit(e){
        var arrdata = this.state.data;
        e.preventDefault();
        axios.patch('/users_expenses/',{data:
            {pk:this.state.id,
            expense_cost:this.state.expense_cost,
            expense_type:this.state.expense_type,
            expense_description:this.state.expense_description}})
            .then((response) => {
                var current_expense_cost = arrdata[this.state.key].expense_cost;
                arrdata[this.state.key] = {"id":response.data.id,"user_id":response.data.user_id,"expense_cost":response.data.expense_cost,"expense_type":response.data.expense_type,"expense_description":response.data.expense_description,"expense_datetime":response.data.expense_datetime} 
                this.setState({data:arrdata})
                var total_cost_data = this.state.total_cost;
                total_cost_data["total_cost"] = parseFloat(total_cost_data["total_cost"]) + (parseFloat(response.data.expense_cost) - parseFloat(current_expense_cost));
                this.setState({total_cost:total_cost_data});
                this.setState({open:false});
                this.setState({ key:null });
            })
    }
    render() {
        const tableInstance = (
            <Table responsive>
                <thead>
                    <tr className="title">
                        <th>ID</th>
                        <th>USER_ID</th>
                        <th>EXPENSE_COST</th>
                        <th>EXPENSE_TYPE</th>
                        <th>EXPENSE_DESCRIPTION</th>
                        <th>EXPENSE_DATETIME</th>
                        <th>TOTAL_COST</th>
                        <th>DELETE</th>
                        <th>EDIT</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        Object.keys(this.state.data).map(function (key, index) {
                            var new_data = data.users[key];
                            if(this.state.key != key){
                                return (
                                    <tr key={key} id={key}><td>{new_data.id}</td>
                                    <td>{new_data.user_id}</td>
                                    <td>{new_data.expense_cost}</td>
                                    <td>{new_data.expense_type}</td>
                                    <td>{new_data.expense_description}</td>
                                    <td>{new_data.expense_datetime}</td>
                                    <td>{this.state.total_cost['total_cost']}</td>
                                    <td><Button bsStyle="danger" id={new_data.id} onClick={this.handleClick.bind(new_data.id)}>delete</Button></td>
                                    <td><Button bsStyle="primary" id={new_data.id} onClick={this.handleState} value={new_data}>edit</Button></td></tr>);
                            }else{
                                return(
                                    <tr key={key}>
                                    <th colSpan={9}>
                                    <Form  inline>
                                    <DjangoCSRFToken />
                                        <FormControl
                                            type="text"
                                            ref="id"
                                            disabled
                                            value={this.state.id}
                                            placeholder="Enter Expense Cost"
                                            onChange={this.handleChange}
                                            name="id"
                                        />{" "}&nbsp;
                                        <FormControl
                                            type="text"
                                            ref="user_id"
                                            disabled
                                            value={this.state.user_id}
                                            placeholder="user_id"
                                            onChange={this.handleChange}
                                            name="user_id"
                                        />{" "}&nbsp;
                                        <FormControl
                                            type="text"
                                            ref="cost"
                                            value={this.state.expense_cost}
                                            placeholder="Enter Expense Cost"
                                            onChange={this.handleChange}
                                            name="expense_cost"
                                        />{" "}&nbsp;
                                        <FormControl
                                            type="text"
                                            value={this.state.expense_type}
                                            placeholder="Enter Expense Type"
                                            onChange={this.handleChange}
                                            name="expense_type"
                                        />{" "}&nbsp;
                                        <FormControl
                                            type="text"
                                            value={this.state.expense_description}
                                            placeholder="Enter Expense Description"
                                            onChange={this.handleChange}
                                            name="expense_description"
                                        />{" "}&nbsp;
                                        <FormControl
                                            type="text"
                                            value={this.state.expense_datetime}
                                            placeholder="Enter Expense DateTime"
                                            onChange={this.handleChange}
                                            name="expense_datetime"
                                        />{" "}&nbsp;
                                        <Button onClick={this.handleSubmit} bsStyle="primary">save</Button>{" "}&nbsp;{" "}&nbsp;
                                        {" "}&nbsp;{" "}&nbsp;{" "} 
                                        <Button bsStyle="danger" onClick={this.handlePanel}>cancel</Button>
                                    </Form>
                                    </th>
                                    </tr>);
                            }
                            },this)  
                        }
                </tbody>
            </Table>
        );
        return (
            <div >
                {tableInstance}
                <div>
                    <Button bsStyle="success" onClick={() => this.setState({ create: !this.state.create })}>Add Expense</Button><br/><br/>
                    <Col><Panel collapsible expanded={this.state.create}>
                        <Form method="post" inline>
                            <DjangoCSRFToken />
                            <ControlLabel>Enter New Expense</ControlLabel>
                                <FormGroup>
                                    <Col sm={12} >
                                    <InputGroup>
                                        <FormControl
                                            type="text"
                                            value={this.state.value}
                                            placeholder="Enter Expense"
                                            onChange={this.handleChange}
                                            name="expense_cost"
                                        />
                                        <InputGroup.Addon>.00</InputGroup.Addon>
                                        </InputGroup>
                                    </Col>
                                </FormGroup>
                                <FormGroup>
                                    <Col sm={12}>
                                    <FormControl
                                        type="text"
                                        value={this.state.value}
                                        placeholder="Enter Expense Type"
                                        onChange={this.handleChange}
                                        name="expense_type"
                                    />
                                    </Col>
                                </FormGroup>
                                <FormGroup>
                                    <Col sm={12}>
                                    <FormControl
                                        type="text"
                                        value={this.state.value}
                                        placeholder="Enter Expense Discription"
                                        onChange={this.handleChange}
                                        name="expense_description"
                                    />
                                    </Col>
                                </FormGroup>
                                <Button onClick={this.newExpense}>Submit</Button>
                        </Form>
                        </Panel>
                    </Col>
                </div>
            </div>
        );
    }
}

if (value == 'users_expenses') {
    ReactDOM.render(<Demo data={data}/>, document.getElementById('users_expenses'));
}