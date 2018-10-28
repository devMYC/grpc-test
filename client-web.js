/* eslint-disable no-console */
import { h, render, Component } from 'preact'
import { style } from 'typestyle'
import { HealthCheckPromiseClient } from './interfaces/healthcheck_grpc_web_pb'
import { PingPongReq } from './interfaces/healthcheck_pb'

const button = type => ({
  $nest: {
    '&:hover': {
      background: type === 'ping' ? 'lightblue' : '#FE669F',
    }
  },
  background: 'white',
  boxShadow: '0 1px 5px rgba(0, 0, 0, .5)',
  fontSize: type === 'ping' ? 20 : 10,
  fontFamily: 'Menlo',
  margin: 10,
  padding: 10,
  textAlign: 'center',
  transition: 'background .5s, color .5s',
  width: `${type === 'ping' ? 100 : 30}px`,
  display: 'inline-block',
})

const pingBtn = style(button('ping'))
const resetBtn = style(button('reset'))

class App extends Component {
  constructor (props) {
    super(props)
    this.resetData = this.resetData.bind(this)
    this.sendReq = this.sendReq.bind(this)
    this.state = {
      loading: false,
      data: null,
    }
  }

  componentWillMount() {
    this.client = new HealthCheckPromiseClient(`http://${process.env.ENVOY_CONTAINER_IP || 'localhost'}`)
  }

  resetData(ev) {
    ev.preventDefault()
    this.setState({ ...this.state, data: null })
  }

  async sendReq(ev) {
    ev.preventDefault()
    if ( !this.client ) return

    this.setState({
      ...this.state,
      loading: !this.state.loading,
      data: null,
    })

    const req = new PingPongReq()
    req.setMsg('PING')

    try {
      const res = await this.client.pingPong( req )
      this.setState({ ...this.state, data: res.getMsg() })
    }
    catch (err) {
      this.setState({ ...this.state, data: err.message })
    }
    return this.setState({ ...this.state, loading: !this.state.loading })
  }

  render() {
    return (
      <div>
        {this.state.loading
          ? <h1>Sending request ...</h1>
          : (
            <div>
              <div className={pingBtn} onClick={this.sendReq}>PING</div>
              <div className={resetBtn} onClick={this.resetData}>Reset</div>
              {this.state.data &&
                <p style={{fontFamily: 'Menlo'}}>
                  <em>Response from server: </em>
                  <h3 style={{display: 'inline-block'}}>{this.state.data}</h3>
                </p>
              }
            </div>
          )
        }
      </div>
    )
  }
}

render(<App />, document.getElementById('root'))
