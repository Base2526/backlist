import React, { Component } from 'react';
import { connect } from 'react-redux'
import ReactList from 'react-list';

class ListDealers extends Component {
  constructor(props) {
    super(props);

    this.renderSquareShareItem = this.renderSquareShareItem.bind(this);
  }

  componentDidMount() {
  }

  renderSquareShareItem(index, key){
    return <div>{index}</div>
  }

  render() {
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
export default connect(mapStateToProps, null)(ListDealers)