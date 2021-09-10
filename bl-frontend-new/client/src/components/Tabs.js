import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Tab from './Tab';

class Tabs extends Component {
    static propTypes = {
      children: PropTypes.instanceOf(Array).isRequired,
    }
  
    constructor(props) {
      super(props);  
      this.state = {
        activeTab: this.props.activeTab//this.props.children[0].props.id,
      };
    }
  
    render() {
        const {
          props: {
            children,
          },
          state: {
            activeTab,
          }
        } = this;
    
        return (
            <div className="tabs">
            <ol className="tab-list">
                {children.map((child) => {
                const { id, label } = child.props;

                return (
                    <Tab
                      activeTab={activeTab}
                      key={id}
                      id={id}
                      label={label}
                      onClick={()=>{
                        this.setState({ activeTab: id });
                      }}
                    />
                );
                })}
            </ol>
            <div className="tab-content">
                {children.map((child) => {
                if (child.props.id !== activeTab) return undefined;
                    return child.props.children;
                })}
            </div>
            </div>
        );
    }
}

export default Tabs;