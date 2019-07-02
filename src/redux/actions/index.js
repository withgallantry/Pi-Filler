export const SET_LOADING_STATE = 'SET_LOADING_STATE';
export const SET_DRIVE = 'SET_DRIVE';
export const SET_FILE_PATH = 'SET_FILE_PATH';
export const ADD_NAV_PATH = 'ADD_NAV_PATH';
export const POP_NAV_PATH = 'POP_NAV_PATH';
export const CANCEL_UPLOAD = 'CANCEL_UPLOAD';
export const SET_ERROR = 'SET_ERROR';
export const DISMISS_ERROR = 'DISMISS_ERROR';
export const RESET_STATE = 'RESET_STATE';

export const setLoading = (loadingState) => {
    return {
        type: SET_LOADING_STATE,
        loadingState,
    }
};

export const setDrive = (drive) => {
    return {
        type: SET_DRIVE,
        drive,
    }
};

export const setFilePath = (filePath) => {
    return {
        type: SET_FILE_PATH,
        filePath,
    }
};

export const addNavPath = (path) => {
    return {
        type: ADD_NAV_PATH,
        path,
    }
};

export const popNavPath = () => {
    return {
        type: POP_NAV_PATH,
    }
};

export const cancelUpload = (cancel) => {
    return {
        type: CANCEL_UPLOAD,
        cancel: cancel,
    }
};

export const setError = (error) => {
    return {
        type: SET_ERROR,
        error,
    }
};

export const dismissError = () => {
    return {
        type: SET_ERROR,
    }
};

export const resetState = () => {
    return {
        type: RESET_STATE,
    }
};