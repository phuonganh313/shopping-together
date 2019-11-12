import React, { Component, Fragment } from 'react';
import api from './../../api';
import {debounce, clone} from "lodash";
import Pagination from "react-js-pagination";
import { Link } from 'react-router-dom';

export default class Manage extends Component {
    constructor(){
        super(...arguments);
        this.state = {
            rules: [],
            itemsPerPage: '',
            totalItems: '',
            currentPage: '',
            isFetching: true,
            keyWord: '',
            itemsChecked: false,
            idCartRules: [],
            idPriceRules: [],
            status: true,
        }
        this.handlePageChange = this.handlePageChange.bind(this);
        this.onChangeKeyWord = this.onChangeKeyWord.bind(this);
        this.deleteRule = this.deleteRule.bind(this);
        this.onSearchRule = debounce(this.onSearchRule, 500);
        this.selectItems = this.selectItems.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleChangeStatus = this.handleChangeStatus.bind(this);
    }

    componentWillMount () {
        if(this.state.keyWord){
            this.onSearchRule(this.state.keyWord, this.state.currentPage);
        }
        else{
            this.getRulesList(this.state.currentPage);
        }
    }

    async getRulesList (currentPage) {
        const response = await api.getRules(currentPage);
        const result = JSON.parse(response.text);
        if(result.status){
            this.setState({
                itemsPerPage: result.data.items_per_page,
                totalItems: result.data.total_items,
                rules: result.data.items,
                status: this.checkStateStatus(result.data.items),
                currentPage: result.data.current_page,
                isFetching: false,
            });
        }
    }

    async deleteRule (id, idPriceRulesShopify){
        const idCartRules = id ? id : this.state.idCartRules;
        const idPriceRules = idPriceRulesShopify ? idPriceRulesShopify : this.state.idPriceRules;
        this.setState({
            isFetching: true
        });
        try{
            const fetch = await api.deleteRule(idCartRules, idPriceRules);
            const result = JSON.parse(fetch.text);
            if(result.status){
                window.location.replace('/manage');
            }else{
                this.setState({
                    message: result.message,
                    isFetching: false,
                })
            }
        }catch(errors){
            alert(errors.message)
        }
    }

    handlePageChange (currentPage) {
        this.setState({
            isFetching: true
        })
        if(this.state.keyWord){
            this.onSearchRule(this.state.keyWord, currentPage);
        }else{
            this.getRulesList(currentPage);
        }
    }

    onChangeKeyWord (event) {
        this.setState({
            keyWord: event.target.value,
        })
        this.onSearchRule(event.target.value);
    }

    async onSearchRule (keyWord, currentPage = null) {
        this.setState({
            isFetching: true,
        })
        if(keyWord != ''){
            const response = await api.searchRule(keyWord, currentPage);
            const result = JSON.parse(response.text);
            if(result.status){
                this.setState({
                    itemsPerPage: result.data.items_per_page,
                    totalItems: result.data.total_items,
                    rules: result.data.items,
                    status: this.checkStateStatus(result.data.items),
                    currentPage: result.data.current_page,
                    isFetching: false,
                });
            }else{
                this.setState({
                    msg: result.message,
                    rules: '',
                    status: false,
                    itemsPerPage: result.data.items_per_page,
                    totalItems: result.data.total_items,
                    currentPage: result.data.current_page,
                    isFetching: false,
                })
            }
        }else{
            this.getRulesList('');
        }
    }

    checkStateStatus (rules) {
        let checkStateStatus = false;
        rules.map((rule, i) => {
            if (rule.status == true){
                checkStateStatus = true;
            }
        });
        return checkStateStatus;
    }

    async handleChangeStatus (id, status) {
        const {rules} = this.state;
        let statusOption = this.state.status;
        let ids = [];
        this.setState({
            isFetching: true
        });
        if (id) {
            ids = [id];
            if (status ==false) {
                rules.map((rule, i) =>{
                    if(rule.id !== id && rule.status ==false){
                        statusOption = false;
                    }
                })
            } else statusOption = true;
            rules.map((rule, i) => {
                if (rule.id == id){
                    rule.status = status;
                }
            });
        } else {
            statusOption = status;
            rules.map((rule) => {
                rule.status = status;
                ids.push(rule.id);
            }); 
        }
        try {
            const fetch = await api.changeRuleStatus(ids,status);
            const result = JSON.parse(fetch.text);
            if (result.status) {
                this.setState({
                    isFetching: false,
                    rules,
                    status: statusOption ? statusOption : false
                });
            }else{
                this.setState({
                    message: result.message,
                    isFetching: false,
                })
            }
        } catch(errors){
            alert(errors.message)
        }
    } 

    selectItems (e) {
        const {rules, itemsChecked} = this.state;
        let idCartRules = [];
        let idPriceRules = [];
        rules.map((rule) => {
            if(e.target.checked){
                idCartRules.push(rule.id);
                idPriceRules.push(rule.id_price_rule_shopify);
            }
            return Object.assign(rule, {
                is_selected: !this.state.itemsChecked
            })
        });
        this.setState({
            itemsChecked: !itemsChecked,
            idCartRules,
            idPriceRules
        })
    }

    handleClick (idPriceRule, e) {
        const id = parseInt(e.target.value);
        const {rules} = this.state;
        let idCartRules = clone(this.state.idCartRules);
        let idPriceRules = clone(this.state.idPriceRules);
        idPriceRules.indexOf(idPriceRule) >= 0 ? idPriceRules.splice(idPriceRules.indexOf(idPriceRule), 1) : idPriceRules.push(idPriceRule);
        idCartRules.indexOf(id) >= 0 ? idCartRules.splice(idCartRules.indexOf(id), 1) : idCartRules.push(id);
        rules.map((rule) => {
            if(rule.id == id){
                return Object.assign(rule, {
                    is_selected: !rule.is_selected
                })
            }
        });
        this.setState({
            idCartRules,
            rules,
            itemsChecked: false,
            idPriceRules
        })
    }

    render() {
        const {rules, itemsPerPage, totalItems, isFetching, currentPage, keyWord, itemsChecked, status} = this.state;
        console.log(rules);
        if(isFetching){ return (
            <div id="page_loading">
                <div className="loading">
                    <i className="fa fa-spinner fa-pulse fa-3x fa-fw margin-bottom" />
                </div>
            </div>
        )}else {
            return (
                <div>
                    <Link to={'/cart-rule/add'} className="btn btn-sm btn-add_a_new_rule">{lang.add_a_new_rule}</Link>
                    <div className="container table-rule product-search-wrap">
                        <input type="text" className="form-control search-cart-rule" placeholder={lang.search} onChange={this.onChangeKeyWord} value = {keyWord}/>
                    </div>
                    <div className="container table-rule">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>{lang.select}</th>
                                    <th>{lang.name}</th>
                                    <th>{lang.status}</th>
                                    <th>{lang.actions}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    rules.length > 0
                                    ?
                                    <Fragment>
                                        <tr>
                                            <td><input type="checkbox" checked={itemsChecked} onClick={this.selectItems}/></td>
                                            <td>{lang.all}</td>
                                            <td>
                                                <label>
                                                    <input 
                                                        ref="switch" 
                                                        className="glyphicon glyphicon-trash"
                                                        checked={status}
                                                        onClick={e => this.handleChangeStatus(0, !status)}
                                                        className="switch" 
                                                        type="checkbox" 
                                                    />
                                                    <div>
                                                        <div></div>
                                                    </div>
                                                </label>
                                            </td>
                                            <td>
                                                <span 
                                                    className="glyphicon glyphicon-trash"
                                                    onClick={e =>
                                                        itemsChecked===true 
                                                        ?
                                                            window.confirm(lang.are_you_sure_to_delete_all_of_these_rule) && this.deleteRule() 
                                                        : 
                                                            window.confirm(lang.please_tick_the_box_to_select_all_rules) 
                                                    }
                                                />
                                            </td>
                                        </tr>
                                        {rules.map((rule, i)=>(
                                            <tr key={i}>
                                                <td><input checked={rule.is_selected} value={rule.id} type="checkbox" onClick={(event) => this.handleClick(rule.id_price_rule_shopify, event)}/></td>
                                                <td>{rule.name}</td>
                                                <td>
                                                    <label>
                                                        <input ref="switch" className="switch" type="checkbox" onClick={e => this.handleChangeStatus(rule.id, !rule.status)} checked={rule.status == "1"}/>
                                                        <div>
                                                            <div></div>
                                                        </div>
                                                    </label>
                                                </td>
                                                <td>
                                                    <Link  to={'/cart-rule/edit/'+rule.id} className="glyphicon glyphicon-edit"/>
                                                    <span 
                                                        className="glyphicon glyphicon-trash"
                                                        onClick={e => window.confirm(lang.are_you_sure_to_delete_this_rule) && this.deleteRule(rule.id, rule.id_price_rule_shopify)}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </Fragment>
                                    :
                                    null
                                }
                            </tbody>
                        </table>
                        {
                            rules.length > 0
                            ?
                            <Fragment>
                                <div className="pagination-wrap">
                                    <Pagination
                                        activePage={currentPage}
                                        itemsCountPerPage={itemsPerPage}
                                        totalItemsCount={totalItems}
                                        pageRangeDisplayed={5}
                                        onChange={this.handlePageChange}
                                    />
                                </div>
                            </Fragment>
                            :
                            null
                        }
                    </div>
                </div>
            );
        }
    }
}