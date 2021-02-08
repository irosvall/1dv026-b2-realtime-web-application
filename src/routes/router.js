/**
 * The routers.
 *
 * @author Ida Rosvall <ir222gn@student.lnu.se
 * @version 1.0.0
 */

import express from 'express'
import createError from 'http-errors'
import { router as issuesRouter } from './issues-router.js'

export const router = express.Router()

router.use('/', issuesRouter)

// Catch 404.
router.use('*', (req, res, next) => next(createError(404)))
