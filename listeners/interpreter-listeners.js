var SauceLabs = require('saucelabs');
var sauceAccount = new SauceLabs({
      username: process.env.SAUCE_USER_NAME,
      password: process.env.SAUCE_API_KEY
});

var util = require('util');

/** se-interpreter listener factory to handle post-test Sauce integration */
exports.getInterpreterListener = function(testRun) {
    return {
        'startTestRun': function(testRun, info) {
            if (info.success) {
                console.log(testRun.name + ": " + "Starting test " +
                            "(" + testRun.browserOptions.browserName +") " +
                            testRun.name);
            } else {
                console.log(testRun.name + ": " + "Unable to start test " +
                            testRun.name + ": " + util.inspect(info.error));
            }
        },
        'endTestRun': function(testRun, info) {
            if (info.success) {
                console.log(util.inspect(info));
                console.log(testRun.name + ": " + "Test passed");
            } else {
                console.log(util.inspect(info));
                if (info.error) {
                    console.log(testRun.name + ": " + "Test failed: " +
                                util.inspect(info.error));
                } else {
                    console.log(testRun.name + ": " + "Test failed ");
                }
            }
        },
        'startStep': function(testRun, step) {
            return;
        },
        'endStep': function(testRun, step, info) {
            name = step.step_name ? step.step_name + " " : "";
            if (info.success) {
                console.log(testRun.name + ": " + "Success " + name +
                            JSON.stringify(step));
            } else {
                if (info.error) {
                    console.log(testRun.name + ": " + "Failed " + name +
                                util.inspect(info.error));
                } else {
                    console.log(testRun.name + ": " + "Failed " + name);
                }
            }
        },
        'endAllRuns': function(num_runs, successes) {
            var message = successes + '/' + num_runs +
                          ' tests ran successfully. Exiting';

            if (num_runs == 0) {
                message = 'No tests found. Exiting.';
            } else if (successes == num_runs) {
                message = message;
            } else {
                message = message;
            }

            console.log(message);
        }
    };
};

