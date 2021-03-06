'use strict';

var Promise = require('bluebird');
var forecast = require('./forecast.js');
var location = require('./location.js');

/**
 * Handles requests when launching the skill
 * @param {Object} request -- Request object from AlexaApp module.
 * @param {Object} response -- Response object from AlexaApp module.
 */
function handleLaunchIntent(request, response) {

}

function handleLocationIntent(request, response) {
  location
    .setLocation(request.sessionDetails.userId, request.slot('location'))
    .then(function () {
      response.say('Location saved!');

      if (request.session('originalRequestData')) {
	var fn = module.exports['handle' + request.session('originalRequestData').name];
	if (fn) {
	  response.say('In ' + request.slot('location'));
	  fn(request, response);
	}
	else {
	  response.send();
	}
      }
      else {
	response.send()
      }
    });
  return false;
}

/**
 * Handles requests when launching the skill
 * @param {Object} request -- Request object from AlexaApp module.
 * @param {Object} response -- Response object from AlexaApp module.
 */
function handleForecast(request, response) {
  forecast
    .fetch(request.sessionDetails.userId, request.slot('location'))
    .catch(function (reason) {
      response
	.shouldEndSession(false)
	.session('originalRequestData', request.data.request.intent)
	.say('You need to save your location first.')
	.say('For example, you could say "my location is Brooklyn New York".')
	.send();
      return Promise.reject();
    })
    .then(function (data) {
      response
	.say(data.temp.speech)
	.say(data.feelsLike.speech)
	.say(data.hourSummary)
	.say(data.daySummary)
	.send();
    });

  return false;
}

/**
 * Handles requests when launching the skill
 * @param {Object} request -- Request object from AlexaApp module.
 * @param {Object} response -- Response object from AlexaApp module.
 */
function handleNowForecast(request, response) {
  forecast
    .fetch(request.sessionDetails.userId, request.slot('location'))
    .catch(function () {
      response.send();
      return Promise.reject();
    })
    .then(function (data) {
      response
	.say(data.temp.speech)
	.say(data.feelsLike.speech)
	.say(data.hourSummary)
	.send();
    });

  return false;
}

/**
 * Handles requests when launching the skill
 * @param {Object} request -- Request object from AlexaApp module.
 * @param {Object} response -- Response object from AlexaApp module.
 */
function handleDayForecast(request, response) {
  forecast
    .fetch(request.sessionDetails.userId, request.slot('location'))
    .catch(function () {
      response.send();
      return Promise.reject();
    })
    .then(function (data) {
      response
	.say(data.daySummary)
	.send();
    });

  return false;
}

/**
 * Handles requests when launching the skill
 * @param {Object} request -- Request object from AlexaApp module.
 * @param {Object} response -- Response object from AlexaApp module.
 */
function handleWeekForecast(request, response) {
  forecast
    .fetch(request.sessionDetails.userId, request.slot('location'))
    .catch(function () {
      response.send();
      return Promise.reject();
    })
    .then(function (data) {
      response
	.say(data.weekSummary)
	.send();
    });

  return false;
}

/**
 * Handles requests for help with the skill.
 * @param {Object} request -- Request object from AlexaApp module.
 * @param {Object} response -- Response object from AlexaApp module.
 */
function handleHelpIntent(request, response) {

}

module.exports = {
  handleLaunchIntent: handleLaunchIntent,
  handleLocationIntent: handleLocationIntent,
  handleForecast: handleForecast,
  handleNowForecast: handleNowForecast,
  handleDayForecast: handleDayForecast,
  handleWeekForecast: handleWeekForecast,
  handleHelpIntent: handleHelpIntent
};
