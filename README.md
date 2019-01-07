# Code
[See the code at github repo](https://github.com/ertankara/request-prop)

# Usage

### Retrieving props from the objects in the array and building new array with

```javascript
var RequestProps = require('request-prop');

const exampleComplexArrayFromSomeNetworkRequest = [
  { Id: '4466t-5564edd-444yyhh88-55ffcjkhh', Name: 'Michael Jackson (the coder one)', Age: 26, FavLang: 'JavaScript' },
  { Id: '4466t-5564edd-444yyhh88-77rr212ss', Name: 'Harry Potter', Age: 26, FavLang: 'Java' },
  { Id: '4466t-5564edd-444yyhh88-bbxbmmcee', Name: 'Marry Poppins', Age: 26, FavLang: 'Python' },
  { Id: '4466t-5564edd-444yyhh88-596ss2q35', Name: 'John Doe', Age: 26, FavLang: 'Rust' },
];

const newArrayWithDesiredProps = RequestProps(
  exampleComplexArrayFromSomeNetworkRequest, // The raw array to extract data from
  ['Id', 'FavLang']
);

// Returns [{Id: '.....', FavLang: '....'}, {...}, {...}, {...}]
```

### Renaming props, changing case style or making it more descriptive

```javascript
const newArrayRenamedProps = RequestProps(
  exampleComplexArrayFromSomeNetworkRequest,
  // The left side of the colon has to match the original name
  ['Id:id', 'FavLang:favLang'] // I'm a camel case lover
);

// Returns [{id: '.....', favLang: '.....'}, {...}, {...}, {...}]
```


### Extracting data out of object itself, not the array
```javascript
const extractDataOutOfObject = RequestProps(
  { Id: '...', Name: '....' },
  ['Id:myId', 'Name:myName']
);
```


### Using modifiers third optional parameter

```javascript
const modifiedProps = RequestProps(
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
RequestProps(
  person,
  // Notice that, first param of modifications array is a whole string
  // Not a seperated params, that might give you a headache
  ['day: DAY', 'month: MONTH', 'year: YEAR'], ['day, month, year:birthday', (day, month, year) => `${day}/${month}/${year}`]
) // Returns -> { DAY: '11', MONTH: '06', birthday: '11/06/1996', YEAR: '1996' }
```

### Using custom rename indication character

```javascript
// The default is `:` but you are able to change
// by simply providing a character as last character
const customRenameIndicator = RequestProps(
  {Name: 'Jane', Lastname: 'Doe'},
  ['Name@name', 'Lastname@lastname'],
  [], // Empty modifications array, to get the last foruth optional
  '@' // Providing the custom rename indication character
);
```
