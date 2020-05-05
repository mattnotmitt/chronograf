import _ from 'lodash'
import {HANDLERS_TO_RULE_THEM_ALL, AlertTypes} from 'src/kapacitor/constants'

export const parseHandlersFromRule = (rule, handlersFromConfig) => {
  const handlersOfKind = {}
  const handlersOnThisAlert = []

  const handlersFromRule = _.pickBy(rule.alertNodes, (v, k) => {
    return k in HANDLERS_TO_RULE_THEM_ALL
  })

  _.forEach(handlersFromRule, (v, alertKind) => {
    const thisAlertFromConfig = _.find(
      handlersFromConfig,
      h => h.type === alertKind
    )

    _.forEach(v, alertOptions => {
      const count = _.get(handlersOfKind, alertKind, 0) + 1
      handlersOfKind[alertKind] = count

      if (alertKind === 'post') {
        const headers = alertOptions.headers
        alertOptions.headerKey = _.keys(headers)[0]
        alertOptions.headerValue = _.values(headers)[0]
        alertOptions = _.omit(alertOptions, 'headers')
      }

      const ep = {
        enabled: true,
        ...thisAlertFromConfig,
        ...alertOptions,
        alias: `${alertKind}-${count}`,
        type: alertKind,
      }
      handlersOnThisAlert.push(ep)
    })
  })
  const selectedHandler = handlersOnThisAlert.length
    ? handlersOnThisAlert[0]
    : null
  return {handlersOnThisAlert, selectedHandler, handlersOfKind}
}

export const parseAlertNodeList = rule => {
  const nodeList = _.transform(
    rule.alertNodes,
    (acc, v, k) => {
      if (k in HANDLERS_TO_RULE_THEM_ALL && v.length > 0) {
        let alerts
        switch (k) {
          case AlertTypes.slack:
            alerts = _.uniqBy(
              v,
              alert => _.get(alert, 'workspace') || 'default'
            )

            acc.push(
              ..._.map(alerts, alert => {
                const nickname = _.get(alert, 'workspace') || 'default'
                return `${k} (${nickname})`
              })
            )
            break
            case AlertTypes.discord:
              alerts = _.uniqBy(
                v,
                alert => _.get(alert, 'workspace') || 'default'
              )
  
              acc.push(
                ..._.map(alerts, alert => {
                  const nickname = _.get(alert, 'workspace') || 'default'
                  return `${k} (${nickname})`
                })
              )
              break
          case AlertTypes.kafka:
            alerts = _.uniqBy(v, alert => _.get(alert, 'cluster'))

            acc.push(
              ..._.map(alerts, alert => {
                const nickname = _.get(alert, 'cluster')
                return `${k} (${nickname})`
              })
            )
            break
          default:
            acc.push(k)
        }
      }
    },
    []
  )
  const uniqNodeList = _.uniq(nodeList)
  return _.join(uniqNodeList, ', ')
}
