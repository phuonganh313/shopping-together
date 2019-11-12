import React, { Component } from 'react'
import {debounce, clone, isEqual} from 'lodash'
import classNames from 'classnames'
import moment from 'moment'
import api from './../../api';
import DashboardCharts from "./dashboardCharts"

export default class Dashboard extends Component{
    constructor(){
        super(...arguments);
        let cookies = decodeURIComponent(document.cookie);
        cookies = cookies.split(';');
        for(let value of cookies){
        cookies[value.split('=')[0].trim()] = value.split('=')[1];
        }
        let range = cookies.dashboard_range ? cookies.dashboard_range : 'day';
        this.state = {
            chartWidth: 0,
            range: range,
            loading: true,
            timeFrameChangeType: '',
            disableNextDate: true,
            timeFrame: this.initialTimeFrame(range),
            startDate: this.initialStartDate(range),
            endDate: this.initialEndDate(range),
            dashboardData : {
                day: {},
                week: {},
                month: {}
            },
            dashboardDetail: [],
        };

        this.forceChartsUpdate = debounce(this.forceChartsUpdate, 100);
    }

    initialTimeFrame(range) {
        let timeFrame = moment(new Date()).format('Do MMM YYYY');
        switch (range) {
        case 'week':
            timeFrame = moment().day(1).format('Do MMM YYYY') + ' - ' + moment(new Date()).format('Do MMM YYYY');
            break;
        case 'month':
            let date = new Date(new Date()), y = date.getFullYear(), m = date.getMonth();
            let firstDay = new Date(y, m, 1);
            timeFrame = moment(firstDay).format('Do MMM YYYY') + ' - ' + moment(new Date()).format('Do MMM YYYY');
            break;
        default:
            break;
        }
        return  timeFrame;
    }

    initialStartDate(range) {
        let startDate = moment(new Date()).format();
        switch (range) {
        case 'week':
            startDate = moment().day(1).format();
            break;
        case 'month':
            let date = new Date(new Date()), y = date.getFullYear(), m = date.getMonth();
            let firstDay = new Date(y, m, 1);
            startDate = moment(firstDay).format();
            break;
        default:
            break;
        }
        return startDate;
    }

    componentWillReceiveProps(nextProps){
        if(!isEqual(nextProps.dashboardData, this.dashboardData)){
            this.setState({
                dashboardData: nextProps.dashboardData,
                loading: false
            })
        }
    }

    initialEndDate(range){
        let endDate = moment(new Date()).format();
        switch (range) {
            case 'week':
                endDate = moment(new Date()).format();
                break;
            case 'month':
                endDate = moment(new Date()).format();
                break;
            default:
                break;
        }
        return endDate;
    }

    caculateTimeFrame(range, changeDays, timeFrameChangeType) {
        let timeFrame = moment(new Date()).format('Do MMM YYYY');
        let newStartDate = this.initialStartDate(range);
        let newEndDate = this.initialEndDate(range);
        let doesDisableNextDate = true;
        switch (range) {
            case 'day':
                if (changeDays > 0) {
                    if (timeFrameChangeType == 'up') {
                        timeFrame = moment(this.state.startDate).add(changeDays,'d').format('Do MMM YYYY');
                        newStartDate = moment(this.state.startDate).add(changeDays,'d').format();
                        newEndDate = newStartDate;
                        doesDisableNextDate = moment(new Date()).isSame(moment(this.state.startDate).add(changeDays,'d').format(), 'day');

                    }  else {
                        timeFrame = moment(this.state.startDate).subtract(changeDays,'d').format('Do MMM YYYY');
                        newStartDate = moment(this.state.startDate).subtract(changeDays,'d').format();
                        newEndDate = newStartDate;
                        doesDisableNextDate = false;
                    }
                }
                break;
            case 'week':
                if (changeDays > 0) {
                    if (timeFrameChangeType == 'up') {
                        let endDate = this.state.startDate;
                        if (moment(new Date()).isBefore(moment(this.state.startDate).day(7).add(parseInt(changeDays),'d').format())) {
                            doesDisableNextDate = true;
                            endDate = moment(new Date());
                        } else {
                            doesDisableNextDate = false;
                            endDate =moment(this.state.startDate).day(7).add(changeDays,'d');
                        }
                        timeFrame = moment(this.state.startDate).day(1).add(changeDays,'d').format('Do MMM YYYY') + ' - ' + endDate.format('Do MMM YYYY');
                        newStartDate = moment(this.state.startDate).day(1).add(changeDays,'d').format();
                        newEndDate = endDate.format();
                    } else {
                        timeFrame = moment(this.state.startDate).day(1).subtract(changeDays,'d').format('Do MMM YYYY') + ' - ' + moment(this.state.startDate).day(7).subtract(changeDays,'d').format('Do MMM YYYY');
                        newStartDate = moment(this.state.startDate).day(1).subtract(changeDays,'d').format();
                        newEndDate = moment(this.state.startDate).day(7).subtract(changeDays,'d').format();
                        doesDisableNextDate = false;
                    }
                } else {
                    timeFrame = moment().day(1).format('Do MMM YYYY') + ' - ' + moment(new Date()).format('Do MMM YYYY');
                }
                break;
            case 'month':
                let date = new Date(new Date()), y = date.getFullYear(), m = date.getMonth();
                let firstDay = new Date(y, m, 1);
                if (changeDays > 0) {
                    if (timeFrameChangeType == 'up') {
                        let endDate = this.state.startDate;
                        if (moment(new Date()).isBefore(moment(this.state.startDate).add(1,'M').endOf('month').format())) {
                            endDate = moment(new Date()).format();
                            doesDisableNextDate = true;
                        } else {
                        endDate = moment(endDate).add(1,'M').endOf('month').format();
                        doesDisableNextDate = false;
                        }
                        newStartDate = moment(this.state.startDate).add(1,'M').date(1).format();
                        newEndDate = endDate;
                        timeFrame = moment(this.state.startDate).add(1,'M').date(1).format('Do MMM YYYY') + ' - ' + moment(endDate).format('Do MMM YYYY');
                    } else {
                        timeFrame = moment(this.state.startDate).subtract(1,'M').date(1).format('Do MMM YYYY') + ' - ' + moment(this.state.startDate).subtract(1,'M').endOf('month').format('Do MMM YYYY');
                        newStartDate = moment(this.state.startDate).subtract(1,'M').date(1).format();
                        newEndDate = moment(this.state.startDate).subtract(1,'M').endOf('month').format();
                        doesDisableNextDate = false;
                    }
                } else {
                    timeFrame = moment(firstDay).format('Do MMM YYYY') + ' - ' + moment(new Date()).format('Do MMM YYYY');
                }
                break;
            default:
        }
        this.setState({
            startDate: newStartDate,
            endDate: newEndDate,
            disableNextDate:  doesDisableNextDate,
            timeFrame: timeFrame
        });
        this.setState({
            loading: true,
        })
        this.getData(
            range,
            moment(newStartDate).format('YYYY-MM-DD'),
            this.reportStartDate(range, newStartDate),
            moment(newEndDate).format('YYYY-MM-DD'),
        );
    }

    reportStartDate(range, date) {
        let startDate = this.state.startDate;
        switch (range) {
            case 'day':
            startDate = moment(date).subtract(6, 'd').format('YYYY-MM-DD');
            break;
            case 'week':
            startDate = moment(date).subtract(6, 'w').format('YYYY-MM-DD');
            break;
            case 'month':
            startDate = moment(date).subtract(6, 'M').format('YYYY-MM-DD');
            break;
        }
        return startDate;
    }

    onClickRange(range){
        this.setState({
            range: range
        })
        const expires = "; expires=Fri, 31 Dec 9999 23:59:59 GMT";
        document.cookie = "dashboard_range=" + range + expires;
        this.caculateTimeFrame(range, 0);
    }

    changeTimeFrame(type){
        if (type == 'down') {
        this.setState({
            disableNextDate: false
        });
        }
        let disabled = type == 'down' ? false : this.state.disableNextDate;
        if (!disabled) {
            let changeDays = 0;
            switch (this.state.range) {
                case 'day':
                    changeDays = 1;
                    break;
                case 'week':
                    changeDays = 7;
                    break;
                case 'month':
                    changeDays = 30;
                    break;
                default:
            }
            this.setState({
                timeFrameChangeType: type
            })
            this.caculateTimeFrame(this.state.range, changeDays, type);
        }
    }

    getChartWidth(){
        // ensure this boundary correct with @media query in css
        if(window.innerWidth <= 1200){
            return window.innerWidth - 130 > 450 ? 450 : window.innerWidth - 130;
        }
        const chartsContainer = document.getElementsByClassName('charts')[0];
        if(!chartsContainer) return;
        let width = getComputedStyle(chartsContainer).getPropertyValue('width');
        width = parseFloat(width.substring(0, width.length - 2));
        return width / 4;
    }

    componentDidMount(){
        this.getData();
        window.onresize = () => {
            this.forceChartsUpdate();
        }
    }

    forceChartsUpdate(){
        this.setState({
            chartWidth: this.getChartWidth(),
        })
    }

    async getData (range = null, summaryStartDate = null, startDate = null, endDate = null) {
        const response = await api.getDataDashBoard(
            range ? range : this.state.range,
            summaryStartDate ? summaryStartDate : moment(this.state.startDate).format('YYYY-MM-DD'),
            startDate ? startDate : this.reportStartDate(this.state.range, this.state.startDate),
            endDate ? endDate : moment(this.state.endDate).format('YYYY-MM-DD'),
        );
        const result = JSON.parse(response.text);
        if(result.status){
            let dashboardData = clone(this.state.dashboardData);
            Object.assign(dashboardData, {
                [this.state.range]: result.data.dashboard
            })
            this.setState({
                dashboardData,
                loading: false,
                dashboardDetail: result.data.detail
            })
        }
    }

    componentDidUpdate(){
        if(!this.state.loading && !this.getWidth && this.getChartWidth()){
            this.setState({
                chartWidth: this.getChartWidth(),
            })
            this.getWidth = true;
        }
    }

    componentDidUpdate(){
        if(!this.state.loading && !this.getWidth && this.getChartWidth()){
            this.setState({
                chartWidth: this.getChartWidth(),
            })
            this.getWidth = true;
        }
    }
    render(){
        const {
            chartWidth,
            range,
            loading,
            timeFrame,
            disableNextDate,
            dashboardDetail
        } = this.state;
        const { dashboardData } = this.state;
        const chartHeight = chartWidth * 0.8;
        if(loading) return (
            <div id="page_loading">
                <div className="loading">
                    <i className="fa fa-spinner fa-pulse fa-3x fa-fw margin-bottom" />
                </div>
            </div>
        );
        return (
            <div id="dashboard" className="container-fluid">
                <div className="dashboard-header">
                    <div
                        className={classNames("manage-btn", {active: range == 'day'})}
                        onClick={this.onClickRange.bind(this, 'day')}
                        >
                        {lang.day}
                    </div>
                    <div
                        className={classNames("manage-btn", {active: range == 'week'})}
                        onClick={this.onClickRange.bind(this, 'week')}
                    >
                        {lang.week}
                    </div>
                    <div
                        className={classNames("manage-btn", {active: range == 'month'})}
                        onClick={this.onClickRange.bind(this, 'month')}
                    >
                        {lang.month}
                    </div>
                    <div className="time-frame">
                        <ul className="button-group date-shifter ng-isolate-scope">
                            <li onClick={this.changeTimeFrame.bind(this, 'down')}><i className="fa fa-chevron-left"></i></li>
                            <li>{timeFrame}</li>
                            <li onClick={this.changeTimeFrame.bind(this, 'up')}><i disabled={disableNextDate} className={classNames("fa fa-chevron-right", {disabled: disableNextDate})}></i></li>
                        </ul>
                    </div>
                </div>
                <DashboardCharts
                    data={dashboardData[range]}
                    chartWidth={chartWidth}
                    chartHeight={chartHeight}
                    range={range}
                    dashboardDetail={dashboardDetail}
                />
            </div>
        )
    }
}
