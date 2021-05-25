import React, { Component } from 'react';
import ReactList from 'react-list';
import { connect } from 'react-redux'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import axios from 'axios';

import { headers, isEmpty, convertTimestamp2Date, showToast } from '../Utils/Config';
import { loadingOverlayActive } from '../../actions/huay'

import '../../index.css';

class LotteryListChitsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal_show_detail: false,
      is_active: false,
      loading_text: 'รอสักครู่',

      chit: null
    };

    this.renderSquareShareItem = this.renderSquareShareItem.bind(this);
    this.handleShowDetailClick = this.handleShowDetailClick.bind(this);
    this.handleCancelBetClick = this.handleCancelBetClick.bind(this);
    this.showDetail = this.showDetail.bind(this);
  }

  componentDidMount() {
  }

  loadingOverlayActive(){
    this.props.loadingOverlayActive(this.state.is_active, this.state.loading_text);
  }

  showDetail(){

    console.log(this.state.chit);

    // รอดำเนินการ : 55
    // ยกเลิก      : 56
    // อนุมัติ       : 57

    let btn_cancel = <div />
    if(this.state.chit.chit_status_id != 57){
      btn_cancel = <Button onClick={() =>{ this.handleCancelBetClick() }}>ยกเลิกโพย</Button>;
    }

    return<Modal
            show={true}
            onHide={() => {
              this.setState({modal_show_detail: false})
            }}
            dialogClassName="modal-90w"
            aria-labelledby="example-custom-modal-styling-title"
            backdrop="static"
            scrollable={true}>
            <Modal.Header closeButton>
              <Modal.Title id="example-custom-modal-styling-title">
              รายละเอียด
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
            </Modal.Body>
            <Modal.Footer>
              { btn_cancel }
            </Modal.Footer>
          </Modal>
  }

  handleShowDetailClick = (chit)=>{
    this.setState({chit, modal_show_detail:true});
  }

  handleCancelBetClick = async()=>{
    console.log(this.state.chit);

    let response  = await axios.post('/api/bet_cancel', 
                                          { uid: this.props.user.uid,
                                            nid: this.state.chit.nid,
                                            time: new Date().getTime() }, 
                                          {headers:headers()});
    console.log(response);

    this.setState({is_active:false, modal_show_detail:false})

    if( response.status==200 && response.statusText == "OK" ){
    //   if(response.data.result){
    //     this.nextPath('/');

    //     showToast('success', 'ส่งโพยเรียบร้อย');
    //   }else{
    //     this.setState({
    //       error: true,
    //       error_message: response.data.message,
    //       password:''
    //     });

    //     showToast('error', response.data.message);
    //   }
    }else{
      showToast('error', 'Error');
    }
  }

  renderSquareShareItem(index, key){
    let {chits} = this.props

    let chit = chits[index];


    return<div key={key} className={'square-item'} >
            <div >ชื่อ : {chit.chit_type_name}</div>
            <div >รอบ : {chit.round_name}</div>
            <div >สถานะ : {chit.chit_status_name}</div> 
            <div >เวลา : {convertTimestamp2Date(chit.changed)}</div>
            <Button onClick={() =>{ this.handleShowDetailClick(chit) }}>ดูรายละเอียด</Button>
          </div>
  }

  // new Date( 1588719600000 )).format("dd.mm.yyyy hh:MM:ss")

  // var t = new Date( 1588719600000 );
    // var formatted = t.format("dd.mm.yyyy hh:MM:ss");
  
  render() {
    let {chits} = this.props

    var date = new Date(1588719600000*1000);
    console.log(date);

    this.loadingOverlayActive();

    return  <div> 
              { this.state.modal_show_detail ? this.showDetail() : '' }
              <ReactList
                itemRenderer={this.renderSquareShareItem}
                length={chits.length}
                type='uniform'/>
            </div>
  }
}

const mapStateToProps = (state, ownProps) => {
  console.log(state)
  if(!state._persist.rehydrated){
    return {};
  }

  if(state.auth.isLoggedIn){
    let chits = state.auth.user.chits;
    console.log(chits)
    return {  loggedIn: true, user:state.auth.user, chits};
  }else{
    return { loggedIn: false };
  }
}

const mapDispatchToProps = (dispatch) => {
	return {
    loadingOverlayActive: (isActivie, loadingText) =>{
      dispatch(loadingOverlayActive(isActivie, loadingText))
    }
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(LotteryListChitsPage)