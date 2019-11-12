import React, { Component, Fragment } from 'react';
import {fontFamilyOptions, fontStyleOptions} from "../../constants";
import { Panel as ColorPickerPanel } from 'rc-color-picker';
import 'rc-color-picker/assets/index.css';
import classNames from 'classnames'

export default class NewPrice extends Component {
    constructor(props) {
        super(props);

        this.handleOutsideClick = this.handleOutsideClick.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleChangeValue = this.handleChangeValue.bind(this);
        this.changeHandlerColor = this.changeHandlerColor.bind(this, 'newPriceFontColor');
        this.toggle = this.toggle.bind(this);

        this.state = {
            displayFontColor: false,
        };
    }

    handleClick () {
        if (!this.state.displayFontColor) {
            document.addEventListener('click', this.handleOutsideClick, false);
        } else {
            document.removeEventListener('click', this.handleOutsideClick, false);
        }
        this.setState({
            displayFontColor: !this.state.displayFontColor,
        })
    }

    handleOutsideClick (e) {
        if (this.node.contains(e.target)) {
          return;
        }
        this.handleClick();
    }

    changeHandlerColor (name, colors) {
        this.props.handleChangeValue(name, colors.color)
    };

    handleChangeValue (event) {
        this.props.handleChangeValue(event.target.name, event.target.value)
    };

    toggle (event) {
        this.props.handleChangeToggle(event.target.dataset.index);
    }

    render () {
        const {newPriceFontFamily, newPriceFontStyle, newPriceFontColor, validates, newPrice} = this.props;
        const {displayFontColor} = this.state;
        return (
            <div className="full-width display-block">
                <div data-index="newPrice" className='btn-block left-side__title' onClick={this.toggle}>
                    {lang.sale_price}
                    <span>
                        <i data-index="newPrice" className={(newPrice ? 'hide' : 'appear fa fa-plus')} aria-hidden="true"></i>
                        <i data-index="newPrice" className={(newPrice ? 'appear fa fa-minus' : 'hide')} aria-hidden="true"></i>
                    </span>
                </div>
                <div className={(newPrice ? 'left-side__control' : 'collapse')}>
                    <div className="full-width display-block">
                        <div className="form-group">
                            <p>{lang.font_family}</p>
                            <select
                                name="newPriceFontFamily"
                                className="form-control"
                                onChange={this.handleChangeValue}
                                value={newPriceFontFamily}
                            >
                                {fontFamilyOptions.map((value, i) =>
                                    <option key={i} value={value.value}>{value.label}</option>
                                )}
                            </select>
                        </div>
                    </div>
                    <div className="full-width display-block">
                        <div className="form-group">
                            <p>{lang.font_style}</p>
                            <select
                                name="newPriceFontStyle"
                                className="form-control"
                                onChange={this.handleChangeValue}
                                value={newPriceFontStyle}
                            >
                                {fontStyleOptions.map((value, i) =>
                                    <option key={i} value={value.value}>{value.label}</option>
                                )}
                            </select>
                        </div>
                    </div>
                    <div className="full-width" ref={node => { this.node = node; }}>
                        <p>{lang.font_color}</p>
                        <input
                            type="text"
                            value={newPriceFontColor}
                            onChange={this.handleChangeValue}
                            onClick={this.handleClick}
                            name="newPriceFontColor"
                            style={{backgroundColor: newPriceFontColor}}
                            className={classNames('form-control', validates.newPriceFontColor)}
                        />
                        {
                            displayFontColor
                            ?
                            <Fragment>
                                <ColorPickerPanel
                                    alpha={80}
                                    color={newPriceFontColor}
                                    onChange={this.changeHandlerColor}
                                    mode="HSB"
                                />
                            </Fragment>
                            :
                            null
                        }
                    </div>
                </div>
            </div>
        );
    }
}
