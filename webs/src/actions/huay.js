import * as types from "./types";

export const loadingOverlayActive = (isActive, loadingText="Loading content...") => ({
    type: types.LOADING_OVERLAY_ACTIVE,
    isActive,
    loadingText
});

export const updateHuayListBank = (data) => ({
    type: types.UPDATE_HUAY_LIST_BANK,
    data
});

export const updateTransferMethod = (data) => ({
    type: types.UPDATE_TRANSFER_METHOD,
    data
});

export const updateContactUs = (data) => ({
    type: types.UPDATE_CONTACT_US,
    data
});

export const updateListBank = (data) => ({
    type: types.UPDATE_LIST_BANK,
    data
});

export const updateYeekeeRound = (data) => ({
    type: types.UPDATE_YEEKEE_ROUND,
    data
});

export const updateLotterys = (data) => ({
    type: types.UPDATE_LOTTERYS,
    data
});

export const updateShootNumbers = (data) => ({
    type: types.SHOOT_NUMBERS,
    data
});

export const updateDepositStatus = (data) => ({
    type: types.DEPOSIT_STATUS,
    data
});

export const updateSocketIOStatus = (data) => ({
    type: types.UPDATE_SOCKET_IO_STATUS,
    data
});

// export const getPeopleByUID = (data) => ({
//     type: types.GET_PEOPLE_BY_UID,
//     data
// });