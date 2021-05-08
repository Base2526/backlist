import React, { Component } from 'react';
import { connect } from 'react-redux'
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import axios from 'axios';
import _ from 'lodash';
import { Redirect} from 'react-router-dom';

import { loadingOverlayActive } from '../../actions/huay'
import { headers, showToast } from '../Utils/Config';

// var _ = require('lodash');

class WithdrawPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      validated:false,
      user_id_bank: '',
      amount_of_withdraw: '',
      note: '',

      is_active: false
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
  }

  handleChange(event) {
    this.setState({[event.target.id]: event.target.value});

    if(event.target.id == 'amount_of_withdraw'){
      if( this.props.user.credit_balance < event.target.value){
        this.setState({
          error: true,
          error_message: 'จำนวนเงินไม่พอ',
          validated:false
        });
      }else{
        this.setState({
          error: false,
        });
      }
    }
  }   

  handleSubmit = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === false) {
      event.stopPropagation();
      this.setState({validated: true});
    }else{
      this.setState({is_active: true});
      let { user_id_bank, 
            amount_of_withdraw, 
            note} = this.state;  

      let response  = await axios.post('/api/withdraw', 
                                      { uid: this.props.user.uid, 
                                        user_id_bank,         // ID บัญชีธนาคารของลูกค้าที่จะให้โอนเงินเข้า
                                        amount_of_withdraw,   // จำนวนเงินที่ถอน
                                        note},          // หมายเหตุ
                                      {headers:headers()});
      console.log(response);
      this.setState({is_active: false});
      if( response.status==200 && response.statusText == "OK" ){
        if(response.data.result){
          this.nextPath('/');

          showToast('success', 'ถอนเงินเรียบร้อยรอการอนุมัติ');
        }else{
          this.setState({
            error: true,
            error_message: response.data.message,
            validated:true
          });

          showToast('error', response.data.message);
        }
      }else{
        showToast('error', 'Error');
      }
    }
  }

  loadingOverlayActive(){
    this.props.loadingOverlayActive(this.state.is_active);
  }

  nextPath(path) {
    this.props.history.push(path);
  }
  
  render() {
    let { validated, 
          user_id_bank,
          amount_of_withdraw,
          note,

          error, 
          error_message} = this.state;

    let {user} = this.props

    if(!user.banks.length){
      return <Redirect to="/add-bank" />
    }


    this.loadingOverlayActive();

    return (<Form noValidate validated={validated} onSubmit={this.handleSubmit}>
              <Container>
                <Row>
                { error ? <Alert variant={'danger'}>{error_message}</Alert> : '' }  
                </Row>
                <Row>
                  <Form.Group controlId="user_id_bank">
                    <Form.Label>เลือกบัญชีธนาคารของท่าน</Form.Label>
                    <Form.Control 
                        as="select" 
                        required 
                        value={user_id_bank}  
                        onChange={this.handleChange}>
                        <option value="">--เลือก--</option>
                        {/* <option value="10">ธ. กรุงเทพ</option>
                        <option value="20">ธ. กสิกรไทย</option>
                        <option value="30">ธ. กรุงไทย</option> */}

                        {
                          _.map(user.banks[0], (item, key) => {
                            return <option key={key} value={item.bank_tid}>{item.bank_name} : {item.name}</option>
                          })
                        }
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                        กรุณาเลือกธนาคาร
                    </Form.Control.Feedback>
                  </Form.Group>
                </Row>
                <Row>
                  <div>จำนวนเงินที่ถอนได้</div>
                  <div>
                    {Number(parseFloat(user.credit_balance).toFixed(2)).toLocaleString('en', {
                      minimumFractionDigits: 2
                      })
                    } 
                  บาท</div>
                </Row>
                <Row>
                  <Form.Group controlId="amount_of_withdraw">
                    <Form.Label>จำนวนเงินที่ต้องการถอน</Form.Label>
                    <Form.Control 
                      type="number" 
                      placeholder="0.00" 
                      required 
                      value={amount_of_withdraw} 
                      onChange={this.handleChange} />
                    <Form.Control.Feedback type="invalid">
                    จำนวนเงินที่ต้องการถอน
                    </Form.Control.Feedback>
                  </Form.Group>
                </Row>    
                <Row>
                  <Form.Group controlId="note">
                    <Form.Label>หมายเหตุ</Form.Label>
                      <Form.Control 
                        as="textarea" 
                        rows="3" 
                        value={note} 
                        onChange={this.handleChange} />
                  </Form.Group>
                </Row>
                <Row>
                  <Button type="submit">ถอนเงิน</Button>
                </Row>
              </Container>
            </Form>);
  }
}

// export default ;
const mapStateToProps = (state, ownProps) => {
  console.log(state);
	if(!state._persist.rehydrated){
		return {};
  }
  
  if(state.auth.isLoggedIn){
    return { logged_in:true, user: state.auth.user};
  }else{
    return { logged_in:false };
  }
}

const mapDispatchToProps = (dispatch) => {
	return {
    loadingOverlayActive: (isActivie) =>{
      dispatch(loadingOverlayActive(isActivie))
    }
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(WithdrawPage)