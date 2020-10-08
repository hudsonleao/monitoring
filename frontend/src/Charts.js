import React, { Component } from "react";
import Chart from "react-apexcharts";

class App extends Component {
    constructor(props) {
        super(props);

        let token = localStorage.getItem('token');
        let user = localStorage.getItem('username');
        let secret = localStorage.getItem('secret');

        let url;
        if (window.location.host.indexOf("localhost") !== -1) {
            url = "http://localhost:8065/chart/users"
        } else {
            url = "https://api.monitoramos.com.br/chart/users"
        }
        let xhttp = new XMLHttpRequest();
        xhttp.open("GET", url, true);
        xhttp.setRequestHeader('Content-Type', 'application/json');
        xhttp.setRequestHeader('Authorization', `Bearer ${token}`);
        xhttp.setRequestHeader('user', user);
        xhttp.setRequestHeader('secret', secret);


        xhttp.onreadystatechange = function () {
            if (xhttp.readyState === 4 && xhttp.status === 200) {
                let response = xhttp.responseText
                response = JSON.parse(response)
                localStorage.setItem('charts_users', response.users);
                localStorage.setItem('charts_dates', response.dates);
            }
        }
        xhttp.send();

        this.state = {
            options: {
                chart: {
                    id: "new users"
                },
                xaxis: {
                    categories: localStorage.getItem("charts_dates").split(",")
                }
            },
            series: [
                {
                    name: "users created",
                    data: localStorage.getItem("charts_users").split(",")
                }
            ]
        };
    }

    render() {
        return (
            <div className="app">
                <h1>New users</h1>
                <div class="container">
                    <div className="row">
                        <div className="mixed-chart">
                            {window.innerWidth > 500 ? <Chart options={this.state.options} series={this.state.series} type="line" width="1024" height="400" /> : <Chart options={this.state.options} series={this.state.series} type="line" width="390" />}

                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;