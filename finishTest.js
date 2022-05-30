'use strict'

module.exports = function finishTest(err, results) {
  if (err) {
    console.error(err)
  } else {
    console.log(results)
  }
  console.log("LOADTEST END", Date.now())
}

//  finishTest
