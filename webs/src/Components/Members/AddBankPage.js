import React, { Component, useState } from 'react';
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import { connect } from 'react-redux'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import InputMask from "react-input-mask";
import axios from 'axios';
import _ from 'lodash';
import { Base64 } from 'js-base64';

import { headers, showToast  } from '../Utils/Config';
import { loadingOverlayActive } from '../../actions/huay'

class AddBankPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            select_bank:'',
            name_bank:'',
            number_bank:'',
            number_bank_confirm:'',

            number_bank_confirm2:'',

            validated:false,
            error: false,
            error_message:'',

            is_active: false
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleClear  = this.handleClear.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    componentDidMount = async () =>{}

    handleSubmit = async (event) => {
      const form = event.currentTarget;
      event.preventDefault();
      if (form.checkValidity() === false) {
        event.stopPropagation();
        this.setState({validated: true});
      }else{
        this.setState({is_active: true});

        let { select_bank, name_bank, number_bank, number_bank_confirm} = this.state;   
        if(number_bank.trim() !== number_bank_confirm.trim())
        {

          this.setState({
            is_active: false,
            error: true,
            error_message: 'เลขที่บัญชี กับ ยืนยันเลขที่บัญชี ไม่เท่ากัน ',
          });
        }else{
          let response  = await axios.post('/api/add_bank', 
                                      { uid: this.props.user.uid,
                                        tid_bank: select_bank, 
                                        name_bank,
                                        number_bank}, 
                                      {headers:JSON.parse(Base64.decode(Base64.decode(localStorage.getItem('headers'))))});
          console.log(response);

          this.setState({is_active: false});
          if( response.status==200 && response.statusText == "OK" ){
            if(response.data.result){
              this.nextPath('/');

              showToast('success', 'เพิ่มบัญชีธนาคารเรียบร้อย');
            }else{
              this.setState({
                error: true,
                error_message: response.data.message,
                password:''
              });

              showToast('error', response.data.message);
            }
          }else{
            showToast('error', 'Error');
          }
        }
      }
    }

    handleChange(event) {
        this.setState({[event.target.id]: event.target.value});
    }    

    handleClear(event){
        this.setState({
            select_bank:'',
            name_bank:'',
            number_bank:'',
            number_bank_confirm:'',
        });
    }

    nextPath(path) {
      this.props.history.push(path);
    }

    loadingOverlayActive(){
      this.props.loadingOverlayActive(this.state.is_active);
    }
    
    render() {
      let {validated, error, error_message} = this.state;

      let {list_bank} = this.props;
     
      this.loadingOverlayActive();
      return (
          <Form noValidate validated={validated} onSubmit={this.handleSubmit}>
              { error ? <Alert variant={'danger'}>{error_message}</Alert> : '' }
              <Form.Group controlId="select_bank">
                  <Form.Label>เลือกธนาคาร</Form.Label>
                  <Form.Control 
                      as="select" 
                      required 
                      value={this.state.select_bank}  
                      onChange={this.handleChange}>
                      <option value="">--เลือก--</option>
                      {
                        //  _.map(this.state.list_bank, (val, key) => {
                        //   return <option key={key} value={key}>{val}</option>
                        // })   
                        list_bank.data.map(function(item, i){
                          return <option key={i} value={item.tid}>{item.name}</option>
                        })
                      }
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">
                      กรุณาเลือกธนาคาร
                  </Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="name_bank">
                  <Form.Label>ชื่อบัญชี</Form.Label>
                  <Form.Control 
                      type="text" 
                      placeholder="ชื่อบัญชี" 
                      required 
                      value={this.state.name_bank} onChange={this.handleChange}/>
                  <Form.Control.Feedback type="invalid">
                      กรุณากรอบชื่อบัญชี.
                  </Form.Control.Feedback>
              </Form.Group>
              <Form.Group>
                  <Form.Label>เลขที่บัญชี</Form.Label>
                  <InputMask 
                      id='number_bank' 
                      mask="999-9-99999-99999" 
                      onChange={this.handleChange} 
                      value={this.state.number_bank}
                      className="form-control"
                      placeholder="ยืนยันเลขที่บัญชี" 
                      maskPlaceholder={null}
                      required /> 
                  <Form.Control.Feedback type="invalid">
                      กรุณากรอบเลขที่บัญชี.
                  </Form.Control.Feedback>
              </Form.Group>
              <Form.Group>
                  <Form.Label>ยืนยันเลขที่บัญชี</Form.Label>
                  <InputMask 
                      id='number_bank_confirm' 
                      mask="999-9-99999-99999" 
                      onChange={this.handleChange} 
                      value={this.state.number_bank_confirm}
                      className="form-control"
                      placeholder="ยืนยันเลขที่บัญชี" 
                      maskPlaceholder={null}
                      required /> 
                  <Form.Control.Feedback type="invalid">
                      กรุณากรอบยืนยันเลขที่บัญชี xxx.
                  </Form.Control.Feedback>
              </Form.Group>
              <Button variant="primary" type="submit">
                  เพิ่มบัญชี
              </Button>
              {/* <Button variant="light" onClick={this.handleClear}>Clear</Button> */}
          </Form>
      );
    }
}

//	จะเป็น function ที่จะถูกเรียกตลอดเมือ ข้อมูลเปลี่ยนแปลง
//	เราสามารถดึงข้อมูลทั้งหมดที่อยู่ใน redux ได้เลย
const mapStateToProps = (state, ownProps) => {
	if(!state._persist.rehydrated){
		return {};
  }

  if(state.auth.isLoggedIn){
    return { logged_in: true, user: state.auth.user, list_bank:state.list_bank};
  }else{
    return { logged_in: false };
  }
}

const mapDispatchToProps = (dispatch) => {
	return {
    loadingOverlayActive: (isActivie) =>{
      dispatch(loadingOverlayActive(isActivie))
    }
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(AddBankPage)