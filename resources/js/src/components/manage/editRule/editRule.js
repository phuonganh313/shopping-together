import React, { Component, Fragment } from 'react';
import api from './../../../api';
import RelatedProduct from './relatedProduct';
import Discount from './discount';
import Notification from '../../notification';
import {head, clone, findKey} from "lodash";

export default class EditRule extends Component {
    constructor(){
        super(...arguments);
        this.state = {
            form: {
                idCartRule: '',
                discountProducts: [],
                reductionPercent: 0,
                startDate: new Date(),
                endDate: new Date(),
            },
            isFetching: true,
            step: 1,
            relatedKeyWord: '',
            relatedCurrentPage: '',
            message: '',
            showProductQty: 0,
        }

        this.onChangeValue = this.onChangeValue.bind(this);
        this.handleChangeValue = this.handleChangeValue.bind(this);
        this.nextStep = this.nextStep.bind(this);
        this.onSelectRelatedProduct = this.onSelectRelatedProduct.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onChangeDate = this.onChangeDate.bind(this);
    }

    async componentWillMount () {
        const response = await api.getSetup();
        const result = JSON.parse(response.text);
        if(result.data.setting){
            const responseCartRule = await api.getCartRule(this.props.match.params.id);
            const resultCartRule = JSON.parse(responseCartRule.text);
            if(resultCartRule.data.length > 0){
                this.setState({
                    form: Object.assign({}, this.state.form, {
                        idCartRule: head(resultCartRule.data).id,
                        discountProducts: resultCartRule.data, 
                        reductionPercent: head(resultCartRule.data).reduction_percent,
                        startDate: head(resultCartRule.data).start_date,
                        endDate: head(resultCartRule.data).end_date,
                    }),
                    isFetching: false,
                    showProductQty: result.data.setting.show_product_qty,
                })
            }
        }
    }

    handleChangeValue (name, value) {
        this.setState({
            form: Object.assign({}, this.state.form, {
                [name]: value,
            }),
        })
    }

    async onSubmit () {
        this.setState({
            isFetching: true
        });
        try{
            const fetch = await api.updateCartRule(this.state.form);
            const result = JSON.parse(fetch.text);
            if(result.status){
                this.setState({
                    isFetching: false,
                    message: result.message
                })
                window.location.replace('/manage');
            }
        }catch(errors){
            alert(errors.message)
        }
    }

    onSelectRelatedProduct (products) {
        this.setState({
            form: Object.assign({}, this.state.form, {
                discountProducts: products
            }),
        })
    }

    nextStep (step) {
        this.setState({
            step: step
        })
    }

    onChangeValue (name, value) {
        this.setState({
            [name]: value
        })
    }

    onChangeDate (name, date) {
        this.setState({
            form: Object.assign({}, this.state.form, {
                [name]: date
            })
        });
    }

    deleteProduct (idProduct) {
        let discountProducts = clone(this.state.form.discountProducts);
        let index = findKey(discountProducts, function(product){
            return product.id_shopify_product == idProduct
        })
        discountProducts.splice(index, 1);
        this.setState({
            form: Object.assign({}, this.state.form, {
                discountProducts
            })
        })
    }

    render() {
        const {
            form, step, isFetching, showProductQty, relatedCurrentPage, relatedKeyWord, message
        } = this.state;
        if(isFetching){ return (
            <div id="page_loading">
                <div className="loading">
                    <i className="fa fa-spinner fa-pulse fa-3x fa-fw margin-bottom" />
                </div>
            </div>
        )}else {
            return (
                <Fragment>
                    <div className="steps">
                        {
                            step == 1
                            ?
                                <Discount
                                    handleChangeValue = {this.handleChangeValue}
                                    nextStep = {this.nextStep}
                                    onSubmit = {this.onSubmit}
                                    discountProducts = {form.discountProducts}
                                    reductionPercent = {form.reductionPercent}
                                    onChangeDate = {this.onChangeDate}
                                    startDate = {form.startDate}
                                    endDate = {form.endDate}
                                    deleteProduct = {this.deleteProduct.bind(this)}
                                />
                            :
                                null
                        }
                    </div>
                    <div className="steps">
                        {
                            step == 2
                            ?
                                <RelatedProduct
                                    currentPage = {relatedCurrentPage}
                                    keyWord = {relatedKeyWord}
                                    onSelectRelatedProduct = {this.onSelectRelatedProduct}
                                    nextStep = {this.nextStep}
                                    onChangeValue = {this.onChangeValue}
                                    showProductQty = {showProductQty}
                                    discountProducts = {form.discountProducts}
                                />
                            :
                                null
                        }
                    </div>
                    {
                        message
                        ?
                        <Notification
                            content = {message}
                        />
                        :
                        null
                    }
                </Fragment>
            );
        }
    }
}
