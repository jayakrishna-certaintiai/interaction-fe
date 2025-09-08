// API Service for handling backend API calls
class APIService {
    constructor() {
        this.baseURL = process.env.REACT_APP_Base_URL || 'http://localhost:8082';
        this.defaultHeaders = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        };
    }

    // Helper method to handle API responses
    async handleResponse(response) {
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        return await response.json();
    }

    // Helper method to make API calls
    async makeRequest(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: { ...this.defaultHeaders },
            ...options,
        };

        // Add authorization token if available
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        try {
            const response = await fetch(url, config);
            return await this.handleResponse(response);
        } catch (error) {
            console.error(`API call failed for ${endpoint}:`, error);
            throw error;
        }
    }

    // Get companies list
    async getCompanies(userId = 'default') {
        try {
            // Use public route for demo purposes
            const response = await this.makeRequest(`/api/v1/company/public/get-companies`);
            
            if (response.success && response.data) {
                // Transform API data to match expected format
                const transformedCompanies = response.data.map((company, index) => ({
                    id: company.companyId,
                    companyId: company.companyId,
                    companyIdentifier: company.companyIdentifier,
                    companyName: company.companyName,
                    companyCode: company.companyCode,
                    industry: company.industry,
                    email: company.email,
                    phone: company.phone,
                    website: company.website,
                    companyType: company.companyType,
                    projectsCount: company.actualProjectsCount || company.projectsCount || 0,
                    employeesCount: company.employeesCount || 0,
                    annualRevenue: company.annualRevenue,
                    status: company.status || 'Active',
                    totalProjectCost: company.totalProjectCost || 0,
                    totalProjectHours: company.totalProjectHours || 0,
                    createdTime: company.createdTime,
                    modifiedTime: company.modifiedTime
                }));
                
                return {
                    success: true,
                    data: transformedCompanies
                };
            }
            
            return response;
        } catch (error) {
            console.error('Failed to fetch companies:', error);
            // Return mock data as fallback
            return {
                success: true,
                data: [
                    {
                        id: '1',
                        companyId: '1',
                        companyName: 'Demo Company - Loading Real Data...',
                        companyCode: 'DEMO001',
                        industry: 'Technology',
                        status: 'Active',
                        projectsCount: 0,
                        employeesCount: 0
                    }
                ]
            };
        }
    }

    // Get companies list (legacy method for backward compatibility)
    async getCompanies_Legacy(userId = 'default') {
        try {
            return await this.makeRequest(`/api/v1/company/${userId}/get-company-list`);
        } catch (error) {
            console.error('Failed to fetch companies:', error);
            // Return mock data as fallback
            return {
                success: true,
                data: [
                    {
                        companyId: '1',
                        companyName: 'Sample Company 1',
                        companyCode: 'SC001',
                        industry: 'Technology',
                        status: 'Active'
                    },
                    {
                        companyId: '2', 
                        companyName: 'Sample Company 2',
                        companyCode: 'SC002',
                        industry: 'Finance',
                        status: 'Active'
                    }
                ]
            };
        }
    }

    // Get projects by company
    async getProjectsByCompany(userId = 'default', companyId) {
        console.log('🔍 getProjectsByCompany called with:', { userId, companyId });
        try {
            console.log(`📡 Making request to: ${this.baseURL}/api/v1/company/public/${companyId}/get-projects`);
            const response = await this.makeRequest(`/api/v1/company/public/${companyId}/get-projects`);
            console.log('📥 Raw API response:', response);
            
            if (response.success && response.data) {
                // Transform the project data to ensure consistent field mapping
                const transformedProjects = response.data.map(project => ({
                    id: project.id || project.projectId,
                    projectId: project.projectId || project.id,
                    code: project.projectCode || project.code,
                    projectCode: project.projectCode || project.code,
                    name: project.projectName || project.name,
                    projectName: project.projectName || project.name,
                    teamLead: project.spocName || project.projectManager || project.teamLead,
                    projectManager: project.spocName || project.projectManager || project.teamLead,
                    status: project.projectStatus || project.status || 'Active',
                    projectStatus: project.projectStatus || project.status || 'Active',
                    lastModified: project.modifiedTime || project.lastModified || new Date().toISOString().split('T')[0],
                    modifiedTime: project.modifiedTime || project.lastModified || new Date().toISOString().split('T')[0],
                    description: project.description || project.projectDescription || '',
                    companyName: project.s_company_name || project.companyName,
                    s_company_name: project.s_company_name || project.companyName,
                    // Additional fields
                    spocEmail: project.spocEmail || '',
                    totalHours: project.totalHours || 0,
                    totalCost: project.totalCost || 0,
                    timesheetStatus: project.timesheetStatus || 'Active'
                }));
                
                console.log('✅ Transformed projects for company:', transformedProjects.length, 'projects');
                return {
                    success: true,
                    data: transformedProjects
                };
            }
            
            return { success: false, data: [] };
        } catch (error) {
            console.error('❌ getProjectsByCompany error:', error);
            return { success: false, data: [] };
        }
    }

    // Get projects by company (legacy method for backward compatibility)
    async getProjectsByCompany_Legacy(userId = 'default', companyId) {
        try {
            return await this.makeRequest(`/api/v1/company/${userId}/${companyId}/get-projects-by-company`);
        } catch (error) {
            console.error('Failed to fetch projects by company:', error);
            // Return mock data as fallback
            return {
                success: true,
                data: [
                    {
                        projectId: '1',
                        projectCode: 'ALLGIT006_4',
                        projectName: 'Teams CMD',
                        projectManager: 'Sanjay Agnihotri',
                        projectStatus: 'Active',
                        modifiedTime: '2024-08-05',
                    },
                    {
                        projectId: '2',
                        projectCode: 'ALLGBPS007_1',
                        projectName: 'Contractor Services',
                        projectManager: 'Pratik Singh',
                        projectStatus: 'In Progress',
                        modifiedTime: '2024-08-03',
                    }
                ]
            };
        }
    }

    // Get all projects for a user
    async getProjects(userId = 'default', companyId = 'default') {
        try {
            // Use public route for demo purposes
            const response = await this.makeRequest(`/api/v1/projects/public/get-projects`);
            
            if (response.success && response.data) {
                // Transform API data to match expected format
                const transformedProjects = response.data.map((project, index) => ({
                    id: project.projectId || project.projectIdentifier || index + 1,
                    projectId: project.projectId,
                    code: project.projectCode, // Map projectCode to code for UI compatibility
                    projectCode: project.projectCode,
                    name: project.projectName, // Map projectName to name for UI compatibility
                    projectName: project.projectName,
                    teamLead: project.spocName || project.projectManager || 'Not Assigned', // Map to teamLead for UI compatibility
                    projectManager: project.spocName || project.projectManager || 'Not Assigned',
                    status: project.projectStatus || 'Active', // Map to status for UI compatibility
                    projectStatus: project.projectStatus || 'Active',
                    lastModified: project.modifiedTime ? project.modifiedTime.split('T')[0] : '2024-08-04', // Map to lastModified for UI compatibility
                    modifiedTime: project.modifiedTime ? project.modifiedTime.split('T')[0] : '2024-08-04',
                    description: project.description || `${project.projectName} - Business Operations and Support Services`,
                    companyName: project.s_company_name || 'Microsoft Corporation', // Map to companyName for UI compatibility
                    s_company_name: project.s_company_name || 'Microsoft Corporation',
                    // Additional fields from database
                    spocEmail: project.spocEmail,
                    totalHours: project.s_total_hours,
                    totalCost: project.s_total_project_cost,
                    fteCost: project.s_fte_cost,
                    subconCost: project.s_subcon_cost,
                    timesheetStatus: project.s_timesheet_status,
                    companyId: project.companyId
                }));
                
                return {
                    success: true,
                    data: transformedProjects
                };
            }
            
            return response;
        } catch (error) {
            console.error('Failed to fetch projects:', error);
            // Return mock data as fallback
            return {
                success: true,
                data: [
                    {
                        id: 1,
                        projectId: '1',
                        code: 'DEMO001', // Use code for UI compatibility
                        projectCode: 'DEMO001',
                        name: 'Demo Project - Loading Real Data...', // Use name for UI compatibility
                        projectName: 'Demo Project - Loading Real Data...',
                        teamLead: 'Demo Manager', // Use teamLead for UI compatibility
                        projectManager: 'Demo Manager',
                        status: 'Active', // Use status for UI compatibility
                        projectStatus: 'Active',
                        lastModified: '2024-08-07', // Use lastModified for UI compatibility
                        modifiedTime: '2024-08-07',
                        description: 'This is a demo project while loading real data from the database.',
                        companyName: 'Demo Company', // Use companyName for UI compatibility
                        s_company_name: 'Demo Company'
                    }
                ]
            };
        }
    }

    // Get project details
    async getProjectDetails(userId = 'default', companyId, projectId) {
        try {
            return await this.makeRequest(`/api/v1/projects/${userId}/${companyId}/${projectId}/project-details`);
        } catch (error) {
            console.error('Failed to fetch project details:', error);
            throw error;
        }
    }

    // Get company details
    async getCompanyDetails(userId = 'default', companyId) {
        try {
            // Use public route for demo purposes
            const response = await this.makeRequest(`/api/v1/company/public/${companyId}/details`);
            
            if (response.success && response.data) {
                return {
                    success: true,
                    data: response.data
                };
            }
            
            return response;
        } catch (error) {
            console.error('Failed to fetch company details:', error);
            // Fallback to legacy endpoint
            try {
                return await this.makeRequest(`/api/v1/company/${userId}/${companyId}/get-company-details`);
            } catch (legacyError) {
                console.error('Legacy endpoint also failed:', legacyError);
                throw error;
            }
        }
    }

    // Get company details (legacy method for backward compatibility)
    async getCompanyDetails_Legacy(userId = 'default', companyId) {
        try {
            return await this.makeRequest(`/api/v1/company/${userId}/${companyId}/get-company-details`);
        } catch (error) {
            console.error('Failed to fetch company details:', error);
            throw error;
        }
    }

    // Get team members for a project
    async getTeamMembers(userId = 'default', companyId, projectId) {
        try {
            return await this.makeRequest(`/api/v1/projects/${userId}/${companyId}/${projectId}/get-team-members`);
        } catch (error) {
            console.error('Failed to fetch team members:', error);
            return { success: true, data: [] };
        }
    }

    // Get project financials
    async getProjectFinancials(userId = 'default', companyId, projectId) {
        try {
            return await this.makeRequest(`/api/v1/projects/${userId}/${companyId}/${projectId}/get-project-financials`);
        } catch (error) {
            console.error('Failed to fetch project financials:', error);
            return { success: true, data: [] };
        }
    }

    // Search projects by query
    async searchProjects(query, userId = 'default') {
        try {
            const projects = await this.getProjects(userId);
            if (projects.success && projects.data) {
                const filteredProjects = projects.data.filter(project =>
                    project.projectName?.toLowerCase().includes(query.toLowerCase()) ||
                    project.projectCode?.toLowerCase().includes(query.toLowerCase()) ||
                    project.projectManager?.toLowerCase().includes(query.toLowerCase()) ||
                    project.description?.toLowerCase().includes(query.toLowerCase()) ||
                    project.s_company_name?.toLowerCase().includes(query.toLowerCase())
                );
                return { success: true, data: filteredProjects };
            }
            return projects;
        } catch (error) {
            console.error('Failed to search projects:', error);
            throw error;
        }
    }
}

// Export singleton instance
const apiServiceInstance = new APIService();
export default apiServiceInstance;
