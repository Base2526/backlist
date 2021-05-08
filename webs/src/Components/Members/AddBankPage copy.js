import React, { Component } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
// import InputAutocomplete from './InputAutocomplete/InputAutocomplete';
import { Input, DatePicker, Radio, Row, Col } from 'antd';
import { RightCircleOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';
import '../RideSelect/RideSelect.css';
import ls from 'local-storage';

import { withStyles } from '@material-ui/styles';
import Button from '@material-ui/core/Button';


import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import history from '../../history';
import { Redirect, Link} from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(1),
      width: 200,
    //   minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
}));
  
class AddBankPage extends Component {
    // const classes = useStyles();
    constructor(props) {
        super(props);
        this.state = {
            bank:"",
            name_bank:"", 
            number_bank:"", 
            number_bank_confirm:""
        };

        this.onChange = this.onChange.bind(this);
        this.handleSelectChange = this.handleSelectChange.bind(this);
        this.submitForm = this.submitForm.bind(this);
    }

    componentDidMount() {
        
    }

    onChange(e) {
        this.setState({
          [e.target.name]: e.target.value
        });
        // console.log(e.target.name)
        // console.log(e.target.value)
    }

    // handleChange(e){
    //     this.setState({selectValue:e.target.value});
    // }

    handleSelectChange = (event) => {
        this.setState({bank:event.target.value});
    };

    submitForm = async e => {
        e.preventDefault();
        console.log(this.state);
    }
  
    render() {
        const { history, classes } = this.props;
        return (
            <div style={{}}>
            <form onSubmit={this.submitForm} >    
                <FormControl className={classes.formControl}>
                <InputLabel id="demo-simple-select-label">เลือกธนาคาร</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={this.state.bank}
                    onChange={this.handleSelectChange}>
                    <MenuItem value="">None</MenuItem>
                    <MenuItem value={10}>ธ. กรุงเทพ</MenuItem>
                    <MenuItem value={20}>ธ. กสิกรไทย</MenuItem>
                    <MenuItem value={30}>ธ. กรุงไทย</MenuItem>
                </Select>
                </FormControl>
                <br />
                <TextField
                    margin="normal"
                    onChange={this.onChange}
                    label="ชื่อบัญชี"
                    id="outlined-size-normal"
                    // defaultValue={this.state.userName}
                    variant="outlined"
                    name="name_bank"/>
                <br />
                <TextField
                    margin="normal"
                    onChange={this.onChange}
                    label="เลขที่บัญชี"
                    id="outlined-size-normal"
                    variant="outlined"
                    name="number_bank"/>
                <br />
                <TextField
                    margin="normal"
                    onChange={this.onChange}
                    label="ยืนยันเลขที่บัญชี"
                    id="outlined-size-normal"
                    variant="outlined"
                    name="number_bank_confirm"/>
                <br />
                <Button type="submit" variant="contained">เพิ่มบัญชี</Button>
                <Button variant="contained" color="primary" onClick={ () => history.push('/')}>ยกเลิก</Button>
            </form>
        </div>
        );
    }
}

export default withStyles(useStyles)(AddBankPage);