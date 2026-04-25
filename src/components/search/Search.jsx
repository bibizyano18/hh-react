import './Search.css'
import { Octokit } from "octokit";
import {useEffect, useRef, useState} from "react";

const octokit = new Octokit();
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

export const Search = ({ onSearch, login, repo, blacklist }) => {

	const timerRef = useRef(null);

	useEffect(() => {
		return () => {
			clearTimeout(timerRef.current);
		}
	}, []);

	const [selectedReviewer, setSelectedReviewer] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [animatingLogin, setAnimatingLogin] = useState('');


	const filterCandidates = (candidates) => {
		return candidates
			.filter(c =>
				c.login.toLowerCase() !== login.toLowerCase() &&
				!blacklist.some(b => b.toLowerCase() === c.login.toLowerCase())
			);
	};

	const animate = (count, maxCount, contributors) => {
		if (count < maxCount) {
			const randomLogin = contributors[Math.floor(Math.random() * contributors.length)];
			setAnimatingLogin(randomLogin.login);
			const delay = (count * maxCount); // увеличение задержки для эффекта замедления
			timerRef.current = setTimeout(() => animate(count + 1, maxCount, contributors), delay);
		} else {
			const final = contributors[Math.floor(Math.random() * contributors.length)];
			setSelectedReviewer(final.login);
			setAnimatingLogin('');
			setLoading(false);
			timerRef.current = null;
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
			if (filtered.length === 0) {
				setError('Нет подходящих кандидатов');
				setLoading(false);
				return;
			}

			animate(0, 20, filtered);

		} catch (err) {
			setError('Не удалось загрузить контрибьюторов, некорректная ссылка: ' + err.message);
			setLoading(false);
		}
	};

	return (
		<div className="search-container">
			<div className="search-header">
				<p>Поиск ревьюера</p>
				<button onClick={() => onSearch(false)} className='close-button'>x</button>
			</div>

			{error && <p className='error-message'>{error}</p>}

			{animatingLogin && !error && (
				<p>Поиск: {animatingLogin}</p>
			)}

			{selectedReviewer && !error && (
				<>
					<p>
						Выбран ревьюер: <strong>{selectedReviewer}</strong>
					</p>
					<a href={`https://github.com/${selectedReviewer}`}>связаться</a>
				</>

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