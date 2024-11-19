import { BrowserRouter as Router, Routes, Route, Link, useLocation} from "react-router-dom"
import HistoryPage from "../pages/historyPage";
import DataHistoryPage from "../pages/DataHistoryPage";
import HomePage from "../pages/HomePage";
import Chat from "./Chat";



function Routerr() {
    return (
        <div>
          <Chat />
          <Router>
            <Link to="/">Home</Link>
            <Link to="/history">History</Link>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/history" element={<HistoryPage />} />
                <Route path="/datahistory/:questionId" element={<DataHistoryPage />} />
              </Routes>
            <div>
            </div>
          </Router>
        </div> 
      )
}

export default Routerr;