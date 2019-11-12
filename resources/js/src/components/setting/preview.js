import React, { Component } from 'react';
import api from '../../api';
import {mapValues, head} from "lodash";
import RulesList from './rulesList';
import {displayPrice} from './../../utility';

export default class Preview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isFetching: true,
            cartRules: [],
            option1: [],
            option2: [],
            option3: [],
            product: '',
            priceProducts: []
        };
        this.showAlert = this.showAlert.bind(this);
        this.handleChangeTotalPrice = this.handleChangeTotalPrice.bind(this);
        this.onSyncProduct = this.onSyncProduct.bind(this);
    }

    async componentWillMount () {
        const response = await api.getProductInfo();
        const result = JSON.parse(response.text);
        let priceProducts = [];
        let cartRules = [];
	    if(result.data){
            const cartRulesResponse = await api.getCartRules(result.data.id_shopify_product);
            const cartRulesResult = JSON.parse(cartRulesResponse.text);
            let option1 = [];
            let option2 = [];
            let option3 = [];
            if(result.data.variants){
                result.data.variants.forEach(function(variant) {
                    if(variant.option1 != null){
                        option1.push(variant.option1)
                    }
                    if(variant.option2 != null){
                        option2.push(variant.option2)
                    }
                    if(variant.option3 != null){
                        option3.push(variant.option3)
                    }
                })
            }
            if(cartRulesResult.data){
                cartRules = cartRulesResult.data;
                if (cartRules.length > 0) {
                    priceProducts = [];
                    cartRules.forEach(function(cartRule) {
                        if(cartRule.variants.length > 0) {
                            let variants = cartRule.variants;
                            priceProducts[cartRule.id_product] = cartRule.is_main_product == 1 ? parseFloat(variants[0].price) : (parseFloat(variants[0].price) - (parseFloat(variants[0].price) * parseFloat(cartRule.reduction_percent))/100)
                        }
                    })
                }
            }
            this.setState({
                title: result.data.title,
                src: result.data.src_image,
                price: result.data.price,
                quantity: result.data.quantity,
                priceProducts: priceProducts,
                option1,
                option2,
                option3,
                cartRules: cartRules,
                product: result.data,
                isFetching: false,
            })
        }else{
            this.setState({
                isFetching: false,
            })
        }
    }

    async onSyncProduct (){
        this.setState({
            isFetching: true
        });
        try{
            const fetch = await api.cloneProducts();
            const result = JSON.parse(fetch.text);
            if(result.status){
                this.setState({
                    isFetching: false,
                })
                location.reload();
            }else{
                this.setState({
                    isFetching: false,
                    message: result.message
                })
            }
        }catch(errors){
            alert(errors.message)
        }
    }

    handleChangeTotalPrice (cartRule, idProduct, price) {
        let priceProducts = this.state.priceProducts;
        priceProducts[idProduct] = cartRule.is_main_product == 1 ? parseFloat(price) : (parseFloat(price) - (parseFloat(price) * parseFloat(cartRule.reduction_percent))/100);
        this.setState({
            priceProducts
        })
    }

    showAlert () {
        return alert(lang.go_to_your_live_website_to_use_this_function);
    }

    render () {
        const {option1, option2, option3, cartRules, priceProducts, product, isFetching} = this.state;
        const {titleFontFamily, titleFontColor, titleFontStyle, productFontFamily, productFontStyle, productFontColor, amountFontFamily,
            amountFontStyle, amountFontColor, newPriceFontFamily, newPriceFontStyle, newPriceFontColor, oldPriceFontFamily, oldPriceFontStyle,
            oldPriceFontColor, productText, cartText, cartFontFamily, cartFontStyle, cartFontColor, backgroundColor, currency} = this.props;

        let cartStyle={
            color: cartFontColor,
            backgroundColor: backgroundColor,
            fontFamily: cartFontFamily,
            fontWeight: cartFontStyle == 'italic' ? '' : cartFontStyle,
            fontStyle : cartFontStyle == 'italic' ? cartFontStyle : '',
        };

        let oldPriceStyle={
            color: oldPriceFontColor,
            fontFamily: oldPriceFontFamily,
            fontWeight: oldPriceFontStyle == 'italic' ? '' : oldPriceFontStyle,
            fontStyle : oldPriceFontStyle == 'italic' ? oldPriceFontStyle : '',
        };

        let newPriceStyle={
            color: newPriceFontColor,
            fontFamily: newPriceFontFamily,
            fontWeight: newPriceFontStyle == 'italic' ? '' : newPriceFontStyle,
            fontStyle : newPriceFontStyle == 'italic' ? newPriceFontStyle : '',
        };

        let titleStyle={
            color: titleFontColor,
            fontFamily: titleFontFamily,
            fontWeight: titleFontStyle == 'italic' ? '' : titleFontStyle,
            fontStyle : titleFontStyle == 'italic' ? titleFontStyle : '',
        };

        let productNameStyle={
            color: productFontColor,
            fontFamily: productFontFamily,
            fontWeight: productFontStyle == 'italic' ? '' : productFontStyle,
            fontStyle : productFontStyle == 'italic' ? productFontStyle : '',
        };

        let totalAmountStyle={
            color: amountFontColor,
            fontFamily: amountFontFamily,
            fontWeight: amountFontStyle == 'italic' ? '' : amountFontStyle,
            fontStyle : amountFontStyle == 'italic' ? amountFontStyle : '',
        };

        let totalPrice = 0;
        mapValues(priceProducts, function(value) {
            totalPrice += Number(value)
        })

        if(isFetching){ return (
            <div id="page_loading">
                <div className="loading">
                    <i className="fa fa-spinner fa-pulse fa-3x fa-fw margin-bottom" />
                </div>
            </div>
        )}else {
            return (
                <div className="col-md-12 wrap-preview">
                    <div className="row right-side__menu">
                        <div className="menu-title col-md-4 col-xs-6 col-sm-4">
                            {lang.happypoint}
                        </div>
                        <div className="col-md-5 col-md-offset-1 col-sm-offset-1 col-xs-6 col-sm-4">
                            <span>{lang.home}</span>
                            <span>{lang.catalog}</span>
                        </div>
                        <div className="col-md-2 menu-icon col-xs-12 col-sm-3">
                            <span><i className="fa fa-search" aria-hidden="true"></i></span>
                            <span><i className="fa fa-shopping-bag" aria-hidden="true"></i></span>
                        </div>
                    </div>
                    {
                        product
                        ?
                        <div className="row right-side__form-product">
                            <div className="col-md-6">
                                <img className="image-setting-product" src={product.src_image}/>
                            </div>
                        <div className="col-md-6 unpadding-right">
                            <div className="form-group">
                                <p className="title-product">{product.title}</p>
                                <p className="price-product">{displayPrice(product.price, currency)}</p>
                                <div className="col-md-12 option-product">
                                {
                                    option1.length > 0 && head(option1) != "Default Title"
                                    ?
                                    <div className="col-md-6">
                                        <p>{lang.option_name_1}</p>
                                        <select name="option1" className="form-control">
                                            {option1.map((value, i)=>{
                                            return <option key={i}>{value}</option>
                                            })}
                                        </select>
                                    </div>
                                    :
                                    null
                                }
                                {
                                    option2.length > 0 && head(option2) != "Default Title"
                                    ?
                                    <div className="col-md-6">
                                        <p>{lang.option_name_2}</p>
                                        <select name="option2" className="form-control">
                                            {option2.map((value, i)=>{
                                                return <option key={i}>{value}</option>
                                                })}
                                            </select>
                                        </div>
                                        :
                                        null
                                    }
                                    {
                                        option3.length > 0 && head(option3) != "Default Title"
                                        ?
                                        <div className="col-md-6">
                                            <p>{lang.option_name_3}</p>
                                            <select name="option3" className="form-control">
                                                {option3.map((value, i)=>{
                                                    return <option key={i}>{value}</option>
                                                })}
                                            </select>
                                        </div>
                                        :
                                        null
                                    }
                                    </div>
                                </div>
                                {
                                    Number(product.quantity) > 0
                                    ?
                                        <button className="btn btn-primary col-md-12">{lang.add_to_cart}</button>
                                    :
                                        <div>
                                            <button className="btn btn-primary col-md-12 opacity-button">{lang.sold_out}</button>
                                            <button className="btn btn-primary col-md-12 opacity-button">{lang.add_to_cart}</button>
                                        </div>
                                }
                                {
                                    cartRules.length > 0
                                    ?
                                    <div className="col-md-12 col-xs-12 right-side__translation">
                                        <div className="row">
                                            <div className="col-md-12 right-side__option-title" style={titleStyle}>{productText}</div>
                                            <div className="col-md-12 col-xs-12">
                                            {cartRules.map((cartRule, i)=>{
                                                return <RulesList
                                                    key={i}
                                                    cartRule = {cartRule}
                                                    productNameStyle = {productNameStyle}
                                                    titleStyle = {titleStyle}
                                                    oldPriceStyle = {oldPriceStyle}
                                                    newPriceStyle = {newPriceStyle}
                                                    totalAmountStyle = {totalAmountStyle}
                                                    currency = {currency}
                                                    handleChangeTotalPrice = {this.handleChangeTotalPrice}
                                                    idProduct = {cartRule.id_product}
                                                />
                                            })}
                                            </div>
                                            <div className="col-md-12 right-side__total col-xs-12">
                                                <div className="col-md-4 col-xs-4 first unpadding-left">{lang.total}</div>
                                                <div className="col-md-8 col-xs-8 second" style={totalAmountStyle}>{displayPrice(totalPrice, currency)}</div>
                                            </div>
                                            <button className="btn-bundle alert-box" onClick= {this.showAlert} style={cartStyle}>{cartText}</button>
                                        </div>
                                    </div>
                                    :
                                    <div className="note-add-rule">
                                      {lang.please_add_one_rule_taking_this_product_as_a_main_product_to_preview}
                                    </div>
                                }
                            </div>
                        </div>
                        :
                        <button onClick={this.onSyncProduct}>{lang.sync_products}</button>
                    }
                    <div className="row right-side__footer">
                        <span>{lang.label_footer}</span>
                    </div>
                </div>
            );
        }
    }
}
