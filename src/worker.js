export default () =>{
    onmessage = (e) => {
        const command = e.data.cmd;
        switch (command) {
            case 1:
                postMessage({ok:true,msg:"success",cmd : command});
                break;
            default:
                postMessage({ok:false,msg:"unsupported command",cmd: command})
        }
    };
}