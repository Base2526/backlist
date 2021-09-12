import Ajv from "ajv"
import { MAINTENANCE_MODE } from '../constants';

const _setMaintenance = data => ({
  type: MAINTENANCE_MODE,
  data,
});

export const setMaintenance = (data) => dispatch => {
  const schema = {
    properties : {
      maintenance: {type: "boolean"},
    },
    required : ["maintenance"],
    additionalProperties: false,
  }

  const ajv = new Ajv() 
  const validate = ajv.compile(schema)

  if(validate(data)){
    dispatch(_setMaintenance(data));
  }else{
    console.log('Ajv invalid setMaintenance : ', data)
  }
}