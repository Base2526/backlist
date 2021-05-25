import React, { Component } from 'react';
import { connect } from 'react-redux'
import { addTodo, userLogin } from '../actions'

import Image from 'react-bootstrap/Image'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import ls from 'local-storage';

import axios from 'axios';

var styles = {
  simage: {
      width: '200px',
      height: '200px'
  }
}

class ProfilePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      pass: '',
      error: false,
      error_message:'',
    };

    this.onChange = this.onChange.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }

  componentDidMount() {
    // this.callApi()
    //   .then(res => console.log(res.express) )
    //   .catch(err => console.log(err));
  }

  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  callApi = async () => {
    const response = await fetch('/api/hello');
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    
    return body;
  };

  // submitForm(e) {
  submitForm = async e => {
    e.preventDefault();
    console.log('submitForm');
    const { user, pass } = this.state;

    if(user.trim() == "" && pass.trim() == "" ){
      this.setState({
        error: true,
        error_message: "Username && Pass is empty."
          });
    }else if(user.trim() == ""){
      this.setState({
        error: true,
        error_message: "Username is empty."
          });
    }else if(pass.trim() == ""){
      this.setState({
        error: true,
        error_message: "Password is empty."
          });
    }
 
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name:user, pass}),
    });

    let body = await response.text();

    body = JSON.parse(body);
    if(!body.result){
      console.log(body.message);
    }else{
      let data = body.data;
      console.log(data);

      this.props.userLogin();
    }

    // if(username === "admin" && password === "admin") {
    //   ls.set("token", "56@cysXs");
    //   this.setState({
    //     loggedIn: true
    //   });
    // } else {
    //   return <p>Invalid Creds</p>
    // }
    // this.props.userLogin('username', 'password');
    // this.props.addTodo('4');
    /*
    const params = {
      name: username,
      pass: password
    };
    const headers = {
      'Content-Type': 'application/json'
    };
    axios.post("http://localhost/api/login.json",{ params }, {headers})
    .then(res => {
      console.log(res);
      // console.log(res.data);
    })
    .catch(function (error) {
      console.log(error);
    });
    */
  }

  render() {
    let {name, email,image_url} = this.props.user;
    console.log(this.props.user);
    return (<Container>
              <Row>
                <Col>
                  <div>{name}</div>
                  <div><Image style={styles.simage} src={image_url} rounded /></div>
                  <div>{email}</div>
                </Col>
              </Row>
            </Container>);
  }
};

// 


/*
	จะเป็น function ที่จะถูกเรียกตลอดเมือ ข้อมูลเปลี่ยนแปลง
	เราสามารถดึงข้อมูลทั้งหมดที่อยู่ใน redux ได้เลย
*/
const mapStateToProps = (state, ownProps) => {
  console.log(state);
  console.log(ownProps);

	if(!state._persist.rehydrated){
		return {};
  }
  
  if(state.auth.isLoggedIn){
    return { loggedIn: true, user:state.auth.user };
  }else{
    return { loggedIn: false };
  }
}

/*
	การที่เราจะเรียก function ที่อยู่ใน actions ได้
	การใช้
	แบบที่ 1.
	const mapDispatchToProps = (dispatch) => {
		return {
			function1: (id) => {
								// function ที่อยู่ใน actions
								dispatch(addTodo(param1))
							},
			function2: (id, val) => {
								// function ที่อยู่ใน actions
								dispatch(addTodo(param1, param2))
							},
		}
	}
	export default connect(null, mapDispatchToProps)(function)
	แบบที่ 2.
	export default connect(null, { doFunction1, doFunction2 })(function)

	การเรียกใช้
	แบบที่ 1 
	this.props.addTodo(param1, param2);

	แบบที่ 2
	let {function1, function2} = this.props;
*/
const mapDispatchToProps = (dispatch) => {
	console.log(dispatch);

	return {
		addTodo: (id) => {
							dispatch(addTodo(id))
						},
		addTodo2: (id, val) => {
							dispatch(addTodo(val))
            },
    userLogin: () =>{
      dispatch(userLogin())
    }

	}
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePage)