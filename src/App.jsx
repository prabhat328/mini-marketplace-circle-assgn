import { BrowserRouter as Router, Routes, Route, useNavigate, Link } from 'react-router-dom'
import { Toaster, toast } from 'react-hot-toast'
import { ShoppingBag, PlusCircle, LogOut } from 'lucide-react' // Assuming lucide-react for icons
import { supabase } from './lib/supabase'

// AuthGuard and Home, Login, Signup, Sell pages would still be imported or defined elsewhere
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Sell from './pages/Sell'
import AuthGuard from './components/AuthGuard'
import { useEffect, useState } from 'react' // To manage user state

function Navbar({ user }) {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    toast.success('Logged out successfully')
    navigate('/login')
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => navigate('/')}>
            <ShoppingBag className="h-6 w-6 text-zinc-900 mr-2" />
            <h1 className="font-serif text-2xl font-bold tracking-tight text-zinc-900">Lumina</h1>
          </div>

          <div className="flex items-center space-x-8">
            <button
              onClick={() => navigate('/')}
              className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors uppercase tracking-wider"
            >
              Collection
            </button>

            {user ? (
              <>
                <button
                  onClick={() => navigate('/sell')}
                  className="btn-primary flex items-center"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Sell Item
                </button>
                <button
                  onClick={handleLogout}
                  className="text-zinc-400 hover:text-zinc-900 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-6">
                <Link
                  to="/login"
                  className="text-sm font-medium text-zinc-900 hover:text-zinc-600 transition-colors uppercase tracking-wider"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="btn-primary"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

function App() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null)
    })

    // Initial check for user session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null)
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar user={user} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/sell"
            element={
              <AuthGuard>
                <Sell />
              </AuthGuard>
            }
          />
        </Routes>
        <Toaster position="top-right" />
      </div>
    </Router>
  )
}

export default App
