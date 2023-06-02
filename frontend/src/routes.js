import { HomePage } from './pages/home-page.jsx'
import { AboutUs } from './pages/about-us.jsx'
import { ChatIndex } from './pages/chat-index.jsx'
import { ReviewIndex } from './pages/review-index.jsx'
import { ChatApp } from './pages/chat-app.jsx'
import { AdminApp } from './pages/admin-app.jsx'

// Routes accesible from the main navigation (in AppHeader)
const routes = [
    {
        path: '/',
        component: <HomePage />,
        label: 'Home 🏠',
    },
    // {
    //     path: 'chat',
    //     component: <ChatIndex />,
    //     label: 'Chats'
    // },
    {
        path: 'review',
        component: <ReviewIndex />,
        label: 'Reviews'
    },
    {
        path: 'chat',
        component: <ChatIndex />,
        label: 'Chat'
    },
    {
        path: 'about',
        component: <AboutUs />,
        label: 'About us'
    },
    {
        path: 'admin',
        component: <AdminApp />,
        label: 'Admin Only'
    }
]

export default routes