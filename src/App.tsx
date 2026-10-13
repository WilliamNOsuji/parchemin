import { useLiveQuery } from 'dexie-react-hooks'
import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import { exportBackup } from './backup'
import { buildCommands } from './commands'
import { CommandPalette } from './components/CommandPalette'
import { DrawerPage } from './components/DrawerSection'
import { Home, HomeSidebar } from './components/Home'
import { Icon } from './components/Icons'
import { LibraryTree, type SideTab } from './components/LibraryTree'
import { NewStoryDialog } from './components/NewStoryDialog'
import { Ribbon } from './components/Ribbon'
import { RightSidebar, type RightTab } from './components/RightSidebar'
import { ChangesSidebar, SafekeepingPane } from './components/Safekeeping'
import { StatusBar } from './components/StatusBar'
import { TabStrip } from './components/TabStrip'
import { addScene, createCharacter, db, setAsideScene, takeSnapshot } from './db'
import { exportEpub, exportMarkdown } from './export'
import { navigate, useRoute, type Route } from './route'
import { chaptersOf, useSceneIndex } from './sceneIndex'
import { useOpenTabs } from './tabs'
import { THEMES, useTheme } from './theme'
import type { Folder, Story } from './types'

// The story pages pull in Tiptap and dnd-kit, so they load on demand.
const StoryView = lazy(() => import('./components/StoryView').then((m) => ({ default: m.StoryView })))
const StorySidebar = lazy(() => import('./components/StorySidebar').then((m) => ({ default: m.StorySidebar })))

type Screen = 'home' | 'write' | 'outline' | 'cast' | 'safekeeping' | 'drawer'
const screenOf = (r: Route): Screen => (r.name === 'story' ? r.tab : r.name)

/** The right sidebar's tabs, per screen. The web app's panels become icon tabs, as the mockup drew them. */
const RIGHT_TABS: Record<Screen, RightTab[]> = {
  home: [
    { id: 'safe', icon: 'safe', title: 'Safekeeping' },
    { id: 'drawer', icon: 'drawer', title: 'The drawer' },
  ],
  write: [
    { id: 'plan', icon: 'plan', title: 'Chapter plan' },
    { id: 'dialogue', icon: 'dialogue', title: 'Dialogue' },
    { id: 'snapshots', icon: 'snap', title: 'Snapshots' },
    { id: 'notes', icon: 'notes', title: 'Notes' },
    { id: 'unblock', icon: 'bulb', title: 'Unblock' },
  ],
  outline: [
    { id: 'audit', icon: 'outline', title: 'Read the whole outline' },
    { id: 'plan', icon: 'plan', title: 'Chapter plan' },
  ],
  cast: [
    { id: 'voice', icon: 'cast', title: 'Voice' },
    { id: 'hero', icon: 'plan', title: 'Hero check' },
    { id: 'bio', icon: 'notes', title: 'Profile and biography' },
  ],
  safekeeping: [{ id: 'changes', icon: 'snap', title: 'Since the last backup file' }],
  drawer: [],
}

/** A yes/no the device remembers, such as whether a sidebar is open. */
function useStored(key: string, init: boolean): [boolean, (v: boolean | ((b: boolean) => boolean)) => void] {
  const [v, setV] = useState<boolean>(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw === null ? init : raw === '1'
    } catch {
      return init
    }
  })
  useEffect(() => {
    try {
      localStorage.setItem(key, v ? '1' : '0')
    } catch {
      // nothing to do
    }
  }, [key, v])
  return [v, setV]
}

const isPhone = () => window.matchMedia('(max-width: 720px)').matches

export function App() {
  const route = useRoute()
  const screen = screenOf(route)
  const stories = useLiveQuery(() => db.stories.orderBy('updatedAt').reverse().toArray(), [], undefined as Story[] | undefined)
  const folders = useLiveQuery(() => db.folders.toArray(), [], [] as Folder[])
  const index = useSceneIndex()
  const drawerCount = useLiveQuery(() => db.drawer.count(), [], 0)
  const { tabs, active, close, prune } = useOpenTabs(route)
  const [theme, setTheme] = useTheme()

  const [newStoryIn, setNewStoryIn] = useState<{ folderId: string | null } | null>(null)
  const [drawer, setDrawer] = useState(false)
  const [leftOpen, setLeftOpen] = useStored('parchemin.left', true)
  const [rightOpen, setRightOpen] = useStored('parchemin.right', !isPhone())
  const [sideTab, setSideTab] = useState<SideTab>('library')
  const [rightTabs, setRightTabs] = useState<Partial<Record<Screen, string>>>({})
  const [focusOn, setFocusOn] = useState(false)
  const [palette, setPalette] = useState(false)
  const [notice, setNotice] = useState('')

  const writing = route.name === 'story' && route.tab === 'write'
  const focus = focusOn && writing
  const storyId = route.name === 'story' ? route.storyId : stories?.[0]?.id
  const currentSceneId = route.name === 'story' ? (route.itemId ?? chaptersOf(index, route.storyId)[0]?.id) : undefined
  const rightTab = rightTabs[screen] ?? RIGHT_TABS[screen][0]?.id ?? ''
  const hasRight = RIGHT_TABS[screen].length > 0 && rightOpen

  const openRight = useCallback(
    (tab: string) => {
      setRightTabs((t) => ({ ...t, [screen]: tab }))
      setRightOpen(true)
    },
    [screen, setRightOpen],
  )
  const toggleFocus = useCallback(() => setFocusOn((f) => !f), [])
  const cycleTheme = useCallback(() => setTheme(THEMES[(THEMES.indexOf(theme) + 1) % THEMES.length]), [theme, setTheme])
  const say = useCallback((text: string) => {
    setNotice(text)
    window.setTimeout(() => setNotice((n) => (n === text ? '' : n)), 7000)
  }, [])

  const commands = useMemo(
    () =>
      buildCommands({
        route,
        stories: stories ?? [],
        index,
        theme,
        actions: {
          go: navigate,
          newStory: () => setNewStoryIn({ folderId: null }),
          newChapter: async () => {
            if (storyId) navigate({ name: 'story', storyId, tab: 'write', itemId: await addScene(storyId) })
          },
          newCharacter: async () => {
            if (storyId) navigate({ name: 'story', storyId, tab: 'cast', itemId: await createCharacter(storyId) })
          },
          toggleFocus,
          snapshot: async () => {
            if (!currentSceneId) return
            await takeSnapshot(currentSceneId, '')
            openRight('snapshots')
          },
          openRight,
          setAsideChapter: async () => {
            const scene = currentSceneId ? index.find((s) => s.id === currentSceneId) : undefined
            if (!scene || chaptersOf(index, scene.storyId).length < 2) return
            if (window.confirm(`Move "${scene.title}" to the drawer? You can put it back from the drawer.`)) {
              await setAsideScene(scene.id)
              navigate({ name: 'story', storyId: scene.storyId, tab: 'write' })
            }
          },
          backup: () =>
            void exportBackup().then(
              (s) => say(!s ? '' : s.sure ? `Saved ${s.name}.` : `Your browser is saving ${s.name}. Check it under Safekeeping once it has saved.`),
              (e: unknown) => say(e instanceof Error ? e.message : 'The backup could not be made.'),
            ),
          exportMarkdown: () => storyId && void exportMarkdown(storyId),
          exportEpub: () => storyId && void exportEpub(storyId),
          cycleTheme,
          toggleLeft: () => setLeftOpen((o) => !o),
          toggleRight: () => setRightOpen((o) => !o),
        },
      }),
    [route, stories, index, theme, storyId, currentSceneId, toggleFocus, openRight, cycleTheme, say, setLeftOpen, setRightOpen],
  )

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.ctrlKey || e.metaKey
      const key = e.key.toLowerCase()
      if (e.key === 'Escape') {
        if (palette) setPalette(false)
        else if (focusOn) setFocusOn(false)
        return
      }
      if (!mod) return
      if (key === 'p' && !e.shiftKey && !e.altKey) {
        e.preventDefault()
        setPalette((p) => !p)
      } else if (key === 'f' && e.shiftKey && writing) {
        e.preventDefault()
        setFocusOn((f) => !f)
      } else if (key === 's' && e.shiftKey && writing) {
        e.preventDefault()
        commands.find((c) => c.id === 'snapshot')?.run()
      } else if (key === 'd' && !e.shiftKey && writing) {
        e.preventDefault()
        if (rightTab === 'dialogue' && rightOpen) setRightOpen(false)
        else openRight('dialogue')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [palette, focusOn, writing, commands, rightTab, rightOpen, openRight, setRightOpen])

  // the window's title names the page, so the tab in the browser and the taskbar read right
  useEffect(() => {
    const story = route.name === 'story' ? stories?.find((s) => s.id === route.storyId) : undefined
    const scene = currentSceneId ? index.find((s) => s.id === currentSceneId) : undefined
    const page = route.name === 'home' ? 'Library' : route.name === 'safekeeping' ? 'Safekeeping' : route.name === 'drawer' ? 'The drawer' : route.tab === 'write' ? scene?.title : route.tab === 'outline' ? 'Outline' : 'Cast'
    document.title = [page, story?.title, 'Parchemin'].filter(Boolean).join(' · ')
  }, [route, stories, index, currentSceneId])

  const onMenu = () => (isPhone() ? setDrawer(true) : setLeftOpen((o) => !o))
  const ribbon = (className?: string) => (
    <Ribbon
      className={className}
      route={route}
      storyId={storyId}
      drawerCount={drawerCount}
      theme={theme}
      onTheme={cycleTheme}
      onSearch={() => {
        setSideTab('search')
        if (isPhone()) setDrawer(true)
        else setLeftOpen(true)
      }}
      onNavigate={() => setDrawer(false)}
    />
  )

  const cls = ['app', focus && 'focus', drawer && 'drawer-open', !leftOpen && 'no-left', !hasRight && 'no-right', writing && rightTab === 'dialogue' && 'wide-right'].filter(Boolean).join(' ')

  return (
    <div className={cls} data-screen={screen}>
      <header className="titlebar">
        <div className="tb-left">
          <button className={`tb-btn${leftOpen ? ' on' : ''}`} aria-label={leftOpen ? 'Hide the library' : 'Show the library'} title="Library sidebar" onClick={onMenu}>
            <Icon name="menu" size={16} />
          </button>
          <button className="tb-btn nav" aria-label="Back" title="Back" onClick={() => history.back()}><Icon name="back" size={16} /></button>
          <button className="tb-btn nav" aria-label="Forward" title="Forward" onClick={() => history.forward()}><Icon name="fwd" size={16} /></button>
        </div>
        <TabStrip tabs={tabs} active={active} stories={stories ?? []} index={index} loaded={stories !== undefined} onClose={close} onPrune={prune} onAdd={() => setNewStoryIn({ folderId: null })} />
        <div className="tb-right">
          {RIGHT_TABS[screen].length > 0 && (
            <button className={`tb-btn${hasRight ? ' on' : ''}`} aria-label={hasRight ? 'Hide the right sidebar' : 'Show the right sidebar'} title="Right sidebar" onClick={() => setRightOpen((o) => !o)}>
              <Icon name="sidebarRight" size={16} />
            </button>
          )}
        </div>
      </header>

      <div className="body">
        {ribbon()}
        <div className="scrim" onClick={() => setDrawer(false)} />
        <LibraryTree
          stories={stories ?? []}
          folders={folders}
          index={index}
          drawerCount={drawerCount}
          activeStoryId={route.name === 'story' ? route.storyId : undefined}
          activeSceneId={writing ? currentSceneId : undefined}
          sideTab={sideTab}
          onSideTab={setSideTab}
          onNewStory={(folderId) => {
            setNewStoryIn({ folderId })
            setDrawer(false)
          }}
          onNavigate={() => setDrawer(false)}
          extra={ribbon('mobile-ribbon')}
        />

        <main className="pane" id="main">
          {route.name === 'home' && <Home stories={stories ?? []} index={index} onNewStory={() => setNewStoryIn({ folderId: null })} />}
          {route.name === 'safekeeping' && <SafekeepingPane stories={stories ?? []} />}
          {route.name === 'drawer' && <DrawerPage />}
          {route.name === 'story' && (
            <Suspense fallback={<p className="hint pad" role="status">Loading…</p>}>
              <StoryView storyId={route.storyId} tab={route.tab} itemId={route.itemId} focus={focus} onToggleFocus={toggleFocus} onOpenRight={openRight} />
            </Suspense>
          )}
        </main>

        {hasRight && (
          <RightSidebar tabs={RIGHT_TABS[screen]} active={rightTab} onPick={openRight} onClose={() => setRightOpen(false)} label="Details">
            {route.name === 'home' && <HomeSidebar tab={rightTab} say={say} />}
            {route.name === 'safekeeping' && <ChangesSidebar />}
            {route.name === 'story' && (
              <Suspense fallback={<p className="hint" role="status">Loading…</p>}>
                <StorySidebar storyId={route.storyId} tab={route.tab} itemId={route.itemId} rightTab={rightTab} />
              </Suspense>
            )}
          </RightSidebar>
        )}
      </div>

      <StatusBar route={route} index={index} notice={notice} />

      {palette && <CommandPalette commands={commands} onClose={() => setPalette(false)} />}
      {newStoryIn && <NewStoryDialog folderId={newStoryIn.folderId} onClose={() => setNewStoryIn(null)} />}
    </div>
  )
}

