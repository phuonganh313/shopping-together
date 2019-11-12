import React, { Component } from 'react';
import Pagination from "react-js-pagination";
import {debounce, find, findKey} from "lodash";
import classNames from 'classnames'
import api from './../../../api';
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
        }
        this.handlePageChange = this.handlePageChange.bind(this);
        this.onChangeKeyWord = this.onChangeKeyWord.bind(this);
        this.onSearchProduct =  debounce(this.onSearchProduct, 500);
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
            return product.id_shopify_product == id
        })
        if(index >= 0) {
            discountProducts.splice(index, 1);
        }else{
            if(discountProducts.length < this.props.showProductQty){
                const product =  find(this.state.products, function(product){
                    return product.id_shopify_product == id
                })
                product.is_main_product = 0;
                discountProducts.push(product)
            }else{
                alert(lang.exceed_allowed_products_to_group)
            }
        }
        this.props.onSelectRelatedProduct(discountProducts)
    }

    nextStep (step) {
        if(step == 1){
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

    render() {
        const {currentPage, msg, keyWord, discountProducts} = this.props;
        const {products, itemsPerPage, totalItems, isFetching, validates} = this.state;
        if(isFetching){ return (
            <div id="page_loading">
                <div className="loading">
                    <i className="fa fa-spinner fa-pulse fa-3x fa-fw margin-bottom" />
                </div>
            </div>
        )}else {
            return (
                <div className="container related-wrap">
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
                                    <span className={classNames('col-sm-6 col-md-2 col-xs-6 product-wrap', {'disabled-form': (find(discountProducts, function(discountProduct) { return discountProduct.id_shopify_product == product.id_shopify_product && discountProduct.is_main_product == 1}))}, {'sold-out': product.quantity > 0 ? false : true  } )} key={i} onClick={this.onSelectRelatedProduct.bind(this, product.id_shopify_product)}>
                                        <div className={classNames('thumbnail', {'disabled-form  product-step2': (find(discountProducts, function(discountProduct) { return discountProduct.id_shopify_product == product.id_shopify_product && discountProduct.is_main_product == 1})) ? true : false})}>
                                            <img className="img-main-product" src={product.src} alt="..." />
                                            <div className="check-product">
                                                <input
                                                    type="checkbox"
                                                    checked = {(find(discountProducts, function(discountProduct) { return discountProduct.id_shopify_product == product.id_shopify_product && discountProduct.is_main_product == 0})) ? true : false} 
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
                            onClick={this.nextStep.bind(this, 1)}
                            type="button"
                            className={classNames({'btn btn-primary btn-next-step': true})}
                        >
                            {lang.next}
                        </button>
                    </div>
                </div>
            );
        }
    }
}
