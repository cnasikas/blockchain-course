[![CircleCI](https://circleci.com/gh/decrypto-org/blockchain-course.svg?style=svg)](https://circleci.com/gh/decrypto-org/blockchain-course)

# Introduction to Blockchains

This repository contains the material for our [Introduction to
Blockchains](https://blockchain-course.org) course.

You can take the course online at
[blockchain-course.org](https://blockchain-course.org/).

## Installation

### Full

This installation needs a database to function correctly. Any database will do.
We provide here instructions for setting up and using
[Postgres](https://www.postgresql.org/).
- If you don't have a Postgres installation, install `postgresql` using your
  package manager (e.g `sudo apt install posgtgresql`) and follow the [generic
  instructions](https://wiki.postgresql.org/wiki/First_steps) or the ones
  specific to your distribution (e.g.
  [Arch](https://wiki.archlinux.org/index.php/PostgreSQL),
  [Ubuntu](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-postgresql-on-ubuntu-18-04))
  to initialize the database cluster, start the database server and create a
  user. After this step, you should be able to create databases with your normal
  user account.
- Create a database with the name of your choice (e.g. `blockchain_course`), owned by your normal user
  account. With Postgres, you can achieve this with `createdb <db_name>`.
- Create an [OAuth
  App](https://developer.github.com/apps/building-oauth-apps/creating-an-oauth-app/)
  on Github
    - Development:
      - Homepage URL: http://localhost:3001/
      - Authorisation callback URL: http://localhost:3000/api/auth/github/callback
    - Production:
      - Homepage URL: https://blockchain-course.org
      - Authorisation callback URL: https://blockchain-course.org/api/auth/github/callback
- `cd api && cp .env-template .env`
- Add your OAuth App client ID and secret as provided by GitHub to the
  respective variables in `.env`.
- `cd ../db && cp .env-template .env`
- Add your username in the respective placeholders in the first variable of `.env`.
    - _Note_: The default database name is set to `blockchain_course`. If you
      prefer to give it a different name, change the name in `install.sh` and
      `.env`.
- `cd .. && chmod +x install.sh && ./install.sh`
- In the `app` directory, copy `.env-template` to `.env.development.local` for
  development or `.env.production.local` for production and modify the variables
  accordingly. See more at
  [create-react-app](https://facebook.github.io/create-react-app/docs/adding-custom-environment-variables#what-other-env-files-can-be-used).
- *Optional*: If you plan to develop Solidity exercises, install [ganache](https://truffleframework.com/ganache).

### CLI (without database)

Assignment creation and testing do not need a database management system (DBMS). Please note that CLI commands such as `get user` or `stats top` still need a DBMS and you should follow the [full installation instructions](#full).

- `cd db & yarn link & yarn install`
- `cd ../db/cli & yarn install && yarn link blockchain-course-db`


## Environment variables

### Database

`DB_URI`:  Postgres connection URI. It has the following format `DB_URI=postgres://user:password@host/database`. See more at [Connection URIs](https://www.postgresql.org/docs/9.2/libpq-connect.html#AEN38680).

`PROVIDER`: An Ethereum provider like [ganache-cli](https://github.com/trufflesuite/ganache-cli). Needed by `SolidityJudge`.

`ASSIGNMENT_FOLDER`: The path of the folder that contains the assignments. Defaults to `db/assignments`.

### API

`GITHUB_CLIENT_ID`: Your Github Client ID. See more at [Building OAuth Apps](https://developer.github.com/apps/building-oauth-apps/).

`GITHUB_CLIENT_SECRET`: Your Github Client Secret. See more at [Building OAuth Apps](https://developer.github.com/apps/building-oauth-apps/).

`GITHUB_CALLBACK_URL`: Authorization callback URL. See more at [
Redirect URLs](https://developer.github.com/apps/building-oauth-apps/authorizing-oauth-apps/#redirect-urls).

`APP_SECRET`: Session secret. See more at [express-session](https://github.com/expressjs/session#readme).

`APP_URL`: The URL of the web app.

`PORT`: API server port.

### APP

`REACT_APP_API_URL` = The URL of the API server.

`REACT_APP_LOGIN_URL` = The API login URL.

`PORT`: APP web server port. Needed only for development.


## Assignments

Assignments by default are assumed to be inside `db/assignments`. You can change the location of the assignment folder by setting the environment variable `ASSIGNMENT_FOLDER`.

Each assignment should extend the `BaseJudge` class or the `SolidityJudge` class in the case of the smart contract. The assignments are parameterized for each user and each user has a public and a private aux. Both the public and the private aux are created once (See `db/models/parameterizedassignment.js`).

Each assignment has to implement `judge (aux, user, assignment, solution)` and `aux (user, assignment)` functions. `judge` function takes as input an `aux`, a `user`, an `assignment` and a `solution`, and returns an object containing the grade and a message to show to the user. The return object's format must be: `{ grade: 0, msg: 'A message' }` The `aux` function takes as input the `user` and the `assignment` and returns an aux `{ private: privateAux, public: publicAux }` where `private` and `public` can be of any type and can be omitted.

### Example

```javascript
const BaseJudge = require('../judge/BaseJudge')
const { sha256 } = require('../helpers')

const PREIMAGE_PREFIX = 'blockchain-course.org:'
const POW_TARGET = 5

class ProofOfWorkAssignmentJudge extends BaseJudge {
  aux (user, assignment) {
    return {
      public: user.id
    }
  }

  async judge (aux, user, assignment, solution) {
    const nonce = solution
    if (sha256(PREIMAGE_PREFIX + aux.public + nonce).substr(0, POW_TARGET) === '0'.repeat(POW_TARGET)) {
      return { grade: 1, msg: 'Congratulations! Solution correct.' }
    }
    return { grade: 0, msg: 'Wrong! Please try again.' }
  }
}

ProofOfWorkAssignmentJudge.metadata = {
  lecture: 'cryptographic-primitives',
  name: 'proof-of-work',
  title: 'Performing Proof-of-Work',
  description: `Find a nonce such that the hexadecimal digest of SHA256("${PREIMAGE_PREFIX}" || "%s" || <nonce>) starts with ${POW_TARGET} zero characters`,
  type: BaseJudge.type.TEXT
}

module.exports = ProofOfWorkAssignmentJudge

```


## Development

- `cd api && yarn start`
- `cd app && yarn start`

## Build APP

- `cd app && yarn build`

## Serve API

- `cd api && yarn serve`

## CLI Usage

The CLI provides various functionalities to aid in the development of exercises, without the need of API or APP deployment, and provide useful statistics. If only want to create and test assignments you do not need to install any DBMS.

### Usage

```
node cli.js <command>

Commands:
  cli.js generate <command>  Generate <aux>
  cli.js get <command>       Get an entity <assignment>
  cli.js judge <id>          Judge a solution for a specific assignment
  cli.js stats <command>     Get user stats <top|last|score>

Options:
  --version  Show version number                                       [boolean]
  --help     Show help                                                 [boolean]
```

### Examples

```
node cli.js generate aux proof-of-work
node cli.js generate aux proof-of-work --user.id=2 --user.username='foo'
node cli.js judge proof-of-work --solution 'a_solution' --aux.public=2
node cli.js judge simple-storage --solution=/Users/username/SimpleStorage.sol --file
```
