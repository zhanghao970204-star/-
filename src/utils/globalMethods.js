import * as utils from './common'

export function setupGlobalMethods(app) {
  Object.keys(utils).forEach((key) => {
    app.config.globalProperties[`$${key}`] = utils[key]
  })
}
