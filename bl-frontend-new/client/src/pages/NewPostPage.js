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
    const [ibody, setIbody] = useState();
    // บัญชีธนาคารคนขาย
    const [itemsMBA, setItemsMBA] = useState([]);
    // รูปภาพประกอบ
    const [files, setFiles] = useState([]);

    const [change, setChange] = useState(false);
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
        // console.log("change :", change);
        if(!change){
            return;
        }

        if( _.isEmpty(interval) ){
            clearInterval(interval)
            interval = undefined
        }
      
        interval = setInterval(async(props)=>{
            console.log("change");

            setChangeText('Saving...')
            
            // let {user, my_follows} = props
            // let response =  await axios.post(`/api/v1/syc_local`, 
            //                                 { 
            //                                     uid: user.uid, my_follows: JSON.stringify(my_follows) 
            //                                 }, 
            //                                 { headers: {'Authorization': `Basic ${ls.get('basic_auth')}` } });

            // response = response.data
            // console.log("useEffect [props.my_follows] #4:", response, user)

            // if(response.result){
            //     props.onMyFollowUpdateStatus({})
            // }


            console.log('title : ', title)
            console.log('transferAmount : ', transferAmount)
            console.log('personName : ', personName)
            // console.log('personSurname : ', personSurname)
            console.log('idCardNumber : ', idCardNumber)
            console.log('sellingWebsite : ', sellingWebsite)
            console.log('transferDate : ', transferDate)
            console.log('ibody : ', ibody)
            console.log('itemsMBA : ', itemsMBA)
            console.log('files : ', files)

            // let response =  await axios.post(`/v1/add_banlist`, data, { headers: {'Authorization': `Basic ${ls.get('basic_auth')}`, 'content-type': 'multipart/form-data'} });
            // response = response.data
            // console.log("/v1/add_banlist > ", response)

            // if(response.result){
            //     props.onClose()
            //     onToast('info', "Add content success")
            // }else{
            //     onToast('error', response.message)
            // }

            setChangeText('Saved')

            setTimeout(()=>{
                console.log('XX')
                setChangeText('')
            }, 4000)
            
            clearInterval(interval)
        }, 2000, props)

        setChange(false)
    }, [change]);

    const handleFormSubmit = async(e) => {
        console.log("handleFormSubmit : ");
        e.preventDefault();
    }

    const changeFiles = (e) => {
        var filesArr = Array.prototype.slice.call(e.target.files);
        setFiles([...files, ...filesArr])

        setChange(true)
    }

    const removeFile = (f) => {
        setFiles(files.filter((x) => x !== f))
    }

    const removeItemsMBA = (itm) =>{
        setItemsMBA(itemsMBA.filter((x)=>x.key !== itm.key))
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

                              setChange(true)
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

                              setChange(true)
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

                              setChange(true)
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

                                setChange(true)
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

                              setChange(true)
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
                            setChange(true)
                          }} />
                      </div>
                    </div>

                    <div className="form-group has-feedback required">
                      <label htmlFor="body" className="col-sm-5">รายละเอียดเพิ่มเติม *</label>
                      <div className="col-sm-12">
                        <span className="form-control-feedback" aria-hidden="true"></span>
                        {/* <textarea
                            name="body"
                            id="body"
                            className="form-control"
                            placeholder="รายละเอียดเพิ่มเติม"
                            multiline={true}
                            selected={ibody} 
                            onChange={(e) => {  
                              setIbody(e.target.value) 

                              setChange(true)
                            }} 
                          // required
                        /> */}
                        <TextareaAutosize 
                            className="form-control"
                            minRows={8}
                            selected={ibody} 
                            onChange={(e) => {  
                            setIbody(e.target.value) 

                            setChange(true)
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
                          return  <div class="col-sm-12">
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


                                            setChange(true)
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


                                            setChange(true)
    
                                          }} >
                                          {
                                            itemsMerchantBankAccount.map((item)=>
                                              <option value={item.key}>{item.value}</option>
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
                        {files.map((file) => {
                          return (
                            <div style={{ display: "inline-block", padding: "5px" }}>
                              <div>
                                <img width="50" height="60" src={URL.createObjectURL(file)} />
                                <div style={{cursor: "pointer"}} onClick={()=>removeFile(file)}>X</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>                
                  </fieldset>
                  <div className="form-action">
                    <div class="col-sm-5">
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