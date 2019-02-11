export default class WebWorker {
    constructor(worker) {
        const code = worker.toString();
        console.log(code);
        const blob = new Blob(['('+code+')()']);
        return new Worker(URL.createObjectURL(blob));
    }
}
