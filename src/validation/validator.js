import React from "react";
import joi from "@hapi/joi";

const addCustomerValidaiton = (data) => {
  const schema = joi.object({
      firstName: joi.string().min(4).required(),
      lastName: joi.string().min(4).required(),
      age: joi.number().integer().min(1).max(110).required(),
      address: joi.string().min(3).required(),
      gender: joi.string().required(),
      contactNumber:joi.number().integer().required(),

  });
  return schema.validate(data);
}


const addSampleValidaiton = (data) => {
  const schema = joi.object({
      cutomerName: joi.string().min(4).required(),
      dueDate: joi.date().min(4).required(),
      collectedBy: joi.string.min(4).required(),
      payment: joi.number().integer.required(),
      testName: joi.string().min(3).required(),
  });
  return schema.validate(data);
}

// export default {
//   addCustomerValidaiton,
//   addSampleValidaiton
// };

export default addCustomerValidaiton;