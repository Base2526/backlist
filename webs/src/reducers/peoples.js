
import axios from 'axios';

import * as types from "../actions/types";

const initialState = {
    data: []
};

const peoples = async (state = initialState, action) => {
    switch (action.type) {
        case types.ADD_PEOPLE:
            console.log(action);
            return {
                ...state,
                data:action.data,
            };
        case types.UPDATE_PEOPLE:
            console.log(action);
            return {
                ...state,
                data:action.data,
            };
        
        /*
        case types.GET_PEOPLE_BY_UID:

            // return {
            //     ...state,
            //     data:[],
            // };

            console.log(state);
            let response = await axios.get('/api/get_people_by_uid', { params: { uid: action.data.uid } });

            let {result, data} =response.data;
            console.log(result, data);

            if(result){
                let people = {  image_url: data.image_url, 
                                name: data.name,
                                uid: data.uid}

                console.log(people);
                // return {
                //     ...state,
                //     data:[...people],
                // };
            }

            return {
                ...state,
                data:action.data,
                };
       */
            
        default:
        return state;
    }
};

export default peoples;
