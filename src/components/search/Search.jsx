import './Search.css'
import { Octokit } from "octokit";
import {useState} from "react";

export const Search = ({ onSearch, login, repo, blacklist }) => {
	const octokit = new Octokit();

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

	const filterCandidates = (candidates) => {
		return candidates
			.map(c => c.login)
			.filter(name =>
				name.toLowerCase() !== login.toLowerCase() &&
				!blacklist.some(b => b.toLowerCase() === name.toLowerCase())
			);
	}

	const animate = (count, maxCount, contributors) => {
		if (count < maxCount) {
			const randomLogin = contributors[Math.floor(Math.random() * contributors.length)];
			setAnimatingLogin(randomLogin);
			const delay = (count * maxCount); // увеличение задержки для эффекта замедления
			setTimeout(() => animate(count + 1, maxCount, contributors), delay);
		} else {
			const final = contributors[Math.floor(Math.random() * contributors.length)];
			setSelectedReviewer(final);
			setAnimatingLogin('');
		}
	};
	const makeRequest = async () => {
		if (!repo) {
			setError('Укажите репозиторий в настройках');
			return;
		}

		const [owner, repoName] = repo.split('/');

		setLoading(true);
		setError(null);

		try {
			const data = await fetchContributors(owner, repoName);

			const filtered = filterCandidates(data);
			console.log(filtered);
			if (filtered.length === 0) {
				setError('Нет подходящих кандидатов');
				return;
			}

			animate(0, 20, filtered);

		} catch (err) {
			setError('Не удалось загрузить контрибьюторов, некорректная ссылка: ' + err.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="search-container">
			<div className="search-header">
				<p>Поиск ревьюера</p>
				<button onClick={() => onSearch(false)} className='close-button'>x</button>
			</div>




			{error && <p>{error}</p>}

			{animatingLogin && (
				<p>Поиск: {animatingLogin}</p>
			)}

			{selectedReviewer && (
				<p>
					Выбран ревьюер: <strong>{selectedReviewer}</strong>
				</p>
			)}
			<button
				onClick={makeRequest}
				disabled={loading || !repo}
				className='search-button'
			>
				{loading ? 'Загрузка...' : 'Найти ревьюера'}
			</button>
		</div>
	)
}