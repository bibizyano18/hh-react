import './Search.css'
import { Octokit } from "octokit";
import {useState} from "react";

export const Search = ({ onSearch, login, repo, blacklist }) => {
	const octokit = new Octokit();


	const [contributors, setContributors] = useState([]);
	const [selectedReviewer, setSelectedReviewer] = useState(null);

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [animatingLogin, setAnimatingLogin] = useState('');

	const fetchContributors = async (owner, repo) => {
		try {
			const response = await octokit.request(
				'GET /repos/{owner}/{repo}/contributors',
				{
					owner,
					repo,
					per_page: 100,
				}
			);
			return response.data;

		} catch (error) {
			console.error('Ошибка:', error);
			throw error;
		}
	};

	const makeRequest = async () => {
		if (!repo) {
			alert('Укажите репозиторий в настройках');
			return;
		}

		const [owner, repoName] = repo.split('/');

		setLoading(true);
		setError(null);

		try {
			const data = await fetchContributors(owner, repoName);
			console.log(data);
			setContributors(data);

		} catch (err) {
			setError('Не удалось загрузить контрибьюторов: ' + err.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="search-container">
			<button onClick={() => onSearch(false)}>Закрыть</button>

			<button
				onClick={makeRequest}
				disabled={loading || !repo}
			>
				{loading ? 'Загрузка...' : 'Найти ревьюера'}
			</button>

			{error && <div className="error">{error}</div>}

			{animatingLogin && (
				<div className="animation">Поиск: {animatingLogin}</div>
			)}

			{selectedReviewer && (
				<div className="result">
					Выбран ревьюер: <strong>{selectedReviewer}</strong>
				</div>
			)}
		</div>
	)
}