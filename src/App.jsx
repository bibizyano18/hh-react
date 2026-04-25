import {Settings} from './components/settings/Settings.jsx';
import {Search} from "./components/search/Search.jsx";
import './App.css'
import {useState} from "react";
import {useSelector} from "react-redux";

function App() {
    const [settingsView, setSettingsView] = useState(false);
    const [searchView, setSearchView] = useState(false);

    const {login, repo, blacklist} = useSelector((state) => state.settings);

    return (
        <div className="app-container">
            <div className="user-container">
                <p>login: {login || 'не указан'}</p>
                <p>repo: {repo || 'не указан'}</p>
                <p>blacklist: {blacklist.length ? blacklist.join(', ') : 'пусто'}</p>
            </div>
            {searchView
                ? (<Search onSearch={setSearchView} />)
                : (<button className="search-button" onClick={() => setSearchView(true)}>Search</button>)
            }
            {settingsView
                ? (<Settings onSettings={setSettingsView} />)
                : (<button className="settings-button" onClick={() => setSettingsView(true)}>Show Settings</button>)
            }

        </div>
    )
}

export default App
