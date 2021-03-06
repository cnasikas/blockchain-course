import React, { Component } from 'react'
import _ from 'lodash'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Avatar from '@material-ui/core/Avatar'
import { Close } from '@material-ui/icons/'
import { Link, Redirect } from 'react-router-dom'
import classNames from 'classnames'
import SolutionsTable from '../../components/Table/SolutionsTable'

import '../../assets/scss/main.scss'

import {
  userActions
} from '../../actions'

const styles = (theme) => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: 16,
    textAlign: 'center'
  },
  header: {
    background: theme.palette.primary.main
  },
  avatar: {
    background: theme.palette.secondary.main
  },
  grid: {
    [theme.breakpoints.down('md')]: {
      width: '100%',
      margin: 0
    }
  }
})

const fetchCurrentUser = userActions.fetchCurrentUser

class Profile extends Component {
  componentDidMount () {
    if (this.props.isAuthenticated) {
      this.props.actions.fetchCurrentUser()
    }
  }

  formatSolution (solution) {
    solution = solution.split('\n')
    return solution.map((el, index) => (
      <span key={index}>
        {el.replace(/\s/g, '\u00a0')}
        <br />
      </span>
    ))
  }

  render () {
    if (_.isEmpty(this.props.user)) {
      return <Redirect from={this.props.path} to='/' />
    }

    const solutions = this.props.user.solutions.map(s => ({ ...s, solution: this.formatSolution(s.solution) }))

    return (
      <div className='app user-profile'>
        <div className='icon close-icon'><Link to='/'><Close /></Link></div>
        <div className='user-profile-wrapper'>
          <Grid container spacing={24} className={this.props.classes.grid}>
            <Grid item xs={12} lg={9}>
              <header className={classNames('profile-header', this.props.classes.header)}>
                <div className='profile-header-info'>
                  <div className='profile-avatar'>
                    <Avatar className='avatar'>{this.props.user.firstName ? this.props.user.firstName[0] : ''}</Avatar>
                  </div>
                  <div className='profile-full-name'>{this.props.user.firstName} {this.props.user.lastName}</div>
                </div>
              </header>
              <div className='profile-row'>
                <div className='row-header'>Personal info</div>
                <div className='row-info'>
                  <div className='row-info-wrapper'>
                    <div className='row-info-entry'>
                      <div className='label'>Full name</div>
                      <div className='text'>{this.props.user.firstName} {this.props.user.lastName}</div>
                    </div>
                    <div className='row-info-entry'>
                      <div className='label'>Email</div>
                      <div className='text'>{this.props.user.email}</div>
                    </div>
                    <div className='row-info-entry'>
                      <div className='label'>Github username</div>
                      <div className='text'>{this.props.user.username}</div>
                    </div>
                    <div className='row-info-entry'>
                      <div className='label'>Github ID</div>
                      <div className='text'>{this.props.user.githubId}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='profile-row'>
                <div className='row-header'>Statistics</div>
                <div className='row-info'>
                  <div className='row-info-wrapper'>
                    <div className='row-info-entry'>
                      <div className='label'>Assignments solved</div>
                      <div className='text'>
                        {Math.floor((this.props.user.statistics.totalSolved /
                        this.props.user.statistics.totalAssignments) * 100)}%
                        ({this.props.user.statistics.totalSolved} of {this.props.user.statistics.totalAssignments})
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='profile-row'>
                <div className='row-header'>Solutions</div>
                <div className='row-info'>
                  <div className='row-info-wrapper'>
                    <div className='row-info-entry'>
                      <SolutionsTable rows={solutions} labels={['Name', 'Solution']} />
                    </div>
                  </div>
                </div>
              </div>
            </Grid>
          </Grid>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    notification: state.notification,
    auth: state.auth,
    user: state.user,
    isAuthenticated: state.auth.isAuthenticated
  }
}

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators({ fetchCurrentUser }, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(Profile))
