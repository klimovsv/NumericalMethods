import React, { Component } from 'react';
import './App.css';
import { Charts, ChartContainer, ChartRow, YAxis, LineChart } from 'react-timeseries-charts';
import {Field, Form, Formik} from "formik";
import worker from "./worker.js"
import WebWorker from "./workerSetup";

class App extends Component {
  constructor(props){
    super(props);
  }

  componentDidMount() {
    this.worker = new WebWorker(worker);
    this.worker.onmessage = (e) => {
      console.log("main",e.data)
    }
  }

  componentWillUnmount() {
    this.worker.terminate();
  }

  render() {
    const self = this;
    return (
      <div className="App">
        <Formik initialValues={{m:'',n:'',p:'',q:''}}
                onSubmit={(values)=>{
                  console.log(values);
                  self.worker.postMessage(values)
                }}
        >
          {()=>(
              <Form>
                  <Field type="m" name="m" placeholder="M(x)"/>
                  <Field type="n" name="n" placeholder="N(y)"/>
                {" dx + "}
                  <Field type="p" name="p" placeholder="P(x)"/>
                  <Field type="q" name="q" placeholder="Q(y)"/>
                {" dy = 0 "}
                <button type="submit">
                  Submit
                </button>
              </Form>
          )}
        </Formik>
      </div>
    );
  }
}

export default App;
