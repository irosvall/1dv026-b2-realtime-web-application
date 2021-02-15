/**
 * The webhook router.
 *
 * @author Ida Rosvall <ir222gn@student.lnu.se
 * @version 1.0.0
 */

import express from 'express'
import { HookController } from '../controllers/hook-controller.js'
import { IssuesController } from '../controllers/issues-controller.js'

export const router = express.Router()

const controller = new HookController()
const issuesController = new IssuesController()

// Map HTTP verbs and route paths to controller actions.
router.post('/issues', (req, res, next) => controller.authorize(req, res, next),
  (req, res, next) => controller.index(req, res, next),
  (req, res, next) => issuesController.create(req, res, next))
