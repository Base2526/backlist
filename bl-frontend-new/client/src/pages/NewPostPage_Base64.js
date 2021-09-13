import React, { useEffect, useState } from "react";
import { connect } from 'react-redux'
import { useHistory } from "react-router-dom";
import axios from 'axios';
import DatePicker from "react-datepicker";
import Lightbox from "react-image-lightbox";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";

import ls from 'local-storage';

import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import VerifiedUserOutlinedIcon from '@material-ui/icons/VerifiedUserOutlined';
import CameraAltOutlinedIcon from '@material-ui/icons/CameraAltOutlined';
import { CircularProgress } from '@material-ui/core';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { toast }    from "react-toastify";

import TextareaAutosize from 'react-textarea-autosize';

var _ = require('lodash');

let interval = undefined;
const NewPostPage = (props) => {
    const history = useHistory();
    const [showModal, setShowModal] = useState(false);

    // 
    const [draft, setDraft]     = useState(false);
    
    const [nid, setNid]     = useState(0);
    const [title, setTitle] = useState();
    const [transferAmount, setTransferAmount] = useState();
    const [personName, setPersonName] = useState();
    const [personSurname, setPersonSurname] = useState();
    const [idCardNumber, setIdCardNumber] = useState();
    const [sellingWebsite, setSellingWebsite] = useState();
    const [transferDate, setTransferDate] = useState();
    const [detail, setDetail] = useState();
    // บัญชีธนาคารคนขาย
    const [itemsMBA, setItemsMBA] = useState([]);
    // รูปภาพประกอบ
    const [files, setFiles] = useState([]);


    const [files2, setFiles2] = useState([]);

    const [changing, setChanging] = useState('init');
    const [changeText, setChangeText] = useState('');
  
    const [createLoading, setCreateLoading] = useState(false);
  
    const [itemsMerchantBankAccount, setItemsMerchantBankAccount] = useState([
      {'key':0,'value': '--เลือก--'},
      {'key':1,'value': 'ธนาคารกรุงศรีอยุธยา'},
      {'key':2,'value': 'ธนาคารกรุงเทพ'},
      {'key':3,'value': 'ธนาคารซีไอเอ็มบี'},
      {'key':4,'value': 'ธนาคารออมสิน'},
      {'key':5,'value': 'ธนาคารอิสลาม'},
      {'key':6,'value': 'ธนาคารกสิกรไทย'},
      {'key':7,'value': 'ธนาคารเกียรตินาคิน'},
      {'key':8,'value': 'ธนาคารกรุงไทย'},
      {'key':9,'value': 'ธนาคารไทยพาณิชย์'},
      {'key':10,'value': 'Standard Chartered'},
      {'key':11,'value': 'ธนาคารธนชาติ'},
      {'key':12,'value': 'ทิสโก้แบงค์'},
      {'key':13,'value': 'ธนาคารทหารไทย'},
      {'key':14,'value': 'ธนาคารยูโอบี'},
      {'key':15,'value': 'ธนาคารเพื่อการเกษตรและสหกรณ์การเกษตร'},
      {'key':16,'value': 'True Wallet'},
      {'key':17,'value': 'พร้อมเพย์ (PromptPay)'},
      {'key':18,'value': 'ธนาคารอาคารสงเคราะห์'},
      {'key':19,'value': 'AirPay (แอร์เพย์)'},
      {'key':20,'value': 'mPay'},
      {'key':21,'value': '123 เซอร์วิส'},
      {'key':22,'value': 'ธ.ไทยเครดิตเพื่อรายย่อย'},
      {'key':23,'value': 'ธนาคารแลนด์แอนด์เฮ้าส์'},
      {'key':24,'value': 'เก็บเงินปลายทาง'} 
    ]);

    useEffect(() => {
      if( _.isEmpty(interval) ){
        clearInterval(interval)
        interval = undefined
      }

      if( !_.isEmpty(title) ){
        interval = setInterval(async() => {
          setChangeText('Auto saving...')

          //-------------- auto save --------------
          const formData = new FormData();
          formData.append('auto_save', true );
          formData.append('nid', nid );
          formData.append('product_type', title);
          formData.append('transfer_amount', transferAmount);
          formData.append('person_name', personName);
          // data.append('person_surname', personSurname);
          formData.append('id_card_number', idCardNumber);
          formData.append('selling_website', sellingWebsite);
          formData.append('transfer_date', transferDate);
          formData.append('detail', detail);
          formData.append('merchant_bank_account', JSON.stringify(itemsMBA));
      
          // files.map((file) => { data.append('photos[]', file) })
    
          for (let i = 0; i < files.length; i++) {
            formData.append('photos[]', files[i]);
          }

          let response =  await axios.post(`/api/v1/add_banlist`, formData, { headers: {'Authorization': `Basic ${ls.get('basic_auth')}`, 'content-type': 'multipart/form-data'} });
          response = response.data
      
          console.log("auto save : ", response)


          //-------------- auto save --------------

          setChangeText('Saved')
          setTimeout(()=>{ setChangeText('') }, 2000)

          clearInterval(interval)
        }, 1000);


        // console.log("changing :", changing, !_.isEmpty(title));
        // interval = setInterval(async(props)=>{
        //     console.log("Auto saving...");
        //     // setChangeText('Auto saving...')
            
        //     //-------------- auto save --------------

        //     // console.log('title : ', title)
        //     // console.log('transferAmount : ', transferAmount)
        //     // console.log('personName : ', personName)
        //     // // console.log('personSurname : ', personSurname)
        //     // console.log('idCardNumber : ', idCardNumber)
        //     // console.log('sellingWebsite : ', sellingWebsite)
        //     // console.log('transferDate : ', transferDate)
        //     // console.log('detail : ', detail)
        //     // console.log('itemsMBA : ', itemsMBA)
        //     // console.log('files : ', files)
        
          
        //     // const data = new FormData();
        //     // data.append('auto_save', true );
        //     // data.append('nid', nid );
        //     // data.append('product_type', title);
        //     // data.append('transfer_amount', transferAmount);
        //     // data.append('person_name', personName);
        //     // // data.append('person_surname', personSurname);
        //     // data.append('id_card_number', idCardNumber);
        //     // data.append('selling_website', sellingWebsite);
        //     // data.append('transfer_date', transferDate);
        //     // data.append('detail', detail);
        //     // data.append('merchant_bank_account', JSON.stringify(itemsMBA));
        
        //     // // files.map((file) => { data.append('photos[]', file) })
      
        //     // for (let i = 0; i < files.length; i++) {
        //     //   data.append('photos[]', files[i]);
        //     // }
      
        //     // console.log("Auto save ", data)
      
            
        //     // // setLoginLoading(true)
        //     // let response =  await axios.post(`/api/v1/add_banlist`, data, { headers: {'Authorization': `Basic ${ls.get('basic_auth')}`, 'content-type': 'multipart/form-data'} });
      
        //     // response = response.data
      
        //     // console.log("/v1/add_banlist > ", response)

        //     // // result: true, nid: '318', execution_time: 'Time Taken to execute = 0.397 seconds'

        //     // if(response.result){
        //     //   setNid(response.nid)
        //     // }
  
          
        //     //-------------- auto save --------------

        //     // setChangeText('Saved')

        //     // setTimeout(()=>{
        //     //     console.log('XX')
        //     //     setChangeText('')
        //     // }, 4000)
            
        //     clearInterval(interval)
        // }, 1000, props)

        setChanging('init')
      }
    }, [changing]);

    const handleFormSubmit = async(e) => {
      console.log("handleFormSubmit : ", ls.get('basic_auth'));
      e.preventDefault();

      console.log('title : ', title)
      console.log('transferAmount : ', transferAmount)
      console.log('personName : ', personName)
      // console.log('personSurname : ', personSurname)
      console.log('idCardNumber : ', idCardNumber)
      console.log('sellingWebsite : ', sellingWebsite)
      console.log('transferDate : ', transferDate)
      console.log('detail : ', detail)
      console.log('itemsMBA : ', itemsMBA)
      console.log('files : ', files)
    
      // if( _.isEmpty(title) || 
      //     _.isEmpty(transferAmount) ||
      //     _.isEmpty(personName) ||
      //     // isEmpty(personSurname) ||
      //     _.isEmpty(idCardNumber) ||
      //     _.isEmpty(sellingWebsite) ||
      //     _.isEmpty(detail) ){
            
      //   console.log('error', "title or transferAmount or personName or personSurname or idCardNumber or sellingWebsite or detail")
      // }else{
  
        const data = new FormData();
        data.append('draft', draft );
        data.append('nid', nid );
        data.append('product_type', title);
        data.append('transfer_amount', transferAmount);
        data.append('person_name', personName);
        // data.append('person_surname', personSurname);
        data.append('id_card_number', idCardNumber);
        data.append('selling_website', sellingWebsite);
        data.append('transfer_date', transferDate);
        data.append('detail', detail);
        data.append('merchant_bank_account', JSON.stringify(itemsMBA));
    
        // files.map((file) => { data.append('files[]', file) })

        files2.map((file) => { data.append('files[]', file) })
  
  
        console.log("/v1/add_banlist start files : ", files)
  
        
        // setLoginLoading(true)
        let response =  await axios.post(`/api/v1/add_banlist`, data, { headers: {'Authorization': `Basic ${ls.get('basic_auth')}`, 'content-type': 'multipart/form-data'} });
  
        response = response.data
  
        console.log("/v1/add_banlist > ", response)

        return;

    }

    const toBase64 = file => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });

    useEffect(() => {

      // console.log('files : ', files, files2)

      // files2.map((m)=>{
      //   console.log('files : ', m, m.file.name, m.file.type, m.file.size)
      // })

    }, [files, files2])

    const changeFiles = async(e) => {
      let fileList = e.target.files;
      for (var i = 0; i < fileList.length; i++) {
        let file = fileList[i]

        let is_new = false

        if(file !== undefined ){
          if(!_.isEmpty(files)){
            let find = files.find((m)=>{ return !m.name.localeCompare(file.name) })
            if(_.isEmpty(find)){
              is_new = true
            }
          }else{
            is_new = true
          }
        }

        if(is_new){
          setFiles([...files, { uri: await toBase64(file), name: file.name, size: file.size, type: file.type, status: 'add', local: true}])
        
          setChanging('files')
        }
      }
    }

    const removeFile = (data) => {
      let remove_files =  files.filter((file) => {
                            if(file.name.localeCompare(data.name) === 0){
                              if(file.local){
                                return false
                              }else{
                                file.status = 'delete'
                              }
                            }
                            return true
                          })
      setFiles(remove_files)
    }

    const removeItemsMBA = (itm) =>{
        setItemsMBA(itemsMBA.filter((x)=>x.key !== itm.key))
    }
      
    const filePreview = () =>{
      return  files.map((file, key) => {
                return (
                  <div key={key} style={{ display: "inline-block", padding: "5px" }}>
                    <div>
                      <img width="50" height="60" src={file.uri} />
                      <div style={{cursor: "pointer"}} onClick={()=>removeFile(file)}>X</div>
                    </div>
                  </div>
                );
              })
    }

    const bodyContent = () =>{
      return  <form className="form-horizontal form-loanable">
                <fieldset>
                  
                  <div className="form-group has-feedback required">
                    <div>{changeText}</div>
                    <label htmlFor="title" className="col-sm-5">สินค้า/ประเภท *</label>
                    <div className="col-sm-12">
                      <span className="form-control-feedback" aria-hidden="true"></span>
                      <input
                          type="text"
                          name="title"
                          id="title"
                          className="form-control"
                          placeholder="สินค้า/ประเภท"
                          onChange={(e)=>{
                            setTitle(e.target.value)

                            setChanging('title')
                          }}
                          value={title}
                          // required
                      />
                    </div>
                  </div>
  
                  <div className="form-group has-feedback required">
                    <label htmlFor="transfer-amount" className="col-sm-5">ยอดเงิน *</label>
                    <div className="col-sm-12">
                      <span className="form-control-feedback" aria-hidden="true"></span>
                      <input
                          type='number'
                          pattern='[0-9]{0,5}'
                          name="transfer_amount"
                          id="transfer-amount"
                          className="form-control"
                          placeholder="ยอดเงิน"
                          onChange={(e)=>{
                            setTransferAmount(e.target.value)

                            setChanging('transfer_amount')
                          }}
                          value={transferAmount}
                          // required
                      />
                    </div>
                  </div>
  
                  <div className="form-group has-feedback required">
                    <label htmlFor="sales-person-name" className="col-sm-5">ชื่อบัญชี-นามสกุล ผู้รับเงินโอน *</label>
                    <div className="col-sm-12">
                      <span className="form-control-feedback" aria-hidden="true"></span>
                      <input
                          type="text"
                          name="sales_person_name"
                          id="sales-person-name"
                          className="form-control"
                          placeholder="ชื่อบัญชี ผู้รับเงินโอน"
                          onChange={(e)=>{ 
                            setPersonName(e.target.value) 

                            setChanging('sales_person_name')
                          }}
                          value={personName}
                          // required
                      />
                    </div>
                  </div>
  
                  {/* <div className="form-group has-feedback required">
                    <label htmlFor="sales-person-surname" className="col-sm-5">นามสกุล ผู้รับเงินโอน</label>
                    <div className="col-sm-12">
                      <span className="form-control-feedback" aria-hidden="true"></span>
                      <input
                          type="text"
                          name="sales_person_surname"
                          id="sales-person-surname"
                          className="form-control"
                          placeholder="นามสกุล ผู้รับเงินโอน"
                          onChange={(e)=>{ 
                              setPersonSurname(e.target.value) 

                              setChange(true)
                          }}
                          value={personSurname}
                      />
                    </div>
                  </div> */}
  
                  <div className="form-group has-feedback required">
                    <label htmlFor="id-card-number" className="col-sm-5">เลขบัตรประชาชนคนขาย</label>
                    <div className="col-sm-12">
                      <span className="form-control-feedback" aria-hidden="true"></span>
                      <input
                          type='number'
                          pattern='[0-9]{0,5}'
                          name="id_card_number"
                          id="id-card-number"
                          className="form-control"
                          placeholder="เลขบัตรประชาชนคนขาย"
                          onChange={(e)=>{ 
                              setIdCardNumber(e.target.value) 

                              setChanging('id_card_number')
                          }}
                          value={idCardNumber}
                      />
                    </div>
                  </div>
  
                  <div className="form-group has-feedback required">
                    <label htmlFor="selling-website" className="col-sm-5">เว็บไซด์ประกาศขายของ</label>
                    <div className="col-sm-12">
                      <span className="form-control-feedback" aria-hidden="true"></span>
                      <input
                          type="text"
                          name="selling_website"
                          id="selling-website"
                          className="form-control"
                          placeholder="เว็บไซด์ประกาศขายของ"
                          onChange={(e)=>{ 
                            setSellingWebsite(e.target.value) 

                            setChanging('selling_website')
                          }}
                          value={sellingWebsite}
                        // required
                      />
                    </div>
                  </div>
  
                  <div className="form-group has-feedback required">
                    <label htmlFor="transfer-date" className="col-sm-5">วันโอนเงิน *</label>
                    <div className="col-sm-12">
                      <span className="form-control-feedback" aria-hidden="true"></span>
                      <DatePicker 
                        id="transfer-date"
                        placeholderText="yyyy/mm/dd"
                        selected={ transferDate } 
                        dateFormat="yyyy/MM/dd"
                        isClearable
                        onChange={date =>{
                          setTransferDate(date)
                          setChanging('transfer-date')
                        }} />
                    </div>
                  </div>

                  <div className="form-group has-feedback required">
                    <label htmlFor="body" className="col-sm-5">รายละเอียดเพิ่มเติม *</label>
                    <div className="col-sm-12">
                      <span className="form-control-feedback" aria-hidden="true"></span>
                      
                      <TextareaAutosize 
                          className="form-control"
                          minRows={8}
                          selected={detail} 
                          onChange={(e) => {  
                            setDetail(e.target.value) 

                            setChanging('detail')
                          }} 
                      />
                    </div>
                  </div>
  
                </fieldset>
                <fieldset>
                  <div className="form-group has-feedback required">
                    <label htmlFor="merchant-bank-account" className="col-sm-5">บัญชีธนาคารคนขาย</label>
                    <div style={{cursor: "pointer", 
                                 display: "inline-block", 
                                 padding: "6px 12px",
                                 border: "1px solid #ccc" }} onClick={()=>{setItemsMBA([...itemsMBA, {key:itemsMBA.length, bank_account: "", bank_wallet: 0}])}}>+</div>
                  </div>
     
                  <div>
                    {
                      itemsMBA.map((it, index)=>{
                        return  <div className="col-sm-12" key={index}>
                                  <div>
                                    <div>
                                      <div style={{display: "inline-block"}}>เลขบัญชี</div> 
                                      <div style={{cursor: "pointer", display: "inline-block",  border: "1px solid rgb(204, 204, 204)", padding: "4px", marginLeft:"10px" }} onClick={()=>removeItemsMBA(it)} >X</div>
                                    </div>
                                    <div>
                                      <input
                                        type='number'
                                        pattern='[0-9]{0,5}'
                                        name={`bank_account[${index}]`}
                                        id={`bank-account[${index}]`}
                                        className="form-control"
                                        placeholder="เลขบัญชี"
                                        onChange={(e)=>{
  
                                          const val = e.target.value;
                                          // console.log('onChange', val, e.target.id)
                                          console.log('index : ', index, e.target.id, e.target.value, itemsMBA)
  
  
                                          let _itemsMBA = [...itemsMBA]
  
                                          let findi = _itemsMBA.findIndex((im)=>im.key === it.key)
                                          // console.log('itemsMBA-im : ', im)
  
                                          let data = _itemsMBA[findi];
                                          // console.log(itemsMerchantBankAccount, key)
                                          _itemsMBA[findi]  = {...data, bank_account: val}
  
                                          console.log('_itemsMBA : ', _itemsMBA)
                                          
                                          setItemsMBA(_itemsMBA)


                                          setChanging('bank_account')
                                        }}
                                        value={it.bank_account}
                                        // required
                                      />
                                    </div> 
                                  </div>
                                  <div>
                                    <select 
                                        value={it.bank_wallet}
                                        className="form-control"
                                        name={`bank_wallet[${index}]`}
                                        id={`bank-wallet[${index}]`}
                                        onChange={(e)=>{
                                          const val = e.target.value;
                                          // console.log('onChange', val, e.target.id)
                                          // console.log('index : ', index, e.target.id, e.target.value, itemsMBA)
  
                                          let _itemsMBA = [...itemsMBA]
  
                                          let findi = _itemsMBA.findIndex((im)=>im.key === it.key)
                                          // console.log('itemsMBA-im : ', im)
  
                                          let data = _itemsMBA[findi];
                                          // console.log(itemsMerchantBankAccount, key)
                                          _itemsMBA[findi]  = {...data, bank_wallet: val}
  
                                          console.log('_itemsMBA : ', _itemsMBA)
                                          
                                          setItemsMBA(_itemsMBA)


                                          setChanging('bank_wallet')
  
                                        }} >
                                        {
                                          itemsMerchantBankAccount.map((item)=>
                                            <option key={item.key} value={item.key}>{item.value}</option>
                                          )
                                        }
                                    </select>
                                  </div>
                                  
                                </div>
                      })
                    }
                  </div>
                </fieldset>
                <fieldset>
                  <div className="form-group has-feedback required">
                    <label htmlFor="login-email" className="col-sm-5">รูปภาพประกอบ</label>
                    <label className="custom-file-upload">
                      <input type="file" multiple onChange={changeFiles} />
                      <i className="fa fa-cloud-upload" /> Attach
                    </label>
  
                    <div className="file-preview">
                      {
                        filePreview()
                      }
                    </div>
                  </div>                
                </fieldset>
                <div className="form-action">
                  <div className="col-sm-5">
                  <button
                      type="submit"
                      // disabled={isEmpty(searchWord) ? true : false}
                      onClick={(e)=>{ handleFormSubmit(e) }}>
                      Create
                      {createLoading && <CircularProgress size={10}/>}
                  </button>
                  </div>
              </div> 
              </form>
    }

    return (
        <div>
           {bodyContent()}
        </div>
    );
};
  
const mapStateToProps = (state, ownProps) => {
	return { user: state.user.data }
}

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(NewPostPage)