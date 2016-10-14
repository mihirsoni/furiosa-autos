var express = require('express');
var router = express.Router();
var api = require('../lib/api');
const { flatten } = require('../helpers/arrayUtils');
const { sorts } = require('../constants');


/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index');
});

/*
* Task 1:
* Make models alphabetically sortable (ascending, descending, default)
*/
router.get('/models', function(req, res, next) {
	// use api to get models and render output
  api.fetchModels()
  .then((models) => {
    let sort = req.query.sort || '';
    if(sort == 'aesc') {
      models.sort();
    } else if (sort == 'desc') {
      models.sort().reverse();
    }
    res.render('models', { models: models, sorts: sorts, selectedSort: sort })
  })
  .catch((err) => res.render('error'));
});

/*
* Task 2:
* Make services filterable by type (repair, maintenance, cosmetic)
*/
router.get('/services', function(req, res, next) {
	// use api to get services and render output
  api.fetchServices()
  .then((services) => {
    var filters = [];
    services.map((service) => !~filters.indexOf(service.type) ? filters.push(service.type) : '');
    if(req.query.filter) {
      services = services.filter((item) => item.type === req.query.filter)
    }
    res.render('services', { services: services, filters: filters })
  })
  .catch((err) => console.log(err))
});
/*
* Task 3:
* Bugfix: Something prevents reviews from being rendered
* Make reviews searchable (content and source)
*/
router.get('/reviews', function(req, res, next) {
	Promise.all([api.fetchCustomerReviews(), api.fetchCorporateReviews()])
		.then(function(reviews) {
      let allReviews = flatten(reviews);
			res.render('reviews', {reviews: allReviews});
		});
});

router.post('/reviews', function(req, res, next) {
  Promise.all([api.fetchCustomerReviews(), api.fetchCorporateReviews()])
    .then(function(reviews) {
      let allReviews = flatten(reviews);
      const searchText = req.body.search.toLowerCase();
      if(searchText) {
        allReviews = allReviews.filter(
          (item) => ~item.content.toLowerCase().indexOf(searchText)  || ~item.source.toLowerCase().indexOf(searchText));
      }
      res.render('reviews', {reviews: allReviews, searchText: searchText});
    });
});

module.exports = router;
