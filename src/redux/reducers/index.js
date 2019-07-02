import {
    SET_LOADING_STATE,
    SET_DRIVE,
    SET_FILE_PATH,
    ADD_NAV_PATH,
    POP_NAV_PATH,
    CANCEL_UPLOAD,
    SET_ERROR,
    DISMISS_ERROR,
    RESET_STATE,
} from '../actions';

const initialState = {
    loading: false,
    drive: '',
    filePath: '/home/pi/RetroPie/roms',
    navigationPaths: ['/home/pi/RetroPie/roms'],
    cancelUpload: false,
    error: {type: '', msg: 'Something Wrong'},
    showError: false,
};

export default (state = initialState, action) => {
    switch (action.type) {
        case SET_LOADING_STATE:
            return Object.assign({}, state, {
                loading: action.loadingState
            });
        case SET_DRIVE:
            return Object.assign({}, state, {
                drive: action.drive
            });
        case SET_FILE_PATH:
            return Object.assign({}, state, {
                filePath: action.filePath
            });
        case ADD_NAV_PATH:
            const newPaths = state.navigationPaths.slice(0);
            newPaths.push(action.path);
            console.log(newPaths);
            return Object.assign({}, state, {
                navigationPaths: newPaths
            });
        case POP_NAV_PATH:
            const navPaths = state.navigationPaths.slice(0);
            navPaths.pop();
            return Object.assign({}, state, {
                navigationPaths: navPaths,
            });
        case CANCEL_UPLOAD:
            return Object.assign({}, state, {
                cancelUpload: action.cancel,
            });
        case SET_ERROR:
            return Object.assign({}, state, {
                error: action.error,
                showError: true,
            });
        case DISMISS_ERROR:
            return Object.assign({}, state, {
                error: '',
                showError: false,
            });
        case RESET_STATE:
            return Object.assign({}, state, initialState);
        default:
            return state
    }
};