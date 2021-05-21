import React, { Component } from 'react';
import { connect } from 'react-redux'
import axios from 'axios';
import { CircularProgress } from '@material-ui/core';
import AddCircleOutlinedIcon from '@material-ui/icons/AddCircleOutlined';

import Pagination from "./Pagination";
import UseHomeItem from "./UseHomeItem";
import Checkbox from "./Checkbox";
import AddBanlistForm from './AddBanlistForm'

import LoginForm from '../Setting/LoginForm'
import {isEmpty} from '../Utils/Utils'
import { fetchData } from '../../actions/app';
import { ___followUp } from '../../actions/user';

// http://react.tips/checkboxes-in-react/
const items = [
  { id: 'title', title: 'สินค้า/ประเภท'},
  { id: 'banlist_name_surname_field', title: 'ชื่อ-นามสกุล บัญชีผู้รับเงินโอน'},
  { id: 'field_id_card_number', title: 'เลขบัตรประชาชนคนขาย'},
  { id: 'body', title: 'รายละเอียด'},
  { id: 'banlist_book_bank_field', title: 'บัญชีธนาคาร'},
]

const allResultCount = 10000;
const pageLimit = 30;

class HomePage extends Component {
  constructor(props) {
    super(props);

    this.selectedCheckboxes = new Set();
    
    this.state = {
      allCountries: [],
      currentCountries: [],
      currentPage: null,
      totalPages: null,

      searchWord: '',

      // allResultCount: 0,
      offset: 0,
      loading: false,
      showModal : false,

      showModalLogin: false
    };
  }

  componentDidMount() {
    let {data} = this.props
    console.log("componentDidMount : 1 ", this.props)
    if(isEmpty(data)){
      this.getData()
    }
  }

  onPageChanged = data => {

    const { allCountries } = this.state;
    const { currentPage, totalPages, pageLimit } = data;
    const offset = (currentPage - 1) * pageLimit;
    const currentCountries = allCountries.slice(offset, offset + pageLimit);

    // console.log("onPageChanged: ", allCountries, currentPage, totalPages, pageLimit, offset, currentCountries)

    this.setState({ currentPage, currentCountries, totalPages, offset: currentPage -1 }, ()=>{
      if( offset || isEmpty(this.props.data)  ){
        this.getData()
      }
    });    
  };

  mergeArrays = (...arrays) => {
    let jointArray = []
  
    arrays.forEach(array => {
        jointArray = [...jointArray, ...array]
    })
    const uniqueArray = jointArray.reduce((newArray, item) =>{
        let found = newArray.find(({ id }) => id === item.id);
        if (found){
            return newArray
        } else {
            return [...newArray, item]
        }
    }, [])
    return uniqueArray
  }

  getData = () =>{
    let _this = this

    let {offset} = _this.state

    _this.setState({loading: true});

    console.log('getData : ', offset)
    axios.post(`/api/search?_format=json`, {
      type: 0,
      key_word: '*',
      offset
    }, {
        headers: {'Authorization': `Basic YWRtaW46U29ta2lkMDU4ODQ4Mzkx`}
    })
    .then(function (response) {
      let results = response.data
      console.log('getData end : > ', results)
      if(results.result){
        // true
        let {execution_time, datas, count, all_result_count} = results;
        _this.props.fetchData(datas);

        /*
        let {execution_time, datas, count} = results;
        _this.props.fetchData(datas);
        */

        // console.log(">>>", offset, _this.mergeArrays(_this.state.allCountries, datas))

        let allCountries = _this.mergeArrays(_this.state.allCountries, datas);


        // let pageLimit = 30
        let { currentPage, totalPages,  } = _this.state;
        let currentCountries = []
        if(currentPage != null){
          // let offset = (currentPage - 1) * pageLimit;
          // currentCountries = allCountries.slice(offset, offset + pageLimit);
          // console.log('allCountries >> ', allCountries, currentCountries)

          currentCountries = datas
        }
        
        console.log('getData currentCountries : ', currentCountries)
        _this.setState({ allCountries /*, allResultCount:all_result_count */ , currentCountries, loading: false });
      }

      // _this.setState({loading: false})
    })
    .catch(function (error) {
      // alert(error.message)

      console.log('getData : ', error)

      // console.log("error :", error)

      // _this.toast.show(error.message);

      // _this.setState({loading: false})
    });
  }

  handleFormSubmit = formSubmitEvent => {
    console.log('handleFormSubmit : ', this.selectedCheckboxes, this.state.searchWord);
    formSubmitEvent.preventDefault();

    /*
    axios.post(`${API_URL}/api/added_banlist?_format=json`, data, {
      headers: { 
        'Authorization': `Basic ${basic_auth}`,
        'content-type': 'multipart/form-data'
      }
    })
    .then(function (response) {
      let results = response.data
      console.log(results)
      
      if(results.result){
        // true
        console.log('true');
        console.log(results);

        // let {execution_time, datas, count} = results;
        // console.log(execution_time);
        // console.log(count);
        // console.log(datas);

        // if(datas && datas.length > 0){
        //   _this.setState({spinner: false, execution_time, datas, count});
        // }else{

        _this.setState({spinner: false})
        //   alert('Empty result.');
        // }

        let {navigation, route} = _this.props;

        navigation.pop();
        route.params.updateState({});     
      }else{
        // false
        console.log('false');

        _this.setState({spinner: false})

        _this.toast.show('ไม่สามารถเพิ่มรายงาน');
      }
    })
    .catch(function (error) {

      _this.setState({spinner: false})

      // _this.toast.show('ไม่สามารถเพิ่มรายงาน');

      console.log('Error >  ' + error);
    });
    */

  }

  toggleCheckbox = value => {
    // console.log(label, this.selectedCheckboxes)
    if (this.selectedCheckboxes.has(value)) {
      this.selectedCheckboxes.delete(value);
    } else {
      this.selectedCheckboxes.add(value);
    }
  }

  // id: 'title', title:
  // createCheckbox = (itm) => (
  //   <Checkbox
  //     label={itm.title}
  //     handleCheckboxChange={this.toggleCheckbox}
  //     value={itm.id}
  //     key={itm.id}/>
  // )

  // createCheckboxes = () => (
    
  // )

  handleChange(event) {
    this.setState({searchWord: event.target.value})
  }


  updateState = data => {
    this.setState(data);
  }

  renderContent = () =>{
    let {loading}  = this.state
    let {data} = this.props

    if(loading){
      return <CircularProgress />
    }else {
      return data.map(item => (
        <UseHomeItem 
          {...this.props} 
          item={item}
          updateState={this.updateState}/>
      ))
    }
  }

  render() {
    let {
      allCountries,
      currentCountries,
      currentPage,
      totalPages,
      // allResultCount,

      loading,
      showModal,
      showModalLogin
    } = this.state;

    let {user, data} = this.props

    console.log('--1-- >>> >>>>', this.props, data );
    // allResultCount = 10000;
    if (allResultCount === 0) return null;

    // console.log('--2--' , currentCountries);
    return (
      <div className="container mb-5">
        {/* <button style={{outline: 'none !important', backgroundColor:'red'}}  onClick={()=>{
            if(isEmpty(user)){
              this.setState({showModalLogin:true})
            }else{
              this.setState({showModal:true})
            }
          }}>
            เพิ่ม Banlist
        </button> */}

        {/* <div style={{cursor:"pointer"}} onClick={()=>{
          if(isEmpty(user)){
            this.setState({showModalLogin:true})
          }else{
            this.setState({showModal:true})
          }
        }}>
         <span className="bl-border-bottom">เพิ่ม Banlist</span>
        </div> */}

        <AddBanlistForm showModal={showModal} onClose = {()=>{ console.log('--0999--');  this.setState({showModal:false})   }} />
        <div>
          <form onSubmit={this.handleFormSubmit}>
            <div>
              <div>
                <input 
                  type="text" 
                  name="title" 
                  value={this.state.searchWord} 
                  onChange={this.handleChange.bind(this)}
                  required/>
                <button type="submit">ค้นหา</button>
              </div>
              <div>
              <ul class="flex-container row">
                {
                  items.map((itm)=>{
                    return <li class="flex-item">
                              <Checkbox
                                label={itm.title}
                                handleCheckboxChange={this.toggleCheckbox}
                                value={itm.id}
                                key={itm.id}/>
                          </li>
                  })
                }
              </ul>
              </div>
              
              
            </div>
          </form>
        </div>
        <div className="row d-flex flex-row py-5"> 
          {this.renderContent()}
          <div className="w-100 px-4 py-5 d-flex flex-row flex-wrap align-items-center justify-content-between">
            <div className="d-flex flex-row py-4 align-items-center">
              <Pagination
                totalRecords={allResultCount}
                pageLimit={pageLimit}
                pageNeighbours={1}
                onPageChanged={this.onPageChanged}
              />
            </div>
            <div className="d-flex flex-row align-items-center">
              {currentPage && (
                <span className="current-page d-inline-block h-100 pl-4 text-secondary">
                  Page <span className="font-weight-bold">{currentPage}</span> /{" "}
                  <span className="font-weight-bold">{totalPages}</span>
                </span>
              )}
            </div>
          </div>
        </div>
     
        {
          showModalLogin &&  <LoginForm showModal={showModalLogin} onClose = {()=>{this.setState({showModalLogin:false})}} />
        }

        <div 
          className="fab"
          onClick={()=>{
            if(isEmpty(user)){
              this.setState({showModalLogin:true})
            }else{
              this.setState({showModal:true})
            }
          }}>
          <AddCircleOutlinedIcon className="floating-icon"/>
          </div>       
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
	return {
    user: state.user.data,
    data: state.app.data,
  };
}

const mapDispatchToProps = {
  fetchData,
  ___followUp,
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage)