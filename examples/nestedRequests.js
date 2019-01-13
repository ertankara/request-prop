const requestProp = require('../src/index');
console.log(requestProp);
const complexArray = [
  {
    Name: 'Jane',
    Age: 26,
    Hobbies: [
      {
        Daily: [
          'read'
        ],
        Weekly: [
          'write'
        ]
      },
    ]
  }
];

const extractedData = requestProp(
  complexArray,
  ['Name: name', 'Hobbies: hobbies'],
  [
    'Hobbies', (h) /* Hobbies will passed automatically providing an alias */ => {
      return requestProp(
        h,
        ['Daily: daily', 'Weekly: weekly']
      );
    }
  ]
);

console.log(JSON.stringify(extractedData));
// [{"name":"Jane","hobbies":[{"daily":["read"],"weekly":["write"]}]}]
