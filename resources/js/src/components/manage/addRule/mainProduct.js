import React, { Component, Fragment } from 'react';
import Pagination from "react-js-pagination";
import {debounce, filter, head, isEmpty, every, values} from "lodash";
import classNames from 'classnames'
import api from './../../../api';
import {displayPrice} from './../../../utility';

export default class MainProduct extends Component {
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
        this.handleChangeValue = this.handleChangeValue.bind(this);
        this.nextStep = this.nextStep.bind(this, 2);
    }

    componentWillMount () {
        if(this.props.keyWord){
            this.onSearchProduct(this.props.keyWord, this.props.currentPage);
        }else{
            this.getListProduct(this.props.currentPage);
        }
    }

    async getListProduct (currentPage) {
        const response = await api.getProducts(currentPage, true);
        const result = JSON.parse(response.text);
        if(result.status){
            this.props.onChangeValue('mainCurrentPage', result.data.current_page);
            this.setState({
                itemsPerPage: result.data.items_per_page,
                totalItems: result.data.total_items,
                products: result.data.items,
                isFetching: false,
            });
        }
    }

    handleChangeValue (event) {
        this.props.handleChangeValue(event.target.name, event.target.value);
    }

    onSelectProduct(id){
        let product = filter(this.state.products, function(product) { return product.id == id; });
        head(product).isMainProduct = true;
        this.props.onSelectMainProduct(product);
    }

    nextStep(step){
        this.props.checkValidateValue();
        if((!isEmpty(this.props.requiredFields))){
            if(!this.props.idMainProduct){
                alert(lang.please_select_at_least_one_product)
            }else{
                this.props.nextStep(step);
            }
        }
    }

    handlePageChange (currentPage) {
        this.setState({
            isFetching: true
        })
        this.props.onChangeValue('mainCurrentPage', currentPage);
        if(this.props.keyWord){
            this.onSearchProduct(this.props.keyWord, currentPage);
        }else{
            this.getListProduct(currentPage);
        }
    }

    onChangeKeyWord (event) {
        this.props.onChangeValue('mainKeyWord', event.target.value)
        this.onSearchProduct(event.target.value);
    }

    async onSearchProduct (keyWord, currentPage = null) {
        this.setState({
            isFetching: true,
        })
        if(keyWord != ''){
            const response = await api.searchProduct(keyWord, currentPage, true);
            const result = JSON.parse(response.text);
            if(result.status){
                this.props.onChangeValue('mainCurrentPage', result.data.current_page);
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
        const {products, itemsPerPage, totalItems, isFetching, msg} = this.state;
        const {currentPage,  ruleName, validates, keyWord} = this.props;
        const disabledOnClick = !every(values(validates), function(value) {return value == 'valid'});
        if(isFetching){ return (
            <div id="page_loading">
                <div className="loading">
                    <i className="fa fa-spinner fa-pulse fa-3x fa-fw margin-bottom" />
                </div>
            </div>
        )}else {
            return (
                <div className="container section-manage">
                    <div className="form-inline rulename-wrap">
                        <div className="form-group mb-2 title-rulename">
                            <span>{lang.set_the_rule_name}</span>
                        </div>
                        <div className="form-group mx-sm-3 mb-2">
                            <input
                                type="text"
                                name="ruleName"
                                value={ruleName}
                                placeholder={lang.rule}
                                onChange={this.handleChangeValue}
                                className={classNames('form-control', validates.ruleName)}
                            />
                            {/* {validates.ruleName == 'invalid' ? <span className="alert-rule-exists">{lang.this_name_already_exists}</span> : null} */}
                        </div>
                    </div>

                    <div className="form-group product-search-wrap">
                        <label className="title-search-product" htmlFor="formGroupExampleInput">{lang.select_a_main_product}</label>
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
                                    <span className={classNames('product-wrap col-sm-6 col-md-2 col-xs-6', {'sold-out': product.quantity > 0 ? false : true  })} key={i} onClick={this.onSelectProduct.bind(this, product.id)}>
                                        <div className={`thumbnail  ${this.props.idMainProduct == product.id ? 'img-active ': ''}`}>
                                            <img className="img-main-product" src={product.src} alt="..." />
                                            <h5 className="split-title-product">{product.title}</h5>
                                            <p>{displayPrice(product.price, product.currency)}</p>
                                            <p>{product.quantity <= 0 ? lang.sold_out : null}</p>
                                        </div>
                                    </span>
                                ))}
                            </div>
                        :
                            <p>{msg}</p>
                    }

                    <Fragment>
                        <div className="pagination-wrap">
                            <Pagination
                                activePage={currentPage}
                                itemsCountPerPage={itemsPerPage}
                                totalItemsCount={totalItems}
                                pageRangeDisplayed={5}
                                onChange={this.handlePageChange}
                            />
                            <button
                                onClick={this.nextStep}
                                type="button"
                                className={classNames({'btn btn-primary btn-next-step': true}, {'disabled-form': disabledOnClick})}
                            >
                                {lang.next}
                            </button>
                        </div>
                    </Fragment>
                </div>
            );
        }
    }
}
