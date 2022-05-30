'use strict'

const autocannon = require('autocannon')
const { v4: uuidV4 } = require('uuid')
const finishTest = require('./finishTest')

const ENV = 'dev'
const AUTH_TOKEN = 'eyJraWQiOiIyVXF6cXVtRCtXaFh0MUR5eDlCcnI4ck5YM05sbkFhSVpSbVwvanpZaDBTcz0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiI0MzI0NTY2Yy0xMDgwLTQ5MTktOTlhYS00YzAyZmVlNDVmMzciLCJjb2duaXRvOmdyb3VwcyI6WyJpbW1fdHJhZGVyIl0sImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC5hcC1zb3V0aGVhc3QtMS5hbWF6b25hd3MuY29tXC9hcC1zb3V0aGVhc3QtMV93djY4a1dBSWMiLCJjbGllbnRfaWQiOiI0cmt1bzFmaGtqbThrcXI1bnBxaWJvcnVvIiwib3JpZ2luX2p0aSI6ImZmYjUzMTBhLWZlMTQtNGY1My1hYjY4LThlYzQ2NzU0YmQxZiIsImV2ZW50X2lkIjoiZjdmMjI0ZjctZmRjMS00YmI5LWE0YTktNmNmOTEwMjNmMmQwIiwidG9rZW5fdXNlIjoiYWNjZXNzIiwic2NvcGUiOiJhd3MuY29nbml0by5zaWduaW4udXNlci5hZG1pbiIsImF1dGhfdGltZSI6MTY1MzYxNzUzNSwiZXhwIjoxNjUzNjIxMTM1LCJpYXQiOjE2NTM2MTc1MzUsImp0aSI6ImY3OTk0NzZiLTAzMzEtNDBlOS1hMDgxLTE4MGFkNWQ3MWZlZiIsInVzZXJuYW1lIjoiNDMyNDU2NmMtMTA4MC00OTE5LTk5YWEtNGMwMmZlZTQ1ZjM3In0.tAsZqzbFD7NkscHn-tOOQVrYVZbglCD4nHOPncI4UymDWi2Ug4ZbMjSXB1_RkvaDE615a69iJBU0JLYFP4teVsTNiuco4Mxkq-U6-GSrYGHEKg1YWmivtua2_zQnlnCguGy1x_dm4vqIuSYcVBa48_Zz55MQdDgPXsdIYM6kndoQfEEKWDAymMcJgD2m-eg2rQMucb_JPp3nR6wFOGtK3dwWmU-ir8_TqeeSv6xxV16I4znAyv2Qv04GaW65rZH4MTekBG0Nj5olcTvxTlpkgrG5uxdRxtkXIQGD-CEG76s-nO_nK64atKw17eraNaQx2y_cIwpzVURVfobOBBPVbA'
const ASSET = 'ETH_TEST'
const SERVICE_CLIENT_REFERENCE = 'custody-otc'


const BASE_URL = `https://${ENV}.custody-otc.services.pdax.ph`
const ENDPOINT = '/api/custody/v2/account/create'
const LOAD = 1000
const DURATION = 10 // sec
const TIMEOUT = 30 // sec

console.log("LOADTEST START", Date.now())

const HIDDEN_ACCOUNT_NAME = 'loadtestdummyaccount'

const instance = autocannon({
  timeout: TIMEOUT,
  amount: LOAD,
  connections: LOAD,
  // duration: DURATION,
  url: BASE_URL,

  headers: {
    'Content-Type': 'application/json',
    'x-cognitoauth-token': AUTH_TOKEN,
  },
  requests: [
    {
      path: ENDPOINT,
      method: 'POST',
      setupRequest: (req, context) => {
        req.body = JSON.stringify({
          asset_id: ASSET,
          service_client_reference: SERVICE_CLIENT_REFERENCE,
          user_reference: `${HIDDEN_ACCOUNT_NAME}-${Date.now()}`
        })
        req.rawBody = req.body
        // console.log(req)
        return req
      },
      onResponse: function (status, body, context) {
        // console.log('\n', status, body, context)
      }
    }
  ]
}, finishTest)


// this is used to kill the instance on CTRL-C
process.once('SIGINT', () => {
  instance.stop()
})

// just render results
autocannon.track(instance, {renderProgressBar: true})