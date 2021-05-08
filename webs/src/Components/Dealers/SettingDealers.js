import React, { Component } from 'react';
import { connect } from 'react-redux'
import ReactList from 'react-list';

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'

class SettingDealers extends Component {
  constructor(props) {
    super(props);

    this.renderSquareShareItem = this.renderSquareShareItem.bind(this);
  }

  componentDidMount() {
  }

  renderSquareShareItem(index, key){
    return <div>{index}</div>
  }

  nextPath(path) {
    this.props.history.push(path);
  }

  render(){
      return<Container>
            <Row style={{ border: '1px solid #61dafb' }}>
                <Col style={{ border: '1px solid #61dafb' }} md={3} xs={6}>
                    <Button variant="primary" onClick={() =>{ this.nextPath('/setting-dealers/list-dealers') }}>รายการโพยทั้งหมด</Button>
                </Col>
                <Col style={{ border: '1px solid #61dafb' }} md={3} xs={6}>
                    <Button variant="primary" onClick={() =>{ this.nextPath('/setting-dealers/lottery-suppress') }}>อั้นหวย</Button>
                </Col>
                <Col style={{ border: '1px solid #61dafb' }} md={3} xs={6}>
                    <Button variant="primary" onClick={() =>{ this.nextPath('/setting-dealers/lottery-distribute') }}>รายการหวยที่รับซื้อ</Button>
                </Col>
                {/* <Col style={{ border: '1px solid #61dafb' }} md={3} xs={6}>
                    <Button variant="primary" onClick={() =>{ this.nextPath('/setting-dealers/list-dealers') }}>รายการโพยทั้งหมด</Button>
                </Col> */}
            </Row>
            </Container>
  }

  render2() {
    let {dealers} = this.props;
    console.log(dealers)
    // return (<div>List dealers</div>);
    let lotterys = [{'tid':66, 'name':'หวยรัฐบาลไทย'}, {'tid':67, 'name':'จับยี่กี VIP'}, {'tid':68, 'name':'หวยฮานอย'}]
    return lotterys.map((value, key) =>{
      switch(value.tid){
        // หวยรัฐบาลไทย
        case 66:{
          return (
            <div key={1}>
              <p>{value.name}</p>
              <ReactList
                key={1}
                itemRenderer={this.renderSquareShareItem}
                length={10}
                type='uniform'/>
            </div>
          );
        }

        // จับยี่กี VIP
        case 67:{
          return (
            <div key={1}>
              <p>{value.name}</p>
              <ReactList
                key={1}
                itemRenderer={this.renderSquareShareItem}
                length={10}
                type='uniform'/>
            </div>
          );
        }

        // หวยฮานอย
        case 68:{
          return (
            <div key={1}>
              <p>{value.name}</p>
              <ReactList
                key={1}
                itemRenderer={this.renderSquareShareItem}
                length={10}
                type='uniform'/>
            </div>
          );
        }
      }
    });
  }
};

const mapStateToProps = (state, ownProps) => {
  console.log(state);
	if(!state._persist.rehydrated){
		return {};
    }
    
    if(state.auth.isLoggedIn){
      return { loggedIn: true, dealers:state.auth.user.dealers };
    }else{
      return { loggedIn: false };
    }
}
export default connect(mapStateToProps, null)(SettingDealers)