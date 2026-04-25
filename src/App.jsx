import {Settings} from './components/settings/Settings.jsx';
import {Search} from "./components/search/Search.jsx";
import './App.css'
import {useEffect, useState} from "react";

function App() {
    const [settingsView, setSettingsView] = useState(false);
    const [searchView, setSearchView] = useState(false);
    const [login, setLogin] = useState('');
    const [src, setSrc] = useState('');
    const [blacklist, setBlacklist] = useState([]);

    useEffect(() => {
        try {
            const data = JSON.parse(localStorage.getItem('settings'));
            if (data) {
                setLogin(data.login || '');
                setSrc(data.repo || '');
                setBlacklist(data.blacklist || []);
            }
        } catch (e) {
            console.log(e);
        }

    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const log = formData.get('login').toString();
        const url = formData.get('src').toString();
        const arr = formData.get('blacklist').toString();


        if (url) {
            const parts = url.split('/');
            if (parts.length !== 2 || !parts[0] || !parts[1]) {
                alert('Репозиторий должен быть в формате: owner/repo\nНапример: facebook/react');
                return;
            }
        }
        const blacklistArray = arr
            ? arr.split(',').map(item => item.trim()).filter(item => item !== '')
            : [];

        setLogin(log);
        setSrc(url);
        setBlacklist(blacklistArray);

        localStorage.setItem('settings', JSON.stringify({
            login: log,
            repo: url,
            blacklist: blacklistArray
        }));

        setSettingsView(!settingsView);
    }
    return (
        <div className="app-container">
            <div className="user-container">
                <p>login: {login || 'не указан'}</p>
                <p>repo: {src || 'не указан'}</p>
                <p>blacklist: {blacklist.length ? blacklist.join(', ') : 'пусто'}</p>
            </div>
            {searchView ? (<Search
                    onSearch={setSearchView}
                    login={login}
                    repo={src}
                    blacklist={blacklist}
                />)
                : (<button className="search-button" onClick={() => setSearchView(true)}>Search</button>)
            }
            {settingsView ? (<Settings
                    onSettings={setSettingsView}
                    handleSubmit={handleSubmit}
                    login={login}
                    repo={src}
                    blacklist={blacklist}
                />)
                : (<button className="settings-button" onClick={() => setSettingsView(true)}>Show Settings</button>)
            }

        </div>
    )
}

export default App
