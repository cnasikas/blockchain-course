const { handleGetEntity, buildCommand } = require('../helpers')

const commonOptions = {
  all: {
    alias: 'a',
    describe: 'All groups',
    boolean: true
  }
}

const getSubCommands = {
  options: { cmd: ':key [id]', desc: 'Get :key given by id or ommit id to get all entries.' },
  entries: {
    assignment: ['Assignment', { ...commonOptions }, handleGetEntity],
    user: ['User', { ...commonOptions }, handleGetEntity],
    parameterized: ['ParameterizedAssignment', { ...commonOptions }, handleGetEntity],
    solution: ['Solution', { ...commonOptions }, handleGetEntity]
  }
}

const cmd = {
  command: 'get <user|assignment|solution|parameterized> [id]',
  desc: 'Retrieves the user or assignment whose id is [id]. If the id is omitted then all users or assignments will be retrieved. Run cli.js get --help for more information.'
}

module.exports = buildCommand(cmd, getSubCommands)
