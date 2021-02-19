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
            iid: issue.iid,
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
   * Closes an issue.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async close (req, res, next) {
    try {
      await fetch(`https://gitlab.lnu.se/api/v4/projects/${process.env.GITLAB_PROJECT_ID}/issues/${req.body.iid}?state_event=close`, {
        method: 'PUT',
        headers: {
          authorization: `bearer ${process.env.ACCESS_TOKEN}`
        }
      })
      res.redirect('..')
    } catch (error) {
      next(error)
    }
  }

  /**
   * Returns a HTML form for editing a issue.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async edit (req, res, next) {
    try {
      let issue = await fetch(`https://gitlab.lnu.se/api/v4/projects/${process.env.GITLAB_PROJECT_ID}/issues/${req.params.id}`, {
        headers: {
          authorization: `bearer ${process.env.ACCESS_TOKEN}`
        }
      })
      issue = await issue.json()

      const viewData = {
        id: issue.id,
        iid: issue.iid,
        title: issue.title,
        description: issue.description,
        author: issue.author.name,
        avatar: issue.author.avatar_url,
        createdAt: issue.created_at.slice(0, 10)
      }

      res.render('issues/edit', { viewData })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Socket.io: Send websocket events to the client when webhooks are recieved.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async hook (req, res, next) {
    try {
      const details = {
        id: req.body.id,
        iid: req.body.iid,
        title: req.body.title,
        description: req.body.description,
        author: req.body.author,
        avatar: req.body.avatar,
        createdAt: req.body.createdAt
      }

      if (!req.body.action || req.body.action === 'open') {
        res.io.emit('newIssue', details)
      } else if (req.body.action === 'reopen') {
        res.io.emit('reOpenIssue', details)
      } else if (req.body.action === 'update') {
        res.io.emit('updateIssue', details)
      } else if (req.body.action === 'close') {
        res.io.emit('closeIssue', details)
      }

      // Webhook: Send respond to webhook.
      if (req.headers['x-gitlab-event']) {
        res.status(200).send('Hook accepted')
      }
    } catch (error) {
      next(error)
    }
  }
}
