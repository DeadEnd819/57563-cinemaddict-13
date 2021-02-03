import FilmCardView from "../view/card.js";
import {FilterType, UserAction, UpdateType} from "../utils/const.js";
import {remove, replace} from "../utils/render.js";
import moment from "moment";

export default class Film {
  constructor(changeData, activeFilter) {
    this._changeData = changeData;
    this._activeFilter = activeFilter;

    this._filmCardComponent = null;

    this._watchListClickHandler = this._watchListClickHandler.bind(this);
    this._watchedClickHandler = this._watchedClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
  }

  init(film) {
    this._film = film;
    this._currentUpdateType = this._activeFilter === FilterType.ALL ? UpdateType.PATCH : UpdateType.MINOR;

    const prevFilmCardComponent = this._filmCardComponent;

    this._filmCardComponent = new FilmCardView(this._film);

    if (prevFilmCardComponent !== null) {
      this._removeCardHandlers();
      replace(this._filmCardComponent, prevFilmCardComponent);
      remove(prevFilmCardComponent);
    }

    this._setCardHandlers();

    return this._filmCardComponent.getElement();
  }

  destroy() {
    remove(this._filmCardComponent);
  }

  _watchListClickHandler() {
    this._changeData(
        UserAction.UPDATE_FILM,
        this._currentUpdateType,
        Object.assign(
            {},
            this._film,
            {
              isWatchList: !this._film.isWatchList
            }
        )
    );
  }

  _watchedClickHandler() {
    this._changeData(
        UserAction.UPDATE_FILM,
        this._currentUpdateType,
        Object.assign(
            {},
            this._film,
            {
              isWatched: !this._film.isWatched,
              watchingDate: !this._film.isWatched ? moment().format() : null
            }
        )
    );
  }

  _favoriteClickHandler() {
    this._changeData(
        UserAction.UPDATE_FILM,
        this._currentUpdateType,
        Object.assign(
            {},
            this._film,
            {
              isFavorite: !this._film.isFavorite
            }
        )
    );
  }

  _setCardHandlers() {
    this._filmCardComponent.setWatchListClickHandler(this._watchListClickHandler);
    this._filmCardComponent.setWatchedClickHandler(this._watchedClickHandler);
    this._filmCardComponent.setFavoriteClickHandler(this._favoriteClickHandler);
  }

  _removeCardHandlers() {
    this._filmCardComponent.removeWatchListClickHandler(this._watchListClickHandler);
    this._filmCardComponent.removeWatchedClickHandler(this._watchedClickHandler);
    this._filmCardComponent.removeFavoriteClickHandler(this._favoriteClickHandler);
  }
}
