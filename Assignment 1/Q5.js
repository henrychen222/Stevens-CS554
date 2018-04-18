const first = {

  x: 12,

  z: "batman"

};

 

const second = {

  f: 16,

  z: "panda"

}

 

const third = {

  y: 17,

  z: "zubat"

}

//const result = { ...third, ...first, ...second }

//const result = { ...first, ...second, ...third }

const result = { ...second, ...first, ...third }


console.log(result);



