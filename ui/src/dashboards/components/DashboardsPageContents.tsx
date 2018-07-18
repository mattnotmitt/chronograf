import React, {Component, MouseEvent} from 'react'

import Authorized, {EDITOR_ROLE} from 'src/auth/Authorized'

import DashboardsTable from 'src/dashboards/components/DashboardsTable'
import ImportDashboardOverlay from 'src/dashboards/components/ImportDashboardOverlay'
import SearchBar from 'src/hosts/components/SearchBar'
import FancyScrollbar from 'src/shared/components/FancyScrollbar'
import {ErrorHandling} from 'src/shared/decorators/errors'
import OverlayTechnology from 'src/reusable_ui/components/overlays/OverlayTechnology'
import Dropdown from 'src/reusable_ui/components/dropdowns/Dropdown'
import DropdownItem from 'src/reusable_ui/components/dropdowns/DropdownItem'
import DropdownDivider from 'src/reusable_ui/components/dropdowns/DropdownDivider'
import {IconFont, ComponentColor} from 'src/reusable_ui/types'

import {Dashboard} from 'src/types'
import {Notification} from 'src/types/notifications'

interface Props {
  dashboards: Dashboard[]
  onDeleteDashboard: (dashboard: Dashboard) => () => void
  onCreateDashboard: () => void
  onCloneDashboard: (
    dashboard: Dashboard
  ) => (event: MouseEvent<HTMLButtonElement>) => void
  onExportDashboard: (dashboard: Dashboard) => () => void
  onImportDashboard: (dashboard: Dashboard) => void
  notify: (message: Notification) => void
  dashboardLink: string
}

interface State {
  searchTerm: string
  isOverlayVisible: boolean
}

@ErrorHandling
class DashboardsPageContents extends Component<Props, State> {
  constructor(props) {
    super(props)

    this.state = {
      searchTerm: '',
      isOverlayVisible: false,
    }
  }

  public render() {
    const {
      onDeleteDashboard,
      onCreateDashboard,
      onCloneDashboard,
      onExportDashboard,
      dashboardLink,
    } = this.props

    return (
      <FancyScrollbar className="page-contents">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12">
              <div className="panel">
                {this.renderPanelHeading}
                <div className="panel-body">
                  <DashboardsTable
                    dashboards={this.filteredDashboards}
                    onDeleteDashboard={onDeleteDashboard}
                    onCreateDashboard={onCreateDashboard}
                    onCloneDashboard={onCloneDashboard}
                    onExportDashboard={onExportDashboard}
                    dashboardLink={dashboardLink}
                  />
                  <Dropdown
                    onChange={this.handleDropdownChange}
                    selectedItem="Bloooooooooooooooooooop"
                    icon={IconFont.Clock}
                    color={ComponentColor.Primary}
                    width={130}
                    wrapText={true}
                  >
                    <DropdownItem text="Swoop" />
                    <DropdownItem text="Scoop" />
                    <DropdownDivider text="Things" />
                    <DropdownItem text="Bloooooooooooooooooooop" />
                    <DropdownItem text="Ploop" />
                    <DropdownDivider />
                    <DropdownItem text="Droop" />
                    <DropdownItem text="Boop" />
                  </Dropdown>

                  <Dropdown
                    onChange={this.handleDropdownChange}
                    selectedItem="Bloooooooooooooooooooop"
                    icon={IconFont.Clock}
                    color={ComponentColor.Success}
                    width={130}
                  >
                    <DropdownItem text="Swoop" />
                    <DropdownItem text="Scoop" />
                    <DropdownDivider text="Things" />
                    <DropdownItem text="Bloooooooooooooooooooop" />
                    <DropdownItem text="Ploop" />
                    <DropdownDivider />
                    <DropdownItem text="Droop" />
                    <DropdownItem text="Boop" />
                  </Dropdown>

                  <Dropdown
                    onChange={this.handleDropdownChange}
                    selectedItem="Bloooooooooooooooooooop"
                    icon={IconFont.Clock}
                    color={ComponentColor.Warning}
                    width={130}
                  >
                    <DropdownItem text="Swoop" />
                    <DropdownItem text="Scoop" />
                    <DropdownDivider text="Things" />
                    <DropdownItem text="Bloooooooooooooooooooop" />
                    <DropdownItem text="Ploop" />
                    <DropdownDivider />
                    <DropdownItem text="Droop" />
                    <DropdownItem text="Boop" />
                  </Dropdown>

                  <Dropdown
                    onChange={this.handleDropdownChange}
                    selectedItem="Bloooooooooooooooooooop"
                    icon={IconFont.Cube}
                    color={ComponentColor.Danger}
                    width={130}
                  >
                    <DropdownItem text="Swoop" />
                    <DropdownItem text="Scoop" />
                    <DropdownDivider text="Things" />
                    <DropdownItem text="Bloooooooooooooooooooop" />
                    <DropdownItem text="Ploop" />
                    <DropdownDivider />
                    <DropdownItem text="Droop" />
                    <DropdownItem text="Boop" />
                  </Dropdown>

                  <Dropdown
                    onChange={this.handleDropdownChange}
                    selectedItem="Bloooooooooooooooooooop"
                    icon={IconFont.Clock}
                    color={ComponentColor.Alert}
                    width={130}
                  >
                    <DropdownItem text="Swoop" />
                    <DropdownItem text="Scoop" />
                    <DropdownDivider text="Things" />
                    <DropdownItem text="Bloooooooooooooooooooop" />
                    <DropdownItem text="Ploop" />
                    <DropdownDivider />
                    <DropdownItem text="Droop" />
                    <DropdownItem text="Boop" />
                  </Dropdown>

                  <Dropdown
                    onChange={this.handleDropdownChange}
                    selectedItem="Bloooooooooooooooooooop"
                    icon={IconFont.Clock}
                    color={ComponentColor.Default}
                    width={130}
                  >
                    <DropdownItem text="Swoop" />
                    <DropdownItem text="Scoop" />
                    <DropdownDivider text="Things" />
                    <DropdownItem text="Bloooooooooooooooooooop" />
                    <DropdownItem text="Ploop" />
                    <DropdownDivider />
                    <DropdownItem text="Droop" />
                    <DropdownItem text="Boop" />
                  </Dropdown>
                </div>
              </div>
            </div>
          </div>
        </div>
      </FancyScrollbar>
    )
  }

  private handleDropdownChange = (text: string) => {
    console.log(text)
  }

  private get renderPanelHeading(): JSX.Element {
    const {onCreateDashboard} = this.props

    return (
      <>
        <div className="panel-heading">
          <h2 className="panel-title">{this.panelTitle}</h2>
          <div className="panel-controls">
            <SearchBar
              placeholder="Filter by Name..."
              onSearch={this.filterDashboards}
            />
            <Authorized requiredRole={EDITOR_ROLE}>
              <>
                <button
                  className="btn btn-sm btn-default"
                  onClick={this.handleToggleOverlay}
                >
                  <span className="icon import" /> Import Dashboard
                </button>
                <button
                  className="btn btn-sm btn-primary"
                  onClick={onCreateDashboard}
                >
                  <span className="icon plus" /> Create Dashboard
                </button>
              </>
            </Authorized>
          </div>
        </div>
        {this.renderImportOverlay}
      </>
    )
  }

  private get filteredDashboards(): Dashboard[] {
    const {dashboards} = this.props
    const {searchTerm} = this.state

    return dashboards.filter(d =>
      d.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  private get panelTitle(): string {
    const {dashboards} = this.props

    if (dashboards === null) {
      return 'Loading Dashboards...'
    } else if (dashboards.length === 1) {
      return '1 Dashboard'
    }

    return `${dashboards.length} Dashboards`
  }

  private filterDashboards = (searchTerm: string): void => {
    this.setState({searchTerm})
  }

  private handleToggleOverlay = (): void => {
    this.setState({isOverlayVisible: !this.state.isOverlayVisible})
  }

  private get renderImportOverlay(): JSX.Element {
    const {onImportDashboard, notify} = this.props
    const {isOverlayVisible} = this.state

    return (
      <OverlayTechnology visible={isOverlayVisible}>
        <ImportDashboardOverlay
          onDismissOverlay={this.handleToggleOverlay}
          onImportDashboard={onImportDashboard}
          notify={notify}
        />
      </OverlayTechnology>
    )
  }
}

export default DashboardsPageContents
