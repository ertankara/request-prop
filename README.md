# Code
[See the code at github repo](https://github.com/ertankara/request-prop)

# Installation

`npm i request-prop --save`

# Usage

### Retrieving props from the objects in the array and building new array with

```javascript
var requestProps = require('request-prop');

const exampleComplexArrayFromSomeNetworkRequest = [
  { Id: '4466t-5564edd-444yyhh88-55ffcjkhh', Name: 'Michael Jackson (the coder one)', Age: 26, FavLang: 'JavaScript' },
  { Id: '4466t-5564edd-444yyhh88-77rr212ss', Name: 'Harry Potter', Age: 26, FavLang: 'Java' },
  { Id: '4466t-5564edd-444yyhh88-bbxbmmcee', Name: 'Marry Poppins', Age: 26, FavLang: 'Python' },
  { Id: '4466t-5564edd-444yyhh88-596ss2q35', Name: 'John Doe', Age: 26, FavLang: 'Rust' },
];

const newArrayWithDesiredProps = requestProps(
  exampleComplexArrayFromSomeNetworkRequest, // The raw array to extract data from
  ['Id', 'FavLang']
);

// Returns [{Id: '.....', FavLang: '....'}, {...}, {...}, {...}]
```

### Renaming props, changing case style or making it more descriptive

```javascript
const newArrayRenamedProps = requestProps(
  exampleComplexArrayFromSomeNetworkRequest,
  // The left side of the colon has to match the original name
  ['Id:id', 'FavLang:favLang'] // I'm a camel case lover
);

// Returns [{id: '.....', favLang: '.....'}, {...}, {...}, {...}]
```


### Extracting data out of object itself, not the array
```javascript
const extractDataOutOfObject = requestProps(
  { Id: '...', Name: '....' },
  ['Id:myId', 'Name:myName']
);
```


### Using modifiers third optional parameter

```javascript
const modifiedProps = requestProps(
  exampleComplexArrayFromSomeNetworkRequest,
  // To use it in modifiers, it has to exist in the requested props first.
  ['Age:age'],
  // Has to match the original prop name not the modified name
  ['Age', function tenYearsLater(age){ return age + 10 }]
);

// Return [{age: 36}, {...}, {...}, {...}];
```

### Using modifiers that operates on multiple prop
```javascript
const person = {
  day: '11',
  month: '06',
  year: '1996'
}

// If operating on multiple props, the last param, needs to be named
// this name will be prop in the returned object which holds value of
// function's return value, the returned object will also hold all of the
// requested props
requestProps(
  person,
  // Notice that, first param of modifications array is a whole string
  // Not a seperated params, that might give you a headache
  ['day: DAY', 'month: MONTH', 'year: YEAR'], ['day, month, year:birthday', (day, month, year) => `${day}/${month}/${year}`]
) // Returns -> { DAY: '11', MONTH: '06', birthday: '11/06/1996', YEAR: '1996' }
```

### Modifying single element and renaming it

```javascript
const obj = {
  name: 'Jane',
  favLang: 'JavaScript'
};

// Two ways to name props, this is probably straightforward way to do it
const retrunValue = requestProps(
  obj
  ['favLang:getFavLang'],
  ['favLang', (favLang) => () => 'My fav lang is ' + favLang]
)

// Calling it returnValue.getFavLang() => 'My fav lang is JavaScript'

// Implicit way to rename the single prop provided to modifier
const returnValue = requestProps(
  obj,
  ['favLang'],
  // Rule still applies, the left hand side of the colon must equal
  // original prop name,

  // === This one has one perk over the other, you can retrieve ===
  // both prop and the modified version at the same time if you want them both
  ['favLang,:myFav', (favLang) => () => 'My fav lang is ' + favLang]/* Notice that, comma followed by colon */
)

returnValue.myFav() // 'My fav lang is JavaScript'
```


### Using custom rename indication character

```javascript
// The default is `:` but you are able to change
// by simply providing a character as last character
const customRenameIndicator = requestProps(
  {Name: 'Jane', Lastname: 'Doe'},
  ['Name@name', 'Lastname@lastname'],
  [], // Empty modifications array, to get the last foruth optional
  '@' // Providing the custom rename indication character
);
```
