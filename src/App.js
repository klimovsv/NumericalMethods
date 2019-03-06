import React, { Component } from 'react';
import './App.css';
import {Field, Form, Formik} from "formik";
import {Button, Tab} from "semantic-ui-react"
import Validator from "./Validator.js";
import * as math from 'mathjs';
import {CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis} from "recharts"
import System from './components/System'
import {  Header, Icon, Image, Menu, Segment, Sidebar } from 'semantic-ui-react'

// комманды для систем
// 10 - пост одн
// 11 - пост неодн
// 12 - непост одн
// 13 - непост неодн
// 14 - уравнения deg-го порядка

// eslint-disable-next-line
let MyWorker = require("worker-loader!./worker.js");
//
class App extends Component {
  constructor(props){
    super(props);
    this.commands = [10,11,12,13,1];
    this.state = {visible:false,active:0};
    this.testing()
  }
    validateX = Validator.validate_vars(['x']);
    validateY = Validator.validate_vars(['y']);

    handleHideClick = () => this.setState({ visible: false })
    handleShowClick = () => this.setState({ visible: true })
    handleSidebarHide = () => this.setState({ visible: false })

  testing(){
          const node = math.parse("3+-2".trim());
        console.log(node);
        console.log(node.eval())
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

  range = (n) => {
      let r = [];
      for (let i = 0 ; i <n ; i++){
          r.push(i+1)
      }
      return r
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
                <div className="App">
                    <Formik enableReinitialize initialValues={{start:0,m:"",n:"",p:"",q:""}}
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
                                <Field type="q" name="q" placeholder="Q(y)" className={
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
            )
        },
        {menuItem: "Системы с постоянными коэф одн ",render : () => (
                <div className="App">
                    <System worker={this.worker} cmd={10} homogeneous={true} state={this.state}/>
                </div>
            )},
        {menuItem: "Системы с постоянными коэф неодн ",render : () => (
                <div className="App">
                    <System worker={this.worker} cmd={11} homogeneous={false} state={this.state}/>
                </div>
            )},
        {menuItem: "Системы с переменными коэф одн ",render : () => (
                <div className="App">
                    <System worker={this.worker} cmd={12} homogeneous={true} state={this.state}/>
                </div>
            )},
        {menuItem: "Системы с переменными коэф неодн ",render : () => (
                <div className="App">
                    <System worker={this.worker} cmd={13} homogeneous={false} state={this.state}/>
                </div>
            )},
        {menuItem: "Уравнения n-го порядка с постоянными коэф", render: () => (
            <div className="App">
                <Formik enableReinitialize initialValues={{deg:1,start:2}}
                        onSubmit={(values)=>{
                            console.log(values);
                            self.worker.postMessage({...values,cmd:14})
                        }}
                        render = {({values})=>{
                            return (
                                <Form >
                                    <Field type="number" name="deg" min="1" max="6"/>
                                    <Field type="number" name="start"/>
                                    <Button type="submit">
                                        Submit
                                    </Button>
                                        <div>
                                            {
                                                this.range(values.deg + 1).map(v => {
                                                    return (
                                                        <span>
                                                   <Field type="text" name={`coefs.${values.deg-v +1}`} placeholder={`f(x)`} style={{width:'50px'}}/>
                                                   y<sup>{`(${values.deg-v+1})`}</sup>
                                                            {(values.deg-v+1) === 0 ? "": "+"}
                                               </span>
                                                    )
                                                })
                                            }
                                            {
                                                <span>
                                            =
                                            <Field type="text" placeholder={"f(x)"} name="f"/>
                                        </span>
                                            }
                                        </div>
                                    {
                                        this.range(values.deg).map(v => {
                                            return (
                                                <div>
                                                    {`y`}<sup>{`(${v - 1})`}</sup>
                                                    {`(${values.start})=`}
                                                    <Field type="text"   name={`start_v.${v - 1}`}/>
                                                </div>
                                            )
                                        })
                                    }
                                    <div>
                                        y(x)=
                                        <Field type="text" name='user'/>
                                    </div>
                                </Form>
                            )
                        }}/>
            </div>
            )
        }
    ];
    const { visible } = this.state;
    return (
      <div>
          <Sidebar.Pushable as={Segment}>
              <Sidebar
                  as={Menu}
                  animation='overlay'
                  icon='labeled'
                  inverted
                  onHide={this.handleSidebarHide}
                  vertical
                  visible={visible}
                  width='wide'
              >
                  {panes.map((pane, i) => {
                      return (
                          <Menu.Item as='a'
                            onClick={()=>{
                                this.setState({active:i})
                            }}>
                              {pane.menuItem}
                          </Menu.Item>
                      )
                  })}
              </Sidebar>

              <Sidebar.Pusher>
                  <Segment basic style={{height:"900px"}}>

                      <Button.Group>
                          <Button icon disabled={visible} onClick={this.handleShowClick}>
                              <Icon name='bars' size='huge'/>
                          </Button>
                      </Button.Group>
                      {panes[this.state.active].render()}
                  </Segment>
              </Sidebar.Pusher>
          </Sidebar.Pushable>


      </div>
    );
  }
}

export default App;
