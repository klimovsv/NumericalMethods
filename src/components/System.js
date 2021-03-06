import React, { Component } from 'react';
import {Field, Form, Formik} from "formik";
import {Button} from "semantic-ui-react";
import {CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis} from "recharts";
import Validator from '../Validator'
import styled from "styled-components";


const MyField = styled(Field)`
    margin-left:8px;
    margin-top:5px;
    margin-bottom:5px;
    border:1px solid #001c91;
    border-radius:4px;
    width:100px;
`;

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
                    initialValues={{number:3,vars:['x','y','z'],vals:{},start:0}} key={this.props.cmd}
                        onSubmit={(values)=>{
                            console.log(values);
                            self.props.worker.postMessage({...values,cmd:this.props.cmd,homogeneous:this.props.homogeneous})
                        }}
                        // validate={values=>{
                        //     let errors = {};
                        //     errors.vals = {};
                        //     errors.start = {};
                        //     errors.user = {};
                        //     let added = false;
                        //     for(let i = 0; i < values.number ; i++){
                        //         for (let j = 0; j < values.number ; j++){
                        //             if(!!values.vals[i] && values.vals[i][j]){
                        //                 let validated = Validator.validate_vars('t')(values.vals[i][j]);
                        //                 if (!!validated){
                        //                     added = true
                        //                     errors.vals[i*values.number + j] = validated
                        //                 }
                        //             }
                        //         }
                        //     }
                        //     if (!this.props.homogeneous){
                        //         for(let i = 0; i < values.number ; i++){
                        //             if(!!values.vals[i] && values.vals[i][values.number]) {
                        //                 let validated;
                        //                 if (this.props.cmd === 10 || this.props.cmd === 11){
                        //                     validated = Validator.validate_number(values.vals[i][values.number]);
                        //                 }else{
                        //                     validated = Validator.validate_vars('t')(values.vals[i][values.number]);
                        //                 }
                        //                 // validated = Validator.validate_vars('t')(values.vals[i][values.number]);
                        //                 if (!!validated){
                        //                     added = true;
                        //                     errors.vals[i * values.number + values.number] = validated
                        //                 }
                        //             }
                        //         }
                        //     }
                        //
                        //     for(let i = 0; i < values.number ; i++){
                        //         if(!!values.vals.start && !!values.vals.start[i]) {
                        //             let validated = Validator.validate_number(values.vals.start[i]);
                        //             if (!!validated){
                        //                 added = true;
                        //                 errors.start[i] = validated
                        //             }
                        //         }
                        //     }
                        //
                        //     for(let i = 0; i < values.number ; i++){
                        //         if(!!values.user && !!values.user[i]) {
                        //             let validated = Validator.validate_vars(['t'])(values.user[i]);
                        //             if (!!validated){
                        //                 added = true;
                        //                 errors.user[i] = validated
                        //             }
                        //         }
                        //     }
                        //
                        //     if (!added){
                        //         errors = undefined
                        //     }
                        //     console.log(errors);
                        //     return errors
                        // }}
                        render = {({values,errors,touched})=>{
                            return (
                                <Form >
                                    <div className="App" style={{margin:"15px"}}>
                                        {'Размерность системы : '}
                                        <MyField component="select" name="number">
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                        </MyField>
                                    </div>
                                    <div className="App" style={{margin:"15px"}}>
                                        Стартовая точка : {' '} <MyField type="number" name="start" style={{width:"50px"}}/>
                                    </div>
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
                                                                            <MyField type="text" name={`vals.${index}.${ind}`} style={{width:'50px'}}
                                                                                   className={
                                                                                       !!errors.vals &&
                                                                                       !!errors.vals[index*values.number + ind]? 'input error' : 'text-input'
                                                                                   }/>
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
                                                            {/*{console.log(errors.vals)}*/}
                                                            <MyField type="text"
                                                                   name={`vals.${index}.${values.number}`}
                                                                   style={{width:'50px'}}
                                                                   placeholder="f(t)"
                                                                   className={
                                                                       !!errors.vals &&
                                                                       !!errors.vals[index*(values.number+1) + values.number]? 'input error' : 'text-input'
                                                                   }
                                                            />
                                                        </span>
                                                    )}
                                                    {
                                                        <span>
                                                            {` ,    ${values.vars[index]}(${values.start}) = `}
                                                            <MyField type="text" name={`vals.start.${index}`}
                                                                   className={
                                                                       !!errors.start &&
                                                                       !!errors.start[index]? 'input error' : 'text-input'
                                                                   }/>
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
                                                    {`${values.vars[index]}(t) = `}
                                                    {
                                                        <MyField type="text" name={`user.${index}`}
                                                               className={
                                                                   !!errors.user &&
                                                                   !!errors.user[index]? 'input error' : 'text-input'
                                                               } style={{width:"300px"}}/>
                                                    }
                                                </div>
                                            )
                                        }
                                    })}
                                    <div>
                                        <Button  primary type="submit" style={{margin:"10px"}}>
                                            Посчитать
                                        </Button>
                                    </div>
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
                    console.log(Math.max.apply(null, diff.map(v=>v[0])));
                    console.log(Math.max.apply(null, diff.map(v=>v[1])));
                    console.log(Math.max.apply(null, diff.map(v=>v[2])));
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
                                <div align="center" style={{'font-size':"12pt"}}>
                                    <LineChart width={1000} height={400} data={zipped}>
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
                    )
                })() : null}
            </div>
        );
    }
}