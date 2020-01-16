# Search thingy

To use run the 'bind' function, which takes three args:

```bind(theSearchQuery, [{jsonObjectOfDBInfo: true, anyExtraThingsNeeded: [{answer:yes, whatYouNeed:[{ifDBentryIsProject:'add "type:project"'},{ifDBentryIsUser:'add "type:user"'}]}]}], amountOfHitsOnAPage, pageNumToShow = 29)```

For example:

```
bind("paIGn", [
  { _id : "5a82a82a7790e3001465e6da", user : "paignpast", title : "Sexier", identifier : "grumpy-sexier-crib", description : "This project sees how Bootstrap makes button groups responsive.", privacy : "1", trending : 3.258096538021482, views : 4, likes : [ ], comments : [], timestamp : 1518512170201, nominated : false, type: "project" },
  { _id : "5a82a82a7790e3001465e6da", user : "paignpast", title : "Paign", identifier : "chicken-cow-pig", description : "This project sees how Bootstrap makes button groups responsive.", privacy : "1", trending : 3.258096538021482, views : 4, likes : [ ], comments : [], timestamp : 1518512170201, nominated : false, type: "project" },
  { _id : "5a82a82a7790e3001465e6da", user : "paignpast", title : "paignpast", identifier : "chocolate-candy-sweets", description : "This project sees how Bootstrap makes button groups responsive.", privacy : "1", trending : 3.258096538021482, views : 4, likes : [ ], comments : [], timestamp : 1518512170201, nominated : false, type: "project" },
  { _id : "5a7cb274ab7c93003696e48f", username : "paignpast", name : "Pal Kerecsenyi", country : "GB", gender : "male", algolia : null, followers : [ ], following : [ ], bio : "I made CodeDragon with 3 other people. github.com/codeddraig/ffau", perms : 1, token : "87646}6cRc::gg", tutorial: 2, type:"user"},
  { _id : "5a7cb274ab7c93003696e48f", username : "paignpast", name : "Pal Kerecsenyi", country : "GB", gender : "male", algolia : null, followers : [ ], following : [ ], bio : "I made CodeDragon with 3 other people. github.com/codeddraig/ffau", perms : 1, token : "87646}6cRc::gg", tutorial: 2, type:"user"}
], 4, 0));
```

would return

```
{ success: true,
  properties: 
   { totResults: 5,
     hitsPerPage: 4,
     term: 'paIGn',
     page: 0,
     results: 4 },
  results: 
   [ { username: 'paignpast',
       name: 'Pal Kerecsenyi',
       bio: 'I made CodeDragon with 3 other people. github.com/codeddraig/ffau',
       _id: '5a82a82a7790e3001465e6da',
       type: 'user' },
     { username: 'paignpast',
       name: 'Pal Kerecsenyi',
       bio: 'I made CodeDragon with 3 other people. github.com/codeddraig/ffau',
       _id: '5a82a82a7790e3001465e6da',
       type: 'user' },
     { description: 'This project sees how Bootstrap makes button groups responsive.',
       title: 'Paign',
       _id: '5a82a82a7790e3001465e6da',
       type: 'project' },
     { description: 'This project sees how Bootstrap makes button groups responsive.',
       title: 'paignpast',
       _id: '5a82a82a7790e3001465e6da',
       type: 'project' } ] }
```

After that, one can further switch page by using `switchPage(pageNumberWanted)` (note that this counts from 0). If, for some reason, you do need to see all of the results, do `switchPage(listAll)` (note the lack of speech marks). For the next page, do `switchPage(next)` and to see the previous page do `switchPage(prev)`.

Great, that's all. Now use it.
