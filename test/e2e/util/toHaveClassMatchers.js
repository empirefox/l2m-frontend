"use strict";

// 5secs
var maxWaitTimeoutMs = 5000;

/**
 * Custom Jasmine matcher builder that waits for an element to have
 * or not have an html class.
 * @param {String} expectation The html class name
 * @return {Boolean} Returns the expectation result
 *
 * Uses the following object properties:
 * {ElementFinder} this.actual The element to find
 * Creates the following object properties:
 * {String} this.message The error message to show
 * {Error} this.spec.lastStackTrace A better stack trace of user's interest
 */
function toHaveClassFnBuilder(builderTypeBool) {
	return function toHaveClass(clsName) {
		if (clsName == null)
			throw new Error("Custom matcher toHaveClass needs a class name");
		var customMatcherFnThis = this;
		var elmFinder = customMatcherFnThis.actual;
		if (!elmFinder.element)
			throw new Error("This custom matcher only works on an actual ElementFinder.");

		var driverWaitIterations = 0;
		var lastWebdriverError;

		var thisIsNot = this.isNot;
		var testHaveClass = !thisIsNot;
		if (!builderTypeBool) {
			testHaveClass = !testHaveClass;
		}
		var haveOrNot = testHaveClass ? 'have' : 'not to have';
		customMatcherFnThis.message = function message() {
			var msg = (elmFinder.locator().message || elmFinder.locator().toString());
			return "Expected '" + msg + "' to " + haveOrNot + " class " + clsName + ". After " + driverWaitIterations + " driverWaitIterations. Last webdriver error: " + lastWebdriverError;
		};

		// This will be picked up by elgalu/jasminewd#jasmine_retry
		customMatcherFnThis.spec.lastStackTrace = new Error('Custom Matcher');
		function haveClassOrNotError(err) {
			lastWebdriverError = err.toString();
			return false;
		};
		return browser.driver.wait(function() {
			driverWaitIterations++;
			return elmFinder.getAttribute('class').then(function getAttributeClass(classes) {
				var hasClass = classes.split(' ').indexOf(clsName) !== -1;
				if (testHaveClass) {
					lastWebdriverError = 'class present:' + hasClass;
					return hasClass;
				} else {
					lastWebdriverError = 'class absent:' + !hasClass;
					return !hasClass;
				}
			}, haveClassOrNotError);
		}, maxWaitTimeoutMs).then(function(waitResult) {
			if (thisIsNot) {
				// Jasmine 1.3.1 expects to fail on negation
				return !waitResult;
			} else {
				return waitResult;
			}
		}, function(err) {
			// Jasmine 1.3.1 expects to fail on negation
			return thisIsNot;
		});
	};
};

module.exports = {
	toHaveClass : toHaveClassFnBuilder(true),
	toNotHaveClass : toHaveClassFnBuilder(false),
};