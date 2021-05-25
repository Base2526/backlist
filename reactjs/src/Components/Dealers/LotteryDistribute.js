import React, { Component } from 'react';
import { connect } from 'react-redux'
import ReactList from 'react-list';

import Alert from 'react-bootstrap/Alert'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

class LotteryDistribute extends Component {
    constructor(props) {
        super(props);

        this.state = {
            validated:false,
            error: false,
            error_message:'',

            selected: [],
        }

        this.renderSquareShareItem = this.renderSquareShareItem.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        // var arr = [35, 44, 99];
        // console.log(arr.indexOf(44) > -1); //true
    }

    handleSubmit = async (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        if (form.checkValidity() === false) {
            event.stopPropagation();
            this.setState({validated: true});
        }else{
            console.log('handleSubmit')
        }
    }

    handleChange(event) {
        console.log(event.target.id, event.target.value, event.target);
        // this.setState({[event.target.id]: event.target.value});

        let {selected} = this.state
        if(selected.indexOf(event.target.id) > -1){
            selected = selected.filter(item => item != event.target.id)
        }else{
            selected = [...selected, event.target.id];
        }
        this.setState({selected})
        console.log(selected)
    }

    renderSquareShareItem(index, key){
        return <div>{index}</div>
    }

    render() {
        let {lotterys} = this.props;
        let {validated, error, error_message, selected} = this.state;

        return (<Form noValidate validated={validated} onSubmit={this.handleSubmit}>   
                { error ? <Alert variant={'danger'}>{error_message}</Alert> : '' }
                {
                lotterys.map((value, key) =>{
                    if(selected.indexOf(value.tid.toString()) > -1){
                        return (<Form.Group key={key} controlId={value.tid}  >
                                    <Form.Check type="checkbox" checked={true} label={value.name} onChange={this.handleChange}/>
                                </Form.Group>)
                    }else{
                        return (<Form.Group key={key} controlId={value.tid}  >
                                    <Form.Check type="checkbox" checked={false} label={value.name} onChange={this.handleChange}/>
                                </Form.Group>)
                    }
                })
                }
                <Button variant="primary" type="submit">บันทึก</Button>
                </Form>) 
    }
};

const mapStateToProps = (state, ownProps) => {
    console.log(state);
	if(!state._persist.rehydrated){
		return {};
    }
    
    if(state.auth.isLoggedIn){
      let lotterys = state.lotterys.data
      return { loggedIn: true, lotterys };
    }else{
      return { loggedIn: false };
    }
}
export default connect(mapStateToProps, null)(LotteryDistribute)