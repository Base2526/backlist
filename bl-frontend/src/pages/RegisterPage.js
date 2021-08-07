import React, { Component } from 'react';
import { Redirect, Link} from 'react-router-dom';

import { connect } from 'react-redux'

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

class RegisterPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      validated: false,
      name: '',
      email: '',
      password: '',

      error: false,
      error_message:'',
    };

    this.onChange = this.onChange.bind(this);
    this.submitForm = this.submitForm.bind(this);

    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    // this.callApi()
    //   .then(res => console.log(res.express) )
    //   .catch(err => console.log(err));
  }

  handleChange(event) {
    this.setState({[event.target.id]: event.target.value});
  }    

  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  // callApi = async () => {
  //   const response = await fetch('/api/hello');
  //   const body = await response.json();
  //   if (response.status !== 200) throw Error(body.message);
    
  //   return body;
  // };

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

    // let response  = await axios.post('/api/login', 
    //                     {name: email, pass: password}, 
    //                     {headers:headers()});
 
    // const response = await fetch('/api/register', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ name:user, pass}),
    // });

    // let body = await response.text();

    // body = JSON.parse(body);
    // if(!body.result){
    //   console.log(body.message);
    // }else{
    //   let data = body.data;
    //   console.log(data);

    //   this.props.userLogin(data);
    // }

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

  handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();

      this.setState({validated:true});
    }
    let { email, password } = this.state;

    console.log(email);
    console.log(password);
  }

  nextPath(path) {
    this.props.history.push(path);
  }

  render(){
    let {validated, name, email, password} = this.state;

    if(this.props.loggedIn){
      return <Redirect to="/" />
    }

    return( <Form noValidate validated={validated} onSubmit={this.handleSubmit}>
             <Form.Group controlId="name">
                <Form.Label>ชื่อ</Form.Label>
                <Form.Control 
                    type="text" 
                    placeholder="ชื่อ" 
                    required 
                    value={name} onChange={this.handleChange}/>
                <Form.Control.Feedback type="invalid">
                    กรุณากรอบชื่อ.
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="email">
                <Form.Label>อีเมลล์</Form.Label>
                <Form.Control 
                  type="email" 
                  placeholder="อีเมลล์" 
                  required 
                  value={email} onChange={this.handleChange}/>
                <Form.Control.Feedback type="invalid">
                    กรุณากรอบอีเมลล์ หรือ invalid email address.
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="password">
                <Form.Label>รหัสผ่าน</Form.Label>
                <Form.Control 
                  type="password" 
                  placeholder="รหัสผ่าน" 
                  required
                  value={password} onChange={this.handleChange}/>
                <Form.Control.Feedback type="invalid">
                    กรุณากรอบรหัสผ่าน.
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="password_confirm">
                <Form.Label>ยืนยันรหัสผ่าน</Form.Label>
                <Form.Control 
                  type="password" 
                  placeholder="ยืนยันรหัสผ่าน" 
                  required
                  value={password} onChange={this.handleChange}/>
                <Form.Control.Feedback type="invalid">
                    กรุณากรอบยืนยันรหัสผ่าน.
                </Form.Control.Feedback>
              </Form.Group>
              <Button variant="primary" type="submit">
                สมัครสมาชิก
              </Button>
            </Form>
    );
  }
};

/*
	จะเป็น function ที่จะถูกเรียกตลอดเมือ ข้อมูลเปลี่ยนแปลง
	เราสามารถดึงข้อมูลทั้งหมดที่อยู่ใน redux ได้เลย
*/
const mapStateToProps = (state, ownProps) => {
	if(!state._persist.rehydrated){
		return {};
  }
  
  if(state.auth.isLoggedIn){
    return { loggedIn: true };
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
// const mapDispatchToProps = (dispatch) => {
// 	return {
//     userLogin: (data) =>{
//       dispatch(userLogin(data))
//     }
// 	}
// }

export default connect(mapStateToProps, null)(RegisterPage)