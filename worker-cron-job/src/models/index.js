const joi = require('@hapi/joi')
const mongoose = require('mongoose')
const typeMapping = {
  string: String,
  array: Array,
  number: Number,
  boolean: Boolean,
  object: Object
}

function handleObj (joiSchema, special, schemaOnly, joiOnly) {
  const { $_terms: { keys } } = joiSchema
  let schemaObj = {}
  keys.forEach(i => {
    const { key, schema: { type } } = i
    if (joiOnly[key] === 1) {
      return
    }
    if (type === 'array' && special[key]) {
      schemaObj[key] = special[key]
    } else {
      if (type === 'object') {
        const n = handleObj(i.schema, special[key] || {}, schemaOnly[key] || {}, joiOnly[key] || {})
        schemaObj[key] = n
      } else {
        schemaObj[key] = {
          type: typeMapping[type],
          ...(special[key] || {})
        }
      }
    }
  })
  schemaObj = { ...schemaObj, ...schemaOnly }
  return schemaObj
}

const joi2MongoSchema = (joiSchema, special = {}, schemaOnly = {}, joiOnly = {}) => {
  /*
  * @param {joiSchema} schema joi
  * @param {special} cấu hình đặc biệt của 1 field của schema ví dụ index, unique,....
  * @param {schemaOnly} 1 số field mà chỉ có ở db mà k có ở schema
  *
  *
  * */
  const schemaObj = handleObj(joiSchema, special, schemaOnly, joiOnly)
  return mongoose.Schema(schemaObj)
}
module.exports = container => {
  const { serverHelper } = container.resolve('config')
  container.registerValue('ObjectId', mongoose.Types.ObjectId)
  const Watch = require('./watch.model')(joi, mongoose, { joi2MongoSchema, serverHelper })
  const schemas = {
    Watch
  }
  const schemaValidator = (obj, type) => {
    const schema = schemas[type]
    if (schema) {
      return schema.validateObj(obj, {
        allowUnknown: true,
        stripUnknown: true
      })
    }
    return { error: `${type} not found.` }
  }
  return {
    schemas,
    schemaValidator
  }
}
