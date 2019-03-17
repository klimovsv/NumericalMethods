import React, { Component } from 'react';
import './css/App.css';
import './css/slider.css'
// import './css/navbar.css'
import './css/hamburger.css'
import './css/ul.css'
import {Field, Form, Formik} from "formik";
import {Button, Modal, Tab} from "semantic-ui-react"
import Validator from "./Validator.js";
import System from './components/System'
import {  Header, Icon, Image, Menu, Segment, Sidebar , Input } from 'semantic-ui-react'
import LinearPlot from "./components/LinearPlot";
import $ from "jquery";
import * as math from 'mathjs'
import nerdamer from 'nerdamer/nerdamer.core'
import 'nerdamer/Algebra'
import 'nerdamer/Calculus'
import 'nerdamer/Solve'
import 'nerdamer/Extra'

import i21 from './images/2.1.png'
import i22 from './images/2.2.png'
import {CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis} from "recharts";
// комманды для систем
// 2 - однородные урванения
// 1 - разделяющиеся
// 3 - линейные уравнения первого порядка (+ бернулли и рикатти)
// 4 -
// 10 - пост одн
// 11 - пост неодн
// 12 - непост одн
// 13 - непост неодн
// 14 - уравнения n-го порядка
// 14 - уравнения n-го порядка с перемнными коэф
// 15 - разрешенные отн y'

// eslint-disable-next-line
let MyWorker = require("worker-loader!./worker.js");
// eslint-disable-next-line

class App extends Component {
  constructor(props){
    super(props);
    this.commands = [10,11,12,13,1,14,2,3,15,16,17];
    this.state = {visible:false,active:0,length:1,steps:100};
    this.menu();
      this.test();
  }

  valaidate_x = Validator.validate_vars(['x']);

  componentDidMount() {
      this.worker = new MyWorker();
      this.worker.onmessage = (e) => {
          if(e.data.ok){
              const command = e.data.cmd;
              console.log(e.data.cmd);
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


    test = () => {
      // let node = math.parse('2*y*y2 - (y1)^2 - 1');
      // console.log(node.toString());
      // const transformed = node.transform(function (node, path, parent) {
      //     if (node.isSymbolNode && node.name === 'y2') {
      //         const node1 = new math.expression.node.SymbolNode('p');
      //         const node2 = new math.expression.node.SymbolNode('p1');
      //         return new math.expression.node.OperatorNode('*','mul',[node1,node2])
      //     }
      //     if (node.isSymbolNode && node.name === 'y1') {
      //         return new math.expression.node.SymbolNode('p');
      //     }
      //     if (node.isSymbolNode && node.name === 'y3') {
      //         const node1 = new math.expression.node.SymbolNode('p');
      //         const node2 = new math.expression.node.SymbolNode('p1');
      //         const node3 = new math.expression.node.SymbolNode('p2');
      //     }
      //     else {
      //         return node
      //     }
      // });
      // console.log(transformed.toString());
      // let eq = nerdamer(transformed.toString()+"=0");
      // console.log(eq.solveFor("p1").toString())
        console.log(math.eval("pi"))
      // console.log(eq.solveFor('p1').toString())
  };

  componentWillUnmount() {
    this.worker.terminate();
  }

  range = (n) => {
      let r = [];
      for (let i = 0 ; i <n ; i++){
          r.push(i+1)
      }
      return r
  };

    menu() {
        $(window).on('load',function(){
            var height = window.innerHeight,
                x= 0, y= height/2,
                curveX = 10,
                curveY = 0,
                targetX = 0,
                xitteration = 0,
                yitteration = 0,
                menuExpanded = false;

            var blob = $('#blob'),
                blobPath = $('#blob-path'),

                hamburger = $('.hamburger');

            $(this).on('mousemove', function(e){
                x = e.pageX;
                y = e.pageY;
            });

            $('.hamburger, .menu-inner').on('mouseenter', function(){
                $(this).parent().addClass('expanded');
                menuExpanded = true;
            });

            // $(this).on('click',function(){
            //     menuExpanded = false;
            //     $(this).parent().removeClass('expanded');
            // });
            $('.menu-inner').on('mouseleave', function(){
                menuExpanded = false;
                $(this).parent().removeClass('expanded');
            });

            function easeOutExpo(currentIteration, startValue, changeInValue, totalIterations) {
                return changeInValue * (-Math.pow(2, -10 * currentIteration / totalIterations) + 1) + startValue;
            }

            var hoverZone = 150;
            var expandAmount = 20;

            function svgCurve() {
                if ((curveX > x-1) && (curveX < x+1)) {
                    xitteration = 0;
                } else {
                    if (menuExpanded) {
                        targetX = 0;
                    } else {
                        xitteration = 0;
                        if (x > hoverZone) {
                            targetX = 0;
                        } else {
                            targetX = -(((60+expandAmount)/100)*(x-hoverZone));
                        }
                    }
                    xitteration++;
                }

                if ((curveY > y-1) && (curveY < y+1)) {
                    yitteration = 0;
                } else {
                    yitteration = 0;
                    yitteration++;
                }

                curveX = easeOutExpo(xitteration, curveX, targetX-curveX, 100);
                curveY = easeOutExpo(yitteration, curveY, y-curveY, 100);

                var anchorDistance = 200;
                var curviness = anchorDistance - 40;

                var newCurve2 = "M60,"+height+"H0V0h60v"+(curveY-anchorDistance)+"c0,"+curviness+","+curveX+","+curviness+","+curveX+","+anchorDistance+"S60,"+(curveY)+",60,"+(curveY+(anchorDistance*2))+"V"+height+"z";

                blobPath.attr('d', newCurve2);

                blob.width(curveX+60);

                hamburger.css('transform', 'translate('+curveX+'px, '+curveY+'px)');
                window.requestAnimationFrame(svgCurve);
            }

            window.requestAnimationFrame(svgCurve);

        });
    }

  render() {
    const self = this;
    const modals =[
        {
            render : () => {
            return (
                <Modal trigger={<div><Icon name='book' size='small'/>Указания к решению</div>}>
                    <Modal.Header align="center">Уравнения с разделяющимися переменными</Modal.Header>
                    <Modal.Content scrolling>
                        <div align="center"><Image wrapped src={i21}/></div>
                        <div align="center"><Image wrapped src={i22}/></div>
                    </Modal.Content>
                </Modal>
            )
        }
        },
        {
            render : () => {
                return (
                    <Modal trigger={<div><Icon name='book' size='small'/>Указания к решению</div>}>
                        <Modal.Header>Однородные уравнения</Modal.Header>
                        <Modal.Content image scrolling>
                            <Image size='medium' src='https://react.semantic-ui.com/images/wireframe/image.png' wrapped />

                            <Modal.Description>
                                <Header>Modal Header</Header>
                                <p>This is an example of expanded content that will cause the modal's dimmer to scroll</p>
                            </Modal.Description>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button primary>
                                Proceed <Icon name='chevron right' />
                            </Button>
                        </Modal.Actions>
                    </Modal>
                )
            }
        },
        {
            render : () => {
                return (
                    <Modal trigger={<div><Icon name='book' size='small'/>Указания к решению</div>}>
                        <Modal.Header>Линейные уравнения первого порядка</Modal.Header>
                        <Modal.Content image scrolling>
                            <Image size='medium' src='https://react.semantic-ui.com/images/wireframe/image.png' wrapped />

                            <Modal.Description>
                                <Header>Modal Header</Header>
                                <p>This is an example of expanded content that will cause the modal's dimmer to scroll</p>
                            </Modal.Description>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button primary>
                                Proceed <Icon name='chevron right' />
                            </Button>
                        </Modal.Actions>
                    </Modal>
                )
            }
        },
        {
            render : () => {
                return (
                    <Modal trigger={<div><Icon name='book' size='small'/>Указания к решению</div>}>
                        <Modal.Header>Системы с постоянными коэф одн</Modal.Header>
                        <Modal.Content image scrolling>
                            <Image size='medium' src='https://react.semantic-ui.com/images/wireframe/image.png' wrapped />

                            <Modal.Description>
                                <Header>Modal Header</Header>
                                <p>This is an example of expanded content that will cause the modal's dimmer to scroll</p>
                            </Modal.Description>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button primary>
                                Proceed <Icon name='chevron right' />
                            </Button>
                        </Modal.Actions>
                    </Modal>
                )
            }
        },
        {
            render : () => {
                return (
                    <Modal trigger={<div><Icon name='book' size='small'/>Указания к решению</div>}>
                        <Modal.Header>Системы с постоянными коэф неодн</Modal.Header>
                        <Modal.Content image scrolling>
                            <Image size='medium' src='https://react.semantic-ui.com/images/wireframe/image.png' wrapped />

                            <Modal.Description>
                                <Header>Modal Header</Header>
                                <p>This is an example of expanded content that will cause the modal's dimmer to scroll</p>
                            </Modal.Description>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button primary>
                                Proceed <Icon name='chevron right' />
                            </Button>
                        </Modal.Actions>
                    </Modal>
                )
            }
        },
        {
            render : () => {
                return (
                    <Modal trigger={<div><Icon name='book' size='small'/>Указания к решению</div>}>
                        <Modal.Header>Системы с переменными коэф одн</Modal.Header>
                        <Modal.Content image scrolling>
                            <Image size='medium' src='https://react.semantic-ui.com/images/wireframe/image.png' wrapped />

                            <Modal.Description>
                                <Header>Modal Header</Header>
                                <p>This is an example of expanded content that will cause the modal's dimmer to scroll</p>
                            </Modal.Description>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button primary>
                                Proceed <Icon name='chevron right' />
                            </Button>
                        </Modal.Actions>
                    </Modal>
                )
            }
        },
        {
            render : () => {
                return (
                    <Modal trigger={<div><Icon name='book' size='small'/>Указания к решению</div>}>
                        <Modal.Header>Системы с переменными коэф неодн</Modal.Header>
                        <Modal.Content image scrolling>
                            <Image size='medium' src='https://react.semantic-ui.com/images/wireframe/image.png' wrapped />

                            <Modal.Description>
                                <Header>Modal Header</Header>
                                <p>This is an example of expanded content that will cause the modal's dimmer to scroll</p>
                            </Modal.Description>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button primary>
                                Proceed <Icon name='chevron right' />
                            </Button>
                        </Modal.Actions>
                    </Modal>
                )
            }
        },
        {
            render : () => {
                return (
                    <Modal trigger={<div><Icon name='book' size='small'/>Указания к решению</div>}>
                        <Modal.Header>Уравнения n-го порядка с постоянными коэф</Modal.Header>
                        <Modal.Content image scrolling>
                            <Image size='medium' src='https://react.semantic-ui.com/images/wireframe/image.png' wrapped />

                            <Modal.Description>
                                <Header>Modal Header</Header>
                                <p>This is an example of expanded content that will cause the modal's dimmer to scroll</p>
                            </Modal.Description>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button primary>
                                Proceed <Icon name='chevron right' />
                            </Button>
                        </Modal.Actions>
                    </Modal>
                )
            }
        },
        {
            render : () => {
                return (
                    <Modal trigger={<div><Icon name='book' size='small'/>Указания к решению</div>}>
                        <Modal.Header>Уравнения n-го порядка с переменными коэф</Modal.Header>
                        <Modal.Content image scrolling>
                            <Image size='medium' src='https://react.semantic-ui.com/images/wireframe/image.png' wrapped />

                            <Modal.Description>
                                <Header>Modal Header</Header>
                                <p>This is an example of expanded content that will cause the modal's dimmer to scroll</p>
                            </Modal.Description>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button primary>
                                Proceed <Icon name='chevron right' />
                            </Button>
                        </Modal.Actions>
                    </Modal>
                )
            }
        },
        {
            render : () => {
                return (
                    <Modal trigger={<div><Icon name='book' size='small'/>Указания к решению</div>}>
                        <Modal.Header>Уравенния разрешенные относительно y'</Modal.Header>
                        <Modal.Content image scrolling>
                            <Image size='medium' src='https://react.semantic-ui.com/images/wireframe/image.png' wrapped />

                            <Modal.Description>
                                <Header>Modal Header</Header>
                                <p>This is an example of expanded content that will cause the modal's dimmer to scroll</p>
                            </Modal.Description>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button primary>
                                Proceed <Icon name='chevron right' />
                            </Button>
                        </Modal.Actions>
                    </Modal>
                )
            }
        },
        {
            render : () => {
                return (
                    <Modal trigger={<div><Icon name='book' size='small'/>Указания к решению</div>}>
                        <Modal.Header>Нелинейные системы</Modal.Header>
                        <Modal.Content image scrolling>
                            <Image size='medium' src='https://react.semantic-ui.com/images/wireframe/image.png' wrapped />

                            <Modal.Description>
                                <Header>Modal Header</Header>
                                <p>This is an example of expanded content that will cause the modal's dimmer to scroll</p>
                            </Modal.Description>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button primary>
                                Proceed <Icon name='chevron right' />
                            </Button>
                        </Modal.Actions>
                    </Modal>
                )
            }
        },{
            render : () => {
                return (
                    <Modal trigger={<div><Icon name='book' size='small'/>Указания к решению</div>}>
                        <Modal.Header>Уравенния разрешенные относительно y'</Modal.Header>
                        <Modal.Content image scrolling>
                            <Image size='medium' src='https://react.semantic-ui.com/images/wireframe/image.png' wrapped />

                            <Modal.Description>
                                <Header>Modal Header</Header>
                                <p>This is an example of expanded content that will cause the modal's dimmer to scroll</p>
                            </Modal.Description>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button primary>
                                Proceed <Icon name='chevron right' />
                            </Button>
                        </Modal.Actions>
                    </Modal>
                )
            }
        },
        ];
    const panes = [
        {menuItem : "Уравнения с разделяющимися переменными",render : () => (
                <div className="App">
                    <Formik enableReinitialize initialValues={{start:0,m:"",n:"",p:"",q:""}} key={1}
                            onSubmit={(values)=>{
                                const exist = (arr) => {
                                    for ( let field of arr){
                                        if (values[field] === undefined) return false;
                                    }
                                    return true
                                };
                                if(exist(['f'])){
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
                                <div className="App" style={{margin:"20px"}}>
                                    Стартовая точка : {' '} <Field type="number" name="start" style={{width:"50px"}}/>
                                </div>

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
                                <Field type="f" name="f" placeholder="f(x)*g(y)"/>
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
                    <LinearPlot state={this.state} cmd={1}/>
                </div>
            )
        },
        {menuItem : "Однородные уравнения",render : () => (
                <div className="App">
                    <Formik enableReinitialize initialValues={{start:0,m:"",n:""}} key={2}
                            onSubmit={(values)=>{
                                self.worker.postMessage({...values,cmd:2})
                            }}
                    >
                        {({errors,touched,values})=>(
                            <Form>
                                <div className="App" style={{margin:"20px"}}>
                                    Стартовая точка : {' '} <Field type="number" name="start" style={{width:"50px"}}/>
                                </div>
                                <Field type="m" name="m" placeholder="M(x,y)"/>
                                {" dx + "}
                                <Field type="n" name="n" placeholder="N(x,y)"/>
                                {" dy = 0 "}
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
                    <LinearPlot state={this.state} cmd={2}/>
                </div>
            )
        },
        {menuItem : "Линейные уравнения первого порядка",render : () => (
                <div className="App">
                    <Tab menu={{pointing:true}} panes={[
                        {menuItem : "Линейные уравнения первого порядка" , render : () => {
                                return (
                                    <div className="App">
                                        <Formik enableReinitialize initialValues={{start:0,a:"",b:"",user:"",start_value:""}} key={3}
                                                onSubmit={(values)=>{
                                                    self.worker.postMessage({...values,cmd:3,mode:1})
                                                }}
                                        >
                                            {({errors,touched,values})=>(
                                                <Form>
                                                    <div className="App" style={{margin:"20px"}}>
                                                        Стартовая точка : {' '} <Field type="number" name="start" style={{width:"50px"}}/>
                                                    </div>
                                                    {" y' + "}
                                                    <Field type="text" name="a" placeholder="a(x)"/>
                                                    {" y =  "}
                                                    <Field type="text" name="b" placeholder="b(x)"/>
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
                                        <LinearPlot state={this.state} cmd={3}/>
                                    </div>
                                )
                            }},
                        {menuItem : "Уравнение Бернулли" , render : () => {
                                return (
                                    <div className="App">
                                        <Formik enableReinitialize initialValues={{start:0,a:"",b:"",user:"",start_value:"",n:0}} key={3}
                                                onSubmit={(values)=>{
                                                    self.worker.postMessage({...values,cmd:3,mode:2})
                                                }}
                                        >
                                            {({errors,touched,values})=>(
                                                <Form>
                                                    <div className="App" style={{margin:"15px"}}>
                                                        Стартовая точка : {' '} <Field type="number" name="start" style={{width:"50px"}}/>
                                                    </div>
                                                    {" y' + "}
                                                    <Field type="text" name="a" placeholder="a(x)"/>
                                                    {" y =  "}
                                                    <Field type="text" name="b" placeholder="b(x)"/>
                                                    y
                                                    <sup>
                                                        <Field type="number" name="n" style={{height:"15px",width:"35px"}}/>
                                                    </sup>
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
                                        <LinearPlot state={this.state} cmd={3}/>
                                    </div>
                                )
                            }},
                        {menuItem : "Уравнение Рикатти" , render : () => {
                                return (
                                    <div className="App">
                                        <Formik enableReinitialize initialValues={{start:0,a:"",b:"",c:"",user:"",start_value:""}} key={3}
                                                onSubmit={(values)=>{
                                                    self.worker.postMessage({...values,cmd:3,mode:3})
                                                }}
                                        >
                                            {({errors,touched,values})=>(
                                                <Form>
                                                    <div className="App" style={{margin:"15px"}}>
                                                        Стартовая точка : {' '} <Field type="number" name="start" style={{width:"50px"}}/>
                                                    </div>
                                                    {" y' + "}
                                                    <Field type="text" name="a" placeholder="a(x)"/>
                                                    {" y +  "}
                                                    <Field type="text" name="b" placeholder="b(x)"/>
                                                    y<sup>2</sup>=
                                                    <Field type="text" name="c" placeholder="c(x)"/>
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
                                        <LinearPlot state={this.state} cmd={3}/>
                                    </div>
                                )
                            }}
                    ]}/>
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
                    <Tab menu={{pointing:true}} panes={[
                         {menuItem:"Однородные уравнения",render: ()=>{
                             return (
                                 <div>
                                     <Formik enableReinitialize initialValues={{deg:1,start:0, coefs:"",f:"",start_v:{},user:""}} key={14}
                                             onSubmit={(values)=>{
                                                 console.log(values);
                                                 self.worker.postMessage({...values,cmd:14,mode:2})
                                             }}
                                             render = {({values})=>{
                                                 return (
                                                     <Form >
                                                         <div className="App" style={{margin:"20px"}}>
                                                             Порядок уравнения : {' '}
                                                             <Field type="number" name="deg" min="1" max="6"/>
                                                         </div>
                                                         <div className="App" style={{margin:"20px"}}>
                                                             Стартовая точка : {' '} <Field type="number" name="start" style={{width:"50px"}}/>
                                                         </div>
                                                         <div>
                                                             {
                                                                 this.range(values.deg + 1).map(v => {
                                                                     return (
                                                                         <span>
                                                   <Field type="text" name={`coefs.${values.deg-v +1}`} placeholder={`a${v-1}`} style={{width:'50px'}} key={values.deg-v +1}/>
                                                   y<sup>{`(${values.deg-v+1})`}</sup>
                                                                             {(values.deg-v+1) === 0 ? "": "+"}
                                               </span>
                                                                     )
                                                                 })
                                                             }
                                                             {
                                                                 <span>
                                            = 0
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
                                                         <Button type="submit">
                                                             Submit
                                                         </Button>
                                                     </Form>
                                                 )
                                             }}/>
                                     <LinearPlot state={this.state} cmd={14}/>
                                 </div>
                             )
                         }},
                         {menuItem:"Уравения Эйлера",render: ()=>{
                                return (
                                    <div>
                                        <Formik enableReinitialize initialValues={{deg:1,start:0, coefs:"",f:"",start_v:{},user:""}} key={14}
                                                onSubmit={(values)=>{
                                                    console.log(values);
                                                    self.worker.postMessage({...values,cmd:14,mode:3})
                                                }}
                                                render = {({values})=>{
                                                    return (
                                                        <Form >
                                                            <div className="App" style={{margin:"20px"}}>
                                                                Порядок уравнения : {' '}
                                                                <Field type="number" name="deg" min="1" max="6"/>
                                                            </div>
                                                            <div className="App" style={{margin:"20px"}}>
                                                                Стартовая точка : {' '} <Field type="number" name="start" style={{width:"50px"}}/>
                                                            </div>
                                                            <div>
                                                                {
                                                                    this.range(values.deg + 1).map(v => {
                                                                        return (
                                                                            <span>
                                                   <Field type="text" name={`coefs.${values.deg-v +1}`} placeholder={`a${v-1}`} style={{width:'50px'}} key={values.deg-v +1}/>
                                                                                x<sup>{`${values.deg-v+1}`}</sup>
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
                                                            <Button type="submit">
                                                                Submit
                                                            </Button>
                                                        </Form>
                                                    )
                                                }}/>
                                        <LinearPlot state={this.state} cmd={14}/>
                                    </div>
                                )
                            }},
                         {menuItem:"Неоднородные уравнения",render: ()=>{
                                return (
                                    <div>
                                        <Formik enableReinitialize initialValues={{deg:1,start:0, coefs:"",f:"",start_v:{},user:""}} key={14}
                                                onSubmit={(values)=>{
                                                    console.log(values);
                                                    self.worker.postMessage({...values,cmd:14,mode:1})
                                                }}
                                                render = {({values})=>{
                                                    return (
                                                        <Form >
                                                            <div className="App" style={{margin:"20px"}}>
                                                                Порядок уравнения : {' '}
                                                                <Field type="number" name="deg" min="1" max="6"/>
                                                            </div>
                                                            <div className="App" style={{margin:"20px"}}>
                                                                Стартовая точка : {' '} <Field type="number" name="start" style={{width:"50px"}}/>
                                                            </div>
                                                            <div>
                                                                {
                                                                    this.range(values.deg + 1).map(v => {
                                                                        return (
                                                                            <span>
                                                   <Field type="text" name={`coefs.${values.deg-v +1}`} placeholder={`a${v-1}`} style={{width:'50px'}} key={values.deg-v +1}/>
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
                                                            <Button type="submit">
                                                                Submit
                                                            </Button>
                                                        </Form>
                                                    )
                                                }}/>
                                        <LinearPlot state={this.state} cmd={14}/>
                                    </div>
                                )
                            }}
                    ]}/>
                </div>
            )
        },
        {menuItem: "Уравнения n-го порядка с переменными коэф", render: () => (
                <div className="App">
                    <Formik enableReinitialize initialValues={{deg:1,start:0,coefs:"",f:"",start_v:{},user:""}} key={15}
                            onSubmit={(values)=>{
                                console.log(values);
                                self.worker.postMessage({...values,cmd:14,mode:1})
                            }}
                            render = {({values})=>{
                                return (
                                    <Form >
                                        <div className="App" style={{margin:"20px"}}>
                                            Порядок уравнения : {' '}
                                            <Field type="number" name="deg" min="1" max="6"/>
                                        </div>
                                        <div className="App" style={{margin:"20px"}}>
                                            Стартовая точка : {' '} <Field type="number" name="start" style={{width:"50px"}}/>
                                        </div>

                                        <div>
                                            {
                                                this.range(values.deg + 1).map(v => {
                                                    return (
                                                        <span>
                                                   <Field type="text" name={`coefs.${values.deg-v +1}`} placeholder={`f(x)`} style={{width:'50px'}} key={values.deg-v +1}/>
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
                                        <Button type="submit">
                                            Submit
                                        </Button>
                                    </Form>
                                )
                            }}/>
                    <LinearPlot state={this.state} cmd={14}/>
                </div>
            )
        },
        {menuItem : "Уравнения разрешенные относительно y'",render : () => (
                <div className="App">
                    <Formik enableReinitialize initialValues={{start:0,f:""}} key={1}
                            onSubmit={(values)=>{
                                const exist = (arr) => {
                                    for ( let field of arr){
                                        if (values[field] === undefined) return false;
                                    }
                                    return true
                                };
                                if(exist(['f'])){
                                    self.worker.postMessage({...values,cmd:15})
                                }else{
                                    alert(" field errors")
                                }
                            }}
                    >
                        {({errors,touched,values})=>(
                            <Form>
                                <div className="App" style={{margin:"20px"}}>
                                    Стартовая точка : {' '} <Field type="number" name="start" style={{width:"50px"}}/>
                                </div>
                                {"y' = "}
                                <Field type="f" name="f" placeholder="f(x,y)"/>
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
                    <LinearPlot state={this.state} cmd={15}/>
                </div>
            )
        },
        {menuItem : "Нелинейные системы",render : () => (
                <div className="App">
                    <Formik enableReinitialize initialValues={{start:0,f:""}} key={1}
                            onSubmit={(values)=>{
                                self.worker.postMessage({...values,cmd:16})
                            }}
                    >
                        {({errors,touched,values})=>(
                            <Form>
                                <div className="App" style={{margin:"20px"}}>
                                    Стартовая точка : {' '} <Field type="number" name="start" style={{width:"50px"}}/>
                                </div>
                                {"y' = "}
                                <Field type="f" name="f" placeholder="f(x,y,z)"/>
                                {`y(${values.start}) = `}
                                <Field type="text" name={`start_value_y`}/>
                                <div>
                                    {"z' = "}
                                    <Field type="g" name="g" placeholder="g(x,y,z)"/>
                                    {`z(${values.start}) = `}
                                    <Field type="text" name={`start_value_z`}/>
                                </div>
                                <div>
                                    {`y(x) = `}
                                    <Field type="text" name={`user_y`}/>
                                </div>
                                <div>
                                    {`z(x) = `}
                                    <Field type="text" name={`user_z`}/>
                                </div>
                                <div>
                                    <Button type="submit">
                                        Submit
                                    </Button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                    {!!this.state['16'] ?(()=>{
                        const data = this.state['16'];
                        const time = data.time;
                        const diff = data.diff;
                        const user = data.user;
                        const res = data.result;
                        const number = data.data.number;
                        const conc = this.concat([diff,user,res]);
                        let names = [["dy","y_user","y_computed"],["dz","z_user","z_computed"]];
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
            )
        },
        {menuItem : "Кравевая задача",render : () => (
                <div className="App">
                    <Formik enableReinitialize initialValues={{start:"",f:""}} key={1}
                            onSubmit={(values)=>{
                                self.worker.postMessage({...values,cmd:17})
                            }}
                    >
                        {({errors,touched,values})=>(
                            <Form>
                                <div>
                                    <Field type="text" name="a" placeholder="a(x)" validate={this.valaidate_x}
                                        className={errors.a ? 'error' : "input"}/>
                                    {"y'' + "}
                                    <Field type="text" name="p" placeholder="p(x)" />
                                    {"y' + "}
                                    <Field type="text" name="q" placeholder="q(x)"/>
                                    {"y = "}
                                    <Field type="text" name="f" placeholder="f(x)"/>
                                </div>
                                <div>
                                    y(<Field type="text" name="start" placeholder="a"/>) =
                                    <Field type="text" name={`start_value`} placeholder="A"/>
                                    y(<Field type="text" name="end" placeholder="b"/>) =
                                    <Field type="text" name={`end_value`} placeholder="B"/>
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
                    <LinearPlot state={this.state} cmd={17}/>
                </div>
            )
        },
    ];
    const { visible } = this.state;
    return (
        <div>
            <span>
                <span id="menu">
                <div className="hamburger">
                    <div className="line"></div>
                    <div className="line"></div>
                    <div className="line"></div>
                </div>
                <div className="menu-inner">
                    <ul className="myul">
                        {
                            panes.map((pane,i)=>{
                                if (i === this.state.active) {
                                    return( <li className="myli" onClick={()=>{this.setState({active:i})}}><a className="active">{pane.menuItem}</a></li>)
                                }else{
                                    return( <li className="myli" onClick={()=>{this.setState({active:i})}}><a>{pane.menuItem}</a></li>)
                                }
                            })
                        }
                    </ul>
                </div>


                <svg version="1.1" id="blob" xmlns="http://www.w3.org/2000/svg"
                     xlink="http://www.w3.org/1999/xlink">
                    <path id="blob-path" d="M60,500H0V0h60c0,0,20,172,20,250S60,900,60,500z"/>
                </svg>
                </span>
                <div align="center" style={{margin: "auto", width: "50%"}}>
                    <h3>
                        Методические указания к решению обыкновенных дифференциальных уравнений
                    </h3>
                </div>
                <div className="marg">
                    <Menu attached='top' position='right'>
                    <Menu.Menu position='right'>
                        <Menu.Item name='settings' active={visible}>
                        <Modal trigger={<div><Icon name='settings' size='small'/>Настройки</div>}>
                            <h2>Длина отрезка - {this.state.length}</h2>
                            <input type="range" name="len" min="1" max="10" value={this.state.length} step="0.1" className="slider" onChange={(e)=>{
                                this.setState({length:e.target.value});
                                this.worker.postMessage({cmd:0,length:e.target.value})
                            }}/>
                            <h2>Количество шагов - {this.state.steps}</h2>
                            <input type="range" name="steps" min="10" max="200" value={this.state.steps} step="1" className="slider" onChange={(e)=>{
                                this.setState({steps:e.target.value});
                                this.worker.postMessage({cmd:-1,steps:e.target.value})
                            }}/>
                        </Modal>
                    </Menu.Item>
                        <Menu.Item >
                        {modals[this.state.active].render()}
                    </Menu.Item>
                    </Menu.Menu>
                </Menu>
                <div style={{height:"850px"}}>
                    {panes[this.state.active].render()}
                    </div>
                </div>

            </span>
        </div>
    )
  }
}

export default App;
