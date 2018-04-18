const baseObject = { a: 12, b: 17, c: -1, d: "apple" }


//const {a, d, ...rest } = baseObject;

//const {a, f, ...rest } = baseObject;

const {a, b, c, ...rest } = baseObject;


console.log(rest);
