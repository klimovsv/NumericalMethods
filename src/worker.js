

export default () =>{
    onmessage = (e) => {
        console.log("worker",e.data);
        postMessage("back msg")
    };
}