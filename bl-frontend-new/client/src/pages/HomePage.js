import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux'
import axios from 'axios';
import { CircularProgress } from '@material-ui/core';
import AddCircleOutlinedIcon from '@material-ui/icons/AddCircleOutlined';
import { Button } from "react-bootstrap";
import ls from 'local-storage';

import ReactPaginate from 'react-paginate';

import Ajv from "ajv"

import UseHomeItem from "./UseHomeItem";
import Checkbox from "../components/Checkbox";
// import AddBanlistDialog from './AddBanlistDialog'
// import ReportDialog from './ReportDialog'
import InputSearchField from '../components/InputSearchField'

import LoginDialog from './LoginDialog'
import { isEmpty, mergeArrays, onToast } from '../utils'
import { addContentsData, setTotalValue, addFollowData } from '../actions/app';
import { followUp } from '../actions/user';
import { onMyFollow } from '../actions/my_follows';

var _ = require('lodash');

const HomePage = (props) => {
  // const [allDatas, setAllDatas]           = useState([]);
  const [currentDatas, setCurrentDatas]   = useState([]);
  const [currentPage, setCurrentPage]     = useState(0);
  const [totalPages, setTotalPages]       = useState(0);
  const [pageLimit, setPageLimit]         = useState(25);
  const [allResultCount, setAllResultCount] = useState(0);

  const [searchWord, setSearchWord]               = useState("");
  const [loading, setLoading]                     = useState(false);
  const [searchLoading, setSearchLoading]         = useState(false);
  const [showModal, setShowModal]                 = useState(false);
  const [showModalLogin, setShowModalLogin]       = useState(false);
  const [showModalReport, setShowModalReport]     = useState(false);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState(["title"]);

  const [offset, setOffset]                       = useState(0)
  const [pageCount, setPageCount]                 = useState(0)

  const [itemsCategory, setItemCategory] = useState([ { id: 'title', title: 'สินค้า/ประเภท'},
                                                            { id: 'banlist_name_surname_field', title: 'ชื่อ-นามสกุล บัญชีผู้รับเงินโอน'},
                                                            { id: 'field_id_card_number', title: 'เลขบัตรประชาชนคนขาย'},
                                                            { id: 'body', title: 'รายละเอียด'},
                                                            { id: 'banlist_book_bank_field', title: 'บัญชีธนาคาร'},
                                                          ]);

  useEffect(() => {
    //----------------
  }, []);

  useEffect(() => {

    let datas = props.data

    // setAllDatas(mergeArrays(allDatas, datas))

    setCurrentDatas(datas)
    setAllResultCount(props.total_value)
    setTotalPages(Math.ceil(allResultCount / pageLimit))
    //----------------
  }, [props.data]);

  useEffect(() => {
    // if( !_.isEmpty(currentPage) ){
    fetch()
    // }
  }, [offset])

  const handleFormSearch = async(e) => {
    e.preventDefault();
    if(isEmpty(selectedCheckboxes)){
      onToast('error', "Please select category")
    }else{

      setSearchLoading(true)
      let response = await axios.post(`/api/v1/search`, { 
                                                          type: 99,
                                                          key_word: searchWord,
                                                          offset,
                                                          full_text_fields: JSON.stringify(selectedCheckboxes),
                                                          page_limit: pageLimit
                                                        }, {
                                                            headers: {'Authorization': isEmpty(ls.get('basic_auth')) ? `Basic ${process.env.REACT_APP_AUTHORIZATION}` : ls.get('basic_auth')}
                                                        });
  
      response = response.data
      console.log("response", response, pageLimit)
      if(response.result){
  
          let {execution_time, datas, count, all_result_count} = response;
          props.addContentsData(datas);
          // props.setTotalValue(all_result_count);

          setPageCount( Math.ceil(all_result_count / pageLimit) )
      }
  
      setSearchLoading(false)
    }
  }

  const clearSearch = () =>{
    setCurrentPage(0)
  }

  const fetch = async() =>{
    setLoading(true)
    let response = await axios.post(`/api/v1/search`, { type: 0,
                                                        key_word: '*',
                                                        offset,
                                                        page_limit: pageLimit
                                                      }, {
                                                          headers: {'Authorization': isEmpty(ls.get('basic_auth')) ? `Basic ${process.env.REACT_APP_AUTHORIZATION}` : ls.get('basic_auth')}
                                                      });

    response = response.data
    if(response.result){

        let {execution_time, datas, count, all_result_count} = response;
        props.addContentsData(datas);
        props.setTotalValue(all_result_count);


        // pageCount: Math.ceil(data.meta.total_count / data.meta.limit),
        setPageCount( Math.ceil(all_result_count / pageLimit) )
    }

    setLoading(false)
  }

  const toggleCheckbox = (data) => {
    let temp = [...selectedCheckboxes]
    let select =  temp.find((item)=>item === data)

    if(select !== undefined){
      temp = temp.filter((item)=>item !== data)
    }else{
      temp = [...temp, data]
    }
    setSelectedCheckboxes(temp)
  }

  const updateState = data => {
    switch(Object.keys(data)[0]){
      case "showModalLogin":{
        setShowModalLogin(Object.values(data)[0])
        break;
      }
      case "showModalReport":{
        setShowModalReport(Object.values(data)[0])
        break;
      }
    }
  }

  const renderContent = () =>{
    if(loading){
      return <CircularProgress />
    }else {
      return currentDatas.map( (item, index) => (
              <UseHomeItem 
                key={index}
                {...props} 
                item={item}
                updateState={updateState}
                // followUp={(data)=>{
                //   props.myFollow(data)
                // }}

                myFollow={(data)=>{
                  // console.log('myFollow :', data)
                  props.addFollowData(data)
                }}
                />
            ))
    }
  }

  const paginate = () =>{
    if(pageCount === 0){
      return;
    }else{
      return  <div className="w-100 px-4 py-5 d-flex flex-row flex-wrap align-items-center justify-content-between">
                <div className="d-flex flex-row py-4 align-items-center">
                  <ReactPaginate
                    previousLabel={'previous'}
                    nextLabel={'next'}
                    breakLabel={'...'}
                    breakClassName={'break-me'}
                    pageCount={pageCount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={(data)=>{
                      let selected = data.selected;
                      let offset = Math.ceil(selected * pageLimit);

                      console.log('>> ', offset)
                      setOffset(offset)
                    }}
                    containerClassName={'pagination'}
                    activeClassName={'active'}
                  />
                </div>
                <div className="d-flex flex-row align-items-center">
                  <h2>
                    <strong className="text-secondary">{props.total_value}</strong>  Item
                  </h2>
                  <span className="current-page d-inline-block h-100 pl-4 text-secondary">
                    Page <span className="font-weight-bold">{offset/pageLimit+1}</span> /{" "}
                    <span className="font-weight-bold">{pageCount}</span>
                  </span>
                </div>
              </div>

    }
  }
    
  return (<div className="container mb-5">
            <div>
                <div>
                  <form /*onSubmit={handleFormSubmit}*/ >
                    <div>
                      <div>
                        
                        <InputSearchField 
                          label="Input keyword"
                          placeholder="Input keyword"
                          value={searchWord}  
                          onChange={(e)=>{ 
                            setSearchWord(e.target.value)
                          }}
                          onClear={(e)=>{
                            setSearchWord('')
                            setCurrentPage(1)

                            clearSearch()
                          }}/>
                        <Button 
                          variant="primary" 
                          disabled={isEmpty(searchWord) ? true : false}
                          onClick={(e)=>{ handleFormSearch(e)}}>Search { searchLoading && <CircularProgress size={15}/> }</Button>

                        {/* searchLoading */}
                      </div>
                      <div style={{paddingTop:10}}>
                        <div style={{fontSize:"20px"}}>Search by category </div>
                        <ul className="flex-container row">
                          {
                            // selectedCheckboxes
                            itemsCategory.map((itm, index)=>{
                              return  <li className="flex-item" key={index}>
                                        <Checkbox
                                          label={itm.title}
                                          handleCheckboxChange={toggleCheckbox}
                                          value={itm.id}
                                          key={itm.id}
                                          checked={(selectedCheckboxes.find((item)=>item === itm.id) === undefined) ? false : true}/>
                                      </li>
                            })
                          }
                        </ul>
                      </div>
                    </div>
                  </form>
                </div>
                <div className="row d-flex flex-row py-5"> 
                  { renderContent() }

                  {/* <div className="w-100 px-4 py-5 d-flex flex-row flex-wrap align-items-center justify-content-between">
                    <div className="d-flex flex-row py-4 align-items-center">
                      <Pagination
                        totalRecords={allResultCount}
                        pageLimit={pageLimit}
                        pageNeighbours={1}
                        onPageChanged={onPageChanged}
                      />
                    </div>
                    <div className="d-flex flex-row align-items-center">
                      <h2>
                        <strong className="text-secondary">{allResultCount}</strong>  Item
                      </h2>
                        {currentPage && (
                          <span className="current-page d-inline-block h-100 pl-4 text-secondary">
                            Page <span className="font-weight-bold">{currentPage}</span> /{" "}
                            <span className="font-weight-bold">{totalPages}</span>
                          </span>
                        )}
                    </div>
                  </div> */}
                  
                  { paginate() }
                  
                </div>
                {showModalLogin &&  <LoginDialog showModal={showModalLogin} onClose = {()=>{  setShowModalLogin(false) }} />}
            </div>
          </div>
  )
}

const mapStateToProps = (state, ownProps) => {

	return {
    user: state.user.data,
    data: state.app.data,
    follows: state.app.follows,

    total_value: state.app.total_value,
    follow_ups: state.user.follow_ups,

    my_apps: state.user.my_apps,
    my_follows: state.my_follows.data,

    socket_connected : state.data,
  };
}

const mapDispatchToProps = {
  addContentsData,
  setTotalValue,
  followUp,

  onMyFollow,


  addFollowData
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage)
