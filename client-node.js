'use strict'

const { join } = require('path')
const grpc = require('@grpc/grpc-js')
const protoLoader = require('@grpc/proto-loader')
const packageDefinition = protoLoader.loadSync(
  join(__dirname, 'interfaces/healthcheck.proto'),
  {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  }
)

const { svcs: { HealthCheck } } = grpc.loadPackageDefinition(packageDefinition)
const client = new HealthCheck('localhost:3000', grpc.credentials.createInsecure())
const req = { msg: 'PING' }
client.pingPong(req, (err, res) => {
  if ( err ) return _print('error occurred:', err && err.stack || err)
  _print(`got response from server "${res.msg}"`)
})
_print('...sending', req)


function _print (...args) {
  console.log('\u279c ', ...args) // eslint-disable-line no-console
}
