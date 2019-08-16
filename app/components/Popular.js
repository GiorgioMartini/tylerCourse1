import React from 'react'
import PropTypes from 'prop-types'
import {fetchPopularRepos} from '../utils/api'
import { FaUser, FaStar, FaCodeBranch, FaExclamationTriangle} from 'react-icons/fa'

function LanguagesNav ({ selected, onUpdateLanguage }) {
  const languages = ['All', 'JavaScript', 'Ruby', 'Java', 'CSS', 'Python']

  return (
    <ul className='flex-center'>
      {languages.map((language) => (
        <li key={language}>
          <button
            className='btn-clear nav-link'
            style={language === selected ? {color: 'rgb(255,0,0)'} : null }
            onClick={() => onUpdateLanguage(language)}>
            {language}
          </button>
        </li>
      ))}
    </ul>
  )
}

function ReposGrid({ repos }) {
  return(
    <ul className='grid space-around'>
      {repos.map((repo, i) => {
        const { name, owner, html_url, stargazers_count, forks, open_issues } = repo
        const { login, avatar_url } = owner

        return (
          <li key={html_url} className='repo bg-light'>
            <h4 className='header-lg center-text'>
              #{ i + 1}
            </h4>
            <img
              className='avatar'              
              src={avatar_url}
            />
            <h2 className="center-text">
              <a href={html_url} className="link">{login}</a>
            </h2>

            <ul className="card-list">

              <li>
                <FaUser color='rgb(255,0,0)' size={22}/>
                <a href={`https://github.com/${login}`}>
                  {login}
                </a>

              </li>
              <li>
                <FaStar color='rgb(0,255,0)' size={22}/>
                  {stargazers_count.toLocaleString()} stars
              </li>

              <li>
                <FaExclamationTriangle color='rgb(0,0,255)' size={22}/>
                  {open_issues.toLocaleString()} issues}
              </li>

            </ul>
          </li>
        )
      })}
    </ul>
  )
}

ReposGrid.propTypes = {
  repos: PropTypes.array.isRequired,
}

export default class Popular extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedLanguage: 'All',
      repos: {},
      error: null,
    }

    this.updateLanguage = this.updateLanguage.bind(this)
    this.isLoading = this.isLoading.bind(this)
  }

  componentDidMount() {
    this.updateLanguage(this.state.selectedLanguage)
  }

  updateLanguage (selectedLanguage) {
    this.setState({
      selectedLanguage,
      error: null,
    })

    if (!this.state.repos[selectedLanguage]) {

      fetchPopularRepos(selectedLanguage)
        .then( (data) =>{
          this.setState(({ repos }) => ({
            repos: {
              ...repos,
              [selectedLanguage]: data
            }
          }))
        })
        .catch( () => {
          console.warn('error', error)
          this.setState({error: 'error'})
        })
    }
  }

  isLoading() {
    const { selectedLanguage, repos, error } = this.state

    return !repos[selectedLanguage] && error === null
  }

  render() {
    const { selectedLanguage, repos, error } = this.state

    return (
      <React.Fragment>
        <LanguagesNav
          selected={selectedLanguage}
          onUpdateLanguage={this.updateLanguage}
        />

        {this.isLoading() && <p>LOADING</p>}

        {error && <p>error</p>}

        {repos[selectedLanguage] && <ReposGrid repos={repos[selectedLanguage]}/>}

    </React.Fragment>
    )
    
  }
}