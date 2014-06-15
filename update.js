// I don't want to hose feedly's servers, so don't run this script too much.
var request = require('request'),
    fs = require('fs');

var interests = [
  ['gaming', 'ігри', 'игры'],
  ['architecture', 'архітектура', 'архитектура'],
  ['design', 'дизайн'],
  ['politics', 'політика', 'политика'],
  ['art', 'мистецтво', 'искусство'],
  ['painting', 'живопис', "живопись"],
  ['technology', 'технологія', 'технология'],
  ['writing', 'письменство', 'писательство'],
  ['books', "книги"],
  ['engineering', 'технологія', 'технология', 'техніка', 'техника', 'інжинирінг', 'инжиниринг'],
  ['science', 'наука'],
  ['economics', 'економіка', 'экономика'],
  ['history', 'історія', 'история'],
  ['diy', 'зроби сам', 'сделай сам', 'очумелые ручки'],
  ['cooking', 'кулінарія', 'кулинария'],
  ['movies', 'кіно', 'кино'],
  ['television', 'телебачення', 'телевидение'],
  ['philosophy', 'філософія', 'философия'],
  ['psychology', 'психологія', 'психология'],
  ['sports', 'спорт', 'спорт'],
  ['programming', 'developing', 'html', 'javascript', 'css', 'python', 'програмування', 'программирования']
];

function loadUrls(interestAliases, callback) {
  var urls = [],
      count = interestAliases.length,
      url =  'http://feedly.com/v3/search/feeds';

  interestAliases.forEach(function(interest) {
    request.get({url: url, qs: {q: interest, n: 1000}, json: true}, function(error, response, body) {
      if (!error && response.statusCode === 200 && body.results.length) {
        body.results.forEach(function (result) {
          if('website' in result) {
            urls.push(result.website);
          }
        })
      }
      // if all aliases are loaded
      if (!--count) {
        // process it
        callback(urls);
      }
    });
  });
}

function sortByUrl(interests){
  var byUrl = {};

  for(var key in interests) {
    interests[key].forEach(function (url) {
      byUrl[url] = byUrl[url] || [];
      byUrl[url].push(key);
    })
  }
  return byUrl;
}

function saveSites(urls) {
  fs.writeFile('sites.json', JSON.stringify(urls), function(err) {
    if(err) {
      console.log(err);
    } else {
      console.log('sites.json was saved!');
    }
  });
}

var allInterests = {},
    length = interests.length
    count = length;

interests.forEach(function(interest, i) {
  var key = interest[0];
  console.log('Retrieving %s, (%s / %s)', key, i + 1, length);

  loadUrls(interest, function(urls) {
    allInterests[key] = urls;

    // if all interests are loaded
    if (!--count) {
      // sort interests by url,
      // and save to sites.json
      saveSites(sortByUrl(allInterests));
    }
  });

});
