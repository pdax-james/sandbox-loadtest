'use strict'

const autocannon = require('autocannon')
const { v4: uuidV4 } = require('uuid')
const finishTest = require('./finishTest')

const ENV = 'dev'
const BASE_URL = `https://${ENV}.custody-otc.services.pdax.ph`
const ENDPOINT = '/api/custody/health'
const CONCURRENCY = 1000
const DURATION = 5

console.log("LOADTEST START", Date.now())

const instance = autocannon({
  duration: DURATION,
  connections: CONCURRENCY,
  url: BASE_URL + ENDPOINT,
  method: 'GET'
}, finishTest)

// this is used to kill the instance on CTRL-C
process.once('SIGINT', () => {
  instance.stop()
})

// just render results
autocannon.track(instance, {renderProgressBar: true})