import React, { Component } from 'react';
import { connect } from 'react-redux'
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import DatePicker from "react-datepicker";
import axios from 'axios';
import _ from 'lodash';

import { Base64 } from 'js-base64';

import { Redirect} from 'react-router-dom';

import "react-datepicker/dist/react-datepicker.css";
import { showToast } from '../Utils/Config';
import { loadingOverlayActive } from '../../actions/huay'

class DepositPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      validated:false,
      error: false,
      error_message:'',
      is_active: false,

      hauy_id_bank:'', 
      user_id_bank:'', 
      amount: '', 
      transfer_method: '', 
      date_transfer: '',//Date.parse((new Date()).toString()), 
      note:'',


      attached_file: null
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
  }

  handleChange(event) {
    this.setState({[event.target.id]: event.target.value});
  }    

  handleDateTransferChange = date => {
    this.setState({
      date_transfer: Date.parse(date.toString())
    });
  }

  handleSubmit = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === false) {
      event.stopPropagation();
      this.setState({validated: true});
    }else{
      this.setState({is_active: true});
      let { hauy_id_bank, 
            user_id_bank, 
            transfer_method, 
            amount, 
            date_transfer, 
            note} = this.state;  


      console.log(this.state);

      // Create an object of formData 
      const formData = new FormData(); 
    
      // Update the formData object 
      if(this.state.attached_file){
        formData.append( 
          "attached_file", 
          this.state.attached_file, 
          this.state.attached_file.name 
        );
      }
      
      formData.append('uid', this.props.user.uid); 
      formData.append('hauy_id_bank', hauy_id_bank); 
      formData.append('user_id_bank', user_id_bank); 
      formData.append('transfer_method', transfer_method); 
      formData.append('amount', amount); 
      formData.append('date_transfer', date_transfer); 
      formData.append('note', note); 

      var headers = JSON.parse(Base64.decode(Base64.decode(localStorage.getItem('headers'))));

      var new_headers = { 'Content-Type': 'multipart/form-data' };
      new_headers.authorization = headers.authorization;
      new_headers.uid           = headers.uid;

      let response  = await axios.post('/api/add-deposit', 
                                      formData,
                                      {headers:new_headers});
                     
      this.setState({is_active: false}); 
      if( response.status==200 && response.statusText == "OK" ){
        if(response.data.result){
          this.nextPath('/');

          showToast('success', 'ฝากเงินเรียบร้อย รอการอนุมัติ');
        }else{
          this.setState({
            error: true,
            error_message: response.data.message,
            validated:true
          });

          showToast('error', response.data.message);
        }
      }else{
        // ฝากเงิน
        showToast('error', 'Error');
      }
      

      // { 'content-type': 'multipart/form-data' }
      
      /*
      $uid                = trim( $content['uid'] );
      $hauy_id_bank       = trim( $content['hauy_id_bank'] );     // ID ธนาคารของเว็บฯ
      $user_id_bank       = trim( $content['user_id_bank'] );     // ID บัญชีธนาคารของลูกค้าที่จะให้โอนเงินเข้า
      $transfer_method    = trim( $content['transfer_method'] );  // ช่องทางการโอนเงิน
      $amount             = trim( $content['amount'] );           // จำนวนเงินที่โอน
      $note               = trim( $content['note'] );             // หมายเหตุ
      */

      /*
      let response  = await axios.post('/api/add-deposit', 
                                      { uid: this.props.user.uid, 
                                        hauy_id_bank,      // ID ธนาคารของเว็บฯ
                                        user_id_bank,      // ID บัญชีธนาคารของลูกค้าที่จะให้โอนเงินเข้า
                                        amount_of_money,   // จำนวนเงินที่โอน
                                        transfer_method,   // ช่องทางการโอนเงิน
                                        date_transfer,     // วัน & เวลา ที่โอน
                                        note},       // หมายเหตุ
                                      {headers:headers()});
      console.log(response);
      if( response.status==200 && response.statusText == "OK" ){
        if(response.data.result){
          this.nextPath('/');

          showToast('success', 'ฝากเงินเรียบร้อย รอการอนุมัติ');
        }else{
          this.setState({
            error: true,
            error_message: response.data.message,
            validated:true
          });

          showToast('error', response.data.message);
        }
      }else{
        // ฝากเงิน
        showToast('error', 'Error');
      }
      this.setState({is_active: false}); 
      */
    }
  }

  nextPath(path) {
    this.props.history.push(path);
  }

  loadingOverlayActive(){
    this.props.loadingOverlayActive(this.state.is_active);
  }

  // On file select (from the pop up) 
  onFileChange = event => { 
    // Update the state 
    this.setState({ attached_file: event.target.files[0] });
  }; 

  // On file upload (click the upload button) 
  onFileUpload = () => { 
     
    // Create an object of formData 
    const formData = new FormData(); 
   
    // Update the formData object 
    formData.append( 
      "myFile", 
      this.state.attached_file, 
      this.state.attached_file.name 
    ); 
   
    // Details of the uploaded file 
    console.log(this.state.attached_file); 

    
   
    // Request made to the backend api 
    // Send formData object 
    axios.post("api/uploadfile", formData); 
  }; 

  render() {
    let { validated, 
          hauy_id_bank, 
          user_id_bank, 
          amount, 
          transfer_method, 
          date_transfer, 
          note} = this.state

    console.log(this.props.transfer_method)
    console.log(this.props);
    console.log(this.state);

    // this.props.user.banks[0]

    let {user} = this.props
    
    if(!user.banks.length){
      return <Redirect to="/add-bank" />
    }

    this.loadingOverlayActive();

    return (<Form noValidate validated={validated} onSubmit={this.handleSubmit}>
              <Container>
                <Row>
                  <div>
                    <div>Step 1 : เลือกบัญชีธนาคารของเว็บฯ</div>
                    <div>
                      <Form.Group controlId="hauy_id_bank">
                        <Form.Label>เลือกธนาคาร</Form.Label>
                        <Form.Control 
                            as="select" 
                            required 
                            value={hauy_id_bank}  
                            onChange={this.handleChange}>
                            <option value="">--เลือก--</option>
                            {/* <option value="10">ธ. กรุงเทพ</option>
                            <option value="20">ธ. กสิกรไทย</option>
                            <option value="30">ธ. กรุงไทย</option> */}
                            {
                              this.props.huay_list_bank.map(function(item, i){
                                console.log(item);
                                return <option key={item._id} value={item.tid}>{item.name}</option>
                              })
                              }
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">
                            กรุณาเลือกธนาคาร
                        </Form.Control.Feedback>
                      </Form.Group>
                    </div>
                  </div>
                </Row>
                <Row>
                  <div>
                    <div>Step 2 : โอนเงินเพื่อเติมเครดิต</div>
                    <div>
                      โอนขั้นตํ่า "ครั้งละ 20 บาท" ถ้าโอนตํ่ากว่า 20 บาทเงินของท่านจะไม่เข้าระบบ
                      และไม่สามารถคืนได้
                    </div>

                    <div>
                      คำเตือน! กรุณาใช้บัญชีที่ท่านผูกกับ XXX ในการโอนเงินเท่านั้น
                    </div>

                    <div>
                      เมือท่านทำการโอนเงินไปยังบัญชีข้างต้นเรียบร้อยแล้ว (เก็บสลิปการโอนไว้ทุกครั้ง)
                      "คลิกปุ่มด้านล่าง" เพือแจ้งการโอนเงิน
                    </div>
                  </div>
                </Row>
                <Row>
                  <div>
                    <div>Step 3 : แจ้งรายละเอียดการโอนเงิน</div>
                    <div>กรุณาโอนเงินเข้าบัญชีด้านบน ภาญใน 5 นาที</div>
                    <div>เลือกบัญชีธนาคารของลูกค้า</div>
                    <div>
                      <Form.Group controlId="user_id_bank">
                        <Form.Label>เลือกธนาคาร</Form.Label>
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
                              _.map(this.props.list_bank, (val, key) => {
                                return <option key={val._id} value={val.tid}>{val.name}</option>
                              })
                            }
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">
                            กรุณาเลือกธนาคาร
                        </Form.Control.Feedback>
                      </Form.Group>
                    </div>
                    
                    <div>
                      <Form.Group controlId="transfer_method">
                        <Form.Label>กรุณาเลือกช่องทางการโอน</Form.Label>
                        <Form.Control 
                            as="select" 
                            required 
                            value={transfer_method}  
                            onChange={this.handleChange}>
                            <option value="">--เลือก--</option>
                            {/* <option value="10">ATM โอนจากตู้กดเงินสด</option>
                            <option value="20">CDM</option>
                            <option value="30">Counter Cashier</option>
                            <option value="30">Internet Banking</option>
                            <option value="30">Mobile Banking</option> */}
                            {
                              this.props.transfer_method.map(function(item, i){
                                console.log(item);
                                return <option key={item._id} value={item.tid}>{item.name}</option>
                              })
                            }
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">
                        กรุณาเลือกช่องทางการโอน
                        </Form.Control.Feedback>
                      </Form.Group>
                    </div>
                    <div>
                      <Form.Group controlId="amount">
                        <Form.Label>จำนวนเงินที่โอน</Form.Label>
                        <Form.Control 
                          type="number" 
                          placeholder="0.00" 
                          required 
                          value={amount} onChange={this.handleChange} />
                        <Form.Control.Feedback type="invalid">
                        จำนวนเงินที่โอน
                        </Form.Control.Feedback>
                      </Form.Group>
                    </div>

                    <div>
                      <Form.Group controlId="select_function">
                        <Form.Label>วัน-เวลาโอน</Form.Label>
                          <DatePicker
                              selected={ date_transfer == "" ? '' : (new Date(date_transfer))}
                              // onChange={date => setStartDate(date)}
                              onChange={this.handleDateTransferChange}
                              showTimeSelect
                              timeFormat="HH:mm"
                              className="form-control"
                              // injectTimes={[
                              //   setHours(setMinutes(new Date(), 1), 0),
                              //   setHours(setMinutes(new Date(), 5), 12),
                              //   setHours(setMinutes(new Date(), 59), 23)
                              // ]}
                              required
                              dateFormat="MMMM d, yyyy h:mm aa"
                            />
                        <Form.Control.Feedback type="invalid">
                        วัน-เวลาโอน
                        </Form.Control.Feedback>
                      </Form.Group>
                    </div>
                    <div>
                      <input type="file" onChange={this.onFileChange} /*style={{ display: 'none' }}*/  />
                      <img style={{ width: '200px', height: '200px',}}  src={this.state.attached_file ? URL.createObjectURL(this.state.attached_file) : ""}/>
                    </div>
                    <div>
                      <Form.Group controlId="note">
                        <Form.Label>หมายเหตุ</Form.Label>
                          <Form.Control 
                            as="textarea" 
                            rows="3" 
                            value={note} 
                            onChange={this.handleChange} />
                      </Form.Group>
                    </div>
                  </div>
                </Row>
                <Row>
                  <Button type="submit">ยืนยันการแจ้งโอนเงิน</Button>
                </Row>
              </Container>
            </Form>);
  }
}

const mapStateToProps = (state, ownProps) => {
  console.log(state);
	if(!state._persist.rehydrated){
		return {};
  }

  if(state.auth.isLoggedIn){
    let huay_list_bank = state.huay_list_bank.data;
    let transfer_method = state.transfer_method.data;
    let list_bank = state.list_bank.data;

    console.log(huay_list_bank)
    console.log(transfer_method)
    console.log(list_bank)
    
    return {...{huay_list_bank, transfer_method, list_bank}, 
            logged_in:true, 
            user: state.auth.user};
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

export default connect(mapStateToProps, mapDispatchToProps)(DepositPage)