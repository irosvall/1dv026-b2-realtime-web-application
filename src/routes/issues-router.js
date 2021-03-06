/**
 * The issues router.
 *
 * @author Ida Rosvall <ir222gn@student.lnu.se
 * @version 1.0.0
 */

import express from 'express'
import { IssuesController } from '../controllers/issues-controller.js'

export const router = express.Router()

const controller = new IssuesController()

// Map HTTP verbs and route paths to controller actions.
router.get('/', (req, res, next) => controller.index(req, res, next))

router.post('/:id/close', (req, res, next) => controller.close(req, res, next))

router.get('/:id/edit', (req, res, next) => controller.edit(req, res, next))
router.post('/:id/update', (req, res, next) => controller.update(req, res, next))
