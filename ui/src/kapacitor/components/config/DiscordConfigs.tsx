import React, {Component, MouseEvent} from 'react'
import _ from 'lodash'

import DiscordConfig from 'src/kapacitor/components/config/DiscordConfig'
import {ErrorHandling} from 'src/shared/decorators/errors'

import {DiscordProperties} from 'src/types/kapacitor'
import {Notification, NotificationFunc} from 'src/types'

import {getDeep} from 'src/utils/wrappers'

const DEFAULT_CONFIG = {
  options: {
    enabled: false,
    workspace: '',
    url: '',
    timestamp: true,
    username: '',
    'avatar-url': '',
    'embed-title': '',
    'ssl-ca': '',
    'ssl-cert': '',
    'ssl-key': '',
    'insecure-skip-verify': false
  },
  isNewConfig: true,
}

interface Config {
  options: DiscordProperties & {
    workspace: string
  }
  isNewConfig?: boolean
}

interface Props {
  configs: Config[]
  onSave: (properties: DiscordProperties) => Promise<boolean>
  onDelete: (specificConfig: string) => void
  onTest: (
    e: MouseEvent<HTMLButtonElement>,
    specificConfigOptions: Partial<DiscordProperties> & {id: string}
  ) => void
  onEnabled: (specificConfig: string) => boolean
  notify: (message: Notification | NotificationFunc) => void
  isMultipleConfigsSupported: boolean
}

interface State {
  configs: Config[]
}

@ErrorHandling
class DiscordConfigs extends Component<Props, State> {
  public static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    return {...prevState, configs: nextProps.configs}
  }
  public state: State = {configs: []}

  public render() {
    const {onSave, onDelete, onTest, notify} = this.props

    return (
      <div>
        {this.configs.map(c => {
          const enabled = getDeep<boolean>(c, 'options.enabled', false)
          const workspace = this.getWorkspace(c)
          const workspaceID = this.getWorkspaceID(c)
          const isDefaultConfig = this.isDefaultConfig(c)
          return (
            <DiscordConfig
              config={c}
              onSave={onSave}
              onTest={onTest}
              onDelete={onDelete}
              enabled={enabled}
              notify={notify}
              key={workspace}
              isDefaultConfig={isDefaultConfig}
              workspaceID={workspaceID}
            />
          )
        })}
        {this.isAddingConfigsAllowed && (
          <div className="form-group col-xs-12 text-center">
            <button
              className="btn btn-md btn-default"
              onClick={this.handleAddConfig}
            >
              <span className="icon plus" /> Add Another Config
            </button>
          </div>
        )}
      </div>
    )
  }

  private isNewConfig = (config: Config): boolean => {
    return getDeep(config, 'isNewConfig', false)
  }

  private isDefaultConfig = (config: Config): boolean => {
    return this.getWorkspace(config) === '' && !this.isNewConfig(config)
  }

  private getWorkspace = (config: Config): string => {
    const {isMultipleConfigsSupported} = this.props
    if (isMultipleConfigsSupported) {
      const workspace = _.get(config, 'options', {workspace: null}).workspace

      if (workspace !== null) {
        return workspace
      }

      return 'new'
    }
    return ''
  }

  private getWorkspaceID = (config: Config): string => {
    if (this.isDefaultConfig(config)) {
      return 'default'
    }

    if (this.isNewConfig(config)) {
      return 'new'
    }

    return this.getWorkspace(config)
  }

  private get configs(): Config[] {
    return _.sortBy(this.state.configs, c => {
      const id = getDeep<string>(c, 'options.id', '')
      const {isNewConfig} = c
      if (id === 'default') {
        return ''
      }
      if (isNewConfig) {
        return Infinity
      }
      return id
    })
  }

  private get isAddingConfigsAllowed() {
    const {isMultipleConfigsSupported} = this.props
    const isAllConfigsPersisted = _.every(this.configs, c => !c.isNewConfig)
    return isMultipleConfigsSupported && isAllConfigsPersisted
  }

  private handleAddConfig = (): void => {
    const {configs} = this.state
    const newConfig: Config = DEFAULT_CONFIG
    const updatedConfigs = [...configs, newConfig]
    this.setState({configs: updatedConfigs})
  }
}

export default DiscordConfigs
