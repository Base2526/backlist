import React, { Component } from 'react';
import { connect } from 'react-redux'

class RewardPage extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  render() {
    let {tid, type} = this.props.location.state
    return (<div>RewardPage type > {type}, id > {tid}</div>);
  }
}

const mapStateToProps = (state, ownProps) => {
	if(!state._persist.rehydrated){
		return {};
    }
    
    if(state.auth.isLoggedIn){
        return { loggedIn: true, user:state.auth.user };
    }else{
        return { loggedIn: false };
    }
}
export default connect(mapStateToProps, null)(RewardPage)