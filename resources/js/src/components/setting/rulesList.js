import React, { Component, Fragment  } from 'react';
import {head, find} from "lodash";
import {displayPrice} from './../../utility';

export default class RulesList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            variant: head(this.props.cartRule.variants),
        };
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange (event) {
        const value = event.target.value;
        const {cartRule, idProduct} = this.props;
        let variant = find(cartRule.variants, function(variant) { return variant.id_variant == value });
        this.props.handleChangeTotalPrice(cartRule, idProduct, variant.price);
        this.setState({
            variant
        });
    }

    render () {
        const { cartRule, productNameStyle, oldPriceStyle, newPriceStyle, currency} = this.props;
        const { variant } = this.state;
        return (
            <Fragment>
                {
                variant
                ?
                  <div className="col-md-12 col-xs-12 unpadding right-side__option">
                      <div className="col-md-2 col-xs-5 unpadding-left">
                          <img className="img-option" src={variant.src}/>
                      </div>
                      <div className="col-md-4 col-xs-7">
                          <span style={productNameStyle} className="col-md-12 unpadding split-title-product">{variant.product_name}</span>
                          {
                            variant.title != "Default Title"
                            ?
                                <span className="col-md-12 unpadding">
                                    <select className="select-option" name="variants" onChange={this.handleChange}>
                                    {
                                        cartRule.variants.map((variant, j) => {
                                            return <option key={j} value={variant.id_variant}>{variant.title}</option>
                                        })
                                    }
                                    </select>
                                </span>
                            : null
                          }
                      </div>
                      <div className="col-md-6 col-xs-12 unpadding">
                        <div className="col-md-6 col-xs-6 unpadding old-price-wrap">
                          <del><span className="old-price" style={oldPriceStyle}>{displayPrice(variant.price, currency)}</span></del>
                        </div>
                        <div className="col-md-6 col-xs-6 unpadding-right">
                          <span className="new-price" style={newPriceStyle}>
                              {
                                  cartRule.is_main_product == 1
                                  ?
                                      displayPrice(parseFloat(variant.price), currency)
                                  :
                                      displayPrice((parseFloat(variant.price) - (parseFloat(variant.price) * parseFloat(cartRule.reduction_percent))/100), currency)
                              }
                          </span>
                        </div>
                      </div>

                  </div>
                :
                null
                }
            </Fragment>
        )
    }
}
