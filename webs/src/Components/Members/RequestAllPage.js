import React, { Component } from 'react';
import { connect } from 'react-redux'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import axios from 'axios';

import ReactList from 'react-list';

import moment from 'moment'

import { loadingOverlayActive } from '../../actions/huay'
import { headers, showToast } from '../Utils/Config';

class RequestAllPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      is_active: false,

      tab_active_key: "tab-deposit" 
    }

    this.renderDepositItem  = this.renderDepositItem.bind(this);
    this.renderWithdrawItem = this.renderWithdrawItem.bind(this);
    this.handleTabsSelect   = this.handleTabsSelect.bind(this);
  }

  componentDidMount = async () => {}

  loadingOverlayActive(){
    this.props.loadingOverlayActive(this.state.is_active);
  }

  renderDepositItem(index, key) {
    let {deposit_status, transfer_method, user} = this.props;

    let sortedDeposit = user.deposit.sort((a, b) => {
      return new Date(b.create* 1000) - new Date(a.create* 1000);
    })

    let find_deposit_status = deposit_status.data.find(o => o.tid == sortedDeposit[index].deposit_status);
    let find_transfer_method = transfer_method.data.find(o => o.tid == sortedDeposit[index].transfer_method);

    return  <div key={key}>
              <div>Amount : {sortedDeposit[index].amount}</div>
              <div>Attached_file : {sortedDeposit[index].attached_file}</div>
              <div>Deposit_status : {find_deposit_status.name}</div>
              <div>Transfer_method : {find_transfer_method.name}</div>
              <div>Date : {(new Date(sortedDeposit[index].create * 1000)).toString()}</div>
              <div>Note : {sortedDeposit[index].note}</div>
              <hr />
            </div>;
  }

  renderWithdrawItem(index, key) {
    let {deposit_status, user} = this.props;

    let sortedWithdraw = user.withdraw.sort((a, b) => {
      return new Date(b.create* 1000) - new Date(a.create* 1000);
    })

    let find_deposit_status = deposit_status.data.find(o => o.tid == sortedWithdraw[index].deposit_status);
    
    return  <div key={key}>
              <div>Amount : {sortedWithdraw[index].amount}</div>
              <div>Deposit_status : {find_deposit_status.name}</div>
              <div>Date : {(new Date(sortedWithdraw[index].create * 1000)).toString()}</div>
              <div>Note : {sortedWithdraw[index].note}</div>
              <hr />
            </div>;
  }

  handleTabsSelect(tab_active_key) {
    console.log("selected " + tab_active_key);
    this.setState({tab_active_key})
  }
  
  render() {
    let {tab_active_key}  = this.state;
    let {deposit, withdraw}         = this.props.user;


    return(
      <Tabs 
        // defaultActiveKey="tab-deposit" 
        id="uncontrolled-tab-example"
        activeKey={tab_active_key}
        onSelect={this.handleTabsSelect}>
        <Tab eventKey="tab-deposit" title="ฝากเงิน">
          {
            deposit.length == 0 ? <div>ไม่มีรายการฝากเงิน</div> : <ReactList
                                                                  itemRenderer={this.renderDepositItem}
                                                                  length={deposit.length}
                                                                  type='uniform'/>
          }
          
        </Tab>
        <Tab eventKey="tab-withdraw" title="ถอนเงิน">
            {
              withdraw.length == 0 ? <div>ไม่มีรายการถอนเงิน</div> :<ReactList
                                                                    itemRenderer={this.renderWithdrawItem}
                                                                    length={withdraw.length}
                                                                    type='uniform'/> 
            }
        </Tab>
      </Tabs>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
	if(!state._persist.rehydrated){
		return {};
  }

  if(state.auth.isLoggedIn){
    let {huay_list_bank, list_bank, transfer_method, deposit_status} = state;
    return {logged_in:true, 
            user: state.auth.user,
            ...{huay_list_bank, list_bank, transfer_method, deposit_status}};
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

export default connect(mapStateToProps, mapDispatchToProps)(RequestAllPage)