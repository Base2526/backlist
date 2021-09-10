import Ajv from "ajv"
import { ADD_CONTENTS_DATA, ADD_FOLLOWS_DATA, ADD_FOLLOW_DATA, SET_TOTAL_VALUE, CLEAR_ALL_CONTENTS_DATA } from '../constants';

const _addContentsData = data => ({
  type: ADD_CONTENTS_DATA,
  data,
});

const _setTotalValue = data =>({
  type: SET_TOTAL_VALUE,
  data,
})

const _addFollowsData = data => ({
  type: ADD_FOLLOWS_DATA,
  data,
});

const _addFollowData = data => ({
  type: ADD_FOLLOW_DATA,
  data,
});

// onMyFollow

const _clearAllContentsData = () => ({
  type: CLEAR_ALL_CONTENTS_DATA
});

export const addContentsData = (data) => dispatch => {
  var innerSchema = {
    "type" : "object",
    "properties" : {
      _id: {type: "string"},
      ref: {type: "string"},
      nid: {type: "integer"},
      owner_id: {type: "integer"},
      status: {type: "boolean"},
    },
    "required" : ["_id", "ref", "nid", "owner_id", "status"]
  }

  const schema = {
    type: "array",
    items: innerSchema,
    additionalProperties: false,
  }

  const ajv = new Ajv() 
  const validate = ajv.compile(schema)

  if(validate(data)){
    dispatch(_addContentsData(data));
  }else{
    console.log('Ajv invalid addContentsData : ', data)
  }
}

export const setTotalValue = (data) => dispatch => {  
  const schema = {
    type: "integer",
    additionalProperties: false,
  }

  const ajv = new Ajv() 
  const validate = ajv.compile(schema)

  if(validate(data)){
    dispatch(_setTotalValue(data));
  }else{
    console.log('Ajv invalid setTotalValue : ', data)
  }
}

export const addFollowsData = (data) => dispatch => {
  var innerSchema = {
    "type" : "object",
    "properties" : {
      nid: {type: "integer"},
      status: {type: "boolean"},
      date: {type: "integer"},
      local: {type: "boolean"},
    },
    "required" : ["nid", "status"]
  }

  const schema = {
    type: "array",
    items: innerSchema,
    additionalProperties: false,
  }

  const ajv = new Ajv() 
  const validate = ajv.compile(schema)

  if(validate(data)){
    dispatch(_addFollowsData(data));
  }else{
    console.log('Ajv invalid addFollowsData : ', data)
  }
}

// const _addFollowData = data => ({
//   type: ADD_FOLLOW_DATA,
//   data,
// });

export const addFollowData = (data) => dispatch => {
  // var innerSchema = {
  //   "type" : "object",
  //   "properties" : {
  //     nid: {type: "integer"},
  //     status: {type: "boolean"},
  //     date: {type: "integer"},
  //     local: {type: "boolean"},
  //   },
  //   "required" : ["nid", "status"]
  // }

  // const schema = {
  //   type: "array",
  //   items: innerSchema,
  //   additionalProperties: false,
  // }

  const schema = {
    properties : {
      uid: {type: "integer"},
      nid: {type: "integer"},
      status: {type: "boolean"},
    },
    required : ["uid", "nid", "status"],
    additionalProperties: false,
  }

  const ajv = new Ajv() 
  const validate = ajv.compile(schema)

  if(validate(data)){
    dispatch(_addFollowData(data));
  }else{
    console.log('Ajv invalid addFollowData : ', data)
  }
}

export const clearAllContentsData = () => dispatch => {
  dispatch(_clearAllContentsData());
}