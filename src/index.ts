import * as dotenv from 'dotenv'
dotenv.config()

import { app, start, StartResult } from './app'

const main = ({ server, stop }: StartResult): void => {
  // Track runtime exceptions
  const errors = ['unhandledRejection', 'uncaughtException']

  errors.map(errorType => {
    process.on(errorType, error => {
      console.error('Unhandled exception occured', error)
    })
  })

  // Graceful shutdown
  const signals: NodeJS.Signals[] = ['SIGTERM', 'SIGINT', 'SIGUSR2']

  signals.map(signal => {
    process.once(signal, () => {
      stop()
      console.warn(`Server stop because of "${signal}". Trying graceful shutdown`)
      server.close(err => {
        if (err) {
          console.error(err)
        }
        console.info('Server stop')
        process.exit(err ? 1 : 0)
      })
    })
  })
}

if (require.main) {
  start()
    .then(main)
    .catch(err => console.error(err))
}

// Expose app e.g. for testing
export default app
