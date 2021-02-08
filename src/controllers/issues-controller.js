/**
 * Module for the IssuesController.
 *
 * @author Ida Rosvall <ir222gn@student.lnu.se
 * @version 1.0.0
 */

/**
 * Encapsulates the issues controller.
 */
export class IssuesController {
  /**
   * Displays the start page containing issues.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async index (req, res, next) {
    try {
      res.render('issues/index')
    } catch (error) {
      next(error)
    }
  }
}
