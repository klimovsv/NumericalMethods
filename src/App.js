import React, { Component } from 'react';
import './App.css';
import {Field, Form, Formik} from "formik";
import worker from "./worker.js"
import WebWorker from "./workerSetup";
import {Button, Tab} from "semantic-ui-react"

// eslint-disable-next-line
let MyWorker = require("worker-loader!./worker.js");
//
class App extends Component {
  constructor(props){
    super(props);
  }

  componentDidMount() {
      this.worker = new MyWorker();
    // this.worker = new WebWorker(worker);
    this.worker.onmessage = (e) => {
      if(e.data.ok){
          const command = e.data.cmd;
          switch (command) {
              case 3:
                  break;
              default:
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
                    <Formik initialValues={{number:3,vars:['x','y','z'],vals:{},start:0}}
                            onSubmit={(values)=>{
                                console.log(values);
                                self.worker.postMessage({...values,cmd:3})
                            }}
                        render = {({values})=>{
                            return (
                                <Form>
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
