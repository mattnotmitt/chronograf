import React, {PureComponent, MouseEvent, ChangeEvent} from 'react'
import {ErrorHandling} from 'src/shared/decorators/errors'

import {Notification, NotificationFunc} from 'src/types'

import {DiscordProperties} from 'src/types/kapacitor'

import {getDeep} from 'src/utils/wrappers'

interface Config {
  options: DiscordProperties
  isNewConfig?: boolean
}


interface Props {
  config: Config
  onSave: (
    properties: DiscordProperties,
    isNewConfig: boolean,
    specificConfig: string
  ) => Promise<boolean>
  onTest: (
    event: React.MouseEvent<HTMLButtonElement>,
    specificConfigOptions: Partial<DiscordProperties>
  ) => void
  enabled: boolean
  notify: (message: Notification | NotificationFunc) => void
  workspaceID: string
  onDelete: (specificConfig: string, workspaceID: string) => void
  isDefaultConfig: boolean
}

interface State {
  workspace: string
  testEnabled: boolean
  enabled: boolean
}

@ErrorHandling
class DiscordConfig extends PureComponent<Props, State> {
  private url: HTMLInputElement
  private username: HTMLInputElement
  private avatarUrl: HTMLInputElement
  private embedTitle: HTMLInputElement
  private timestamp: HTMLInputElement
  private sslCA: HTMLInputElement
  private sslCert: HTMLInputElement
  private sslKey: HTMLInputElement
  private insecureSkipVerify: HTMLInputElement

  constructor(props) {
    super(props)

    this.state = {
      workspace: getDeep<string>(this.props, 'config.options.workspace', ''),
      testEnabled: this.props.enabled,
      enabled: getDeep<boolean>(this.props, 'config.options.enabled', false),
    }
  }

  public render() {
    const { 
      url, username, timestamp,
      'avatar-url': avatarUrl, 
      'embed-title': embedTitle, 
      'ssl-ca': sslCA, 
      'ssl-cert': sslCert, 
      'ssl-key': sslKey,  
      'insecure-skip-verify': insecureSkipVerify} = this.options
    const {enabled, workspace, testEnabled} = this.state

    return (
      <form onSubmit={this.handleSubmit}>
         <div className="form-group col-xs-12">
          <label htmlFor={`${this.workspaceID}-nickname`}>
            Nickname this Configuration
          </label>
          <input
            className="form-control"
            id={`${this.workspaceID}-nickname`}
            type="text"
            placeholder={this.nicknamePlaceholder}
            value={workspace}
            onChange={this.handleWorkspaceChange}
            disabled={this.isNicknameDisabled}
          />
        </div>
        <div className="form-group col-xs-12">
          <label htmlFor={`${this.workspaceID}-url`}>
            Discord Webhook URL (
            <a href="https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks" target="_">
              see more on Discord webhooks
            </a>
            )
          </label>
          <input
            className="form-control"
            id={`${this.workspaceID}-url`}
            type="text"
            placeholder=""
            ref={r => (this.url = r)}
            defaultValue={url || ''}
            onChange={this.disableTest}
          />
        </div>
        <div className="form-group col-xs-12">
          <label htmlFor={`${this.workspaceID}-username`}>
            Username (optional)
          </label>
          <input
            className="form-control"
            id={`${this.workspaceID}-username`}
            type="text"
            placeholder="Kapacitor Alert"
            ref={r => (this.username = r)}
            defaultValue={username || ''}
            onChange={this.disableTest}
          />
        </div>
        <div className="form-group col-xs-12">
          <label htmlFor={`${this.workspaceID}-avatarUrl`}>
            Avatar URL (optional)
          </label>
          <input
            className="form-control"
            id={`${this.workspaceID}-avatarUrl`}
            type="text"
            placeholder="Kapacitor"
            ref={r => (this.avatarUrl = r)}
            defaultValue={avatarUrl || ''}
            onChange={this.disableTest}
          />
        </div>
        <div className="form-group col-xs-12">
          <label htmlFor={`${this.workspaceID}-embedTitle`}>
            Avatar URL (optional)
          </label>
          <input
            className="form-control"
            id={`${this.workspaceID}-embedTitle`}
            type="text"
            placeholder="Kapacitor Alert"
            ref={r => (this.embedTitle = r)}
            defaultValue={embedTitle || ''}
            onChange={this.disableTest}
          />
        </div>
        <div className="form-group col-xs-12">
          <div className="form-control-static">
            <input
              id={`${this.workspaceID}-timestamp`}
              type="checkbox"
              defaultChecked={timestamp}
              ref={r => (this.timestamp = r)}
              onChange={this.disableTest}
            />
            <label htmlFor={`${this.workspaceID}-timestamp`}>
              Show timestamp in embed
            </label>
          </div>
        </div>

        <div className="form-group col-xs-12">
          <label htmlFor={`${this.workspaceID}-sslCA`}>SSL CA</label>
          <input
            className="form-control"
            id={`${this.workspaceID}-sslCA`}
            type="text"
            ref={r => (this.sslCA = r)}
            defaultValue={sslCA || ''}
            onChange={this.disableTest}
          />
        </div>
        <div className="form-group col-xs-12">
          <label htmlFor={`${this.workspaceID}-sslCert`}>SSL Cert</label>
          <input
            className="form-control"
            id={`${this.workspaceID}-sslCert`}
            type="text"
            ref={r => (this.sslCert = r)}
            defaultValue={sslCert || ''}
            onChange={this.disableTest}
          />
        </div>
        <div className="form-group col-xs-12">
          <label htmlFor={`${this.workspaceID}-sslKey`}>SSL Key</label>
          <input
            className="form-control"
            id={`${this.workspaceID}-sslKey`}
            type="text"
            ref={r => (this.sslKey = r)}
            defaultValue={sslKey || ''}
            onChange={this.disableTest}
          />
        </div>
        <div className="form-group col-xs-12">
          <div className="form-control-static">
            <input
              id={`${this.workspaceID}-insecureSkipVerify`}
              type="checkbox"
              defaultChecked={insecureSkipVerify}
              ref={r => (this.insecureSkipVerify = r)}
              onChange={this.disableTest}
            />
            <label htmlFor={`${this.workspaceID}-insecureSkipVerify`}>
              Insecure Skip Verify
            </label>
          </div>
        </div>
        <div className="form-group col-xs-12">
          <div className="form-control-static">
            <input
              type="checkbox"
              id={`${this.workspaceID}-enabled`}
              checked={enabled}
              onChange={this.handleConfigEnabledChange}
            />
            <label htmlFor={`${this.workspaceID}-enabled`}>Configuration Enabled</label>
          </div>
        </div>
        <div className="form-group form-group-submit col-xs-12 text-center">
          <button
            className="btn btn-primary"
            type="submit"
            disabled={testEnabled || this.isWorkspaceEmpty}
          >
            <span className="icon checkmark" />
            Save Changes
          </button>
          <button
            className="btn btn-primary"
            disabled={this.isTestDisabled}
            onClick={this.handleTest}
          >
            <span className="icon pulse-c" />
            Send Test Alert
          </button>
          {this.deleteButton}
          <hr />
        </div>
      </form>
    )
  }

  private get options(): DiscordProperties {
    const {
      config: {options},
    } = this.props

    return options
  }

  private handleWorkspaceChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({workspace: e.target.value})
  }

  private get isNewConfig(): boolean {
    return getDeep<boolean>(this.props, 'config.isNewConfig', false)
  }

  private get isDefaultConfig(): boolean {
    return this.props.isDefaultConfig
  }

  private get deleteButton(): JSX.Element {
    if (this.isDefaultConfig) {
      return null
    }

    return (
      <button className="btn btn-danger" onClick={this.handleDelete}>
        <span className="icon trash" />
        Delete
      </button>
    )
  }

  private handleSubmit = async e => {
    e.preventDefault()

    const properties: DiscordProperties = {
      url: this.url.value,
      username: this.username.value,
      'avatar-url': this.avatarUrl.value,
      'embed-title': this.embedTitle.value,
      timestamp: this.timestamp.checked,
      'ssl-ca': this.sslCA.value,
      'ssl-cert': this.sslCert.value,
      'ssl-key': this.sslKey.value,
      'insecure-skip-verify': this.insecureSkipVerify.checked,
      enabled: this.state.enabled,
    }

    if (this.isNewConfig) {
      properties.workspace = this.state.workspace
    }

    const success = await this.props.onSave(
      properties,
      this.isNewConfig,
      this.workspaceID
    )
    if (success) {
      this.setState({testEnabled: true})
    }
  }

  private handleConfigEnabledChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({enabled: e.target.checked})
    this.disableTest()
  }

  private handleDelete = async e => {
    e.preventDefault()
    const {workspace} = this.state
    await this.props.onDelete(workspace, this.workspaceID)
  }

  private handleTest = (e: MouseEvent<HTMLButtonElement>): void => {
    this.props.onTest(e, {workspace: this.workspaceID})
  }

  private disableTest = () => {
    this.setState({testEnabled: false})
  }

  private get workspaceID(): string {
    return this.props.workspaceID
  }

  private get nicknamePlaceholder(): string {
    if (this.isDefaultConfig) {
      return 'Only for additional Configurations'
    }
    return 'Must be different from previous Configurations'
  }

  private get isWorkspaceEmpty(): boolean {
    const {workspace} = this.state
    return workspace === '' && !this.isDefaultConfig
  }

  private get isTestDisabled(): boolean {
    const {testEnabled, enabled} = this.state
    return !testEnabled || !enabled || this.isWorkspaceEmpty
  }

  private get isNicknameDisabled(): boolean {
    return !this.isNewConfig || this.isDefaultConfig
  }
}

export default DiscordConfig
