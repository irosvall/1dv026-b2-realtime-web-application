/**
 * Module for the HookController.
 *
 * @author Ida Rosvall <ir222gn@student.lnu.se
 * @version 1.0.0
 */

/**
 * Encapsulates the webhook controller.
 */
export class HookController {
  /**
   * Recieves a Webhook, validates it and sends it to Issues Create Controller.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  index (req, res, next) {
    req.body = {
      id: req.body.object_attributes.id,
      title: req.body.object_attributes.title,
      description: req.body.object_attributes.description,
      author: req.body.user.name,
      avatar: req.body.user.avatar_url,
      createdAt: req.body.object_attributes.created_at.slice(0, 10),
      action: req.body.object_attributes.action
    }

    next()
  }

  /**
   * Authorizes the webhook.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  authorize (req, res, next) {
    // Validate the Gitlab Secret Token to be sure that the hook is from the correct sender.
    // This need to be in a database if we have multiple users.
    if (req.headers['x-gitlab-token'] !== process.env.HOOK_SECRET) {
      res.status(403).send('Incorrect Secret')
      return
    }

    next()
  }
}
