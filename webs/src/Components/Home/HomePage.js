import React, { Component } from 'react';
import { connect } from 'react-redux'

import axios from 'axios';
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";

import Countries from './Countries';

import Pagination from "./Pagination";
import CountryCard from "./CountryCard";

import HomeItem from "./HomeItem";
import Checkbox from "./Checkbox";

import "../../App.css";

// import { API_URL, API_TOKEN } from "../../constants"



// http://react.tips/checkboxes-in-react/
const items = [
  { id: 'title', title: 'สินค้า/ประเภท'},
  { id: 'banlist_name_surname_field', title: 'ชื่อ-นามสกุล บัญชีผู้รับเงินโอน'},
  { id: 'field_id_card_number', title: 'เลขบัตรประชาชนคนขาย'},
  { id: 'body', title: 'รายละเอียด'},
  { id: 'banlist_book_bank_field', title: 'บัญชีธนาคาร'},
]

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
    };
  }

  componentDidMount() {
    const allCountries = Countries;    
    this.setState({ allCountries });
  }

  onPageChanged = data => {
    const { allCountries } = this.state;
    const { currentPage, totalPages, pageLimit } = data;

    const offset = (currentPage - 1) * pageLimit;
    const currentCountries = allCountries.slice(offset, offset + pageLimit);

    this.setState({ currentPage, currentCountries, totalPages });
  };

  handleFormSubmit = formSubmitEvent => {
    console.log('handleFormSubmit : ', this.selectedCheckboxes, this.state.searchWord);
    formSubmitEvent.preventDefault();

    // formSubmitEvent.stopPropagation();

    // for (const checkbox of this.selectedCheckboxes) {
    //   console.log(checkbox, 'is selected.');
    // }

    // let response  = await axios.post('/api/login', 
    //                                   {name: email, pass: password}, 
    //                                   {headers:headers()});

    // // this.setState({ is_active:false })
    // console.log(response);
    // if( response.status==200 && response.statusText == "OK" ){
      
    // }

    
    axios.post(`/api/search?_format=json`, {
      type: 0,
      key_word: '*',
      offset: 0
    }, {
        headers: {'Authorization': `Basic YWRtaW46U29ta2lkMDU4ODQ4Mzkx`}
    })
    .then(function (response) {
      let results = response.data
      console.log('end : > ', results)
      // if(results.result){
      //   // true
      //   let {execution_time, datas, count} = results;
      //   _this.props.fetchData(datas);
      // }

      // _this.setState({loading: false})
    })
    .catch(function (error) {
      // alert(error.message)

      // console.log("error :", error)

      // _this.toast.show(error.message);

      // _this.setState({loading: false})
    });
    
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
  createCheckbox = (itm) => (
    <Checkbox
      label={itm.title}
      handleCheckboxChange={this.toggleCheckbox}
      value={itm.id}
      key={itm.id}/>
  )

  createCheckboxes = () => (
    // items.map(this.createCheckbox)

    items.map((itm)=>{
      console.log('createCheckboxes :', itm)
      return this.createCheckbox(itm)
    })
  )

  handleChange(event) {
    this.setState({searchWord: event.target.value})
  }

  render() {
    const {
      allCountries,
      currentCountries,
      currentPage,
      totalPages
    } = this.state;
    const totalCountries = allCountries.length;

    // const { openLightbox } = useLightbox();

    let photoIndex = 0

    if (totalCountries === 0) return null;

    const headerClass = [
      "text-dark py-2 pr-4 m-0",
      currentPage ? "border-gray border-right" : ""
    ]
      .join(" ")
      .trim();

    return (
      <div className="container mb-5">
        <div>
          <form onSubmit={this.handleFormSubmit}>
            {this.createCheckboxes()}
            <input 
              type="text" 
              name="title" 
              value={this.state.searchWord} 
              onChange={this.handleChange.bind(this)}
              required/>
            <button className="btn btn-default" type="submit">ค้นหา</button>
          </form>
        </div>
        <div className="row d-flex flex-row py-5">

          {/* <Lightbox
            mainSrc={images[photoIndex]}
            nextSrc={images[(photoIndex + 1) % images.length]}
            prevSrc={images[(photoIndex + images.length - 1) % images.length]}
            onCloseRequest={() => this.setState({ isOpen: false })}
            onMovePrevRequest={() =>
              this.setState({
                photoIndex: (photoIndex + images.length - 1) % images.length
              })
            }
            onMoveNextRequest={() =>
              this.setState({
                photoIndex: (photoIndex + 1) % images.length
              })
            }
          /> */}
          
          {currentCountries.map(country => (
            // <CountryCard {...this.props} key={country.cca3} country={country} />
            // <Buttonx country={country}/>

            <HomeItem {...this.props} />
          ))}

          <div className="w-100 px-4 py-5 d-flex flex-row flex-wrap align-items-center justify-content-between">
            <div className="d-flex flex-row py-4 align-items-center">
              <Pagination
                totalRecords={totalCountries}
                pageLimit={18}
                pageNeighbours={1}
                onPageChanged={this.onPageChanged}
              />
            </div>
            <div className="d-flex flex-row align-items-center">
              {/* <h2 className={headerClass}>
                <strong className="text-secondary">{totalCountries}</strong>{" "}
                Countries
              </h2> */}
              {currentPage && (
                <span className="current-page d-inline-block h-100 pl-4 text-secondary">
                  Page <span className="font-weight-bold">{currentPage}</span> /{" "}
                  <span className="font-weight-bold">{totalPages}</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
	return {};
}

export default connect(mapStateToProps, null)(HomePage)