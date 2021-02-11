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
      let issues = await fetch(`${process.env.PROJECT_ISSUES_LINK}?state=opened`, {
        headers: {
          authorization: `bearer ${process.env.ACCESS_TOKEN}`
        }
      })
      issues = await issues.json()

      const viewData = {
        snippets: issues
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
}
