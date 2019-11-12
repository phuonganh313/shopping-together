import React, { Component } from 'react';
import Setting from './components/setting/setting';
import { Switch, Route } from 'react-router-dom'
import Manage from './components/manage/manage';
import AddRule from './components/manage/addRule/addRule';
import Dashboard from './components/stats/dashboard';
import EditRule from './components/manage/editRule/editRule';

export default class RouterPath extends Component{
    render(){   
        return (
            <Switch>
                <Route exact path={'/'} component={Setting}/>
                <Route exact path={'/home'} component={Setting}/>
                <Route exact path={'/manage'} component={Manage}/>
                <Route exact path={'/stats'} component={Dashboard}/>
                <Route path={'/cart-rule/add'} component={AddRule}/>
                <Route exact path={'/cart-rule/edit/:id?'} component={EditRule} />
            </Switch>
        )
    }
}