import { Link } from "react-router-dom"
import { routerPaths } from "../../router/routerPaths"

const NotFoundPage = () => {
  return (
    <div>
      <h1>404 - Page Not Found</h1>
      <Link to={routerPaths.app}>Go to Home</Link>
    </div>
  )
}

export default NotFoundPage