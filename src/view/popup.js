import {humanizeReleaseDate} from "../utils/common.js";
import SmartView from "./smart.js";
import {createElement} from "../utils/render.js";
import moment from "moment";

const createGenreTemplate = (genres) => {
  const listGenres = [];

  for (const genre of genres) {
    listGenres.push(`<span class="film-details__genre">${genre}</span>`);
  }

  return `<td class="film-details__term">${listGenres.length === 1 ? `Genre` : `Genres`}</td>
            <td class="film-details__cell">${listGenres.join(``)}</td>`;
};

const createPopupTemplate = (data) => {
  const {
    poster,
    title,
    rating,
    date,
    duration,
    genres,
    description,
    country,
    ageRating,
    director,
    writers,
    actors,
    comments,
    isWatchList,
    isWatched,
    isFavorite,
    id
  } = data;
  const filmDuration = humanizeReleaseDate(duration);
  const release = moment(date).format(`D MMMM Y`);

  return `<section class="film-details" data-id="${id}">
            <form class="film-details__inner" action="" method="get">
              <div class="film-details__top-container">
                <div class="film-details__close">
                  <button class="film-details__close-btn" type="button">close</button>
                </div>
                <div class="film-details__info-wrap">
                  <div class="film-details__poster">
                    <img class="film-details__poster-img" src="${poster}" alt="">

                    <p class="film-details__age">${ageRating}+</p>
                  </div>

                  <div class="film-details__info">
                    <div class="film-details__info-head">
                      <div class="film-details__title-wrap">
                        <h3 class="film-details__title">${title}</h3>
                        <p class="film-details__title-original">Original: ${title}</p>
                      </div>

                      <div class="film-details__rating">
                        <p class="film-details__total-rating">${rating}</p>
                      </div>
                    </div>

                    <table class="film-details__table">
                      <tr class="film-details__row">
                        <td class="film-details__term">Director</td>
                        <td class="film-details__cell">${director}</td>
                      </tr>
                      <tr class="film-details__row">
                        <td class="film-details__term">Writers</td>
                        <td class="film-details__cell">${writers.join(`, `)}</td>
                      </tr>
                      <tr class="film-details__row">
                        <td class="film-details__term">Actors</td>
                        <td class="film-details__cell">${actors.join(`, `)}</td>
                      </tr>
                      <tr class="film-details__row">
                        <td class="film-details__term">Release Date</td>
                        <td class="film-details__cell">${release}</td>
                      </tr>
                      <tr class="film-details__row">
                        <td class="film-details__term">Runtime</td>
                        <td class="film-details__cell">${filmDuration}</td>
                      </tr>
                      <tr class="film-details__row">
                        <td class="film-details__term">Country</td>
                        <td class="film-details__cell">${country}</td>
                      </tr>
                      <tr class="film-details__row">${createGenreTemplate(genres)}</tr>
                    </table>

                    <p class="film-details__film-description">
                       ${description}
                    </p>
                  </div>
                </div>

                <section class="film-details__controls">
                  <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" data-list-checkbox ="watchlist" ${isWatchList ? `checked` : ``}>
                  <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist" data-list="watchlist">Add to watchlist</label>

                  <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" data-list-checkbox ="history" ${isWatched ? `checked` : ``}>
                  <label for="watched" class="film-details__control-label film-details__control-label--watched" data-list="history">Already watched</label>

                  <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" data-list-checkbox ="favorites" ${isFavorite ? `checked` : ``}>
                  <label for="favorite" class="film-details__control-label film-details__control-label--favorite" data-list="favorites">Add to favorites</label>
                </section>
              </div>

              <div class="film-details__bottom-container">
                <section class="film-details__comments-wrap">
                  <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

                  <ul class="film-details__comments-list"></ul>
                </section>
              </div>
            </form>
</section>`;
};

export default class Popup extends SmartView {
  constructor(film) {
    super();

    this._data = Popup.parseFilmToData(film);

    this._mouseDownHandler = this._mouseDownHandler.bind(this);
    this._watchListClickHandler = this._watchListClickHandler.bind(this);
    this._watchedClickHandler = this._watchedClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
  }

  getTemplate() {
    return createPopupTemplate(this._data);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  setMouseDownHandler(callback) {
    this._callback.closePopup = callback;
    this.getElement()
      .querySelector(`.film-details__close-btn`)
      .addEventListener(`mousedown`, this._mouseDownHandler);
  }

  setWatchListClickHandler(callback) {
    this._callback.watchListClick = callback;
    this.getElement()
      .querySelector(`.film-details__control-label--watchlist`)
      .addEventListener(`click`, this._watchListClickHandler);
  }

  setWatchedClickHandler(callback) {
    this._callback.watchedClick = callback;

    this.getElement()
      .querySelector(`.film-details__control-label--watched`)
      .addEventListener(`click`, this._watchedClickHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement()
      .querySelector(`.film-details__control-label--favorite`)
      .addEventListener(`click`, this._favoriteClickHandler);
  }

  removeMouseDownHandler() {
    this.getElement()
      .querySelector(`.film-details__close-btn`)
      .removeEventListener(`mousedown`, this._mouseDownHandler);
    this._callback = {};
  }

  removeWatchListClickHandler() {
    this.getElement()
      .querySelector(`.film-details__control-label--watchlist`)
      .removeEventListener(`click`, this._watchListClickHandler);
    this._callback.watchListClick = null;
  }

  removeWatchedClickHandler() {
    this.getElement()
      .querySelector(`.film-details__control-label--watched`)
      .removeEventListener(`click`, this._watchedClickHandler);
    this._callback.watchedClick = null;
  }

  removeFavoriteClickHandler() {
    this.getElement()
      .querySelector(`.film-details__control-label--favorite`)
      .removeEventListener(`click`, this._favoriteClickHandler);
    this._callback.favoriteClick = null;
  }

  restoreHandlers() {
    this.getElement()
      .querySelector(`.film-details__close-btn`)
      .addEventListener(`mousedown`, this._mouseDownHandler);
    this.getElement()
      .querySelector(`.film-details__close-btn`)
      .addEventListener(`mousedown`, this._mouseDownHandler);
    this.getElement()
      .querySelector(`.film-details__control-label--watchlist`)
      .addEventListener(`click`, this._watchListClickHandler);
    this.getElement()
      .querySelector(`.film-details__control-label--watched`)
      .addEventListener(`click`, this._watchedClickHandler);
    this.getElement()
      .querySelector(`.film-details__control-label--favorite`)
      .addEventListener(`click`, this._favoriteClickHandler);
  }

  _mouseDownHandler(evt) {
    evt.preventDefault();
    this._callback.closePopup(evt);
  }

  _watchListClickHandler(evt) {
    evt.preventDefault();

    this.updateData({
      isWatchList: !this._data.isWatchList,
    });

    this._callback.watchListClick(Popup.parseDataToFilm(this._data));
  }

  _watchedClickHandler(evt) {
    evt.preventDefault();

    this.updateData({
      isWatched: !this._data.isWatched,
    });

    this._callback.watchedClick(Popup.parseDataToFilm(this._data));
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();

    this.updateData({
      isFavorite: !this._data.isFavorite,
    });

    this._callback.favoriteClick(Popup.parseDataToFilm(this._data));
  }

  static parseFilmToData(film) {
    return Object.assign(
        {},
        film,
        {
          isWatchList: film.isWatchList,
          isWatched: film.isWatched,
          isFavorite: film.isFavorite
        }
    );
  }

  static parseDataToFilm(data) {
    data = Object.assign({}, data);
    return data;
  }
}
