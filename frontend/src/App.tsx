import { Route, Switch } from 'wouter'
import { Suspense } from 'react'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Trading from './pages/Trading'
import Analytics from './pages/Analytics'
import Governance from './pages/Governance'
import Vaults from './pages/Vaults'
import LoadingSpinner from './components/LoadingSpinner'

function App() {
  return (
    <Layout>
      <Suspense fallback={<LoadingSpinner />}>
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/trading" component={Trading} />
          <Route path="/analytics" component={Analytics} />
          <Route path="/governance" component={Governance} />
          <Route path="/vaults" component={Vaults} />
        </Switch>
      </Suspense>
    </Layout>
  )
}

export default App