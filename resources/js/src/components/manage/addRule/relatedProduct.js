import React, { Component } from 'react';
import Pagination from "react-js-pagination";
import {debounce, every, values, find, findKey} from "lodash";
import classNames from 'classnames'
import api from './../../../api';
import {isPercentage} from "../../../models/validate.model";
import {displayPrice} from './../../../utility';

export default class RelatedProduct extends Component {
    constructor(){
        super(...arguments);
        this.state = {
            products: [],
            itemsPerPage: '',
            totalItems: '',
            isFetching: true,
            msg: '',
            validates: {},
        }
        this.handlePageChange = this.handlePageChange.bind(this);
        this.onChangeKeyWord = this.onChangeKeyWord.bind(this);
        this.onSearchProduct = debounce(this.onSearchProduct, 500);
        this.handleChangeValue = this.handleChangeValue.bind(this);
    }

    componentWillMount () {
        if(this.props.keyWord){
            this.onSearchProduct(this.props.keyWord, this.props.currentPage);
        }else{
            this.getListProduct(this.props.currentPage);
        }
    }

    async getListProduct (currentPage) {
        const response = await api.getProducts(currentPage);
        const result = JSON.parse(response.text);
        if(result.status){
            this.props.onChangeValue('relatedCurrentPage', result.data.current_page);
            this.setState({
                itemsPerPage: result.data.items_per_page,
                totalItems: result.data.total_items,
                products: result.data.items,
                isFetching: false,
            });
        }
    }

    onSelectRelatedProduct (id) {
        let discountProducts = this.props.discountProducts;
        let index = findKey(discountProducts, function(product){
            return product.id == id
        })
        if(index > 0) {
            discountProducts.splice(index, 1);
        }else{
            if(discountProducts.length < this.props.showProductQty){
                const product =  find(this.state.products, function(product){
                    return product.id == id
                })
                product.isMainProduct = false;
                discountProducts.push(product)
            }else{
                alert(lang.exceed_allowed_products_to_group)
            }
        }
        this.props.onSelectRelatedProduct(discountProducts)
    }

    nextStep (step) {
        if(step == 3){
            if(this.props.discountProducts.length == 1){
                alert(lang.please_select_at_least_one_product)
            }else{
                this.props.nextStep(step);
            }
        }else{
            this.props.nextStep(step);
        }
    }

    handlePageChange (currentPage) {
        this.setState({
            isFetching: true
        })
        this.props.onChangeValue('relatedCurrentPage', currentPage);
        if(this.props.keyWord){
            this.onSearchProduct(this.props.keyWord, currentPage);
        }else{
            this.getListProduct(currentPage);
        }
    }

    onChangeKeyWord (event) {
        this.props.onChangeValue('relatedKeyWord', event.target.value)
        this.onSearchProduct(event.target.value);
    }

    async onSearchProduct (keyWord, currentPage = null) {
        this.setState({
            isFetching: true,
        })
        if(keyWord != ''){
            const response = await api.searchProduct(keyWord, currentPage);
            const result = JSON.parse(response.text);
            if(result.status){
                this.props.onChangeValue('relatedCurrentPage', result.data.current_page);
                this.setState({
                    itemsPerPage: result.data.items_per_page,
                    totalItems: result.data.total_items,
                    products: result.data.items,
                    isFetching: false,
                });
            }else{
                this.setState({
                    msg: result.message,
                    products: '',
                    itemsPerPage: result.data.items_per_page,
                    totalItems: result.data.total_items,
                    isFetching: false,
                })
            }
        }else{
            this.getListProduct();
        }
    }

    handleChangeValue (event) {
        const name = event.target.name;
        const value = event.target.value;
        const {validates} = this.state;
        switch(name){
            case 'reductionPercent':
                validates[name] = isPercentage(value) ? 'valid' : 'invalid';
            break;
        }
        this.props.handleChangeValue(name, value);
    }

    render() {
        const {currentPage, msg, keyWord, idMainProduct, reductionPercent, discountProducts} = this.props;
        const {products, itemsPerPage, totalItems, isFetching, validates} = this.state;
        const disabledOnClick = !every(values(validates), function(value) {return value == 'valid'});
        if(isFetching){ return (
            <div id="page_loading">
                <div className="loading">
                    <i className="fa fa-spinner fa-pulse fa-3x fa-fw margin-bottom" />
                </div>
            </div>
        )}else {
            return (
                <div className="container related-wrap">
                    <div className="discount">
                        <p>{lang.set_discount}</p>
                        <input
                            type="text"
                            className={classNames('form-control', validates.reductionPercent)}
                            name="reductionPercent"
                            placeholder={lang.discount_value}
                            onChange={this.handleChangeValue}
                            value = {reductionPercent}
                        />
                        <span className="icon-percent"><i className="fa fa-percent" aria-hidden="true"></i></span>
                    </div>
                    <div className="form-group section-manage">
                        <label className="related-search__title" htmlFor="formGroupExampleInput">{lang.select_relected_product}</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder={lang.search}
                            onChange={this.onChangeKeyWord}
                            value = {keyWord}
                        />
                    </div>
                    {
                        products
                        ?
                            <div className="row">
                                {products.map((product, i)=>(
                                    <span className={classNames('col-sm-6 col-md-2 col-xs-6 product-wrap', {'disabled-form': idMainProduct == product.id ? true : false}, {'sold-out': product.quantity > 0 ? false : true  })} key={i} onClick={this.onSelectRelatedProduct.bind(this, product.id)}>
                                        <div className={classNames('thumbnail', {'disabled-form  product-step2': idMainProduct == product.id ? true : false})}>
                                            <img className="img-main-product" src={product.src} alt="..." />
                                            <div className="check-product">
                                                <input
                                                    type="checkbox"
                                                    checked = {(find(discountProducts, function(discountProduct) { return discountProduct.id == product.id && !discountProduct.isMainProduct})) ? true : false}
                                                />
                                                <span className="checkmark"></span>
                                            </div>
                                            <div className="caption">
                                                <h5 className="split-title-product">{product.title}</h5>
                                                <p>{displayPrice(product.price, product.currency)}</p>
                                                <p>{product.quantity <= 0 ? lang.sold_out : null}</p>
                                            </div>
                                        </div>
                                    </span>
                                ))}
                            </div>
                        :
                            <p>{msg}</p>
                    }
                    <div className="pagination-wrap">
                        <Pagination
                            activePage={currentPage}
                            itemsCountPerPage={itemsPerPage}
                            totalItemsCount={totalItems}
                            pageRangeDisplayed={5}
                            onChange={this.handlePageChange}
                        />
                        <button
                            onClick={this.nextStep.bind(this, 3)}
                            type="button"
                            className={classNames({'btn btn-primary btn-next-step': true}, {'disabled-form': disabledOnClick})}
                        >
                            {lang.next}
                        </button>
                        <button
                            onClick={this.nextStep.bind(this, 1)}
                            type="button"
                            className={classNames({'btn btn-primary btn-back-step': true}, {'disabled-form': disabledOnClick})}
                        >
                            {lang.back}
                        </button>
                    </div>
                </div>
            );
        }
    }
}
