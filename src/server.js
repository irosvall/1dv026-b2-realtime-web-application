/**
 * The starting point of the application.
 *
 * @author Ida Rosvall <ir222gn@student.lnu.se
 * @version 1.0.0
 */

import express from 'express'
import hbs from 'express-hbs'
import helmet from 'helmet'
import logger from 'morgan'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { router } from './routes/router.js'

// Socket.io: To add Socket.io support
import http from 'http'
import { Server } from 'socket.io'

/**
 * The main function of the application.
 */
const main = () => {
  try {
    const app = express()
    const directoryFullName = dirname(fileURLToPath(import.meta.url))

    const baseURL = process.env.BASE_URL || '/'

    // Set various HTTP headers to make the application little more secure (https://www.npmjs.com/package/helmet).
    app.use(helmet())

    // Set up a morgan logger using the dev format for log entries.
    app.use(logger('dev'))

    // View engine setup.
    app.engine('hbs', hbs.express4({
      defaultLayout: join(directoryFullName, 'views', 'layouts', 'default'),
      partialsDir: join(directoryFullName, 'views', 'partials')
    }))
    app.set('view engine', 'hbs')
    app.set('views', join(directoryFullName, 'views'))

    // Parse requests of the content type application/x-www-form-urlencoded.
    // Populates the request object with a body object (req.body).
    app.use(express.urlencoded({ extended: false }))

    // Webhook: Enable body parsing of application/json
    // Populates the request object with a body object (req.body).
    app.use(express.json())

    // Serve static files.
    app.use(express.static(join(directoryFullName, '..', 'public')))

    // Add trust proxy for using the application in production.
    if (app.get('env') === 'production') {
      console.log('Running in production')
      app.set('trust proxy', 1)
    }

    // Socket.io: Add socket.io to the Express project
    const server = http.createServer(app)
    const io = new Server(server)

    // Socket.io; Not nessessery, but nice to log when users connect/disconnect
    io.on('connection', (socket) => {
      console.log('a user connected')

      socket.on('disconnect', () => {
        console.log('user disconnected')
      })
    })

    // middleware to be executed before the routes.
    app.use((req, res, next) => {
      // Pass the base URL to the views.
      res.locals.baseURL = baseURL

      // Socket.io: Add Socket.io to the Response-object to make it available in controllers.
      res.io = io

      next()
    })

    // Register routes.
    app.use('/', router)

    // Error handler.
    app.use(function (err, req, res, next) {
      // 404 Not Found.
      if (err.status === 404) {
        return res
          .status(404)
          .sendFile(join(directoryFullName, 'views', 'errors', '404.html'))
      }

      // 500 Internal Server Error (in production, all other errors send this response).
      if (req.app.get('env') !== 'development') {
        return res
          .status(500)
          .sendFile(join(directoryFullName, 'views', 'errors', '500.html'))
      }

      // Development only!
      // Only providing detailed error in development.

      // Render the error page.
      res
        .status(err.status || 500)
        .render('errors/error', { error: err })
    })

    // Starts the HTTP server listening for connections.
    server.listen(process.env.PORT, () => {
      console.log(`Server running at http://localhost:${process.env.PORT}`)
      console.log('Press Ctrl-C to terminate...')
    })
  } catch (error) {
    console.error(error.message)
    process.exitCode = 1
  }
}

main()
