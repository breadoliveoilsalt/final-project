import fetch from 'isomorphic-fetch'
import { loadCurrentArtObject, reloadFavorites, loadExtendedHistory, reloadSessionHistory, loadError, addToStateFavorites, removeFromStateFavorites } from './basicActionCreators'

//// SEND RECORD TO RAILS API DB FOR ID ////
//// RETURNS FULL RECORD FOR THUNKS IN harvardApiThunks TO LOAD INTO STORE/STATE ////
export function postInitialObjectData(record) {
    // Notice: In a component, if I wrap a function in dispatch in mapPropsToDispatch...
        // [For example: postInitialObjectData: (data) => dispatch(postInitialObjectData(data))]
        // ...then thunkage still works and I still get access to getState if inserted
        // as a second argument below.
  return function(dispatch) {
    return fetch("/api/artobjects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(record)
      })
    .then(res => res.json())
    .then(res => {
      if (res.errors) {
        throw res.errors
      } else {
        return res
    }})
  }
}

//// GET FAVORITES FROM RAILS API DB ////
export function getFavorites() {
  return function(dispatch) {
    return fetch('/api/artobjects/favorites')
    .then(response => response.json())
    .then(response => dispatch(reloadFavorites(response)))
  }
}

//// GET EXTENDED HISTORY FROM RAILS API DB ////
export function get30DayHistory() {
  return function(dispatch) {
    return fetch('/api/artobjects')
    .then(res => res.json())
    .then(res => {
      dispatch(loadExtendedHistory(res))
    })
  }
}

//// HELPER FUNCTIONS ////

  // Updates Rails API DB on "favorited/unfavorited" button clicks and  when Something
  // is "lastViewed". Note: "data" is a hash.
export function postUpdate(id, data) {
  return function(dispatch){
    return fetch(`/api/artobjects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
        })
    .then( (res) => {
      if (res.status !== 200) {
        throw Error
      } else {
        return res
      }
    })
    .catch(error => {
        dispatch(loadError("Sorry, something seems to have gone wrong with the database."))
      })
  }
}

export function postFavoriteUpdateArtPage(id, data) {
  return function(dispatch, getState){
    return fetch(`/api/artobjects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
        })
    .then( res => res.json())
    .then( res => {

        // If user clicked "Add to Favorites" while viewing the Art, update the Art (currentArtObject)
      if (getState().currentArtObject.id === res.id) {
        dispatch(loadCurrentArtObject(res))
      }

        // Update all instances when the ArtObject was viewed in sessionHistory
      dispatch(updateSessionObjects(res.id, {favorite: res.favorite}))

        // Add or remove from state Favorites
      if (res.favorite) {
        dispatch(addToStateFavorites(res))
      } else {
        dispatch(removeFromStateFavorites(res.id))
      }})
    .catch(error => {
        dispatch(loadError("Sorry, something seems to have gone wrong with the database."))
      })
  }
}

  // Updates the currentArtObject and sessionHistory in store/state
  // on "favorited/unfavorited" button clicks and when something is "lastViewed"
export function updateSessionObjects(id, data) {
  return function(dispatch, getState) {
    const { currentArtObject, sessionHistory } = getState()

      // Update the COA in the store/state
    if (currentArtObject.id === id) {
      const copyOfCOA = Object.assign({}, currentArtObject, data)
      dispatch(loadCurrentArtObject(copyOfCOA))
    }
      // Update all copies of the COA in the sessionHistory store/state
    const copyOfSessionHistory = [...sessionHistory]
    copyOfSessionHistory.forEach( (e) => {
      if (e.id === id) {
        return Object.assign(e, data)
      }
    })
    dispatch(reloadSessionHistory(copyOfSessionHistory))
  }
}
