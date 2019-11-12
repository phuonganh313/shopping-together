import React, { Component, Fragment } from 'react';
import {assign, every, values, head} from "lodash";
import classNames from 'classnames'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {displayPrice} from './../../../utility';
import { Link } from 'react-router-dom';

export default class Discount extends Component {
    constructor(){
        super(...arguments);
        this.state = {
            validates: {},
        }
    }

    nextStep (step) {
        this.props.nextStep(step);
    }

    validate (validates) {
        this.setState({
            validates: assign({}, this.state.validates, validates),
        })
    }

    render(){
        const {discountProducts, reductionPercent, startDate, endDate} = this.props;
        const {validates} = this.state;
        let total = 0;
        discountProducts.map((product) => {
            if(!product.isMainProduct){
                total += (parseFloat(product.price) - (parseFloat(product.price) * parseFloat(reductionPercent))/100);
            }else{
                total += (parseFloat(product.price));
            }
        })
        const disabledOnClick = every(values(validates), function(value) {return value == 'valid'});
        return(
            <Fragment>
                <div className="container section-heading">
                    <h1 className="title-heading">{lang.summary}</h1>
                </div>

                <div className="section-datePicker container">
                    <div className="filter-from">
                        <div className="datePicker">
                            <span className="datePicker_title">{lang.start_date}</span>
                            <DatePicker
                                showYearDropdown
                                selected={startDate}
                                onChange={(value) => this.props.onChangeDate('startDate', value)}
                                className="form-control"
                            />
                        </div>
                    </div>
                    <div className="filter-to">
                        <div className="datePicker">
                            <span className="datePicker_title">{lang.end_date}</span>
                            <DatePicker
                                showYearDropdown
                                selected={endDate}
                                onChange={(value) => this.props.onChangeDate('endDate', value)}
                                className="form-control"
                            />
                        </div>
                    </div>
                </div>

                <div className="panel panel-default container ">
                    <table className="table set-discount-wrap">
                        <thead>
                            <tr>
                                <th className="set-discount__title-img">{lang.image}</th>
                                <th>{lang.name}</th>
                                <th>{lang.original_price}</th>
                                <th className="set-discount__title-sale">{lang.sale_price}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {discountProducts.map((product, key)=>(
                                <tr className="info-product" key={key}>
                                    <td><img className="set-discount__img" src={product.src} alt="..." /></td>
                                    <td>{product.title}</td>
                                    <td>{displayPrice(product.price, product.currency)}</td>
                                    <td className="set-discount__sale-price">
                                        {
                                            product.isMainProduct
                                            ?
                                                displayPrice(product.price, product.currency)
                                            :
                                                displayPrice((parseFloat(product.price) - (parseFloat(product.price) * parseFloat(reductionPercent))/100), product.currency)
                                        }
                                    </td>
                                </tr>
                            ))}
                            <tr>
                                <td className="title-total">{lang.total}</td>
                                <td></td>
                                <td></td>
                                <td className="set-discount__sale-price">{displayPrice(total, head(discountProducts).currency)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="container btn-wrap">
                    <button
                        onClick={() => this.props.onSubmit()}
                        type="button"
                        className={classNames('btn btn-primary btn-next-step', {'disabled-form': !disabledOnClick})}
                    >
                        {lang.save}
                    </button>
                    <button onClick={this.nextStep.bind(this, 2)} type="button" className="btn btn-primary btn-back-step">{lang.back}</button>
                </div>
            </Fragment>
        )
    }
}
