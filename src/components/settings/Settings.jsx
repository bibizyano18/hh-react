import './Settings.css';
import {useDispatch,useSelector} from "react-redux";
import {setSettings} from "../../features/settings/settingsSlice/settingsSlice.js";

export const Settings = ({onSettings}) => {
	const {login, repo, blacklist} = useSelector((state) => state.settings);
	const dispatch = useDispatch();

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

		dispatch(setSettings({login: log, repo: url, blacklist: blacklistArray}));

		localStorage.setItem('settings', JSON.stringify({
			login: log,
			repo: url,
			blacklist: blacklistArray
		}));

		onSettings(false);
	}
	return (
		<form className="settings-container" onSubmit={handleSubmit}>
			<div className="settings-header">
				<p>Настройки</p>
				<button type={'button'} onClick={() => {onSettings(false)}} className="close-button">
					x
				</button>
			</div>
			<input className="settings-input" name="login" placeholder={'github login'} defaultValue={login ? login : ''}/>
			<input className="settings-input" name="src" placeholder={'login/repo'} defaultValue={repo ? repo : ''}/>
			<input className="settings-input" name="blacklist" placeholder={'blacklist (логины через запятую)'}
				   defaultValue={blacklist ? blacklist : ''}/>
			<button type={'submit'} className="submit-button">сохранить</button>
		</form>
	)
}