import React, { Component } from 'react';
import { connect } from 'react-redux'
import ReactList from 'react-list';

class LotterySuppress extends Component {
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
    return (<div>lottery-suppress</div>);
 
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
export default connect(mapStateToProps, null)(LotterySuppress)