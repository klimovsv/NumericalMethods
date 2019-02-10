import React, { Component } from 'react';
import './App.css';
import { Charts, ChartContainer, ChartRow, YAxis, LineChart } from 'react-timeseries-charts';
import {ErrorMessage, Field, Form, Formik} from "formik";
import worker from "./worker.js"
import WebWorker from "./workerSetup";
import {Button, Header, Icon, Modal, Tab} from "semantic-ui-react"

class App extends Component {
  constructor(props){
    super(props);
  }

  componentDidMount() {
    this.worker = new WebWorker(worker);
    this.worker.onmessage = (e) => {
      if(e.data.ok){
          const command = e.data.cmd
      }else{
          alert(e.data.msg)
      }
    }
  }

  componentWillUnmount() {
    this.worker.terminate();
  }

  render() {
    const self = this;
    const panes = [
        {menuItem : "Уравнения с разделяющимися переменными",render : () => (
            <Tab.Pane>
                <div className="App">
                    <Formik initialValues={{m:'',n:'',p:'',q:''}}
                            onSubmit={(values)=>{
                                // console.log(values,errors);
                                self.worker.postMessage({...values,cmd:1})
                            }}
                            validate={(values) => {
                                let errors = {};
                                const names = ['m','n','q','p'];
                                for(let field of names){
                                    console.log(values[field],field)
                                    if (!(values[field])){
                                        errors[field] = 'Req'
                                    }
                                }
                                console.log(errors)
                                return errors;
                            }}
                    >
                        {({errors,touched})=>(
                            <Form>
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
                                <Button type="submit">
                                    Submit
                                </Button>
                            </Form>
                        )}
                    </Formik>
                </div>
                <div className="App">
                    или
                </div>
                <div className="App">
                    <Formik initialValues={{f:'',g:''}}
                            onSubmit={(values)=>{
                                console.log(values);
                                self.worker.postMessage({...values,cmd:2})
                            }}
                    >
                        {()=>(
                            <Form>
                                {"y' = "}
                                <Field type="f" name="f" placeholder="f(x)"/>
                                <Field type="g" name="g" placeholder="g(y)"/>
                                <Button type="submit">
                                    Submit
                                </Button>
                            </Form>
                        )}
                    </Formik>
                </div>
            </Tab.Pane>
            )
        },
        {menuItem : "Tab 4",render : () => (
          <Tab.Pane>
              <div className="App">
                  Tab 4 content
              </div>
          </Tab.Pane>
      )

        },
        {menuItem: "Системы с постоянными коэф ",render : () => (
                <div className="App">
                    <Formik initialValues={{number:3,vars:['x','y','z'],vals:{}}}
                            onSubmit={(values)=>{
                                console.log(values);
                                self.worker.postMessage({...values,cmd:1})
                            }}
                        render = {({values})=>{
                            return (
                                <Form>
                                    <Field component="select" name="number">
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                    </Field>
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
                                                                            <Field type="text" name={`vals.${index*values.number + ind}`} style={{width:'50px'}}/>
                                                                            {`${values.vars[ind]} `}
                                                                            {ind !== values.number - 1 ? '+ ':''}
                                                                        </span>
                                                                )
                                                            }
                                                        })
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
