import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, Route, Routes } from 'react-router-dom'
import heroImg from './assets/The_Challenge_logo.png'
import './App.css'

const challengePages = Array.from({ length: 5 }, (_, index) => ({
  id: index + 1,
  path: `/page-${index + 1}`,
}))

const totalHuntButtons = 500
const winningButtonNumber = 347
const lockCode = '75937358'
const totalHeartImages = 5000

const createSvgDataUri = (svg: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`

const heartImageSrc = createSvgDataUri(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <path fill="#d9e5ff" d="M50 86C36 74 16 60 16 38c0-10 8-18 18-18 7 0 13 4 16 10 3-6 9-10 16-10 10 0 18 8 18 18 0 22-20 36-34 48z"/>
  </svg>
`)

const starImageSrc = createSvgDataUri(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <polygon fill="#d9e5ff" points="50,5 61,36 95,36 68,56 78,88 50,69 22,88 32,56 5,36 39,36"/>
  </svg>
`)

function HomePage() {
  const [isWidgetOpen, setIsWidgetOpen] = useState(false)

  useEffect(() => {
    if (!isWidgetOpen) {
      return
    }

    const handleEscClose = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsWidgetOpen(false)
      }
    }

    window.addEventListener('keydown', handleEscClose)
    return () => window.removeEventListener('keydown', handleEscClose)
  }, [isWidgetOpen])

  return (
    <>
      <main className="page-shell">
        <section className="panel intro-panel">
          <button
            type="button"
            className="intro-media intro-media-button"
            onClick={() => setIsWidgetOpen(true)}
            aria-label="Open hidden star widget"
          >
            <img src={heroImg} alt="The Challenge logo" />
          </button>
          <div className="intro-copy">
            <p className="eyebrow">STAR HUNT | MAIN CHALLENGE</p>
            <h1>Welcome to Website Star Hunt!</h1>
            <p>
              There are 7 hidden stars across these pages. Your challenge is to
              find all of the stars and send screenshots in the group chat as
              fast as possible!
            </p>
          </div>
        </section>

        <section className="panel clue-panel">
          <div className="star-icon" aria-hidden="true" />
          <div>
            <h2>STAR #1</h2>
            <p>
              The star shown here is <strong>1 of 7</strong> stars hidden across
              this website.
            </p>
            <ul>
              <li>
                When you find a star, take a screenshot and send it to chat.
              </li>
              <li>After all 7 are found, your timer stops.</li>
            </ul>
          </div>
        </section>

        <section className="pages-panel">
          <h2>Star Pages</h2>
          <p>Each page has at least one hidden star.</p>
          <div className="page-grid">
            {challengePages.map((page) => (
              <Link key={page.id} className="page-button" to={page.path}>
                Star Page {page.id}
              </Link>
            ))}
          </div>
        </section>
      </main>

      {isWidgetOpen && (
        <div
          className="widget-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Hidden star widget"
          onClick={() => setIsWidgetOpen(false)}
        >
          <section
            className="widget-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="widget-card">
              <div className="widget-star" aria-hidden="true" />
            </div>
            <button
              type="button"
              className="widget-back-button"
              onClick={() => setIsWidgetOpen(false)}
            >
              Back
            </button>
          </section>
        </div>
      )}
    </>
  )
}

type StarPageProps = {
  pageNumber: number
}

function StarPage({ pageNumber }: StarPageProps) {
  const [isWidgetOpen, setIsWidgetOpen] = useState(false)
  const [isTimedStarVisible, setIsTimedStarVisible] = useState(false)
  const [enteredCode, setEnteredCode] = useState('')
  const [lockStatus, setLockStatus] = useState<'idle' | 'error' | 'success'>('idle')
  const isButtonHuntPage = pageNumber === 1
  const isTimedStarPage = pageNumber === 2
  const isComboLockPage = pageNumber === 3
  const isHeartImagePage = pageNumber === 4
  const isFinalePage = pageNumber === 5

  useEffect(() => {
    if (!isWidgetOpen) {
      return
    }

    const handleEscClose = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsWidgetOpen(false)
      }
    }

    window.addEventListener('keydown', handleEscClose)
    return () => window.removeEventListener('keydown', handleEscClose)
  }, [isWidgetOpen])

  useEffect(() => {
    if (!isTimedStarPage) {
      setIsTimedStarVisible(false)
      return
    }

    let cycleTimer: ReturnType<typeof setInterval> | undefined
    let hideTimer: ReturnType<typeof setTimeout> | undefined

    const showTimedStar = () => {
      setIsTimedStarVisible(true)
      hideTimer = setTimeout(() => {
        setIsTimedStarVisible(false)
      }, 2000)
    }

    const showTimer = setTimeout(() => {
      showTimedStar()
      cycleTimer = setInterval(showTimedStar, 22000)
    }, 20000)

    return () => {
      clearTimeout(showTimer)
      if (cycleTimer) {
        clearInterval(cycleTimer)
      }
      if (hideTimer) {
        clearTimeout(hideTimer)
      }
    }
  }, [isTimedStarPage])

  useEffect(() => {
    if (!isComboLockPage) {
      setEnteredCode('')
      setLockStatus('idle')
      return
    }

    if (enteredCode.length !== lockCode.length) {
      return
    }

    if (enteredCode === lockCode) {
      console.log('Page 3 lock code correct: 75937358')
      setLockStatus('success')
      setIsWidgetOpen(true)
      return
    }

    setLockStatus('error')
    const resetTimer = setTimeout(() => {
      setEnteredCode('')
      setLockStatus('idle')
    }, 900)

    return () => clearTimeout(resetTimer)
  }, [enteredCode, isComboLockPage])

  const handleHuntButtonClick = (buttonNumber: number) => {

    if (buttonNumber === winningButtonNumber) {
      console.log(`Winning button found: ${buttonNumber}`)
      setIsWidgetOpen(true)
    }
  }

  const buttonItems = Array.from({ length: totalHuntButtons }, (_, index) => {
    const buttonNumber = index + 1
    return (
      <button
        key={buttonNumber}
        type="button"
        className="hunt-button"
        onClick={() => handleHuntButtonClick(buttonNumber)}
      >
        Button {buttonNumber}
      </button>
    )
  })

  const lockDigits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']

  const starImageIndex = useMemo(() => {
    if (!isHeartImagePage) {
      return -1
    }

    return Math.floor(Math.random() * (totalHeartImages + 1))
  }, [isHeartImagePage])

  const heartImages = useMemo(() => {
    if (!isHeartImagePage || starImageIndex < 0) {
      return []
    }

    return Array.from({ length: totalHeartImages + 1 }, (_, index) => {
      const isStar = index === starImageIndex
      return (
        <img
          key={index}
          className="heart-image"
          src={isStar ? starImageSrc : heartImageSrc}
          alt={isStar ? 'Star image' : 'Heart image'}
          loading="lazy"
          decoding="async"
        />
      )
    })
  }, [isHeartImagePage, starImageIndex])

  const handleLockDigit = (digit: string) => {
    if (!isComboLockPage || lockStatus === 'success') {
      return
    }

    if (enteredCode.length >= lockCode.length) {
      return
    }

    setEnteredCode((previous) => `${previous}${digit}`)
    if (lockStatus === 'error') {
      setLockStatus('idle')
    }
  }

  return (
    <>
      <main className={`page-shell ${isButtonHuntPage ? 'hunt-page' : 'route-page'}`}>
        <section className={`panel ${isButtonHuntPage ? 'hunt-panel' : 'route-panel'}`}>
          <p className="eyebrow">STAR HUNT PAGE {pageNumber}</p>
          <h1>Star Page {pageNumber}</h1>
          {!isTimedStarPage && (
            <p>
              {isButtonHuntPage
                ? 'One of the 500 buttons hides the star. Keep clicking until you find it.'
                : isComboLockPage
                  ? '.- ... -.. .--- -.- .... .- ... -.- .--- ..-. -.. .... .- ... -.- .--- ..-. -... .- -.- ... .--- ..-. -... .- -.- ... ..-. .--- -... .- -.- ... ..-. .--- -... .- ... ..-. -.- .--- .- ... ..-. -.- .--- --... ..... ----. ...-- --... ...-- ..... ---.. .- ... ..-. .-.. -.- .- ... ..-. .-.. -.- .- ..-. .-.. .--- -. --. .-.. -.- ... -. -.. --. .-.. -.- ... -.. -- --. .-.. ... -.. --. -. .-.. -.- .- ... -. --. .-.. -.- .- -. ... .-.. --. -.- .- -. ... --. .-.. -.- .- -. ... .-.. --. -.- -. .- ... --.'
                  : isHeartImagePage
                    ? 'There are 5,001 images here. 5,000 are hearts and 1 is a star.'
                    : isFinalePage
                      ? 'Open the puzzle link and send a screenshot of the solved puzzle.'
                    : `This is page ${pageNumber}. You can now place clues, images, or hidden stars here.`}
            </p>
          )}

          {isButtonHuntPage && <div className="hunt-grid">{buttonItems}</div>}
          {isComboLockPage && (
            <section className="lock-panel" aria-label="Page 3 combo lock">
              <div className={`lock-display lock-${lockStatus}`}>
                {enteredCode.padEnd(lockCode.length, '•')}
              </div>
              <div className="lock-grid">
                {lockDigits.map((digit) => (
                  <button
                    key={digit}
                    type="button"
                    className="lock-digit"
                    onClick={() => handleLockDigit(digit)}
                  >
                    {digit}
                  </button>
                ))}
              </div>
              <button
                type="button"
                className="lock-reset"
                onClick={() => {
                  setEnteredCode('')
                  setLockStatus('idle')
                }}
              >
                Reset
              </button>
            </section>
          )}
          {isHeartImagePage && (
            <section className="heart-field" aria-label="Heart image field">
              {heartImages}
            </section>
          )}
          {isFinalePage && (
            <section className="finale-panel" aria-label="Finale puzzle link">
              <a
                className="finale-link"
                href="https://www.jigsawplanet.com/?rc=play&pid=26404b921c51"
                target="_blank"
                rel="noreferrer"
              >
                Open Puzzle
              </a>
              <p className="finale-note">
                Send a screenshot of the puzzle in your group chat.
              </p>
            </section>
          )}

          <Link className="page-button back-button" to="/">
            Back to Main Page
          </Link>
        </section>
      </main>

      {isWidgetOpen && (
        <div
          className="widget-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Hidden star widget"
          onClick={() => setIsWidgetOpen(false)}
        >
          <section
            className="widget-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="widget-card">
              <div className="widget-star" aria-hidden="true" />
            </div>
            <button
              type="button"
              className="widget-back-button"
              onClick={() => setIsWidgetOpen(false)}
            >
              Back
            </button>
          </section>
        </div>
      )}

      {isTimedStarVisible && (
        <div
          className="widget-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Timed star popup"
        >
          <section className="widget-modal timed-star-modal">
            <div className="widget-card timed-star-card">
              <div className="widget-star" aria-hidden="true" />
            </div>
          </section>
        </div>
      )}
    </>
  )
}

function App() {
  const pageRoutes = challengePages.map((page) => (
    <Route
      key={page.id}
      path={page.path}
      element={<StarPage pageNumber={page.id} />}
    />
  ))

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      {pageRoutes}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
