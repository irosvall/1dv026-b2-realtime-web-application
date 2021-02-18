import '../socket.io/socket.io.js'

const issueTemplate = document.querySelector('#issue-template')

const baseURL = document.querySelector('base').getAttribute('href')
const issuesContainer = document.querySelector('#issues-container')

// If issueTemplate is not present on the page, just ignore and do not listen for tasks
if (issueTemplate) {
  // Create a Handlebars template from the template-tag (rendered from index.hbs)
  const hbsTemplate = window.Handlebars.compile(issueTemplate.innerHTML)

  // Create a socket connection using Socket.io
  const socket = window.io({ path: `${baseURL}socket.io` })

  // Listen to messages from the server.
  socket.on('newIssue', arg => {
    const issue = createIssue(arg)
    issuesContainer.insertBefore(issue, issuesContainer.firstChild)
  })
  socket.on('reOpenIssue', arg => {
    const issue = createIssue(arg)
    insertIssue(issuesContainer, issue)
  })
  socket.on('updateIssue', arg => {
    deleteElementByID(arg.id)
    const issue = createIssue(arg)
    insertIssue(issuesContainer, issue)
  })
  socket.on('closeIssue', arg => {
    deleteElementByID(arg.id)
  })

  /**
   * Creates a div element representing an issue.
   *
   * @param {arg} arg - Contains information about the issue.
   * @returns {HTMLElement} The issue.
   */
  function createIssue (arg) {
    const issueString = hbsTemplate(arg)
    const issue = document.createElement('div')
    issue.classList.add('issue')
    issue.setAttribute('id', arg.id)
    issue.innerHTML = issueString

    return issue
  }

  /**
   * Inserts an issue in the document in ID order.
   *
   * @param {HTMLElement} container - The element for the issue to be inserted in.
   * @param {HTMLElement} issue - The issue.
   */
  function insertIssue (container, issue) {
    let issues = document.querySelectorAll('.issue')

    if (issues.lenght === 0) {
      container.appendChild(issue)
    } else {
      issues = Array.from(issues)

      for (const element of issues) {
        if (element.id < issue.id) {
          container.insertBefore(issue, element)
          return
        }
      }
    }
  }

  /**
   * Deletes an element from the document by specifying its ID.
   *
   * @param {string} id - The id of the element.
   */
  function deleteElementByID (id) {
    document.getElementById(id).remove()
  }
}
