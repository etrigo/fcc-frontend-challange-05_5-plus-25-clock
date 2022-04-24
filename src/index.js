import * as ReackDOMClient from 'react-dom/client'
import App from './App'

const container = document.getElementById('root')
const root = ReackDOMClient.createRoot(container)

root.render(<App />)

// teasting...
// import React from 'react';
// import ReactDOM from 'react-dom';
// import App from './App'


// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );