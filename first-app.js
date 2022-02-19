console.log('a');
console.log('b');
const data = () => {
    const promise = new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('c');
        },1000);
    });
    return promise;
}

setTimeout(() => {
    data()
    .then(text => {
        console.log(text);
    })
    console.log('d')
, 2000})
    
//return promise1;
//return promise2;
console.log('e');