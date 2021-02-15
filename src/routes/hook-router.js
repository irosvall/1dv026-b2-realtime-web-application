/**
 * The webhook router.
 *
 * @author Ida Rosvall <ir222gn@student.lnu.se
 * @version 1.0.0
 */

import express from 'express'
import { HookController } from '../controllers/hook-controller.js'

export const router = express.Router()

const controller = new HookController()

// Map HTTP verbs and route paths to controller actions.
router.post('/issue', (req, res, next) => controller.authorize(req, res, next), (req, res, next) => controller.index(req, res, next))
