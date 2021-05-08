import React, { Component } from 'react';
import { connect } from 'react-redux'
import ReactList from 'react-list';
import { getTime } from '../Utils/Config';
import '../../index.css';

var interval = undefined;
class YeekeeListPage extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      rounds:[]
    };
    this.handleItemClick      = this.handleItemClick.bind(this);
    this.renderItem       = this.renderItem.bind(this);
  }

  componentDidMount() {
    // let {rounds} = this.props

    // rounds = rounds.map((v, k) =>{return {...v, time:getTime(v)}})
    // this.setState({rounds})

    // interval = setInterval(() => {
    //   let {rounds} = this.props
    //   rounds = rounds.map((v, k) =>{ return {...v, time:getTime(v)} })
    //   this.setState({rounds})
    // }, 1000);


    // var today = new Date();
    // var myToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
    // เวลาเริ่มต้นการขายหวล เริ่ม 06.00 AM - 03.00AM 
    // today.setHours(6); 

    // กำหนดนาที ให้โดย Date จะมีการคำนวณ hours, minutes ให้อัตโนมัติ
    // today.setMinutes(1305); 
    // today.setSeconds(0);
    // console.log(today);

    

    var rounds = [];
    var length = 87; // user defined length

    for(var i = 0; i <= length; i++) {
      var today = new Date();
      today.setHours(6); 
      today.setMinutes(i * 15); 
      today.setSeconds(0);
      // console.log(today);

      let year  = today.getFullYear();
      let month = today.getMonth();
      let date  = today.getDate();

      let hours   = today.getHours();
      let minutes = today.getMinutes();
      let seconds = today.getSeconds();

      var ampm = hours >= 12 ? 'pm' : 'am';

      // rounds[i] = hours+' '+ minutes +' '+ seconds;
      // console.log( i + ' : ' + hours+', '+ minutes +', '+ seconds + ", " + ampm);

      // console.log(today.getTime());

      rounds[i] = today.getTime();

      let after_today = new Date(rounds[i]);

      let after_today_hours   = ("0" + after_today.getHours()).slice(-2);
      let after_today_minutes = ("0" + after_today.getMinutes()).slice(-2);
      let after_today_seconds = ("0" + after_today.getSeconds()).slice(-2);
      
      // console.log(today.getTime() +'->'+ after_today.getTime() +' > '+ after_today_hours +':'+ after_today_minutes +':'+ after_today_seconds );
    }
    // console.log(rounds);

    this.setState({rounds});
  }

  componentWillUnmount(){
    if(interval){
      clearInterval(interval);
    }
  }

  handleItemClick = (e, round) => {
    let {history} = this.props
    if(round.is_close){
      history.push({pathname: '/lottery-list/reward',
                    state: { type:'yeekee', tid:round.tid } })
    }else{
      history.push({pathname: '/lottery-list/yeekee-list/chit',
                    state: { type:'yeekee', tid:round.tid } })
    }
  }

  renderItem(index, key){
    /*
    let {rounds} = this.props
    let round = rounds[index];
    // if(round.time == -1){
    //   return<a key={key} onClick={((e) => this.handleClick(e, round))}>
    //         <div className={'square-item' + (index % 2 ? '' : ' even')}>
    //           <p>รอบที่ {round.name} เวลาปิด {round.end_time}</p>
    //           <p>ปิดรับแทง</p>
    //         </div>
    //         </a>
    // }else{

      if(round.date){
        let date = new Date(round.date);
        
        // Hours
        var hours = date.getHours();

        // Minutes
        var minutes =  "0" + date.getMinutes();

        // Seconds
        var seconds =  "0" + date.getSeconds();

        // console.log(hours + "-" + minutes.substr(-2) + "-" + seconds.substr(-2));
      }
      */

      /*
      let {rounds} = this.state

      let round = new Date(rounds[index]);

      let round_hours   = ("0" + round.getHours()).slice(-2);
      let round_minutes = ("0" + round.getMinutes()).slice(-2);
      let round_seconds = ("0" + round.getSeconds()).slice(-2);

      var timeNow = new Date();
      // console.log(today.getTime());

      // if( (today.getHours() > round.getHours())){
      //   console.log(index + 1);
      // }

      // var diff = Math.abs(timeNow.getTime() - round.getTime());

      // var dd1=timeNow.valueOf();
      // var dd2=round.valueOf();

      // console.log(timeNow.getTime());
      // console.log(dd1 +" > "+ dd2);
      if( timeNow.getTime() < round.getTime()){
        console.log('b is greater : ' + index);
      }
      // console.log(diff + " >> " + (index + 1) );
      
      // console.log('->'+ round.getTime() +' > '+ round_hours +':'+ round_minutes +':'+ round_seconds );
      */

      let {rounds} = this.props
      let round = rounds[index];

      var date = new Date(round.date);

      let round_hours   = ("0" + date.getHours()).slice(-2);
      let round_minutes = ("0" + date.getMinutes()).slice(-2);
      let round_seconds = ("0" + date.getSeconds()).slice(-2);

      console.log(round)

      return<a key={key} onClick={((e) => this.handleItemClick(e, round))}>
              <div key={key} className={'square-item' + (index % 2 ? '' : ' even') + (round.is_close ? ' square-item-close' : '')}>
              <p>รอบที่ {round.name} {round.is_close ? '(ปิดรับแทง)' : ''}</p>
                  <div>เวลาปิดรับ : { round_hours +':'+ round_minutes +':'+ round_seconds }</div>
              </div>
            </a>
    // }
  }

  render(){
    let {rounds} = this.props
    return  ( <ReactList
                  // useTranslate3d={true}
                  itemRenderer={this.renderItem}
                  length={rounds.length}
                  // updateWhenThisValueChanges={rounds}
                  type='simple'/>);
  }
}

const mapStateToProps = (state, ownProps) => {
  if(!state._persist.rehydrated){
    return {};
  }
  
  console.log( state );
  if(state.auth.isLoggedIn){
    let yeekees = state.lotterys.data.find((val) => { return val.tid == 67 });
    let rounds =  yeekees.rounds.sort(function(a, b) {
                    return a.weight - b.weight;
                  }).sort(function(x, y) {
                    // true values first
                    return (y.is_close === x.is_close)? 0 : y.is_close? -1 : 1;
                    // false values first
                    // return (x === y)? 0 : x? 1 : -1;
                  });
                

    // rounds.sort(function(x, y) {
    //     // true values first
    //     return (y.is_close === x.is_close)? 0 : y.is_close? -1 : 1;
    //     // false values first
    //     // return (x === y)? 0 : x? 1 : -1;
    // });

    // console.log(rounds);

    console.log(rounds)
    return {  loggedIn: true, 
              user:state.auth.user, 
              rounds
            };
  }else{
    return { loggedIn: false };
  }
}
export default connect(mapStateToProps, null)(YeekeeListPage)