/**
 * Module for the IssuesController.
 *
 * @author Ida Rosvall <ir222gn@student.lnu.se
 * @version 1.0.0
 */

import fetch from 'node-fetch'

/**
 * Encapsulates the issues controller.
 */
export class IssuesController {
  /**
   * Displays the start page containing open issues.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async index (req, res, next) {
    try {
      let issues = await fetch(`https://gitlab.lnu.se/api/v4/projects/${process.env.GITLAB_PROJECT_ID}/issues?state=opened`, {
        headers: {
          authorization: `bearer ${process.env.ACCESS_TOKEN}`
        }
      })
      issues = await issues.json()

      const viewData = {
        issues: issues
          .map(issue => ({
            id: issue.id,
            title: issue.title,
            description: issue.description,
            author: issue.author.name,
            avatar: issue.author.avatar_url,
            createdAt: issue.created_at.slice(0, 10)
          }))
      }

      res.render('issues/index', { viewData })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Creates a new issue.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async create (req, res, next) {
    try {
      // Socket.io: Send the created task to all subscribers.
      res.io.emit('issue', {
        id: req.body.id,
        title: req.body.title,
        description: req.body.description,
        author: req.body.author.name,
        avatar: req.body.author.avatar_url,
        createdAt: req.body.created_at
      })

      // Webhook: Call is from hook. Skip redirect and flash.
      if (req.headers['x-gitlab-event']) {
        res.status(200).send('Hook accepted')
      }
    } catch (error) {
      next(error)
    }
  }
}
