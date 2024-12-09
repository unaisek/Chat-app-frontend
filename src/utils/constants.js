export const HOST = import.meta.env.VITE_SERVER_URL

export const AUTH_ROUTES ="api/auth";
export const SIGNUP_ROUTE = `${AUTH_ROUTES}/signup`;
export const LOGIN_ROUTE = `${AUTH_ROUTES}/login`;
export const GET_USER_DATA = `${AUTH_ROUTES}/user-data`;
export const LOGOUT_ROUTE = `${AUTH_ROUTES}/logout`;

export const USER_ROUTES = "api/user";
export const UPDATE_PROFILE = `${USER_ROUTES}/update-profile`;
export const UPDATE_PROFILE_IMAGE = `${USER_ROUTES}/add-profile-image`;
export const DELETE_PROFILE_IMAGE = `${USER_ROUTES}/delete-profile-image`;
export const SEARCH_CONTACT_ROUTE = `${USER_ROUTES}/search`;
export const GET_CONTACTS_DM_ROUTE = `${USER_ROUTES}/get-contacts-for-dm`;

export const MESSAGE_ROUTES ="api/messages";
export const GET_ALL_MESSAGES_ROUTE =`${MESSAGE_ROUTES}/get-messages`;
export const UPLOAD_FILE_ROUTE = `${MESSAGE_ROUTES}/upload-file`;

