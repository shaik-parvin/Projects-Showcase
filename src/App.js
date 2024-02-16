import {Component} from 'react'
import Loader from 'react-loader-spinner'
import './App.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'INPROGRESS',
}

class App extends Component {
  state = {
    activeCategory: categoriesList[0].id,
    apiStatus: apiConstants.initial,
    projects: [],
  }

  componentDidMount() {
    this.getItem()
  }

  getItem = async () => {
    this.setState({apiStatus: apiConstants.inProgress})
    const {activeCategory} = this.state
    const url = `https://apis.ccbp.in/ps/projects?category=${activeCategory}`
    const options = {
      method: 'GET',
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok) {
      return this.onSubmitSuccess(data.projects)
    }
    return this.onSubmitFailure()
  }

  onSubmitSuccess = list => {
    const updatedData = list.map(each => ({
      id: each.id,
      name: each.name,
      imageUrl: each.image_url,
    }))
    this.setState({apiStatus: apiConstants.success, projects: updatedData})
  }

  onSubmitFailure = () => {
    this.setState({apiStatus: apiConstants.failure})
  }

  changeCategory = event => {
    this.setState({activeCategory: event.target.value}, this.getItem)
  }

  renderFailure = () => (
    <div className="fail-cont">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
        className="fail-img"
      />
      <h1 className="fail-title">Oops! Something Went Wrong</h1>
      <p className="fail-desc">
        We cannot seem to find the page you are looking for
      </p>
      <button className="retry" type="button" onClick={this.getItem}>
        Retry
      </button>
    </div>
  )

  renderLoader = () => (
    <div className="products-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderProjects = () => {
    const {projects} = this.state
    return (
      <ul className="list-cont">
        {projects.map(each => (
          <li className="item" key={each.id}>
            <img src={each.imageUrl} alt={each.name} className="img" />
            <p className="name">{each.name}</p>
          </li>
        ))}
      </ul>
    )
  }

  renderOutput = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiConstants.success:
        return this.renderProjects()
      case apiConstants.failure:
        return this.renderFailure()
      case apiConstants.inProgress:
        return this.renderLoader()
      default:
        return null
    }
  }

  render() {
    const {activeCategory} = this.state
    return (
      <div className="bg-cont">
        <nav className="navbar">
          <img
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
            className="logo"
          />
        </nav>
        <form>
          <select
            value={activeCategory}
            className="dropdown"
            onChange={this.changeCategory}
          >
            {categoriesList.map(each => (
              <option value={each.id} key={each.id}>
                {each.displayText}
              </option>
            ))}
          </select>
        </form>
        <div className="cont">{this.renderOutput()}</div>
      </div>
    )
  }
}

export default App
