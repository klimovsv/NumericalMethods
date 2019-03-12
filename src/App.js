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

import i21 from './images/2.1.png'
import i22 from './images/2.2.png'
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

// eslint-disable-next-line
let MyWorker = require("worker-loader!./worker.js");


class App extends Component {
  constructor(props){
    super(props);
    this.commands = [10,11,12,13,1,14,2,3];
    this.state = {visible:false,active:0,length:1,steps:100};
    this.menu()
  }


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

    handleShowClick = () => this.setState({ visible: true })
    handleSidebarHide = () => this.setState({ visible: false })



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

  render() {
    const self = this;
    const modals =[
        {
            render : () => {
            return (
                <Modal trigger={<div><Icon name='book' size='small'/>Approach</div>}>
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
                    <Modal trigger={<div><Icon name='book' size='small'/>Approach</div>}>
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
                    <Modal trigger={<div><Icon name='book' size='small'/>Approach</div>}>
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
                    <Modal trigger={<div><Icon name='book' size='small'/>Approach</div>}>
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
                    <Modal trigger={<div><Icon name='book' size='small'/>Approach</div>}>
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
                    <Modal trigger={<div><Icon name='book' size='small'/>Approach</div>}>
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
                    <Modal trigger={<div><Icon name='book' size='small'/>Approach</div>}>
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
                    <Modal trigger={<div><Icon name='book' size='small'/>Approach</div>}>
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
                    <Modal trigger={<div><Icon name='book' size='small'/>Approach</div>}>
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
                    <Modal trigger={<div><Icon name='book' size='small'/>Approach</div>}>
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
                                <Field type="number" name="start"/>
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
                                                    <div className="App">
                                                        <Field type="number" name="start"/>
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
                                                    <div className="App">
                                                        <Field type="number" name="start"/>
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
                                                    <div className="App">
                                                        <Field type="number" name="start"/>
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
                    <Formik enableReinitialize initialValues={{deg:1,start:0, coefs:"",f:"",start_v:{},user:""}} key={14}
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
                                    </Form>
                                )
                            }}/>
                    <LinearPlot state={this.state} cmd={14}/>
                </div>
            )
        },
        {menuItem: "Уравнения n-го порядка с переменными коэф", render: () => (
                <div className="App">
                    <Formik enableReinitialize initialValues={{deg:1,start:0,coefs:"",f:"",start_v:{},user:""}} key={15}
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
                                    </Form>
                                )
                            }}/>
                    <LinearPlot state={this.state} cmd={14}/>
                </div>
            )
        }
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
                        <Modal trigger={<div><Icon name='settings' size='small'/>Settings</div>}>
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
