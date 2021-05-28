import React, { Component } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
// import InputAutocomplete from './InputAutocomplete/InputAutocomplete';
import { Input, DatePicker, Radio, Button, Row, Col } from 'antd';
import { RightCircleOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';
import ls from 'local-storage';


import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import history from '../../history';
import { Redirect, Link} from 'react-router-dom';

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  box_width: {
    maxWidth: 300,
  }
});

class GovernmentPage extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      type: 'ow',
      from : 'Bangalore',
      journeyDate: null,
      destination: null,
      lat:null,
      lng:null,
      distance: null,
      journeyTime: null,
      selected: [],



      tabIndex: 1
    };

  }

  componentDidMount() {
    ls.set('rideType', this.state.type);
    ls.set('origin', this.state.from);


    this.handleClick = this.handleClick.bind(this);
  }

  destinationChangeHandler(event) {
    this.setState({ to: event.target.value });
  }

  dateChangeHandler(date, dateStr) {
    ls.set('journeyDate', dateStr);
    this.setState({ journeyDate: dateStr });
  }

  handleBooking = async e => {
    // e.preventDefault();
    const response = await fetch('/api/price', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ lat: this.state.lat, lng: this.state.lng }),
    });
    const body = await response.json();
    
    ls.set('distance', body.distance);
    ls.set('journeyTime', body.days);
  };

  continueHandler = () => {
    history.push('/second-page')
  }

  getDestVal = (val) => {
    this.setState({destination : val[0], lat : val[1].lat, lng : val[1].lng})
    ls.set('destination', this.state.destination)
    ls.set('lat', this.state.lat)
    ls.set('lng', this.state.lng)
      
    console.log(this.state.destination);
  }

  nextPath(path) {
    
    if(this.state.destination != null) {
      this.handleBooking();
      this.props.history.push(path);
    }
  }

  handleClick = (i) => {
    // console.log('this is:', i);
    let find = this.state.selected.find(element => element == i);
    if(!find){
        var newArray = this.state.selected.slice();    
        newArray.push(i);   
        this.setState({selected:newArray})
    }else{
        let filter = this.state.selected.filter(j => i != j);
        this.setState({selected:filter})
    }
  }

  getrSelectedList () {
    var divList = [];
    for (var i = 0; i < this.state.selected.length; i++) {
        divList.push(<button data-id={i} style={{backgroundColor: 'red'}} onClick={e => this.handleClick(e.target.getAttribute('data-id'))}>
                        selected : {this.state.selected[i]}
                    </button>);
    }
    return divList;
  }

  getrDivList () {
    var divList = [];
    for (var i = 0; i < 40; i++) {
        let find = this.state.selected.find(element => element == i);
        if(find){
            divList.push(<button data-id={i} style={{backgroundColor: 'blue'}} onClick={e => this.handleClick(e.target.getAttribute('data-id'))}>
                                {i}
                            </button>);
        }else{
            divList.push(<button data-id={i} onClick={e => this.handleClick(e.target.getAttribute('data-id'))}>
                            {i}
                        </button>);
        }
        
    }
    return divList;
  }

  getTabPanelContent (id) {

    switch(id){
      case 0:{
        return <h2>Any content . {id}</h2>;
        break;
      }
      case 1:{
        // return this.getrDivList();

        let v = <Tabs>
                  <TabList>
                  <Tab>สามตัว</Tab>
                  <Tab>สองตัว</Tab>
                  <Tab>เลขวิ่ง</Tab>
                  </TabList>

                  <TabPanel>
                  <div>
                    <button data-id='3xx' style={{backgroundColor: 'blue'}} >
                    3ตัวบน
                    </button>
                    <button data-id='3yy' style={{backgroundColor: 'blue'}} >
                    3ตัวโต๊ด
                    </button>
                  </div>

                  <div>
                    <button data-id='000' style={{backgroundColor: 'blue'}} >
                    000
                    </button>
                    <button data-id='100' style={{backgroundColor: 'blue'}} >
                    100
                    </button>
                    <button data-id='200' style={{backgroundColor: 'blue'}} >
                    200
                    </button>
                    <button data-id='300' style={{backgroundColor: 'blue'}} >
                    300
                    </button>
                    <button data-id='400' style={{backgroundColor: 'blue'}} >
                    400
                    </button>
                    <button data-id='500' style={{backgroundColor: 'blue'}} >
                    500
                    </button>
                    <button data-id='600' style={{backgroundColor: 'blue'}} >
                    600
                    </button>
                    <button data-id='700' style={{backgroundColor: 'blue'}} >
                    700
                    </button>
                    <button data-id='800' style={{backgroundColor: 'blue'}} >
                    800
                    </button>
                    <button data-id='900' style={{backgroundColor: 'blue'}} >
                    900
                    </button>
                  </div>
                  <div>
                    {this.getrDivList()}
                  </div>
                  </TabPanel>
                  <TabPanel>
                  <div>
                    <button data-id='3xx' style={{backgroundColor: 'blue'}} >
                    2ตัวบน
                    </button>
                    <button data-id='3yy' style={{backgroundColor: 'blue'}} >
                    2ตัวล่าง
                    </button>
                  </div>
                  <div>
                    {this.getrDivList()}
                  </div>
                  </TabPanel>
                  <TabPanel>
                  <div>
                    <button data-id='3xx' style={{backgroundColor: 'blue'}} >
                    วิ่งบน
                    </button>
                    <button data-id='3yy' style={{backgroundColor: 'blue'}} >
                    วิ่งล่าง
                    </button>
                  </div>
                  <div>
                    <button data-id='0' style={{backgroundColor: 'blue'}} >
                    0
                    </button>
                    <button data-id='1' style={{backgroundColor: 'blue'}} >
                    1
                    </button>
                    <button data-id='2' style={{backgroundColor: 'blue'}} >
                    2
                    </button>
                    <button data-id='3' style={{backgroundColor: 'blue'}} >
                    3
                    </button>
                    <button data-id='4' style={{backgroundColor: 'blue'}} >
                    4
                    </button>
                    <button data-id='5' style={{backgroundColor: 'blue'}} >
                    5
                    </button>
                    <button data-id='6' style={{backgroundColor: 'blue'}} >
                    6
                    </button>
                    <button data-id='7' style={{backgroundColor: 'blue'}} >
                    7
                    </button>
                    <button data-id='8' style={{backgroundColor: 'blue'}} >
                    8
                    </button>
                    <button data-id='9' style={{backgroundColor: 'blue'}} >
                    9
                    </button>
                  </div>
                  </TabPanel>
              </Tabs>;

        return v;
        break;
      }
    }
    return <h2>Any content 1x</h2>;
  }

  render() {

    console.log(this.state.selected);
    return (
    //   <Card className={ useStyles.root }>
    //     <CardContent>

        <div style={{minWidth: 275}}>
            <div>
                { this.getrSelectedList() }
            </div>
            <div>
              <div>
                <button data-id='9' >ดึงโพย</button>
              </div>
              <div>
                <button data-id='9' >ใส่ราคา</button>
              </div>
            </div>
            <div>
                <Tabs selectedIndex={this.state.tabIndex} onSelect={tabIndex => this.setState({ tabIndex })}>
                    <TabList>
                      <Tab>กดเลขเอง</Tab>
                      <Tab>เลือกจากแผง</Tab>
                    </TabList>

                    <TabPanel>
                    {this.getTabPanelContent(0)}
                    </TabPanel>
                    <TabPanel>
                    {this.getTabPanelContent(1)}
                    </TabPanel>
                </Tabs>
                <div>
                  <div>เงื่อนไขการแทง</div>
                  <div>
                  <div>วิ่งบน จ่าย : 3.20</div>
                  <ul>
                    <li>แทงขั้นต่ำต่อครั้ง : 10.00</li>
                    <li>แทงสูงสุดต่อครั้ง : 20000.00</li>
                    <li>แทงสูงสุดต่อเลข : 20000.00</li>
                  </ul>
                  <div>วิ่งล่าง จ่าย : 4.20</div>
                  <ul>
                    <li>แทงขั้นต่ำต่อครั้ง : 10.00</li>
                    <li>แทงสูงสุดต่อครั้ง : 20000.00</li>
                    <li>แทงสูงสุดต่อเลข : 20000.00</li>
                  </ul>
                  </div>
                </div>
            </div>
        </div>
    //     </CardContent>
    //   </Card>
    );
  }
}

export default GovernmentPage;