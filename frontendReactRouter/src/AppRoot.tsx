import { BrowserRouter } from 'react-router-dom'
import App from './App'

export function AppRoot() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  )
}
