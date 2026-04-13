import {Settings} from './components/settings/Settings.jsx';
import './App.css'
import {useState} from "react";

function App() {
    const [settingsView, setSettingsView] = useState(false);
    const [login, setLogin] = useState('');
    const [src, setSrc] = useState('');
    const [blacklist, setBlacklist] = useState([]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const log = formData.get('login').toString();
        const url = formData.get('src').toString();
        const arr = formData.get('blacklist').toString();

        setLogin(log);
        setSrc(url);

        if (arr !== '') {
            const blacklistArray = arr.split(',')
                .map(item => item.trim())
                .filter(item => item !== '');
            setBlacklist(blacklistArray);
        }
        else setBlacklist([]);

        localStorage.setItem('settings', JSON.stringify({
            login: log,
            repo: url,
            blacklist: arr ? arr.split(',')
                .map(item => item.trim())
                .filter(item => item !== '') : []
        }));

        setSettingsView(!settingsView);
    }
  return (
        <div>
            {settingsView ? (<Settings onSettings={setSettingsView} handleSubmit={handleSubmit} />)
                : (<button onClick={() => setSettingsView(true)}>Show Settings</button>)
            }
            <label><br/>{login}<br/>{src}<br/>{blacklist}</label>
        </div>
    )
}

export default App
