# Code
[See the code at github repo](https://github.com/ertankara/request-prop)

# Installation

`npm i request-prop --save`

# Contribute

Contributions are welcome, you can get up and running by cloning the project
and running following command in the CLI

Assuming that you have `node` and `npm` installed

`npm i || npm install`

# Usage

### Retrieving props from the objects in the array and building new array with

```javascript
var requestProp = require('request-prop');

const exampleComplexArrayFromSomeNetworkRequest = [
  { Id: '4466t-5564edd-444yyhh88-55ffcjkhh', Name: 'Michael Jackson (the coder one)', Age: 26, FavLang: 'JavaScript' },
  { Id: '4466t-5564edd-444yyhh88-77rr212ss', Name: 'Harry Potter', Age: 15, FavLang: 'Java' },
  { Id: '4466t-5564edd-444yyhh88-bbxbmmcee', Name: 'Marry Poppins', Age: 46, FavLang: 'Python' },
  { Id: '4466t-5564edd-444yyhh88-596ss2q35', Name: 'John Doe', Age: 24, FavLang: 'Rust' },
];

const newArrayWithDesiredProps = requestProp(
  exampleComplexArrayFromSomeNetworkRequest, // The raw array to extract data from
  ['Id', 'FavLang']
);

// Returns [{Id: '.....', FavLang: '....'}, {...}, {...}, {...}]
```

### Renaming props, changing case style or making it more descriptive

```javascript
const newArrayRenamedProps = requestProp(
  exampleComplexArrayFromSomeNetworkRequest,
  // The left side of the colon has to match the original name
  ['Id:id', 'FavLang:favLang'] // I'm a camel case lover
);

// Returns [{id: '.....', favLang: '.....'}, {...}, {...}, {...}]
```


### Extracting data out of object itself, instead of array
```javascript
const extractDataOutOfObject = requestProp(
  { Id: '...', Name: '....' },
  ['Id: myId', 'Name: myName']
);
```


### Using modifiers third optional parameter

```javascript
const modifiedProps = requestProp(
  exampleComplexArrayFromSomeNetworkRequest,
  // To use it in modifiers, it has to exist in the requested props first.
  ['Age'],
  // Has to match the original prop name not the modified name
  [
    {
      props: ['Age'],
      computedName: 'age', // It will override the prop name in the object
      operator: age => age + 10
    }
  ]
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

requestProp(
  person,
  ['day: DAY', 'month: MONTH', 'year: YEAR'],
  [
    {
      props: ['day', 'month', 'year'], // These prop names need to match requestedProps
      computedName: 'birthday',
      operator: (d, m, y) => `${d}/${m}/${y}`
    }
  ]
) // Returns -> { DAY: '11', MONTH: '06', birthday: '11/06/1996', YEAR: '1996' }
```

### Modifying single element and renaming it

```javascript
const obj = {
  name: 'Jane',
  favLang: 'JavaScript',
};

const retrunValue = requestProp(
  obj
  ['favLang'],
  [
    {
      props: ['favLang'],
      computedName: 'getFavLang',
      operator: f => () => `My fav lang is ${f}`
    }
  ]
)

// Calling it returnValue.getFavLang() => 'My fav lang is JavaScript'
```

### Including only desired props

You may want to use props, but not include them in the returned object
in such case prepend props with `!`

```javascript
const person = {
  name: 'Jane',
  lastname: 'Doe',
  age: 26
};

requestProp(
  person,
  // Appending `!` will exclude them from the returned object
  ['!name', '!lastname'],
  [
    {
      props: ['name', 'lastname'],
      computedName: 'fullname',
      operator: (name, lastname) => `${name} ${lastname}`
    }
  ]
)

// { fullname: 'Jane Doe' } // Doesn't include name and lastname props
// Due to exclamation mark
```

### Using custom rename indication character

```javascript
// The default is `:` but you are able to change
// by simply providing a character as last character
const customRenameIndicator = requestProp(
  {Name: 'Jane', Lastname: 'Doe'},
  ['Name@name', 'Lastname@lastname'],
  [], // Empty modifications array, to get the last foruth optional
  '@' // Providing the custom rename indication character
);
```
