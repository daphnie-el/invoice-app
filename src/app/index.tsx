import React from 'react'
import { createRoot } from 'react-dom/client'
import { ApiProvider } from '../api'

import 'bootstrap/dist/css/bootstrap.min.css'
import '../styles/styles.css'

import App from './App'

const domRoot = document.getElementById('root')
const root = createRoot(domRoot!)

root.render(
  <React.StrictMode>
    <ApiProvider
      url="https://jean-test-api.herokuapp.com/"
      token="cb9b4c94-0d86-4d3e-86f7-659e0f9caffe" // set your api token here
    >
      <App />
    </ApiProvider>
  </React.StrictMode>
)
