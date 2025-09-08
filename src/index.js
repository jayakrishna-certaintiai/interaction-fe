import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { ActivityProvider } from "./context/ActivityContext";
import { AuthProvider } from "./context/AuthProvider";
import { ClientProvider } from "./context/ClientContext";
import { ContactProvider } from "./context/ContactContext";
import { DocumentProvider } from "./context/DocumentContext";
import { FilterListProvider } from "./context/FiltersListContext";
import { NotificationProvider } from "./context/NotificationContext";
import { PortfolioProvider } from "./context/PortfolioContext";
import { ProjectProvider } from "./context/ProjectContext";
import { TimesheetProvider } from "./context/TimesheetContext";
import { UserManagementProvider } from "./context/UserManagementContext";
import { WorkbenchProvider } from "./context/WorkbenchContext";
import "./index.css";
import { UserRoleManagementProvider } from "./context/UserRoleManagementContext";
import { CaseContextProvider } from "./context/CaseContext";
import { SheetsProvider } from "./context/SheetsContext";
import { MapperProvider } from "./context/MapperContext";
import { WagesProvider } from "./context/WagesContext";
import { EmployeesProvider } from "./context/EmployeeContext";
import { ProjectTeamProvider } from "./context/ProjectTeammemberContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <AuthProvider>
      <FilterListProvider>
        <ClientProvider>
          <ContactProvider>
            <UserManagementProvider>
              <UserRoleManagementProvider>
                <TimesheetProvider>
                  <PortfolioProvider>
                    <ProjectProvider>
                      <ProjectTeamProvider>
                        
                        <SheetsProvider>
                          <EmployeesProvider>
                            <WorkbenchProvider>
                              <CaseContextProvider>
                                <ActivityProvider>
                                  <DocumentProvider>
                                    <NotificationProvider>
                                      <MapperProvider>
                                        <WagesProvider>
                                          <App />
                                        </WagesProvider>
                                      </MapperProvider>
                                    </NotificationProvider>
                                  </DocumentProvider>
                                </ActivityProvider>
                              </CaseContextProvider>
                            </WorkbenchProvider>
                          </EmployeesProvider>
                        </SheetsProvider>
                      </ProjectTeamProvider>
                    </ProjectProvider>
                  </PortfolioProvider>
                </TimesheetProvider>
              </UserRoleManagementProvider>
            </UserManagementProvider>
          </ContactProvider>
        </ClientProvider>
      </FilterListProvider>
    </AuthProvider>
  </BrowserRouter>
);
