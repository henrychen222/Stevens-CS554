const bluebird = require("bluebird");
const flat = require("flat");
const unflatten = flat.unflatten;
const redis = require("redis");
const client = redis.createClient();
const data = require("./data");

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

/* set: Set key to hold the string value. If key already holds a value, it is overwritten, 
        regardless of its type
   get: Get the value of key. If the key does not exist the special value nil is returned
   exist: Returns if key exists.  1: exist    0: not exist
   multi: Marks the start of a transaction block
   exec: Executes all previously queued commands in a transaction and restores the connection state to normal
   mget: Returns the values of all specified keys. 
         For every key that does not hold a string value or does not exist, 
         the special value nil is returned. So, the operation never fails   
   del: Removes the specified keys. A key is ignored if it does not exist.
        Return the number of keys that were removed
   hmset: Sets the specified fields to their respective values in the hash stored at key.
   hincrby: Increments the number stored at field in the hash stored at key by increment
   hgetall: Returns all fields and values of the hash stored at key
*/
const main = async () => {
  let sayHello = await client.setAsync(
    "hello",
    " FROM THE OTHER SIIIIIIIIIIDE"
  );
  let hello = await client.getAsync("hello");
  console.log(`hello, ${hello}`);
  //Output: hello,  FROM THE OTHER SIIIIIIIIIIDE

  let doesHelloExist = await client.existsAsync("hello");
  console.log(`doesHelloExist ? ${doesHelloExist}`);
  //Output: doesHelloExist ? true

  let doesPikachuExist = await client.existsAsync("pikachu");
  console.log(`doesPikachuExist ? ${doesPikachuExist === 1}`);
  //Output: doesHelloExist ? false

  let setResult = await client.setAsync("goodnight", "moon");
  //console.log("setResult ------------------------")
  console.log(setResult);
  //Output: OK

  let batchResult = await client
    .multi()
    .set("favoriteDrink", "coffee")
    .set("favoriteFood", "steak")
    .set("cake", "is a lie")
    .execAsync();
  console.log(batchResult);
  /*
        Output:[ 'OK', 'OK', 'OK' ]
        ['coffee',
         'steak',
         'is a lie',
         'moon',
         ' FROM THE OTHER SIIIIIIIIIIDE']
   */

  let multiResult = await client.mgetAsync(
    "favoriteDrink",
    "favoriteFood",
    "cake",
    "goodnight",
    "hello"
  );
  console.log(multiResult);
  //OUTPUT: OK

  let deleteHello = await client.delAsync("hello");
  console.log(deleteHello);
  //OUTPUT: 1

  doesHelloExist = await client.existsAsync("hello");
  console.log(`doesHelloExist ? ${doesHelloExist === 1}`);
  //OUTPUT: doesHelloExist ? false

  let bio = {
    name: {
      first: "Phil",
      last: "Barresi"
    },
    goal: {
      desc: "TO BE THE VERY BEST, LIKE NO ONE EVER WAS!",
      test: "TO CATCH THEM IS MY REAL TEST -- ",
      cause: "TO TRAIN THEM IS MY CAUUUUUSE!"
    },
    hobbies: ["making coffee", "making low carb recipes", "soccer"],
    "education.college": {
      name: "Stevens"
    },
    "hobbiesAsObject[]": {
      "0": "making coffee",
      "1": "making low carb recipes",
      sport: "soccer"
    },
    age: 24
  };

  let flatBio = flat(bio);
  let hmSetAsyncBio = await client.hmsetAsync("bio", flatBio);
  console.log(hmSetAsyncBio);
  //OUTPUT:OK

  const incrAge = await client.hincrbyAsync("bio", "age", 1);
  console.log(incrAge);
  //OUTPUT:25

  const flatBioFromRedis = await client.hgetallAsync("bio");
  console.log(flatBioFromRedis);
  //OUTPUT
  /*
  { 'name.first': 'Phil',
  'name.last': 'Barresi',
  'goal.desc': 'TO BE THE VERY BEST, LIKE NO ONE EVER WAS!',
  'goal.test': 'TO CATCH THEM IS MY REAL TEST -- ',
  'goal.cause': 'TO TRAIN THEM IS MY CAUUUUUSE!',
  'hobbies.0': 'making coffee',
  'hobbies.1': 'making low carb recipes',
  'hobbies.2': 'soccer',
  'education.college.name': 'Stevens',
  'hobbiesAsObject[].0': 'making coffee',
  'hobbiesAsObject[].1': 'making low carb recipes',
  'hobbiesAsObject[].sport': 'soccer',
   age: '25' }
  */

  const remadeBio = unflatten(flatBioFromRedis);
  console.log(remadeBio);

  //convert json to string 
  const jsonBio = JSON.stringify(bio);
  await client.setAsync("philJsonBio", jsonBio);

  const jsonBioFromRedis = await client.getAsync("philJsonBio");
  const recomposedBio = JSON.parse(jsonBioFromRedis);
  console.log(recomposedBio);
  //OUTPUT
  /*
  { name: { first: 'Phil', last: 'Barresi' },
  goal: 
   { desc: 'TO BE THE VERY BEST, LIKE NO ONE EVER WAS!',
     test: 'TO CATCH THEM IS MY REAL TEST -- ',
     cause: 'TO TRAIN THEM IS MY CAUUUUUSE!' },
  hobbies: [ 'making coffee', 'making low carb recipes', 'soccer' ],
  education: { college: { name: 'Stevens' } },
  'hobbiesAsObject[]': [ 'making coffee', 'making low carb recipes', sport: 'soccer' ],
  age: '25' }
{ name: { first: 'Phil', last: 'Barresi' },
  goal: 
   { desc: 'TO BE THE VERY BEST, LIKE NO ONE EVER WAS!',
     test: 'TO CATCH THEM IS MY REAL TEST -- ',
     cause: 'TO TRAIN THEM IS MY CAUUUUUSE!' },
  hobbies: [ 'making coffee', 'making low carb recipes', 'soccer' ],
  'education.college': { name: 'Stevens' },
  'hobbiesAsObject[]': 
   { '0': 'making coffee',
     '1': 'making low carb recipes',
     sport: 'soccer' },
     age: 24 }

  */

};

main();






// const bluebird = require("bluebird");
// const flat = require("flat");
// const unflatten = flat.unflatten;
// const redis = require("redis");
// const client = redis.createClient();

// bluebird.promisifyAll(redis.RedisClient.prototype);
// bluebird.promisifyAll(redis.Multi.prototype);

// const main = async () => {
//   let sayHello = await client.setAsync(
//     "hello",
//     " FROM THE OTHER SIIIIIIIIIIDE"
//   );
//   let hello = await client.getAsync("hello");
//   console.log(`hello, ${hello}`);

//   let doesHelloExist = await client.existsAsync("hello");
//   console.log(`doesHelloExist ? ${doesHelloExist === 1}`);

//   let doesPikachuExist = await client.existsAsync("pikachu");
//   console.log(`doesPikachuExist ? ${doesPikachuExist === 1}`);

//   let setResult = await client.setAsync("goodnight", "moon");
//   console.log(setResult);

//   let batchResult = await client
//     .multi()
//     .set("favoriteDrink", "coffee")
//     .set("favoriteFood", "steak")
//     .set("cake", "is a lie")
//     .execAsync();
//   console.log(batchResult);

//   let multiResult = await client.mgetAsync(
//     "favoriteDrink",
//     "favoriteFood",
//     "cake",
//     "goodnight",
//     "hello"
//   );
//   console.log(multiResult);

//   let deleteHello = await client.delAsync("hello");
//   console.log(deleteHello);

//   doesHelloExist = await client.existsAsync("hello");
//   console.log(`doesHelloExist ? ${doesHelloExist === 1}`);

//   let bio = {
//     name: {
//       first: "Phil",
//       last: "Barresi"
//     },
//     goal: {
//       desc: "TO BE THE VERY BEST, LIKE NO ONE EVER WAS!",
//       test: "TO CATCH THEM IS MY REAL TEST -- ",
//       cause: "TO TRAIN THEM IS MY CAUUUUUSE!"
//     },
//     hobbies: ["making coffee", "making low carb recipes", "soccer"],
//     "education.college": {
//       name: "Stevens"
//     },
//     "hobbiesAsObject[]": {
//       "0": "making coffee",
//       "1": "making low carb recipes",
//       sport: "soccer"
//     },
//     age: 24
//   };

//   let flatBio = flat(bio);
//   let hmSetAsyncBio = await client.hmsetAsync("bio", flatBio);
//   console.log(hmSetAsyncBio);

//   const incrAge = await client.hincrbyAsync("bio", "age", 1);
//   console.log(incrAge);

//   const flatBioFromRedis = await client.hgetallAsync("bio");
//   console.log(flatBioFromRedis);

//   const remadeBio = unflatten(flatBioFromRedis);
//   console.log(remadeBio);

//   const jsonBio = JSON.stringify(bio);
//   await client.setAsync("philJsonBio", jsonBio);

//   const jsonBioFromRedis = await client.getAsync("philJsonBio");
//   const recomposedBio = JSON.parse(jsonBioFromRedis);
//   console.log(recomposedBio);
// };

// main();




