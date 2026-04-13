import './Settings.css';

export const Settings = ({onSettings, handleSubmit}) => {
	return (
		<form className="settings-container" onSubmit={handleSubmit}>
			<button type={'button'} onClick={() => {onSettings(false)}} className="close-button">
				x
			</button>
			<input className="settings-input" name="login" placeholder={'github login'}/>
			<input className="settings-input" name="src" placeholder={'login/repo'}/>
			<input className="settings-input" name="blacklist" placeholder={'blacklist (логины через запятую)'}/>
			<button type={'submit'} >сохранить</button>
		</form>
	)
}