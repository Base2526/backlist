import React, { Component } from 'react';
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'

class StatementPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
   
  }
  
  render() {
    return (
      <Tabs defaultActiveKey="home" id="uncontrolled-tab-example">
        <Tab eventKey="home" title="วันนี้">
          <div>
          วันนี้
          </div>
        </Tab>
        <Tab eventKey="profile" title="ก่อนหน้า">
          <div>
          ก่อนหน้า
          </div>
        </Tab>
      </Tabs>
    );
  }
}

export default StatementPage;