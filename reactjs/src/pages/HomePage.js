import React, { useEffect } from 'react';
import { connect } from 'react-redux'
import axios from 'axios';
import { CircularProgress } from '@material-ui/core';
import AddCircleOutlinedIcon from '@material-ui/icons/AddCircleOutlined';

import Pagination from "./Pagination";
import UseHomeItem from "./UseHomeItem";
import Checkbox from "../components/Checkbox";
import AddBanlistDialog from './AddBanlistDialog'
import ReportDialog from './ReportDialog'

import LoginForm from './LoginForm'
import {isEmpty, mergeArrays, onToast} from '../utils'
import { fetchData } from '../actions/app';
import { ___followUp } from '../actions/user';

const HomePage = (props) => {
  const [allDatas, setAllDatas]           = React.useState([]);
  const [currentDatas, setCurrentDatas]   = React.useState([]);
  const [currentPage, setCurrentPage]     = React.useState(undefined);
  const [totalPages, setTotalPages]       = React.useState(0);
  const [pageLimit, setPageLimit]         = React.useState(30);
  const [allResultCount, setAllResultCount] = React.useState(10000);

  const [searchWord, setSearchWord]               = React.useState("");
  const [loading, setLoading]                     = React.useState(false);
  const [searchLoading, setSearchLoading]         = React.useState(false);
  const [showModal, setShowModal]                 = React.useState(false);
  const [showModalLogin, setShowModalLogin]       = React.useState(false);
  const [showModalReport, setShowModalReport]     = React.useState(false);
  const [selectedCheckboxes, setSelectedCheckboxes] = React.useState(["title"]);

  const [itemsCategory, setItemCategory] = React.useState([ { id: 'title', title: 'สินค้า/ประเภท'},
                                                            { id: 'banlist_name_surname_field', title: 'ชื่อ-นามสกุล บัญชีผู้รับเงินโอน'},
                                                            { id: 'field_id_card_number', title: 'เลขบัตรประชาชนคนขาย'},
                                                            { id: 'body', title: 'รายละเอียด'},
                                                            { id: 'banlist_book_bank_field', title: 'บัญชีธนาคาร'},
                                                          ]);

  useEffect(() => {

  })

  useEffect(() => {
    if(currentPage !== undefined){
      setLoading(true)
      axios.post(`/api/search?_format=json`, {
        type: 0,
        key_word: '*',
        offset: currentPage - 1
      }, {
          headers: {'Authorization': `Basic YWRtaW46U29ta2lkMDU4ODQ4Mzkx`}
      })
      .then((response) => {
        let results = response.data
        console.log('/api/search?_format=json : ', results)
        if(results.result){
          // true
          let {execution_time, datas, count, all_result_count} = results;
          props.fetchData(datas);
          setAllDatas(mergeArrays(allDatas, datas))
          setCurrentDatas(currentDatas)
          setLoading(false)
        }

      })
      .catch( (error) => {
        console.log('getData : ', error)
      });
    }
  }, [currentPage])

  const handleFormSearch = (e) => {
    e.preventDefault();

    console.log('selectedCheckboxes : ', JSON.stringify(selectedCheckboxes))

    if(isEmpty(selectedCheckboxes)){
      onToast('error', "Please select category")
    }else{
      setSearchLoading(true)
      axios.post(`/api/search?_format=json`, {
        type: 99,
        key_word: searchWord,
        offset: 0,
        full_text_fields: JSON.stringify(selectedCheckboxes)
      }, {
          headers: {'Authorization': `Basic YWRtaW46U29ta2lkMDU4ODQ4Mzkx`}
      })
      .then((response) => {
        let results = response.data
        console.log('/api/search?_format=json : ', results)
        if(results.result){
          // true
          let {execution_time, datas, count, all_result_count} = results;
          props.fetchData(datas);
          setAllDatas(mergeArrays(allDatas, datas))
          setCurrentDatas(currentDatas)
          
        }
  
        setSearchLoading(false)
  
      })
      .catch( (error) => {
        onToast("error", error)
  
        setSearchLoading(false)
      });
    }
    
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

  const onPageChanged = (data) => {
    const { currentPage, totalPages, pageLimit } = data;
    const offset = (currentPage - 1) * pageLimit;
    const currentDatas = allDatas.slice(offset, offset + pageLimit);

    setCurrentPage(currentPage)
    // setCurrentDatas(currentDatas)
    setTotalPages(totalPages)
    console.log("onPageChanged : ", currentPage)
  };

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
      return props.data.map(item => (
              <UseHomeItem 
                {...props} 
                item={item}
                updateState={updateState}/>
            ))
    }
  }
    
  return (  <div className="container mb-5">
             <AddBanlistDialog showModal={showModal} onClose = {()=>{ setShowModal(false) }} />
             { showModalReport && <ReportDialog showModal={showModalReport} onClose = {()=>{  setShowModalReport(false) }}  /> }
             <div>
               <form /*onSubmit={handleFormSubmit}*/ >
                 <div>
                   <div>
                     <input 
                      type="text" 
                      name="title" 
                      value={searchWord} 
                      onChange={(event)=>{ setSearchWord(event.target.value) }}
                      // required
                      />
                    <button 
                      type="submit" 
                      disabled={isEmpty(searchWord) ? true : false}
                      onClick={(e)=>{
                        handleFormSearch(e)
                      }}
                      className={"div-button"}>
                        ค้นหา { searchLoading && <CircularProgress size={10}/> }
                    </button>

                    {/* searchLoading */}
                  </div>
                  <div style={{paddingTop:10}}>
                    <div style={{fontSize:"20px"}}>Search by category </div>
                    <ul class="flex-container row">
                      {
                        // selectedCheckboxes
                        itemsCategory.map((itm)=>{
                          return  <li class="flex-item">
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
              <div className="w-100 px-4 py-5 d-flex flex-row flex-wrap align-items-center justify-content-between">
                <div className="d-flex flex-row py-4 align-items-center">
                  <Pagination
                    totalRecords={allResultCount}
                    pageLimit={pageLimit}
                    pageNeighbours={1}
                    onPageChanged={onPageChanged}
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
            {showModalLogin &&  <LoginForm showModal={showModalLogin} onClose = {()=>{  setShowModalLogin(false) }} />}
            <div 
              className="fab"
              onClick={()=>{
                if(isEmpty(props.user)){
                  setShowModalLogin(true)
                }else{
                  setShowModal(true)
                }
              }}>
              <AddCircleOutlinedIcon className="floating-icon"/>
            </div>  
          </div>
  )

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