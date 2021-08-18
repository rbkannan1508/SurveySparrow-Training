// 2. Global Scope and Local Scope
var test = 1;
function foo() {
  var test = 2;
  console.log(test);
}
foo();
console.log(test);
/* Solution: 2
	     1 */
/* Explanation: 
1. The first console corresponds to the function foo, inside the function, this "function block" or "local scope" is scoped with var test = 2, hence in the respective console, it prints the corresponding variable "test", whose value inside the function block is 2.
2. The second console corresponds to the global scope's "test" variable, since the order of precedence of search is from a inner function -> global function, this "test" variable is not present inside a function scope and is present directly inside a global scope. Hnece the result.  */

// 3.Assignments without declarations
function bar() {
  test = 2;
}
bar();
console.log(test);
// How to fix this behavoiur?
/* Solution: 
"use strict";
function bar(){
    test = 2
  }
bar() 
console.log(test); */
/* Explanation:
This creates a variable test, but will be a global scoped variable, since variables declared without initializing variables will be created as global variables by javascript. This can be fixed by adding adding "use strict" above the function which will throw an error when we try to use a variable without declaring it. */

// 4.Closures
var ans = 0;
const base = (value) => (multiple) => value * multiple;
const multiply = base(2);
ans = multiply(5);
console.log(ans);
// Solution: 10
/* Explanation: This example denotes currying of 2 parameters inside the function, the const "multiply" will send the parameter as 2 to base function. Hence now const base = (2) => (mltiple) => 2*multiple. Again the  2nd parameter is passed when multiply(5) is called, now it will be like const base = (2) => (5) => 2*5 which results in 10 */

// 5.Closures & References
function outer(outerP) {
  function inner(innerP) {
    outerP["test"] = innerP;
  }
  return inner;
}
const obj = { b: 1 };
const example = outer(obj);
const answer = example(2);
console.log(obj);
/* Solution: {
    b: 1,
    test: 2
} */
/* Explanation: This is an example of closure where the obj variable is passed as a parameter to the function and that function is curried with variable answer which passes the parameter for the function inner both of which takes the 2 parameter's values and creates an entry for the object test:2. And since the obj is consoled, it will not print {b:1}, it will print the above solution instead because, the object is now modified by address and wherever a specific object is modified, it's source will be altered */

function outer(outerP) {
  function inner(innerP) {
    outerP = innerP;
  }
  return inner;
}

const num = 1;
const example = outer(num);
const answer = example(2);
console.log(num);
// Solution: 1
/* Explanation: The value of outerPis modified to 2. But by the lexical scoping in Closures, the value of console.log(num) is 1, because, in closures, the value of num is searched first in the lexical scope of "console.log(num)", which leads to const num = 1 */

let arr = [1, 2];
function testArray(array) {
  array.push(3);
}
testArray(arr);
console.log(arr);
// Solution: [1,2,3]
/* Explanation: The function is actualy not returning anything, hence the value of arr should have been arr = [1,2]. But arrays similar to objects are modified by address/reference. Hence the value of the array will be altered*/

let arr = [1, 2];
function testArray(array) {
  array = [1, 2, 3];
}
testArray(arr);
console.log(arr);
// Solution: [1,2]
// Explanation: Since the variable names are different here, the value of arr is still the same which is [1,2]

// 6. Context
const carInfo = {
  name: "Tom",
  getName() {
    return this.name;
  },
};
var name = "Biden";
var getCarName = carInfo.getName;
console.log(getCarName());

// 7.Hoisting
console.log(a);
console.log(b);
var a = 2;
let b = 2;
/** Solution: undefined
              Error
 */
/**
 * Explanation: hoisting in simple terms is moving all the variable declarations to the top, here both a and b variables are hoisted.
 * But the difference comes when the variables are initialized. For a, the type is "var". Hence, while hoisting the variable is initialized with undefined and at the preceeding line , it will console undefined. Afte that the value is initialized as 2.
 * But for variable b, since the type is let, eventhough it is hoisted as value undefined, there is a temporal dead zone acting here(the zone btw the undefined valuue and initialization of value b). For let and const variables this leads to an error.
 */

test();
function test() {
  console.log("1");
}
test1();
var test1 = function () {
  console.log("2");
};
/**
 * Solution: 1
 *          Error
 */
/**
 * Explanation: The test() fnction declaration is hoisted even before the declaration, but the function assigned to a named variable test1 will not be hoisted.
 */

// 9.Create a private counter using the concept of closures. The counter should be initialized to zero and return an object which should have two methods one is plus and the other is get. For example usage of our counter function
function counter() {
  var counter = 0;
  return {
    plus: function (increment) {
      counter += increment;
    },
    get: function () {
      return counter;
    },
  };
}
var private1 = counter();
private1.plus(5);
private1.plus(9);

var private2 = counter();
private2.plus(1);
private2.plus(4);

let result1 = private1.get(); // => Count is: 14
let result2 = private2.get(); // => Count is: 5
console.log(result1);
console.log(result2);

// 11.What is the difference between Anonymous and Named functions in Javascript?
// --> Anonymous functions can be used as arguments to other functions, whereas Named functions can't be
// --> Named functions are very helpful in debugging, in knowing which function caused an error, as you will get the function name in the error log.
// --> Anonymous functions are very useful in creating IIFE(Immediately Invoked Function Expression) whereas Named function's cant be.

// 10. When does a non-boolean value in Javascript is coerced to a boolean value?
//  using Boolean(value) will convert a non-boolean value to a boolean.
// E.g., Boolean('test') = true  , Boolean('') = false

// 12. How to create a private method in Javascript?
class School {
  constructor() {
    var lecture = function () {
      // This is not accessible from outside
      console.log("This is not accessible from outside");
    };

    this.listenClass = function () {
      // This is accessible from outside
      lecture();
    };
  }
}
var result = new School();
result.listenClass();
