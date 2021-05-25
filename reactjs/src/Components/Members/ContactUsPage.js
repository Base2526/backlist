import React, { Component } from 'react';
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { connect } from 'react-redux'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import Image from 'react-bootstrap/Image'
import { loadingOverlayActive } from '../../actions/huay'
import { headers } from '../Utils/Config';

const axios = require('axios');
var styles = {
    simage: {
        width: '200px',
        height: '200px'
    }
}

class ContactUsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data:{},
      validated:false
    }
  }

  componentDidMount= async () =>{  
    // let response  = await axios.post('/api/contact-us', {}, {headers:headers()});
    // console.log(response);
    // if( response.status==200 && response.statusText == "OK" ){
    //   if(response.data.result){
    //     this.setState({data: response.data.data});
    //   }else{
    //   }
    // }
  }

  render() {
    let { data } = this.props;
    console.log(data);
    return (<Container>
                <Row>
                    <Col>
                      {/* <a href={`http://line.me/ti/p/~${data.line_at}`}>{data.line_at}</a> */}
                      {/* <div><a href={`tel:${data.tel}`}>{data.tel}</a></div>
                      <div><Image style={styles.simage} src={data.url_qrcode} rounded /></div>
                      <div>{data.description}</div> */}
                    </Col>
                </Row>
            </Container>)
  }
}

const mapStateToProps = (state, ownProps) => {
  console.log(state);
	if(!state._persist.rehydrated){
		return {};
  }
  
  if(state.auth.isLoggedIn){
    return { logged_in:true, data: state.contact_us.data};
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

export default connect(mapStateToProps, mapDispatchToProps)(ContactUsPage)