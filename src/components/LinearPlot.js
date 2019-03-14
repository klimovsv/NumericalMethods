import {CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis} from "recharts";
import React , {Component} from "react";


export default class LinearPlot extends Component {
    constructor(props){
        super(props);
    }

    linear_zip = (arrays,names,time) => {
        return time.map((t,i) => {
            const obj = {
                time : t.toFixed(3)
            };
            names.forEach((name,ind) => {
                obj[name] = arrays[ind][i]
            });
            return obj
        })
    };
    concat = (arrays) => {
        let newArr = [];
        arrays[0].forEach((cart , i) => {
            newArr.push(arrays.map((arr) => arr[i]).reduce((a,b) => a.concat(b)))
        });
        return newArr
    };

    render(){
        if (!!this.props.state[this.props.cmd]){
            const data = this.props.state[this.props.cmd];
            const time = data.time;
            const diff = data.diff;
            const user = data.user;
            const res = data.result;
            console.log(Math.max.apply(null, diff));
            const conc = [diff,user,res];
            let names = ["dy","y_user","y_computed"];
            const zipped = this.linear_zip(conc,names,time);
            names = [names];
            console.log(zipped);
            return names.map((name_arr) => {
                    return (
                        <div align="center">
                            <LineChart width={730} height={250} data={zipped}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="time" />
                                <YAxis />
                                <Tooltip />
                                <Legend layout="vertical" align="right" verticalAlign="top"/>
                                <Line type="linear" dot={false} dataKey={name_arr[0]} stroke="#00ff00" />
                                <Line type="linear" dot={false} dataKey={name_arr[1]} stroke="#ff0000" />
                                <Line type="linear" dot={false} dataKey={name_arr[2]} stroke="#0000ff" />
                            </LineChart>
                        </div>
                    )
                })
        }
        return null
    }
}