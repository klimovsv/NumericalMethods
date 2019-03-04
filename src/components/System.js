import React, { Component } from 'react';
import {Field, Form, Formik} from "formik";
import {Button} from "semantic-ui-react";
import {CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis} from "recharts";

export default class System extends Component{
    constructor(props){
        super(props);
        this.state = props.state;
    }


    zip = (time , values , names) => {
        return time.map((t,i) => {
            const obj = {
                time : t.toFixed(3)
            };
            names.forEach((name,ind) => {
                obj[name] = values[i][ind]
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


    render() {
        const self = this;
        return (
            <div>
                <Formik
                    enableReinitialize
                    initialValues={{number:3,vars:['x','y','z'],vals:{},start:0}}
                        onSubmit={(values)=>{
                            console.log(values);
                            self.props.worker.postMessage({...values,cmd:this.props.cmd,homogeneous:this.props.homogeneous})
                        }}
                        render = {({values,errors,touched})=>{
                            return (
                                <Form >
                                    <Field component="select" name="number">
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                    </Field>
                                    <Field type="number" name="start"/>
                                    {values.vars.map((variable,index) => {
                                        if (index < values.number){
                                            return (
                                                <div key={index}>
                                                    {`${values.vars[index]}' = `}
                                                    {
                                                        values.vars.map((variable,ind) =>{
                                                            if (ind < values.number){
                                                                return (
                                                                    <span key={index*values.number+ ind}>
                                                                            <Field type="text" name={`vals.${index}.${ind}`} style={{width:'50px'}}/>
                                                                        {`${values.vars[ind]} `}
                                                                        {ind !== values.number - 1 ? '+ ':''}
                                                                        </span>
                                                                )
                                                            }
                                                        })

                                                    }
                                                    {!this.props.homogeneous && (
                                                        <span key={index*values.number + values.number}>
                                                            {' + '}
                                                            <Field type="text"
                                                                   name={`vals.${index}.${values.number}`}
                                                                   style={{width:'50px'}}
                                                                   placeholder="f(t)"
                                                            />
                                                        </span>
                                                    )}
                                                    {
                                                        <span>
                                                            {`${values.vars[index]}(${values.start}) = `}
                                                            <Field type="text" name={`vals.start.${index}`}/>
                                                            </span>
                                                    }
                                                </div>
                                            )
                                        }
                                    })}
                                    {values.vars.map((variable,index) => {
                                        if (index < values.number){
                                            return (
                                                <div key={index}>
                                                    {`${values.vars[index]} = `}
                                                    {
                                                        <Field type="text" name={`user.${index}`}/>
                                                    }
                                                </div>
                                            )
                                        }
                                    })}
                                    <Button type="submit">
                                        Submit
                                    </Button>
                                </Form>
                            )
                        }}/>
                {!!this.props.state[this.props.cmd] ?(()=>{
                    const data = this.props.state[this.props.cmd];
                    const time = data.time;
                    const diff = data.diff;
                    const user = data.user;
                    const res = data.result;
                    const number = data.data.number;
                    const conc = this.concat([diff,user,res]);
                    let names = [["dx","x_user","x_computed"],["dy","y_user","y_computed"],["dz","z_user","z_computed"]];
                    names = names.slice(0,number);
                    let new_names = [];
                    for(let i = 0 ; i < 3; i++){
                        names.forEach((name_arr) =>{
                            new_names.push(name_arr[i])
                        })
                    }
                    const zipped = this.zip(time,conc,new_names);
                    return (
                        names.map((name_arr) => {
                            return (
                                <div align="center">
                                    <LineChart width={730} height={250} data={zipped}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="time" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend layout="vertical" align="right" verticalAlign="top"/>
                                        <Line type="linear" dot={false} dataKey={name_arr[0]} stroke="#8884d8" />
                                        <Line type="linear" dot={false} dataKey={name_arr[1]} stroke="#82ca9d" />
                                        <Line type="linear" dot={false} dataKey={name_arr[2]} stroke="#82ca9d" />
                                    </LineChart>
                                </div>
                            )
                        })
                    )
                })() : null}
            </div>
        );
    }
}