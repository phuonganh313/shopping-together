import React, { Component } from 'react';
import {Frame, Toast, AppProvider} from '@shopify/polaris';

export default class Notification extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showToast: true
        }
    }

    toggleToast = () => {
        this.setState(({showToast}) => ({showToast: !showToast}));
    };
    
    render(){
        const {content} = this.props;
        const { showToast } = this.state;
        const toastMarkup = showToast ? ( <Toast content={content} onDismiss={this.toggleToast} />) : null;
        return(
            <div className="notification" style={{height: '250px'}}>
                <AppProvider>
                    <Frame>
                        {toastMarkup}
                    </Frame>
                </AppProvider>
            </div>
        );
    }
}