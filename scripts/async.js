const aliceTumbling = [
    { transform: 'rotate(0) scale(1)' },
    { transform: 'rotate(360deg) scale(0)' }
];

const aliceTiming = {
    duration: 2000,
    iterations: 1,
    fill: 'forwards'
}

const alice1 = document.querySelector("#alice1");
const alice2 = document.querySelector("#alice2");
const alice3 = document.querySelector("#alice3");

//element.animate() 并不返回一个 Promise：它返回一个 Animation 对象，该对象具有一个 finished 属性，这个属性才是 Promise
alice1.animate(aliceTumbling,aliceTiming).finished
    .then(()=>alice2.animate(aliceTumbling,aliceTiming).finished)
    .then(()=>alice3.animate(aliceTumbling,aliceTiming).finished)
    .catch(error=>console.error(`Error animating Alices: ${error}`));