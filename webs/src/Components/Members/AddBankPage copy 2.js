import React, { Component, useState } from 'react';
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

// const pStyle = {
//     fontSize: '50px',
//     textAlign: 'center'
// };

var styles = {
    root: {
      display: "block"
    },
    pStyle: {
        fontSize: '50px',
        textAlign: 'center',
        backgroundColor: 'red'
    },
    item: {
      color: "black",
      complete: {
        textDecoration: "line-through"
      },
      due: {
        color: "red"
      }
    },
}

class AddBankPage extends Component {
    // const [show, setShow] = useState(true);
    // const classes = useStyles();
    constructor(props) {
        super(props);

        console.log(props)
    }

    render() {
        // const [show, setShow] = useState(true);
        // {color:"white", backgroundColor: 'blue'}
        return (
            <Container>
            <Row xs={2} md={4} lg={6} style={styles.pStyle}>
                <Col>1 of 2</Col>
                <Col>2 of 2</Col>
            </Row>
            <Row xs={1} md={2}>
                <Col>1 of 3</Col>
                <Col>2 of 3</Col>
                <Col>3 of 3</Col>
            </Row>
            </Container>
        );
    }
}

export default AddBankPage;