import '../socket.io/socket.io.js'

const issueTemplate = document.querySelector('#issue-template')

const baseURL = document.querySelector('base').getAttribute('href')

// If issueTemplate is not present on the page, just ignore and do not listen for tasks
if (issueTemplate) {
  // Create a Handlebars template from the template-tag (rendered from index.hbs)
  const hbsTemplate = window.Handlebars.compile(issueTemplate.innerHTML)

  // Create a socket connection using Socket.io
  const socket = window.io({ path: `${baseURL}socket.io` })

  // Listen for message "issue" from the server
  socket.on('issue', arg => {
    const issueString = hbsTemplate(arg)
    const issue = document.createElement('div')
    issue.classList.add('issue')
    issue.innerHTML = issueString

    const taskList = document.querySelector('#issues-container')
    taskList.insertBefore(issue, taskList.firstChild)
  })
}
