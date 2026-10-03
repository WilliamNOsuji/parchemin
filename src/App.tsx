import { useCallback, useEffect, useState } from 'react'
import { Home } from './components/Home'
import { NewStoryDialog } from './components/NewStoryDialog'
import { Sidebar } from './components/Sidebar'
import { StoryView } from './components/StoryView'
import { useRoute } from './route'

export function App() {
  const route = useRoute()
  const [newStoryIn, setNewStoryIn] = useState<{ folderId: string | null } | null>(null)
  const [drawer, setDrawer] = useState(false)
  const [focusOn, setFocusOn] = useState(false)

  // focus mode only makes sense while writing
  const writing = route.name === 'story' && route.tab === 'write'
  const focus = focusOn && writing
  const toggleFocus = useCallback(() => setFocusOn((f) => !f), [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && focusOn) setFocusOn(false)
      if (e.key.toLowerCase() === 'f' && e.shiftKey && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        setFocusOn((f) => !f)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [focusOn])

  return (
    <div className={`app${focus ? ' focus' : ''}${drawer ? ' drawer-open' : ''}`}>
      <header className="topbar">
        <button className="icon-btn" aria-label="Open library" onClick={() => setDrawer(true)}>☰</button>
        <a className="brand" href="#/"><span aria-hidden>🪶</span> Parchemin</a>
      </header>
      <div className="scrim" onClick={() => setDrawer(false)} />
      <Sidebar
        activeStoryId={route.name === 'story' ? route.storyId : undefined}
        onNewStory={(folderId) => {
          setNewStoryIn({ folderId })
          setDrawer(false)
        }}
        onNavigate={() => setDrawer(false)}
      />
      <main className="main">
        {route.name === 'home' ? (
          <Home onNewStory={() => setNewStoryIn({ folderId: null })} />
        ) : (
          <StoryView storyId={route.storyId} tab={route.tab} itemId={route.itemId} focus={focus} onToggleFocus={toggleFocus} />
        )}
      </main>
      {newStoryIn && <NewStoryDialog folderId={newStoryIn.folderId} onClose={() => setNewStoryIn(null)} />}
    </div>
  )
}
