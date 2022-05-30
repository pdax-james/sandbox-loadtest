'use strict'

const autocannon = require('autocannon')
const { v4: uuidV4 } = require('uuid')
const finishTest = require('./finishTest')

const ENV = 'dev'
const AUTH_TOKEN = 'eyJraWQiOiIyVXF6cXVtRCtXaFh0MUR5eDlCcnI4ck5YM05sbkFhSVpSbVwvanpZaDBTcz0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiI0MzI0NTY2Yy0xMDgwLTQ5MTktOTlhYS00YzAyZmVlNDVmMzciLCJjb2duaXRvOmdyb3VwcyI6WyJpbW1fdHJhZGVyIl0sImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC5hcC1zb3V0aGVhc3QtMS5hbWF6b25hd3MuY29tXC9hcC1zb3V0aGVhc3QtMV93djY4a1dBSWMiLCJjbGllbnRfaWQiOiI0cmt1bzFmaGtqbThrcXI1bnBxaWJvcnVvIiwib3JpZ2luX2p0aSI6IjYwYjY0M2VmLTZkMjktNDI4My1iZDc0LTk1ZTYzZTMyYzYwOCIsImV2ZW50X2lkIjoiNDExMzI2ZTAtOTFiYy00NDEwLTg0NDMtNzBjOTdjYTQ3MjU1IiwidG9rZW5fdXNlIjoiYWNjZXNzIiwic2NvcGUiOiJhd3MuY29nbml0by5zaWduaW4udXNlci5hZG1pbiIsImF1dGhfdGltZSI6MTY1MzYzODI0NywiZXhwIjoxNjUzNjQxODQ3LCJpYXQiOjE2NTM2MzgyNDcsImp0aSI6IjkyNDg2YjVhLTRhZWEtNDkyZi05N2NmLTRmYWEyMzQyM2FlYyIsInVzZXJuYW1lIjoiNDMyNDU2NmMtMTA4MC00OTE5LTk5YWEtNGMwMmZlZTQ1ZjM3In0.nGCCl_WQAN7ZjNClCPQG8cFnU4ffqeaCFGTjRD5Q3zYzxTtcG6wsr6icZkIHu1-FXEHb7q3yc3Uh7lVSSdy116YJvD77ew_k3M_mraQLl51x0lx1n8SHOWD3IiFU5SA45IoOyiuQNrobHWliEg5VFH3t_pptcPvSoKOfEKuz3eL9jcrww7YZ37dDrZeFLwzVjVGzCwy7Tf7aE_XVs4-d0yxAzAHITif6FkmDEwarexzno7GN0adBMMvAzayxfhU94qU1tdeomcM8FkDAkz8nX-jNPUNr6lXqsNk_iE8tiHUc_rdQBEOsAbjYXuX_f5y0NJtjs6mmncIEcwNl696TFw'
const ASSET = 'ADA_TEST'
const SERVICE_CLIENT_REFERENCE = 'custody-otc'


const BASE_URL = `https://${ENV}.custody-otc.services.pdax.ph`
const ENDPOINT = '/api/custody/v2/transaction/transfer'
const LOAD = 500
const DURATION = 10 // sec
const TIMEOUT = 30 // sec

console.log("LOADTEST START", Date.now())

const HIDDEN_ACCOUNT_NAME = 'loadtestdummyaccount'

const instance = autocannon({
  timeout: TIMEOUT,
  amount: LOAD,
  // connections: LOAD,
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
        const uuid = uuidV4()
        req.body = JSON.stringify({
          asset_id: ASSET,
          service_client_reference: SERVICE_CLIENT_REFERENCE,
          from_user_reference: "custody-otc-user1",
          to_address: "addr_test1qqlh46c75pwhrnhj8yqp3a6axpq5scszl94h0aa86ldhy0f4qys6pylevle6qzt27w9ddppud98jnr0vg8dheknxgw4qp0vwhm",
          to_address_tag: "",
          amount: "0.00001",
          fee_level: "MEDIUM",
          idempotency_id: uuid
        })
        req.rawBody = req.body
        // console.log('tx_idempotency_id:', uuid)
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
autocannon.track(instance, { renderProgressBar: true })