import './Search.css'
import {useCallback, useEffect, useRef} from "react";
import {useDispatch, useSelector} from "react-redux";
import {fetchContributors, setError, setSelectedReviewer,
	setLoading, setAnimatingLogin, clearSearch} from "../../features/search/searchSlice/searchSlice.js";

export const Search = ({ onSearch }) => {
	const {login, repo, blacklist} = useSelector((state) => state.settings);
	const {selectedReviewer, animatingLogin, error, loading, contributors} = useSelector((state) => state.search);
	const dispatch = useDispatch();

	const timerRef = useRef(null);

	useEffect(() => {
		return () => {
			if (timerRef.current) {
				clearTimeout(timerRef.current);
				timerRef.current = null;
			}
			dispatch(clearSearch());
		}
	}, [dispatch]);

	const filterCandidates = useCallback((candidates) => {
		return candidates
			.filter(c =>
				c.login.toLowerCase() !== login.toLowerCase() &&
				!blacklist.some(b => b.toLowerCase() === c.login.toLowerCase())
			);
	}, [login, blacklist]);

	const animate = (count, maxCount, contributors) => {
		if (count < maxCount) {
			const randomLogin = contributors[Math.floor(Math.random() * contributors.length)];
			dispatch(setAnimatingLogin(randomLogin.login));
			const delay = (count * maxCount); // увеличение задержки для эффекта замедления
			timerRef.current = setTimeout(() => animate(count + 1, maxCount, contributors), delay);
		} else {
			const final = contributors[Math.floor(Math.random() * contributors.length)];
			dispatch(setSelectedReviewer(final.login));
			dispatch(setAnimatingLogin(''));
			dispatch(setLoading(false));
			timerRef.current = null;
		}
	};
	const makeRequest = async () => {
		if (!repo) {
			dispatch(setError('Укажите репозиторий в настройках'));
			return;
		}
		if (timerRef.current) {
			clearTimeout(timerRef.current);
			timerRef.current = null;
		}
		dispatch(clearSearch());

		const [owner, repoName] = repo.split('/');

		try {
			const data = await dispatch(fetchContributors({ owner, repo: repoName })).unwrap();

			const filtered = filterCandidates(data);
			if (filtered.length === 0) {
				dispatch(setError('Нет подходящих кандидатов'));
				return;
			}
			dispatch(setLoading(true));
			animate(0, 20, filtered);

		} catch (err) {
			dispatch(setError('Не удалось загрузить контрибьюторов, некорректная ссылка: ' + err.message));
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
			{contributors && contributors.length > 0 && ( // вывод массива контрибьюторов из слайса
				<p>Контрибьюторы: {contributors.map(c => c.login).join(', ')}</p>
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