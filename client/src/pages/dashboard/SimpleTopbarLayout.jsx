import { Outlet, Link } from 'react-router-dom'
import ProfileMenu from '../../components/dashboard/ProfileMenu'
import './dashboard.css'

export default function SimpleTopbarLayout() {
  return (
    <div className="dash">
      <div className="dash-body" style={{ width: '100%' }}>
        <header className="dash-topbar">
          <Link to="/dashboard/workspace" className="dash-topbar__btn" title="Workspace tools">
            <span style={{ fontSize: 11, fontWeight: 700 }}>Workspace</span>
          </Link>
          <ProfileMenu />
        </header>
        <main className="dash-main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
