import React from 'react'
import ReactDOM from 'react-dom'

const App = class extends React.Component {
  render() {
    return <h1>Hello World!</h1>
  }
}
ReactDOM.render(<App />, document.getElementById('root'))
