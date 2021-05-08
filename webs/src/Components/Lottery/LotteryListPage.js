import React, { Component } from 'react';
import { connect } from 'react-redux'
import Image from 'react-bootstrap/Image'
import ReactList from 'react-list';
import { getTime, getTimeWithDate} from '../Utils/Config';
import '../../index.css';

var interval = undefined;
class LotteryListPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lotterys:[]
    };

    this.renderSquareNotableItem = this.renderSquareNotableItem.bind(this);
    this.renderSquareShareItem   = this.renderSquareShareItem.bind(this);
  }

  componentDidMount() {

    console.log(this.props);

    let {lotterys} = this.props
    lotterys =  lotterys.map((v, k) =>{
                  return  v.map((vv, kk) =>{
                            if(vv.is_open){
                              if(vv.tid == 66){
                                return {...vv, time:getTimeWithDate(vv)}
                              }
                              return {...vv, time:getTime(vv, false)}
                            }else{
                              return {...vv, time:-1}
                            }
                          })
                })
    this.setState({lotterys})

    interval = setInterval(() => {
      // console.log('Interval triggered');
      let {lotterys} = this.props
      lotterys =  lotterys.map((v, k) =>{
                   return  v.map((vv, kk) =>{
                             if(vv.is_open){
                                if(vv.tid == 66){
                                  return {...vv, time:getTimeWithDate(vv)}
                                }
                                return {...vv, time:getTime(vv, false)}
                             }else{
                               return {...vv, time:-1}
                             }
                           })
                  })
      this.setState({lotterys})
    }, 1000);
  }
  
  componentWillUnmount(){
    if(interval){
      clearInterval(interval);
    }
  }

  handleClick = (e, item) => {
    // access to e.target here
    console.log(item);
    // 

    let {history} = this.props;
    // /reward/:id
    let type = 'yeekee';
    switch(item.tid){
      case 66:{
        type = 'thai-government';
        break;
      }
      case 68:{
        type = 'hanoi';
        break;
      }
      case 69:{
        type = 'hanoi-vip';
        break;
      }
      case 70:{
        type = 'malay';
        break;
      }
      case 71:{
        type = 'laos';
        break;
      }
      case 72:{
        type = 'baac';
        break;
      }
      case 73:{
        type = 'savings-bank';
        break;
      }
      case 75:{
        type = 'stock-singapore';
        break;
      }
      case 76:{
        type = 'stock-thai';
        break;
      }
      case 77:{
        type = 'stock-india';
        break;
      }
      case 78:{
        type = 'stock-russia';
        break;
      }
      case 79:{
        type = 'stock-german';
        break;
      }
      case 80:{
        type = 'stock-dow';
        break;
      }
      case 81:{
        type = 'stock-egypt';
        break;
      }

      case 82:{
        type = 'stock-en';
        break;
      }
      case 88:{
        type = 'stock-nikkei';
        break;
      }
      case 85:{
        type = 'stock-hangseng';
        break;
      }
      case 86:{
        type = 'stock-taiwan';
        break;
      }
      case 87:{
        type = 'stock-korea';
        break;
      }
      case 84:{
        type = 'stock-china';
        break;
      }
    }

    if(item.is_open){
      switch(item.tid){
        case 67:{
          history.push({pathname: '/lottery-list/yeekee-list', 
                           state: { type:type, tid:item.tid }});
          break;
        }
        default:{
          // history.push('/lottery-list/'+ type +'/' + item.tid)

          history.push({pathname: '/lottery-list/yeekee-list/chit',
                           state: { type:type, tid:item.tid } })
        }
      }
    }else{
      
      // หวยรัฐบาลไทย  : thai-government : 66 
      // หวยยี่กี่        : yeekee          : 67
      // หวยฮานอย     : hanoi           : 68
      // หวยฮานอย VIP : hanoi-vip       : 69
      // หวยมาเลย์     : malay           : 70
      // หวยลาว       : laos            : 71
      // หวยธกส.      : baac            : 72
      // หวยออมสิน     : savings-bank    : 73

      // หุ้นสิงคโปร์     : stock-singapore : 75
      // หุ้นไทย        : stock-thai      : 76
      // หุ้นอินเดีย      : stock-india     : 77
      // หุ้นรัสเซีย      : stock-russia    : 78
      // หุ้นเยอรมัน     : stock-german    : 79
      // หุ้นดาวโจนส์    : stock-dow       : 80
      // หุ้นอียิปต์       : stock-egypt     : 81
      // หุ้นอังกฤษ      : stock-en        : 82
      // นิเคอิ         : stock-nikkei    : 88
      // หุ้นฮั่งเส็ง      : stock-hangseng  : 85
      // หุ้นไต้หวัน      : stock-taiwan    : 86
      // หุ้นเกาหลี      : stock-korea     : 87
      // หุ้นจีน         : stock-china     : 84

      history.push('/lottery-list/reward/'+ type +'/' + item.tid)
    }
  }

  renderSquareNotableItem(index, key){ 
    let item = this.state.lotterys[0][index];
    switch(item.tid){
      case 67:{
        if(item.is_open){
          return  <a key={key} onClick={((e) => this.handleClick(e, item))}>
                    <div key={key} className={'square-item' + (index % 2 ? '' : ' even')}>
                      <Image className={'img-style'} src={item.image_url} rounded />
                      <p>{item.name}</p>
                      <p>เปิดรับ 88 รอบ</p>
                      <p>24 ชม</p>
                    </div>
                  </a>
        }else{
          return <a key={key} onClick={((e) => this.handleClick(e, item))}>
            <div key={key} className={'square-item' + (index % 2 ? '' : ' even')}>
              <Image className={'img-style'} src={item.image_url} rounded />
              <p>{item.name}</p>
              <p>เปิดรับ 88 รอบ</p>
              <p>ปิดรับ</p>
            </div>
          </a>
        }
      }
    }
    if(item.is_open && item.time != -1){
      return  <a key={key} onClick={((e) => this.handleClick(e, item))}>
                <div key={key} className={'square-item' + (index % 2 ? '' : ' even')}>
                  <Image className={'img-style'} src={item.image_url} rounded />
                  <p>{item.name}</p>
                  <p>ปิดรับ : {item.end_time}</p>
                  <p>เหลือเวลา : {item.time}</p>
                </div>
              </a>
    }else{
      return <a key={key} onClick={((e) => this.handleClick(e, item))}>
                <div key={key} className={'square-item' + (index % 2 ? '' : ' even')}>
                  <Image className={'img-style'} src={item.image_url} rounded />
                  <p>{item.name}</p>
                  <p>ปิดรับ : {item.end_time}</p>
                  <p>ปิดรับ</p>
                </div>
              </a>
    }
  }

  renderSquareShareItem(index, key){
    let item = this.state.lotterys[1][index];
    // console.log(item)
    if(item.is_open && item.time != -1){
      return  <a key={key} onClick={((e) => this.handleClick(e, item))}>
                <div key={key} className={'square-item' + (index % 2 ? '' : ' even')}>
                  <Image className={'img-style'} src={item.image_url} rounded />
                  <p>{item.name}</p>
                  <p>ปิดรับ : {item.end_time}</p>
                  <p>เหลือเวลา : {item.time}</p>
                </div>
              </a>
    }else{
      return  <a key={key} onClick={((e) => this.handleClick(e, item))}>
                <div key={key} className={'square-item' + (index % 2 ? '' : ' even')}>
                  <Image className={'img-style'} src={item.image_url} rounded />
                  <p>{item.name}</p>
                  <p>ปิดรับ : {item.end_time}</p>
                  <p>ปิดรับ</p>
                </div>
              </a>
    }
  }

  render() {
    let {lotterys} = this.state

    return lotterys.map((value, key) =>{
      switch(key){
        case 0:{
          if(value.length > 0){
            return  <div className={'lotterys-1'} key={key}>
                      <p>หวยเด่น</p>
                      <ReactList
                        key={key}
                        itemRenderer={this.renderSquareNotableItem}
                        length={value.length}
                        type='uniform'/>
                    </div>
          }else{
            return  <div key={key}></div>
          }
        }

        case 1:{
          if(value.length > 0){
            return  <div key={key}>
                      <p>หวยหุ้น</p>
                      <ReactList
                        key={key}
                        itemRenderer={this.renderSquareShareItem}
                        length={value.length}
                        type='uniform'/>
                    </div>
          }else{
            return  <div key={key}></div>
          }
        }
      }
    })
  }
}

const mapStateToProps = (state, ownProps) => {
  console.log(state)
  if(!state._persist.rehydrated){
    return {};
  }
  
  if(state.auth.isLoggedIn){
    let lotterys = state.lotterys.data.sort(function(obj1, obj2) {
      return obj1.weight - obj2.weight;
    });

    let notables = lotterys.filter(v => v.type_lottery == 90 && v.is_display)
    let shares   = lotterys.filter(v => v.type_lottery == 91 && v.is_display)

    return {  loggedIn: true, 
              user:state.auth.user,
              lotterys:[notables, shares]};
  }else{
    return { loggedIn: false };
  }
}

export default connect(mapStateToProps, null)(LotteryListPage)