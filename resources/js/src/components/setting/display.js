import React, {Component } from 'react';
import 'rc-color-picker/assets/index.css';
import {rangeProductQuantityMin, rangeProductQuantityMax} from "../../constants";

export default class Display extends Component {
    constructor(props) {
        super(props);
        this.handleChangeValue = this.handleChangeValue.bind(this);
        this.handleChangeStatus = this.handleChangeStatus.bind(this);
        this.toggle = this.toggle.bind(this);
    }

    handleChangeValue (event) {
        this.props.handleChangeValue(event.target.name, event.target.value);
    };

    handleChangeStatus () {
        this.props.handleChangeStatus(!this.props.activeMobile) 
    }

    toggle (event) {
        this.props.handleChangeToggle(event.target.dataset.index);
    }

    render () {
        const {showProductQty, display, activeMobile} = this.props;
        return (
            <div className="full-width display-block">
                <div data-index="display" className='btn-block left-side__title' onClick={this.toggle}>
                    {lang.display}
                    <span>
                        <i data-index="display" className={(display ? 'hide' : 'appear fa fa-plus')} aria-hidden="true"></i>
                        <i data-index="display" className={(display ? 'appear fa fa-minus' : 'hide')} aria-hidden="true"></i>
                    </span>
                </div>
                <div className={(display ? 'left-side__control' : 'collapse')}>
                    <div>
                        <p>{lang.show}</p>
                        <label className="check-product">
                            <input type="checkbox" checked/>
                            <span className="left-side__checkbox-title">{lang.allow_on_pcs}</span>
                            <span className="checkmark" style={{opacity: 0.5}}></span>
                        </label>
                        <label className="check-product">
                            <input 
                                type="checkbox" 
                                name="activeMobile"
                                onClick={this.handleChangeStatus}
                                checked={activeMobile ? true : false}
                            />
                            <span className="left-side__checkbox-title">{lang.allow_on_mobile_devices}</span>
                            <span className="checkmark"></span>
                        </label>
                    </div>
                    <div className="left-side__product-group">
                        <p>{lang.products_to_group}</p>
                        <div className="range-show-product">
                            <input
                                type="range"
                                name="showProductQty"
                                className="slider"
                                value={showProductQty}
                                min={rangeProductQuantityMin}
                                max={rangeProductQuantityMax}
                                onChange={this.handleChangeValue}
                            />
                          <span>{showProductQty}</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
