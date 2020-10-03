import React, { Component } from "react";
import Chart from "react-apexcharts";

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            options: {
                chart: {
                    id: "basic-bar"
                },
                xaxis: {
                    categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999]
                }
            },
            series: [
                {
                    name: "series-1",
                    data: [0, 1, 1, 1, 0]
                }
            ]
        };
    }

    render() {
        return (
            <div className="app">
                <h1>Users</h1>
                <div className="row">
                    <div className="mixed-chart">
                        <Chart
                            options={this.state.options}
                            series={this.state.series}
                            type="line"
                            width="800"
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default App;