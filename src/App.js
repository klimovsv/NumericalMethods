import React, { Component } from 'react';
import './App.css';
import {Field, Form, Formik} from "formik";
import {Button, Tab} from "semantic-ui-react"
import Validator from "./Validator.js";
import * as math from 'mathjs';
import {CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis} from "recharts"

// комманды для систем
// 10 - пост одн
// 11 - пост неодн
// 12 - непост одн
// 13 - непост неодн

// eslint-disable-next-line
let MyWorker = require("worker-loader!./worker.js");
//
class App extends Component {
  constructor(props){
    super(props);
    this.commands = [10,11,12,13,1];
    this.state = {};
    this.testing()
  }

  testing(){
      const node = math.parse(" ".trim());
      console.log(node);
      console.log(Validator.vilidate_vars(" ",[]))
  }

  componentDidMount() {
      this.worker = new MyWorker();
      this.worker.onmessage = (e) => {
          if(e.data.ok){
              const command = e.data.cmd;
              if (this.commands.includes(command)){
                  this.state[command] = e.data;
                  this.forceUpdate();
              }else{
                  alert("not implemented")
              }
          }else{
              alert(e.data.msg)
          }
      }
  }

  componentWillUnmount() {
    this.worker.terminate();
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
    const panes = [
        {menuItem : "Уравнения с разделяющимися переменными",render : () => (
            <Tab.Pane>
                <div className="App">
                    <Formik initialValues={{start:0}}
                            onSubmit={(values)=>{
                                const exist = (arr) => {
                                    for ( let field of arr){
                                        if (values[field] === undefined) return false;
                                    }
                                    return true
                                };
                                if(exist(['f','g'])){
                                    self.worker.postMessage({...values,cmd:1,mode:2})
                                }else if(exist(['m','n','p','q'])){
                                    self.worker.postMessage({...values,cmd:1,mode:1})
                                }else{
                                    alert(" field errors")
                                }
                            }}
                    >
                        {({errors,touched,values})=>(
                            <Form>
                                <Field type="number" name="start"/>
                                <Field type="m" name="m" placeholder="M(x)" className={
                                    !!errors.m && touched.m? 'input error' : 'text-input'
                                }/>
                                <Field type="n" name="n" placeholder="N(y)" className={
                                    !!errors.n && touched.n? 'input error' : 'text-input'
                                }/>
                                {" dx + "}
                                <Field type="p" name="p" placeholder="P(x)"className={
                                    !!errors.p && touched.p? 'input error' : 'text-input'
                                }/>
                                <Field type="q" name="q" placeholder="Q(y)"className={
                                    !!errors.q && touched.q? 'input error' : 'text-input'
                                }/>
                                {" dy = 0 "}
                                <div className="App">
                                    или
                                </div>
                                {"y' = "}
                                <Field type="f" name="f" placeholder="f(x)"/>
                                <Field type="g" name="g" placeholder="g(y)"/>
                                <div>
                                    {`y(${values.start}) = `}
                                    <Field type="text" name={`start_value`}/>
                                </div>
                                <div>
                                    {`y(x) = `}
                                    <Field type="text" name={`user`}/>
                                </div>
                                <div>
                                    <Button type="submit">
                                        Submit
                                    </Button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </Tab.Pane>
            )
        },
        {menuItem: "Системы с постоянными коэф одн ",render : () => (
                <div className="App">
                    <Formik initialValues={{number:3,vars:['x','y','z'],vals:{},start:0}}
                            onSubmit={(values)=>{
                                // console.log(values);
                                self.worker.postMessage({...values,cmd:10})
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
                                                                        <span key={index*values.number + ind}>
                                                                            <Field type="text" name={`vals.${index}.${ind}`} style={{width:'50px'}}/>
                                                                            {`${values.vars[ind]} `}
                                                                            {ind !== values.number - 1 ? '+ ':''}
                                                                        </span>
                                                                )
                                                            }
                                                        })
                                                    }
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
                    {!!this.state['10'] ?(()=>{
                        const data = this.state['10'];
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
                                    <div className="App">
                                        <LineChart width={730} height={250} data={zipped}
                                                   margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="time" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
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
            )},
        {menuItem: "Системы с постоянными коэф неодн ",render : () => (
                <div className="App">
                    <Formik initialValues={{number:3,vars:['x','y','z'],vals:{},start:0}}
                            onSubmit={(values)=>{
                                console.log(values);
                                self.worker.postMessage({...values,cmd:11})
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
                                                            <span key={index*values.number + values.number}>
                                                                {' + '}
                                                                <Field type="text"
                                                                       name={`vals.${index}.${values.number}`}
                                                                       style={{width:'50px'}}
                                                                       placeholder="f(t)"
                                                                />
                                                            </span>
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
                    {!!this.state['11'] ?(()=>{
                        const data = this.state['11'];
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
                                    <div className="App">
                                        <LineChart width={730} height={250} data={zipped}
                                                   margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="time" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
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
            )},
        {menuItem: "Системы с переменными коэф одн ",render : () => (
                <div className="App">
                    <Formik initialValues={{number:3,vars:['x','y','z'],vals:{},start:0}}
                            onSubmit={(values)=>{
                                // console.log(values);
                                self.worker.postMessage({...values,cmd:10})
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
                                                                        <span key={index*values.number + ind}>
                                                                            <Field type="text" name={`vals.${index}.${ind}`} style={{width:'50px'}}/>
                                                                            {`${values.vars[ind]} `}
                                                                            {ind !== values.number - 1 ? '+ ':''}
                                                                        </span>
                                                                    )
                                                                }
                                                            })
                                                        }
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
                    {!!this.state['10'] ?(()=>{
                        const data = this.state['10'];
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
                                    <div className="App">
                                        <LineChart width={730} height={250} data={zipped}
                                                   margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="time" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
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
            )},
        {menuItem: "Системы с переменными коэф неодн ",render : () => (
                <div className="App">
                    <Formik initialValues={{number:3,vars:['x','y','z'],vals:{},start:0}}
                            onSubmit={(values)=>{
                                console.log(values);
                                self.worker.postMessage({...values,cmd:11})
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
                                                        <span key={index*values.number + values.number}>
                                                                {' + '}
                                                            <Field type="text"
                                                                   name={`vals.${index}.${values.number}`}
                                                                   style={{width:'50px'}}
                                                                   placeholder="f(t)"
                                                            />
                                                            </span>
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
                    {!!this.state['11'] ?(()=>{
                        const data = this.state['11'];
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
                                    <div className="App">
                                        <LineChart width={730} height={250} data={zipped}
                                                   margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="time" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
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
            )}
    ];
    return (
      <div>
          <Tab menu={{ fluid: true, vertical: true, tabular: true }} panes={panes}/>
      </div>
    );
  }
}

export default App;
