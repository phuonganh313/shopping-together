import React, { Component, Fragment } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid} from 'recharts';
import {forIn, } from 'lodash';
import moment from 'moment';

export default class DashboardCharts extends Component{
    formatCharData(data) {
        const {range} = this.props;
        let chartData = [];
        forIn(data, function(value, key){
            let item = {};
            let formattedDate = range == 'month' ? moment(key*1000).format("MMMM YYYY") : moment(key*1000).format("DD-MM-YYYY");
            item['name'] = formattedDate;
            item['quantity'] = (value);
            chartData.push(item);
        })
        return chartData;
    }

    render(){
        const { chartWidth, chartHeight, data, currency, dashboardDetail } = this.props;
        return(
            <Fragment>
                <div className="charts">
                    {
                        chartWidth > 0
                        ?
                        <div>
                            <h3 className="charts__title">{lang.overview_stats}</h3>
                            <div className="overview-charts">
                                <div className="chart-container">
                                    <div className="chart-header">
                                        <h3>{lang.view}</h3>
                                    </div>
                                  <LineChart width={chartWidth} height={chartHeight} data={this.formatCharData(data.views)} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                      <Line type="monotone" dataKey="quantity" stroke="#8884d8" label={false}/>
                                      <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                                      <XAxis dataKey="name" tickLine={false} tick={false}/>
                                      <YAxis />
                                      <Tooltip />
                                  </LineChart>
                                </div>
                                <div className="chart-container">
                                    <div className="chart-header">
                                        <h3>{lang.add_to_cart}</h3>
                                    </div>
                                    <LineChart width={chartWidth} height={chartHeight} data={this.formatCharData(data.add_to_cart)} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                        <Line type="monotone" dataKey="quantity" stroke="#8884d8" label={false}/>
                                        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                                        <XAxis dataKey="name" tickLine={false} tick={false}/>
                                        <YAxis />
                                        <Tooltip />
                                    </LineChart>
                                </div>
                                <div className="chart-container">
                                    <div className="chart-header">
                                        <h3>{lang.orders}</h3>
                                    </div>
                                    <LineChart width={chartWidth} height={chartHeight} data={this.formatCharData(data.orders)} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                        <Line type="monotone" dataKey="quantity" stroke="#8884d8" label={false}/>
                                        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                                        <XAxis dataKey="name" tickLine={false} tick={false}/>
                                        <YAxis />
                                        <Tooltip />
                                    </LineChart>
                                </div>
                                <div className="chart-container">
                                    <div className="chart-header">
                                        <h3>{lang.revenue}</h3>
                                    </div>
                                    <LineChart width={chartWidth} height={chartHeight} data={this.formatCharData(data.revenues)} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                        <Line type="monotone" dataKey="quantity" stroke="#8884d8" label={false}/>
                                        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                                        <XAxis dataKey="name" tickLine={false} tick={false}/>
                                        <YAxis />
                                        <Tooltip />
                                    </LineChart>
                                </div>
                            </div>
                        </div>
                        :
                        null
                    }
                </div>
                <div className="container-fluid table-detail">
                    <h3 className="table-detail__title">{lang.detailed_stats}</h3>
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>{lang.name}</th>
                                <th>{lang.view}</th>
                                <th>{lang.add_to_cart}</th>
                                <th>{lang.orders}</th>
                                <th>{lang.revenue}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dashboardDetail.map((value, i)=>(
                                <tr key={i}>
                                    <td>{value.name}</td>
                                    <td>{value.total_view}</td>
                                    <td>{value.total_add_to_cart}</td>
                                    <td>{value.total_order}</td>
                                    <td>{value.total_sale}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Fragment>
        );
    }
}
