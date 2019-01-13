const requestProp = require('request-prop');

const exampleComplexArrayFromSomeNetworkRequest = [
  { Id: '4466t-5564edd-444yyhh88-bbxbmmcee', Name: 'Marry Poppins', Age: 26, FavLang: 'Python' },
  { Id: '4466t-5564edd-444yyhh88-596ss2q35', Name: 'John Doe', Age: 26, FavLang: 'Rust' },
];

const newArrayWithRequestProp = requestProp(
  exampleComplexArrayFromSomeNetworkRequest, // The raw array to extract data from
  ['Id: id', 'Age: age', 'FavLang: lang', 'Name: nickname'],
  [
    'Age', (age) => age + 10,
    'Id, Name: introduce', (id, name) => `Hello I am ${name}, my id is: ${id}`
  ],
);


const newArrayWithMap = exampleComplexArrayFromSomeNetworkRequest
  .map(el => {
    const { Id, Name, Age, FavLang } = el;

    return {
      id: Id,
      age: Age + 10,
      lang: FavLang,
      nickname: Name,
      introduce: `Hello I am ${Name}, my id is: ${Id}`
    }
  });


console.log(newArrayWithRequestProp);
console.log(newArrayWithMap);
