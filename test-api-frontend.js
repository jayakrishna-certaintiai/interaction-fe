// Test API calls from frontend perspective
const fetch = require('node-fetch');

const baseURL = 'http://localhost:8082';

async function testCompaniesAPI() {
    console.log('Testing Companies API...');
    try {
        const response = await fetch(`${baseURL}/api/v1/company/public/get-companies`);
        const data = await response.json();
        console.log('Companies API Response:', {
            success: data.success,
            count: data.data?.length || 0,
            companies: data.data?.slice(0, 3).map(c => ({
                id: c.companyId,
                name: c.companyName,
                projectsCount: c.actualProjectsCount
            }))
        });
        return data.data?.[0]; // Return first company for projects test
    } catch (error) {
        console.error('Companies API Error:', error.message);
        return null;
    }
}

async function testProjectsAPI(companyId) {
    if (!companyId) {
        console.log('No company ID provided for projects test');
        return;
    }
    
    console.log('\nTesting Projects API for company:', companyId);
    try {
        const response = await fetch(`${baseURL}/api/v1/company/public/${companyId}/get-projects`);
        const data = await response.json();
        console.log('Projects API Response:', {
            success: data.success,
            count: data.data?.length || 0,
            projects: data.data?.slice(0, 3).map(p => ({
                id: p.projectId,
                name: p.projectName,
                code: p.projectCode,
                manager: p.spocName
            }))
        });
    } catch (error) {
        console.error('Projects API Error:', error.message);
    }
}

async function runTests() {
    console.log('Frontend API Test Started...\n');
    
    // Test companies endpoint
    const firstCompany = await testCompaniesAPI();
    
    // Test projects endpoint with first company
    if (firstCompany) {
        await testProjectsAPI(firstCompany.companyId);
    }
    
    console.log('\nFrontend API Test Completed.');
}

runTests();
