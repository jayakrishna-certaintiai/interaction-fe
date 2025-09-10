import React, { useState, useRef, useEffect } from 'react';
import {
    Box,
    Typography,
    TextField,
    IconButton,
    Avatar,
    InputAdornment,
    Paper,
    List,
    ListItemIcon,
    ListItemText,
    Button,
    Tooltip,
    MenuItem,
    CircularProgress,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Switch,
    FormControlLabel,
    Drawer,
    ListItemButton,
    Menu,
    Divider,
    ButtonGroup,
    Autocomplete,
    Collapse
} from '@mui/material';
import { 
    Send, 
    Person, 
    Search,
    History,
    Add,
    Delete,
    Settings,
    Analytics,
    Business,
    Code,
    Refresh,
    Download,
    Close,
    ChatBubbleOutline,
    MoreVert,
    AttachFile,
    CloudUpload,
    Timeline,
    Summarize,
    Public,
    AccountBox,
    ExpandMore,
    ExpandLess,
    Clear
} from '@mui/icons-material';
import axios from 'axios';
import { BaseURL } from '../../constants/Baseurl';
import { Authorization_header } from '../../utils/helper/Constant';
import toast from 'react-hot-toast';

const EnhancedChatAssistant = () => {
    // Chat State
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [conversationHistory, setConversationHistory] = useState([]);
    
    // Chat History State - Enhanced with dynamic titles
    const [chatSessions, setChatSessions] = useState([
        {
            id: 'default',
            title: 'General Chat',
            lastMessage: '',
            timestamp: new Date(),
            messageCount: 0,
            isActive: true,
            mode: 'general',
            contextInfo: 'Ready for any questions'
        }
    ]);
    const [currentChatId, setCurrentChatId] = useState('default');
    const [searchHistory, setSearchHistory] = useState('');
    const [filteredSessions, setFilteredSessions] = useState(chatSessions);
    
    // Enhanced Mode State with hierarchical selection: general > account > project
    const [chatMode, setChatMode] = useState('general'); // 'general', 'account', 'project'
    const [selectedAccount, setSelectedAccount] = useState('');
    const [selectedProject, setSelectedProject] = useState(''); // Selected specific project
    const [accounts, setAccounts] = useState([]);
    const [projects, setProjects] = useState([]);
    const [currentProjectDetails, setCurrentProjectDetails] = useState(null); // Full project details
    
    // UI State
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [showSQLQuery, setShowSQLQuery] = useState('');
    const [showSettings, setShowSettings] = useState(false);
    const [modeDropdownOpen, setModeDropdownOpen] = useState(false);
    const [chatMenuAnchor, setChatMenuAnchor] = useState(null);
    const [showUploadDialog, setShowUploadDialog] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [showSummaryDialog, setShowSummaryDialog] = useState(false);
    const [showTimelineDialog, setShowTimelineDialog] = useState(false);
    const [showHistoryDialog, setShowHistoryDialog] = useState(false);
    const [chatSummary, setChatSummary] = useState('');
    const [chatTimeline, setChatTimeline] = useState('');
    const [downloadMenuAnchor, setDownloadMenuAnchor] = useState(null);
    
    // Settings State
    const [autoSave, setAutoSave] = useState(true);
    const [sqlMode, setSqlMode] = useState(false);
    const [analysisMode, setAnalysisMode] = useState(false);
    
    const messagesEndRef = useRef(null);
    const chatInputRef = useRef(null);

    // Initialize data
    useEffect(() => {
        fetchAccounts();
        initializeWelcomeChat();
    }, []);

    // Filter chat sessions based on search
    useEffect(() => {
        if (searchHistory.trim()) {
            const filtered = chatSessions.filter(session => 
                session.title.toLowerCase().includes(searchHistory.toLowerCase()) ||
                session.lastMessage.toLowerCase().includes(searchHistory.toLowerCase())
            );
            setFilteredSessions(filtered);
        } else {
            setFilteredSessions(chatSessions);
        }
    }, [searchHistory, chatSessions]);

    // Auto-scroll to bottom
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const initializeWelcomeChat = () => {
        const welcomeMessage = {
            id: 'welcome-msg',
            type: 'system',
            content: `Welcome to the AI Chat Assistant!

I can help you in two ways:

**General Mode**: Ask me anything about business, finance, tax, or general questions
**Account Mode**: Select an account to access project data, generate SQL queries, and analyze business metrics

Choose your preferred mode and start chatting!`,
            timestamp: new Date(),
            sender: 'assistant'
        };
        setMessages([welcomeMessage]);
    };

    const fetchAccounts = async () => {
        try {
            console.log('Fetching accounts from:', `${BaseURL}/api/v1/company/public/get-companies`);
            const response = await axios.get(
                `${BaseURL}/api/v1/company/public/get-companies`,
                Authorization_header()
            );
            console.log('Accounts response:', response.data);
            
            if (response.data.success) {
                const accountsData = response.data.data || [];
                console.log('Setting accounts:', accountsData);
                setAccounts(accountsData);
                
                if (accountsData.length === 0) {
                    toast.info('No accounts found. Please check your permissions.');
                }
            } else {
                console.error('Failed to fetch accounts:', response.data.error);
                toast.error('Failed to load accounts: ' + (response.data.error || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error fetching accounts:', error);
            toast.error('Failed to load accounts: ' + (error.response?.data?.error || error.message));
        }
    };

    const fetchProjectsForAccount = async (accountId) => {
        try {
            console.log('Fetching projects for account:', accountId);
            const response = await axios.get(
                `${BaseURL}/api/v1/company/public/${accountId}/get-projects`,
                Authorization_header()
            );
            console.log('Projects response:', response.data);
            
            if (response.data.success) {
                const projectsData = response.data.data || [];
                console.log('Setting projects:', projectsData);
                setProjects(projectsData);
                return projectsData;
            } else {
                console.error('Failed to fetch projects:', response.data.error);
                setProjects([]);
                return [];
            }
        } catch (error) {
            console.error('Error fetching projects:', error);
            setProjects([]);
            return [];
        }
    };

    const createNewChat = () => {
        const newChatId = `chat-${Date.now()}`;
        const newSession = {
            id: newChatId,
            title: 'New Chat',
            lastMessage: '',
            timestamp: new Date(),
            messageCount: 0,
            isActive: false
        };
        
        // Update previous chat as inactive
        setChatSessions(prev => prev.map(session => 
            session.id === currentChatId 
                ? { ...session, isActive: false }
                : session
        ));
        
        // Add new chat session
        setChatSessions(prev => [newSession, ...prev]);
        setCurrentChatId(newChatId);
        setMessages([]);
        setConversationHistory([]);
        
        // Add welcome message for new chat
        const welcomeMessage = {
            id: `welcome-${newChatId}`,
            type: 'system',
            content: `New conversation started. How can I help you today?`,
            timestamp: new Date(),
            sender: 'assistant'
        };
        setMessages([welcomeMessage]);
    };

    const switchToChat = (chatId) => {
        // Save current chat state
        if (autoSave && messages.length > 0) {
            saveChatSession(currentChatId);
        }
        
        // Mark current chat as inactive and new chat as active
        setChatSessions(prev => prev.map(session => ({
            ...session,
            isActive: session.id === chatId
        })));
        
        setCurrentChatId(chatId);
        // Here you would load the messages for this chat session
        // For now, we'll start with a clean slate
        if (chatId === 'welcome') {
            initializeWelcomeChat();
        } else {
            setMessages([]);
            setConversationHistory([]);
        }
    };

    const saveChatSession = (chatId) => {
        if (messages.length > 0) {
            const lastMessage = messages[messages.length - 1];
            const title = messages.length > 1 
                ? messages[1]?.content?.substring(0, 50) + '...' 
                : 'New Chat';
            
            setChatSessions(prev => prev.map(session => 
                session.id === chatId 
                    ? {
                        ...session,
                        title: title,
                        lastMessage: lastMessage.content.substring(0, 100),
                        messageCount: messages.length,
                        timestamp: new Date()
                    }
                    : session
            ));
        }
    };

    const deleteChatSession = (chatId) => {
        if (chatSessions.length <= 1) {
            toast.error('Cannot delete the last chat session');
            return;
        }
        
        setChatSessions(prev => prev.filter(session => session.id !== chatId));
        
        if (currentChatId === chatId) {
            const remainingChats = chatSessions.filter(session => session.id !== chatId);
            if (remainingChats.length > 0) {
                switchToChat(remainingChats[0].id);
            }
        }
    };

    const handleModeChange = async (mode, accountId = '', projectId = '') => {
        setChatMode(mode);
        setSelectedAccount(accountId);
        setSelectedProject(projectId);
        setCurrentProjectDetails(null);
        setIsLoading(true); // Show loading while preparing data context
        
        // Clear current chat for new mode
        setMessages([]);
        setConversationHistory([]);
        
        let projectsData = [];
        let selectedProjectDetails = null;
        let contextPreparationMessage = '';
        
        try {
            if (mode === 'account' && accountId) {
                contextPreparationMessage = 'Loading complete account data for comprehensive analysis...';
                projectsData = await fetchProjectsForAccount(accountId);
                setProjects(projectsData); // Set projects for account mode
                
                // Pre-load account context for better LLM responses
                try {
                    const accountDataResponse = await axios.get(
                        `${BaseURL}/api/v1/project/company/${accountId}`,
                        Authorization_header()
                    );
                    console.log('Pre-loaded account context for LLM:', accountDataResponse.data);
                } catch (error) {
                    console.warn('Could not pre-load account context:', error);
                }
                
            } else if (mode === 'project' && accountId && projectId) {
                contextPreparationMessage = 'Loading complete project data for detailed analysis...';
                projectsData = await fetchProjectsForAccount(accountId);
                setProjects(projectsData); // Set projects for project mode
                selectedProjectDetails = projectsData.find(p => p.projectId === projectId);
                setCurrentProjectDetails(selectedProjectDetails);
                
                // Pre-load project context for better LLM responses
                try {
                    const projectDataResponse = await axios.get(
                        `${BaseURL}/api/v1/project/details/${projectId}?companyId=${accountId}`,
                        Authorization_header()
                    );
                    console.log('Pre-loaded project context for LLM:', projectDataResponse.data);
                } catch (error) {
                    console.warn('Could not pre-load project context:', error);
                }
                
            } else {
                setProjects([]);
                contextPreparationMessage = 'Preparing general mode with full platform access...';
            }
        } catch (error) {
            console.error('Error during mode change:', error);
        } finally {
            setIsLoading(false);
        }
        
        // Update chat session with context information
        updateChatSessionContext(mode, accountId, projectId, selectedProjectDetails, projectsData);
        
        const modeMessage = generateModeMessage(mode, accountId, projectId, projectsData, selectedProjectDetails);
        setMessages([modeMessage]);
    };

    const updateChatSessionContext = (mode, accountId, projectId, projectDetails, projectsData = []) => {
        let title = 'General Chat';
        let contextInfo = 'Ready for any questions';
        
        if (mode === 'project' && projectDetails) {
            const accountName = accounts.find(acc => acc.companyId === accountId)?.companyName || 'Unknown Account';
            const fiscalYear = projectDetails.fiscalYear || (projectDetails.startDate ? `FY${new Date(projectDetails.startDate).getFullYear()}` : 'FY2024');
            const status = projectDetails.projectStatus || projectDetails.status || 'Active';
            title = `${projectDetails.projectName || projectDetails.name || projectDetails.projectCode || projectDetails.code || `Project ${projectId}`}`;
            // Professional single-line status display with fiscal year, status, ID
            contextInfo = `${fiscalYear} • ${status} • ID: ${projectId} • ${accountName}`;
        } else if (mode === 'project' && projectId) {
            // Fallback when project details are not found but projectId is provided
            const accountName = accounts.find(acc => acc.companyId === accountId)?.companyName || 'Unknown Account';
            title = `Project ${projectId}`;
            contextInfo = `FY2024 • Active • ID: ${projectId} • ${accountName}`;
        } else if (mode === 'account' && accountId) {
            const accountName = accounts.find(acc => acc.companyId === accountId)?.companyName || 'Unknown Account';
            const projectCount = projectsData.length || projects.length;
            const currentYear = new Date().getFullYear();
            const fiscalYear = `FY${currentYear}`;
            title = accountName;
            // Professional account-level status display
            contextInfo = `${fiscalYear} • Account Level • ${projectCount} Projects • All Data Scope`;
        } else {
            // General mode professional display - now fully capable
            const currentYear = new Date().getFullYear();
            const fiscalYear = `FY${currentYear}`;
            contextInfo = `${fiscalYear} • General Mode • All Questions Welcome • Full Access`;
        }
        
        setChatSessions(prev => prev.map(session => 
            session.id === currentChatId 
                ? { ...session, title, contextInfo, mode, accountId, projectId }
                : session
        ));
    };

    const generateModeMessage = (mode, accountId, projectId, projectsData, projectDetails) => {
        const accountName = accounts.find(acc => acc.companyId === accountId)?.companyName || 'Selected Account';
        
        let content = '';
        
        if (mode === 'project' && projectDetails) {
            const fiscalYear = projectDetails.fiscalYear || (projectDetails.startDate ? `FY${new Date(projectDetails.startDate).getFullYear()}` : 'FY2024');
            const status = projectDetails.projectStatus || projectDetails.status || 'Active';
            
            content = `**Project Selected**

**PROJECT:** **${projectDetails.projectName || projectDetails.name || projectDetails.projectCode || projectDetails.code || `Project ${projectId}`}**
**Context:** ${fiscalYear} • ${status} • ID: ${projectId}

Ready to help with any questions about this project.`;
        } else if (mode === 'project' && projectId) {
            // Fallback when project details are not found
            content = `**Project Selected**

**PROJECT:** **Project ${projectId}**
**Context:** FY2024 • Active • ID: ${projectId}

Ready to help with any questions about this project.`;
        } else if (mode === 'account') {
            const currentYear = new Date().getFullYear();
            const fiscalYear = `FY${currentYear}`;
            
            content = `**Account Mode Active**

**ACCOUNT:** **${accountName}**
**Context:** ${fiscalYear} • Account Level • ${projectsData.length} Projects Available

Ready to help with any questions about this account or its projects.`;
        } else {
            const currentYear = new Date().getFullYear();
            const fiscalYear = `FY${currentYear}`;
            
            content = `**General Mode Active**

**Context:** ${fiscalYear} • General Mode • All Accounts & Projects

Ready to help with any questions across all accounts and projects.`;
        }
        
        return {
            id: Date.now(),
            type: 'system',
            content: content,
            timestamp: new Date(),
            sender: 'system',
            metadata: {
                mode: mode,
                accountId: accountId,
                projectId: projectId,
                projectCount: projectsData.length
            }
        };
    };

    const sendMessage = async () => {
        if (!inputMessage.trim() || isLoading) return;

        const userMessage = {
            id: Date.now(),
            type: 'user',
            content: inputMessage.trim(),
            timestamp: new Date(),
            sender: 'user'
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsLoading(true);

        try {
            let endpoint = '';
            let requestBody = {
                message: userMessage.content,
                conversationHistory: conversationHistory,
                scope: chatMode // Add scope to indicate data feeding level
            };

            // Scope-based data feeding implementation with complete context
            let contextData = {};
            
            if (chatMode === 'project' && selectedProject && selectedAccount) {
                console.log('Project mode - Fetching complete project data');
                console.log('Selected account ID:', selectedAccount);
                console.log('Selected project ID:', selectedProject);
                endpoint = `${BaseURL}/api/v1/enhanced-chat/enhanced-chat`;
                
                // Fetch comprehensive project data
                try {
                    const projectDataResponse = await axios.get(
                        `${BaseURL}/api/v1/project/details/${selectedProject}?companyId=${selectedAccount}`,
                        Authorization_header()
                    );
                    
                    const timesheetResponse = await axios.get(
                        `${BaseURL}/api/v1/timesheet/project/${selectedProject}?companyId=${selectedAccount}`,
                        Authorization_header()
                    );
                    
                    const budgetResponse = await axios.get(
                        `${BaseURL}/api/v1/project/budget/${selectedProject}?companyId=${selectedAccount}`,
                        Authorization_header()
                    );
                    
                    contextData = {
                        projectDetails: projectDataResponse.data.data || {},
                        timesheets: timesheetResponse.data.data || [],
                        budgetInfo: budgetResponse.data.data || {},
                        projectKPIs: projectDataResponse.data.data?.kpis || [],
                        teamMembers: projectDataResponse.data.data?.team || [],
                        projectDocuments: projectDataResponse.data.data?.documents || []
                    };
                    
                    console.log('Loaded complete project context:', contextData);
                    
                    // Add data summary for user visibility
                    const dataSummary = {
                        projectName: contextData.projectDetails.projectName || `Project ${selectedProject}`,
                        timesheetsLoaded: contextData.timesheets.length,
                        teamMembersLoaded: contextData.teamMembers.length,
                        documentsLoaded: contextData.projectDocuments.length,
                        budgetAmount: contextData.budgetInfo.totalBudget || 0,
                        kpisLoaded: contextData.projectKPIs.length
                    };
                    console.log('PROJECT DATA - Project Data Summary for LLM:', dataSummary);
                    
                } catch (contextError) {
                    console.warn('Failed to load some project context data:', contextError);
                    contextData = { 
                        error: 'Partial data loading failed',
                        partialData: true,
                        errorDetails: contextError.message 
                    };
                }
                
                requestBody.accountId = selectedAccount;
                requestBody.projectId = selectedProject;
                requestBody.dataScope = 'project';
                requestBody.contextData = contextData; // Feed complete project data to LLM
                
            } else if (chatMode === 'account' && selectedAccount) {
                console.log('Account mode - Fetching complete account data');
                console.log('Selected account ID:', selectedAccount);
                endpoint = `${BaseURL}/api/v1/enhanced-chat/enhanced-chat`;
                
                // Fetch comprehensive account data
                try {
                    const accountProjectsResponse = await axios.get(
                        `${BaseURL}/api/v1/project/company/${selectedAccount}`,
                        Authorization_header()
                    );
                    
                    const accountTimesheetsResponse = await axios.get(
                        `${BaseURL}/api/v1/timesheet/company/${selectedAccount}`,
                        Authorization_header()
                    );
                    
                    const accountContactsResponse = await axios.get(
                        `${BaseURL}/api/v1/contact/company/${selectedAccount}`,
                        Authorization_header()
                    );
                    
                    const accountBudgetResponse = await axios.get(
                        `${BaseURL}/api/v1/company/budget/${selectedAccount}`,
                        Authorization_header()
                    );
                    
                    contextData = {
                        allProjects: accountProjectsResponse.data.data || [],
                        allTimesheets: accountTimesheetsResponse.data.data || [],
                        allContacts: accountContactsResponse.data.data || [],
                        accountBudgets: accountBudgetResponse.data.data || {},
                        accountKPIs: accountProjectsResponse.data.data?.kpis || [],
                        accountSummary: {
                            totalProjects: (accountProjectsResponse.data.data || []).length,
                            activeProjects: (accountProjectsResponse.data.data || []).filter(p => p.status === 'Active').length,
                            totalBudget: accountBudgetResponse.data.data?.totalBudget || 0
                        }
                    };
                    
                    console.log('Loaded complete account context:', contextData);
                    
                    // Add data summary for user visibility
                    const dataSummary = {
                        projectsLoaded: contextData.allProjects.length,
                        timesheetsLoaded: contextData.allTimesheets.length,
                        contactsLoaded: contextData.allContacts.length,
                        totalBudget: contextData.accountSummary.totalBudget,
                        activeProjects: contextData.accountSummary.activeProjects
                    };
                    console.log('ACCOUNT DATA - Account Data Summary for LLM:', dataSummary);
                    
                } catch (contextError) {
                    console.warn('Failed to load some account context data:', contextError);
                    contextData = { 
                        error: 'Partial data loading failed',
                        partialData: true,
                        errorDetails: contextError.message 
                    };
                }
                
                requestBody.accountId = selectedAccount;
                requestBody.dataScope = 'account';
                requestBody.contextData = contextData; // Feed complete account data to LLM
                
                if (sqlMode) {
                    console.log('SQL mode active - Enhanced chat will handle with account scope');
                }
            } else {
                console.log('General mode - Using full data scope for comprehensive insights');
                endpoint = `${BaseURL}/api/v1/enhanced-chat/enhanced-chat`;
                requestBody.dataScope = 'general'; // Feed all available data
                // General mode uses backend's default comprehensive data loading
            }

            console.log('Sending request to:', endpoint);
            console.log('Request body:', requestBody);
            
            // Add context data info message for user
            if (requestBody.contextData && !requestBody.contextData.error) {
                let dataLoadedMessage = '';
                if (chatMode === 'project') {
                    const summary = `DATA SUMMARY: Complete project data loaded and fed to AI: ${requestBody.contextData.timesheets?.length || 0} timesheets, ${requestBody.contextData.teamMembers?.length || 0} team members, ${requestBody.contextData.projectDocuments?.length || 0} documents, budget info, and KPIs.`;
                    dataLoadedMessage = summary;
                } else if (chatMode === 'account') {
                    const summary = `ACCOUNT DATA: Complete account data loaded and fed to AI: ${requestBody.contextData.allProjects?.length || 0} projects, ${requestBody.contextData.allTimesheets?.length || 0} timesheets, ${requestBody.contextData.allContacts?.length || 0} contacts, and consolidated budgets.`;
                    dataLoadedMessage = summary;
                }
                console.log('✅ Data Context Info:', dataLoadedMessage);
            }

            const response = await axios.post(endpoint, requestBody, Authorization_header());
            console.log('Response received:', response.data);

            if (response.data.success) {
                // Extract project information from response for context tracking
                const responseContent = response.data.data.message || response.data.data.response || response.data.data.explanation || 'No response received';
                const projectIdMatch = responseContent.match(/\b3\d{6}\b/g);
                
                // Auto-detect and suggest project mode if specific project mentioned
                if (projectIdMatch && projectIdMatch.length > 0 && chatMode === 'account') {
                    const detectedProject = projectIdMatch[0];
                    if (!selectedProject || selectedProject !== detectedProject) {
                        console.log('Detected new project in conversation:', detectedProject);
                        // Auto-suggest switching to project mode for better context
                        const projectSuggestion = {
                            id: Date.now() + 2,
                            type: 'system',
                            content: `PROJECT DETECTED: Project ${detectedProject} detected in this conversation. Switch to Project Mode for focused insights on this specific project data.`,
                            timestamp: new Date(),
                            sender: 'assistant',
                            actionSuggestion: {
                                type: 'switchToProject',
                                projectId: detectedProject
                            }
                        };
                        setMessages(prev => [...prev, projectSuggestion]);
                    }
                }

                const aiMessage = {
                    id: Date.now() + 1,
                    type: 'assistant',
                    content: responseContent,
                    timestamp: new Date(),
                    sender: 'assistant',
                    metadata: {
                        mode: chatMode,
                        scope: requestBody.dataScope,
                        accountId: selectedAccount,
                        projectId: selectedProject,
                        accountContext: response.data.data.context?.account,
                        projectContext: response.data.data.context?.project,
                        dataScope: response.data.data.context?.dataScope,
                        sqlQuery: response.data.data.sqlQuery,
                        resultsCount: response.data.data.resultsCount,
                        processingTime: response.data.data.metadata?.processingTime,
                        downloadAvailable: !!response.data.data.downloadContent,
                        downloadContent: response.data.data.downloadContent,
                        scopeInfo: {
                            level: chatMode,
                            accountName: selectedAccount ? accounts.find(acc => acc.companyId === selectedAccount)?.companyName : null,
                            projectName: selectedProject ? `Project ${selectedProject}` : null
                        }
                    }
                };

                setMessages(prev => [...prev, aiMessage]);
                
                // Update conversation history with scope context
                setConversationHistory(prev => [
                    ...prev,
                    { 
                        role: 'user', 
                        content: userMessage.content,
                        scope: chatMode,
                        accountId: selectedAccount,
                        projectId: selectedProject
                    },
                    { 
                        role: 'assistant', 
                        content: aiMessage.content,
                        scope: chatMode,
                        metadata: aiMessage.metadata
                    }
                ]);

                // Update session context for professional display
                updateChatSessionContext();

                // Auto-save chat session
                if (autoSave) {
                    saveChatSession(currentChatId);
                }

            } else {
                throw new Error(response.data.error || 'Failed to get response');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            const errorMessage = {
                id: Date.now() + 1,
                type: 'error',
                content: `Sorry, I encountered an error: ${error.response?.data?.error || error.message}. Please try again.`,
                timestamp: new Date(),
                sender: 'assistant'
            };
            setMessages(prev => [...prev, errorMessage]);
            toast.error('Failed to send message: ' + (error.response?.data?.error || error.message));
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const clearCurrentChat = () => {
        setMessages([]);
        setConversationHistory([]);
        const welcomeMessage = {
            id: `clear-${Date.now()}`,
            type: 'system',
            content: 'Chat cleared. How can I help you today?',
            timestamp: new Date(),
            sender: 'assistant'
        };
        setMessages([welcomeMessage]);
    };

    const downloadMessage = (message) => {
        if (message.metadata?.downloadContent) {
            const blob = new Blob([message.metadata.downloadContent], { type: 'text/plain' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `chat_response_${Date.now()}.txt`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            toast.success('Response downloaded successfully');
        }
    };

    const formatTimestamp = (timestamp) => {
        const now = new Date();
        const messageTime = new Date(timestamp);
        const diffInMinutes = Math.floor((now - messageTime) / (1000 * 60));
        
        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
        return messageTime.toLocaleDateString();
    };

    // Enhanced UI Functions
    const handleFileUpload = (event) => {
        const files = Array.from(event.target.files);
        const newFiles = files.map(file => ({
            id: Date.now() + Math.random(),
            name: file.name,
            size: file.size,
            type: file.type,
            file: file
        }));
        setUploadedFiles(prev => [...prev, ...newFiles]);
        setShowUploadDialog(true);
    };

    const removeFile = (fileId) => {
        setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
    };

    const handleChatMenuOpen = (event) => {
        setChatMenuAnchor(event.currentTarget);
    };

    const handleChatMenuClose = () => {
        setChatMenuAnchor(null);
    };

    const generateSummary = () => {
        setShowSummaryDialog(true);
        setChatSummary(''); // Reset summary
        handleChatMenuClose();
        
        // Generate summary based on current messages
        setTimeout(() => {
            const messageCount = messages.length;
            const userMessages = messages.filter(m => m.sender === 'user').length;
            const aiMessages = messages.filter(m => m.sender === 'assistant').length;
            
            let summary = `Chat Summary:\n\n`;
            summary += `• Total messages: ${messageCount}\n`;
            summary += `• Your messages: ${userMessages}\n`;
            summary += `• AI responses: ${aiMessages}\n`;
            summary += `• Chat mode: ${chatMode}\n`;
            
            if (chatMode === 'account' && selectedAccount) {
                const accountName = accounts.find(acc => acc.companyId === selectedAccount)?.companyName;
                summary += `• Selected account: ${accountName}\n`;
            }
            
            summary += `\nKey Topics Discussed:\n`;
            messages.slice(0, 5).forEach((msg, index) => {
                if (msg.sender === 'user') {
                    const topic = msg.content.substring(0, 50) + (msg.content.length > 50 ? '...' : '');
                    summary += `• ${topic}\n`;
                }
            });
            
            setChatSummary(summary);
        }, 1000);
    };

    const generateTimeline = () => {
        setShowTimelineDialog(true);
        setChatTimeline(''); // Reset timeline
        handleChatMenuClose();
        
        // Generate timeline based on current messages
        setTimeout(() => {
            let timeline = `Conversation Timeline:\n\n`;
            
            messages.forEach((msg, index) => {
                const time = new Date(msg.timestamp).toLocaleTimeString();
                const sender = msg.sender === 'user' ? 'You' : 'AI Assistant';
                const preview = msg.content.substring(0, 60) + (msg.content.length > 60 ? '...' : '');
                timeline += `${time} - ${sender}: ${preview}\n`;
            });
            
            setChatTimeline(timeline);
        }, 1000);
    };

    const downloadProjectSummary = async () => {
        setDownloadMenuAnchor(null);
        
        try {
            // Enhanced project detection - look through conversation history
            let detectedProjectId = null;
            
            // 1. Check if there's a currently selected project
            if (selectedProject) {
                detectedProjectId = selectedProject;
                console.log('Using currently selected project:', detectedProjectId);
            } else {
                // 2. Search through recent messages for project IDs
                const recentMessages = [...messages].reverse(); // Start from most recent
                
                for (let message of recentMessages) {
                    // Look for project IDs in message content
                    const projectMatch = message.content.match(/\b3\d{6}\b/g);
                    if (projectMatch && projectMatch.length > 0) {
                        detectedProjectId = projectMatch[projectMatch.length - 1]; // Use the last mentioned
                        console.log('Found project in message content:', detectedProjectId);
                        break;
                    }
                    
                    // Check metadata for project information
                    if (message.metadata?.projectId) {
                        detectedProjectId = message.metadata.projectId;
                        console.log('Found project in metadata:', detectedProjectId);
                        break;
                    }
                }
                
                // 3. If still no project found, check conversation history
                if (!detectedProjectId && conversationHistory.length > 0) {
                    const historyText = conversationHistory.map(h => h.content).join(' ');
                    const historyProjectMatch = historyText.match(/\b3\d{6}\b/g);
                    if (historyProjectMatch && historyProjectMatch.length > 0) {
                        detectedProjectId = historyProjectMatch[historyProjectMatch.length - 1];
                        console.log('Found project in conversation history:', detectedProjectId);
                    }
                }
            }
            
            if (!detectedProjectId) {
                toast.error('No project found in current conversation. Please ask about a specific project first.');
                return;
            }
            
            // Call backend to get project summary using the enhanced endpoint
            const response = await axios.get(
                `${BaseURL}/api/v1/enhanced-chat/project-summary/${detectedProjectId}`,
                Authorization_header()
            );
            
            if (response.data && response.data.success) {
                const summaryData = response.data.data || response.data;
                
                // Create downloadable content
                const summaryContent = `
PROJECT SUMMARY REPORT
=====================

Project ID: ${detectedProjectId}
Generated: ${new Date().toLocaleString()}
Account: ${chatMode === 'account' && selectedAccount ? accounts.find(acc => acc.companyId === selectedAccount)?.companyName : 'N/A'}

${summaryData.summary || 'No summary available for this project.'}

---
Generated by Certainti AI Assistant
                `.trim();
                
                // Create and download file
                const blob = new Blob([summaryContent], { type: 'text/plain' });
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `project_${detectedProjectId}_summary_${new Date().toISOString().split('T')[0]}.txt`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
                
                toast.success(`Project ${detectedProjectId} summary downloaded successfully!`);
            } else {
                toast.error('Failed to retrieve project summary');
            }
        } catch (error) {
            console.error('Download error:', error);
            toast.error('Error downloading project summary: ' + (error.response?.data?.error || error.message));
        }
    };

    const downloadChatHistory = () => {
        setDownloadMenuAnchor(null);
        
        try {
            // Create chat history content
            const chatContent = `
CHAT HISTORY EXPORT
==================

Session: ${chatSessions.find(s => s.id === currentChatId)?.title || 'Current Chat'}
Exported: ${new Date().toLocaleString()}
Mode: ${chatMode === 'account' ? `Account (${accounts.find(acc => acc.companyId === selectedAccount)?.companyName || 'Unknown'})` : 'General'}
Total Messages: ${messages.length}

CONVERSATION:
${'-'.repeat(50)}

${messages.map(msg => {
    const timestamp = new Date(msg.timestamp).toLocaleTimeString();
    const sender = msg.sender === 'user' ? 'You' : 'AI Assistant';
    return `[${timestamp}] ${sender}:\n${msg.content}\n`;
}).join('\n')}

---
Generated by Certainti AI Assistant
            `.trim();
            
            // Create and download file
            const blob = new Blob([chatContent], { type: 'text/plain' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `chat_history_${new Date().toISOString().split('T')[0]}.txt`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            
            toast.success('Chat history downloaded successfully!');
        } catch (error) {
            console.error('Download error:', error);
            toast.error('Error downloading chat history');
        }
    };

    const renderMessage = (message) => {
        const isUser = message.sender === 'user';
        const isSystem = message.type === 'system';
        const isError = message.type === 'error';

        return (
            <Box key={message.id} sx={{ mb: 1.5, px: 2 }}>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: isUser ? 'flex-end' : 'flex-start',
                        alignItems: 'flex-start',
                        gap: 1
                    }}
                >
                    {!isUser && (
                        <Avatar
                            sx={{
                                bgcolor: isSystem ? '#FF9800' : isError ? '#f44336' : '#1976d2',
                                width: 28,
                                height: 28,
                                fontSize: '0.75rem'
                            }}
                        >
                            {isSystem ? 'S' : isError ? '!' : 'AI'}
                        </Avatar>
                    )}
                    
                    <Paper
                        elevation={1}
                        sx={{
                            p: 1.5,
                            maxWidth: '80%',
                            bgcolor: isUser 
                                ? '#1976d2' 
                                : isSystem 
                                    ? '#fff3e0' 
                                    : isError 
                                        ? '#ffebee' 
                                        : '#f8f9fa',
                            color: isUser ? 'white' : 'text.primary',
                            borderRadius: '12px',
                            borderTopRightRadius: isUser ? '4px' : '12px',
                            borderTopLeftRadius: isUser ? '12px' : '4px',
                            border: isSystem ? '1px solid #ffb74d' : 'none'
                        }}
                    >
                        <Typography
                            variant="body1"
                            sx={{
                                whiteSpace: 'pre-wrap',
                                wordBreak: 'break-word',
                                lineHeight: 1.5,
                                fontSize: '0.9rem'
                            }}
                        >
                            {message.content}
                        </Typography>
                        
                        {/* Simplified message actions */}
                        {message.metadata && !isUser && (
                            <Box sx={{ mt: 1, display: 'flex', gap: 0.5, alignItems: 'center' }}>
                                {message.metadata.sqlQuery && (
                                    <Tooltip title="View SQL Query">
                                        <IconButton
                                            size="small"
                                            onClick={() => setShowSQLQuery(message.metadata.sqlQuery)}
                                            sx={{ 
                                                color: isUser ? 'white' : 'primary.main',
                                                p: 0.5
                                            }}
                                        >
                                            <Code fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                )}
                                
                                {message.metadata.downloadAvailable && (
                                    <Tooltip title="Download Response">
                                        <IconButton
                                            size="small"
                                            onClick={() => downloadMessage(message)}
                                            sx={{ 
                                                color: isUser ? 'white' : 'success.main',
                                                p: 0.5
                                            }}
                                        >
                                            <Download fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                )}
                            </Box>
                        )}
                        
                        <Typography
                            variant="caption"
                            sx={{
                                display: 'block',
                                mt: 0.5,
                                opacity: 0.7,
                                fontSize: '0.7rem'
                            }}
                        >
                            {formatTimestamp(message.timestamp)}
                        </Typography>
                    </Paper>
                    
                    {isUser && (
                        <Avatar
                            sx={{
                                bgcolor: '#1976d2',
                                width: 28,
                                height: 28,
                                fontSize: '0.75rem'
                            }}
                        >
                            <Person fontSize="small" />
                        </Avatar>
                    )}
                </Box>
            </Box>
        );
    };

    return (
        <Box sx={{ height: '100vh', display: 'flex', bgcolor: '#f8f9fa' }}>
            {/* Enhanced Professional Sidebar */}
            <Drawer
                variant="persistent"
                anchor="left"
                open={sidebarOpen}
                sx={{
                    width: 320,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: 320,
                        boxSizing: 'border-box',
                        position: 'relative',
                        bgcolor: '#ffffff',
                        borderRight: '2px solid #e0e0e0',
                        background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 50%, #e8f0fe 100%)',
                        boxShadow: '4px 0 20px rgba(0, 0, 0, 0.1)',
                        backdropFilter: 'blur(10px)'
                    },
                }}
            >
                {/* Compact Professional Sidebar Header */}
                <Box sx={{ 
                    p: 2, 
                    borderBottom: '2px solid rgba(25, 118, 210, 0.1)',
                    background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.05) 0%, rgba(255, 255, 255, 0.8) 100%)',
                    backdropFilter: 'blur(10px)'
                }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                            <Analytics sx={{ color: '#1976d2', fontSize: 28 }} />
                            <Typography variant="h6" sx={{ 
                                fontWeight: 800, 
                                color: '#1976d2',
                                background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                letterSpacing: '0.3px',
                                fontSize: '1.1rem'
                            }}>
                                Smart Assistant
                            </Typography>
                        </Box>
                        <IconButton
                            size="small"
                            onClick={() => setSidebarOpen(false)}
                            sx={{ 
                                display: { md: 'none' },
                                bgcolor: 'rgba(255,255,255,0.2)',
                                '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
                            }}
                        >
                            <Close />
                        </IconButton>
                    </Box>
                    
                    {/* Compact Mode Selector */}
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" sx={{ 
                            mb: 1.5, 
                            fontWeight: 600, 
                            color: '#1976d2', 
                            fontSize: '0.8rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.3px'
                        }}>
                            Analysis Mode
                        </Typography>
                        
                        {/* Compact General Mode Button */}
                        <Button
                            fullWidth
                            size="small"
                            variant={chatMode === 'general' ? 'contained' : 'outlined'}
                            startIcon={<Public sx={{ fontSize: 16 }} />}
                            onClick={() => handleModeChange('general')}
                            sx={{
                                mb: 1.5,
                                textTransform: 'none',
                                borderRadius: '8px',
                                fontWeight: 600,
                                py: 0.8,
                                fontSize: '0.8rem',
                                bgcolor: chatMode === 'general' ? '#1976d2' : 'transparent',
                                color: chatMode === 'general' ? 'white' : '#1976d2',
                                borderColor: '#1976d2',
                                minHeight: '32px',
                                boxShadow: chatMode === 'general' ? 
                                    '0 2px 6px rgba(25, 118, 210, 0.25)' : 'none',
                                '&:hover': {
                                    bgcolor: chatMode === 'general' ? '#1565c0' : 'rgba(25, 118, 210, 0.1)',
                                    boxShadow: '0 3px 8px rgba(25, 118, 210, 0.3)'
                                },
                                transition: 'all 0.2s ease'
                            }}
                        >
                            General
                        </Button>

                        {/* Compact Account Selection */}
                        <Box sx={{ mb: 1.5 }}>
                            <Autocomplete
                                size="small"
                                value={selectedAccount ? accounts.find(acc => acc.companyId === selectedAccount) : null}
                                options={accounts}
                                getOptionLabel={(option) => option?.companyName || ''}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        placeholder="Select Account..."
                                        variant="outlined"
                                        InputProps={{
                                            ...params.InputProps,
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Business sx={{ color: '#1976d2', fontSize: 16 }} />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '8px',
                                                fontSize: '0.8rem',
                                                fontWeight: 500,
                                                minHeight: '32px',
                                                bgcolor: (chatMode === 'account' || chatMode === 'project') ? 
                                                    'rgba(25, 118, 210, 0.08)' : 'transparent',
                                                borderColor: (chatMode === 'account' || chatMode === 'project') ? '#1976d2' : '#ddd',
                                                '&:hover': {
                                                    borderColor: '#1976d2',
                                                    bgcolor: 'rgba(25, 118, 210, 0.05)'
                                                },
                                                '& .MuiInputBase-input': {
                                                    py: 0.8
                                                }
                                            }
                                        }}
                                    />
                                )}
                                renderOption={(props, option) => (
                                    <Box component="li" {...props} sx={{ 
                                        fontSize: '0.8rem',
                                        p: 1.5,
                                        '&:hover': {
                                            bgcolor: 'rgba(25, 118, 210, 0.08)'
                                        }
                                    }}>
                                        <Business sx={{ mr: 1, fontSize: 16, color: '#1976d2' }} />
                                        <Box>
                                            <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
                                                {option.companyName}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                                                ID: {option.companyId}
                                            </Typography>
                                        </Box>
                                    </Box>
                                )}
                                onChange={(event, newValue) => {
                                    if (newValue) {
                                        handleModeChange('account', newValue.companyId);
                                    } else {
                                        handleModeChange('general');
                                    }
                                }}
                                clearOnBlur={false}
                            />
                        </Box>

                        {/* Compact Project Selection when account is selected */}
                        {(chatMode === 'account' || chatMode === 'project') && selectedAccount && projects.length > 0 && (
                            <Box>
                                <Autocomplete
                                    size="small"
                                    value={selectedProject ? projects.find(p => p.projectId === selectedProject) : null}
                                    options={projects}
                                    getOptionLabel={(option) => {
                                        return `${option?.projectName || option?.projectCode || `Project ${option?.projectId}`}`;
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            placeholder="Select Project..."
                                            variant="outlined"
                                            InputProps={{
                                                ...params.InputProps,
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Analytics sx={{ color: '#4caf50', fontSize: 16 }} />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: '8px',
                                                    fontSize: '0.8rem',
                                                    fontWeight: 500,
                                                    minHeight: '32px',
                                                    bgcolor: chatMode === 'project' ? 'rgba(76, 175, 80, 0.08)' : 'rgba(0, 0, 0, 0.02)',
                                                    borderColor: chatMode === 'project' ? '#4caf50' : '#ddd',
                                                    '&:hover': {
                                                        borderColor: '#4caf50',
                                                        bgcolor: 'rgba(76, 175, 80, 0.05)'
                                                    },
                                                    '& .MuiInputBase-input': {
                                                        py: 0.8
                                                    }
                                                }
                                            }}
                                        />
                                    )}
                                    renderOption={(props, option) => (
                                        <Box component="li" {...props} sx={{ 
                                            fontSize: '0.8rem',
                                            p: 1.5,
                                            '&:hover': {
                                                bgcolor: 'rgba(76, 175, 80, 0.08)'
                                            }
                                        }}>
                                            <Analytics sx={{ mr: 1, fontSize: 16, color: '#4caf50' }} />
                                            <Box>
                                                <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
                                                    {option.projectName || option.projectCode || `Project ${option.projectId}`}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                                                    ID: {option.projectId}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    )}
                                    onChange={(event, newValue) => {
                                        if (newValue) {
                                            handleModeChange('project', selectedAccount, newValue.projectId);
                                        } else {
                                            handleModeChange('account', selectedAccount);
                                        }
                                    }}
                                    clearOnBlur={false}
                                />
                            </Box>
                        )}
                    </Box>
                    
                    {/* Compact New Chat Button */}
                    <Button
                        fullWidth
                        variant="contained"
                        size="small"
                        startIcon={<Add sx={{ fontSize: 18 }} />}
                        onClick={createNewChat}
                        sx={{ 
                            bgcolor: '#1976d2',
                            '&:hover': { 
                                bgcolor: '#1565c0',
                                transform: 'translateY(-1px)',
                                boxShadow: '0 3px 12px rgba(25, 118, 210, 0.4)'
                            },
                            borderRadius: '8px',
                            textTransform: 'none',
                            fontWeight: 700,
                            py: 1,
                            fontSize: '0.85rem',
                            minHeight: '36px',
                            transition: 'all 0.2s ease',
                            background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                            boxShadow: '0 2px 8px rgba(25, 118, 210, 0.25)',
                            letterSpacing: '0.3px'
                        }}
                    >
                        New Chat
                    </Button>
                </Box>

                {/* Compact Search Chat History */}
                <Box sx={{ p: 1.5, borderBottom: '1px solid #e0e0e0' }}>
                    <TextField
                        fullWidth
                        size="small"
                        placeholder="Search..."
                        value={searchHistory}
                        onChange={(e) => setSearchHistory(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search sx={{ fontSize: 16 }} />
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '8px',
                                fontSize: '0.8rem',
                                minHeight: '32px',
                                '& .MuiInputBase-input': {
                                    py: 0.8
                                }
                            }
                        }}
                    />
                </Box>

                {/* Chat History List */}
                <Box sx={{ flex: 1, overflow: 'auto' }}>
                    <List sx={{ py: 0 }}>
                        {filteredSessions.map((session) => (
                            <ListItemButton
                                key={session.id}
                                selected={session.id === currentChatId}
                                onClick={() => switchToChat(session.id)}
                                sx={{
                                    mx: 0.5,
                                    my: 0.25,
                                    borderRadius: '6px',
                                    py: 0.5,
                                    '&.Mui-selected': {
                                        bgcolor: '#e3f2fd',
                                        '&:hover': { bgcolor: '#e3f2fd' }
                                    }
                                }}
                            >
                                <ListItemIcon sx={{ minWidth: 32 }}>
                                    <ChatBubbleOutline sx={{ fontSize: 16 }} color="action" />
                                </ListItemIcon>
                                <ListItemText
                                    primary={
                                        <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
                                            {session.title}
                                        </Typography>
                                    }
                                    secondary={
                                        <Box>
                                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                                                {session.lastMessage.length > 35 
                                                    ? session.lastMessage.substring(0, 35) + '...'
                                                    : session.lastMessage
                                                }
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.65rem' }}>
                                                {formatTimestamp(session.timestamp)} • {session.messageCount} msgs
                                            </Typography>
                                        </Box>
                                    }
                                />
                                <IconButton
                                    size="small"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteChatSession(session.id);
                                    }}
                                    sx={{ 
                                        opacity: 0.6, 
                                        '&:hover': { opacity: 1 },
                                        p: 0.5
                                    }}
                                >
                                    <Delete fontSize="small" />
                                </IconButton>
                            </ListItemButton>
                        ))}
                    </List>
                </Box>
            </Drawer>

            {/* Main Chat Area */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                {/* Professional Context Header */}
                <Paper 
                    elevation={0} 
                    sx={{ 
                        p: 1.5, 
                        borderBottom: '1px solid #e0e0e0',
                        bgcolor: 'white',
                        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                        minHeight: '60px',
                        display: 'flex',
                        alignItems: 'center'
                    }}
                >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1 }}>
                            {!sidebarOpen && (
                                <IconButton
                                    onClick={() => setSidebarOpen(true)}
                                    sx={{ 
                                        display: { md: 'none' },
                                        bgcolor: 'rgba(25, 118, 210, 0.1)',
                                        '&:hover': { bgcolor: 'rgba(25, 118, 210, 0.2)' }
                                    }}
                                >
                                    <History sx={{ color: '#1976d2' }} />
                                </IconButton>
                            )}
                            
                            {/* Professional Dynamic Context Display */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1 }}>
                                {/* Enhanced Mode Icon */}
                                {chatMode === 'general' ? (
                                    <Public sx={{ color: '#1976d2', fontSize: 24 }} />
                                ) : chatMode === 'account' ? (
                                    <Business sx={{ color: '#1976d2', fontSize: 24 }} />
                                ) : (
                                    <Analytics sx={{ color: '#4caf50', fontSize: 24 }} />
                                )}
                                
                                {/* Professional Context Information */}
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="h6" sx={{ 
                                        fontWeight: 700, 
                                        color: '#1976d2',
                                        lineHeight: 1.2,
                                        fontSize: '1.1rem',
                                        letterSpacing: '0.5px'
                                    }}>
                                        {chatSessions.find(s => s.id === currentChatId)?.title || 'Smart Analysis Assistant'}
                                    </Typography>
                                    <Typography variant="body2" sx={{ 
                                        color: '#666', 
                                        fontSize: '0.85rem',
                                        lineHeight: 1.3,
                                        display: 'block',
                                        fontWeight: 500,
                                        mt: 0.5
                                    }}>
                                        {chatSessions.find(s => s.id === currentChatId)?.contextInfo || 'Professional AI Assistant | Ready for Analysis'}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {/* Download Menu */}
                            <IconButton
                                onClick={(e) => setDownloadMenuAnchor(e.currentTarget)}
                                sx={{
                                    bgcolor: 'rgba(25, 118, 210, 0.1)',
                                    '&:hover': { 
                                        bgcolor: 'rgba(25, 118, 210, 0.2)',
                                        transform: 'scale(1.05)'
                                    },
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                <MoreVert sx={{ color: '#1976d2' }} />
                            </IconButton>
                            
                            <Menu
                                anchorEl={downloadMenuAnchor}
                                open={Boolean(downloadMenuAnchor)}
                                onClose={() => setDownloadMenuAnchor(null)}
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                                PaperProps={{
                                    sx: { 
                                        minWidth: 200,
                                        borderRadius: 2,
                                        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                                        border: '1px solid rgba(255,255,255,0.2)'
                                    }
                                }}
                            >
                                <MenuItem onClick={downloadProjectSummary}>
                                    <ListItemIcon>
                                        <Download fontSize="small" sx={{ color: '#1976d2' }} />
                                    </ListItemIcon>
                                    <ListItemText primary="Download Project Summary" />
                                </MenuItem>
                                <MenuItem onClick={downloadChatHistory}>
                                    <ListItemIcon>
                                        <Download fontSize="small" sx={{ color: '#4caf50' }} />
                                    </ListItemIcon>
                                    <ListItemText primary="Download Chat History" />
                                </MenuItem>
                                <Divider />
                                <MenuItem onClick={clearCurrentChat}>
                                    <ListItemIcon>
                                        <Clear fontSize="small" sx={{ color: '#ff9800' }} />
                                    </ListItemIcon>
                                    <ListItemText primary="Clear Chat" />
                                </MenuItem>
                                <MenuItem onClick={() => setShowSettings(true)}>
                                    <ListItemIcon>
                                        <Settings fontSize="small" sx={{ color: '#666' }} />
                                    </ListItemIcon>
                                    <ListItemText primary="Settings" />
                                </MenuItem>
                            </Menu>
                        </Box>
                    </Box>
                </Paper>

                {/* Messages Area */}
                <Box
                    sx={{
                        flex: 1,
                        overflow: 'auto',
                        bgcolor: 'white'
                    }}
                >
                    {messages.length === 0 && !isLoading ? (
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: '100%',
                                flexDirection: 'column',
                                textAlign: 'center',
                                px: 4
                            }}
                        >
                            <Analytics sx={{ fontSize: 64, color: '#1976d2', mb: 2 }} />
                            <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
                                Smart Analysis Assistant
                            </Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, fontWeight: 500 }}>
                                Your professional assistant for comprehensive analysis and data-driven insights.
                                Select your analysis scope above and begin your session.
                            </Typography>
                        </Box>
                    ) : (
                        <Box sx={{ py: 2 }}>
                            {messages.map(renderMessage)}
                            
                            {isLoading && (
                                <Box sx={{ display: 'flex', justifyContent: 'flex-start', px: 2, mb: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Avatar sx={{ bgcolor: '#1976d2', width: 32, height: 32 }}>
                                            AI
                                        </Avatar>
                                        <Paper elevation={1} sx={{ p: 2, borderRadius: '12px', borderTopLeftRadius: '4px' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <CircularProgress size={16} />
                                                <Typography variant="body2" color="text.secondary">
                                                    Thinking...
                                                </Typography>
                                            </Box>
                                        </Paper>
                                    </Box>
                                </Box>
                            )}
                            
                            <div ref={messagesEndRef} />
                        </Box>
                    )}
                </Box>

                {/* Optimized Input Area */}
                <Paper
                    elevation={0}
                    sx={{
                        p: 2,
                        borderTop: '1px solid #e0e0e0',
                        bgcolor: 'white',
                        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)'
                    }}
                >
                    {/* Uploaded Files Display - Compact */}
                    {uploadedFiles.length > 0 && (
                        <Box sx={{ mb: 1.5 }}>
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                {uploadedFiles.map((file, index) => (
                                    <Chip
                                        key={index}
                                        label={file.name}
                                        variant="outlined"
                                        size="small"
                                        onDelete={() => removeFile(index)}
                                        deleteIcon={<Close />}
                                        icon={<AttachFile />}
                                        sx={{
                                            bgcolor: 'rgba(76, 175, 80, 0.1)',
                                            borderColor: '#4caf50',
                                            color: '#2e7d32',
                                            fontSize: '0.75rem'
                                        }}
                                    />
                                ))}
                            </Box>
                        </Box>
                    )}

                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
                        {/* Upload Documents Button */}
                        <Tooltip title="Upload Documents">
                            <IconButton
                                onClick={() => setShowUploadDialog(true)}
                                sx={{
                                    bgcolor: 'rgba(76, 175, 80, 0.1)',
                                    color: '#4caf50',
                                    width: 38,
                                    height: 38,
                                    '&:hover': {
                                        bgcolor: 'rgba(76, 175, 80, 0.2)',
                                        transform: 'scale(1.05)'
                                    },
                                    transition: 'all 0.2s ease',
                                    borderRadius: '10px'
                                }}
                            >
                                <AttachFile fontSize="small" />
                            </IconButton>
                        </Tooltip>

                        <TextField
                            ref={chatInputRef}
                            fullWidth
                            multiline
                            maxRows={3}
                            placeholder={
                                chatMode === 'account' 
                                    ? "Ask about your projects, budgets, KPIs, or request summaries..." 
                                    : "Ask me anything about business, finance, or general topics..."
                            }
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            disabled={isLoading}
                            variant="outlined"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '14px',
                                    backgroundColor: '#f8f9fa',
                                    fontSize: '0.9rem',
                                    border: '1px solid rgba(0,0,0,0.1)',
                                    minHeight: '42px',
                                    '&:hover': {
                                        backgroundColor: '#f0f2f5',
                                        border: '1px solid rgba(25, 118, 210, 0.3)'
                                    },
                                    '&.Mui-focused': {
                                        backgroundColor: 'white',
                                        boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.2)'
                                    }
                                }
                            }}
                        />

                        {/* 3-Dot Menu Button */}
                        <Tooltip title="More options">
                            <IconButton
                                onClick={handleChatMenuOpen}
                                sx={{
                                    bgcolor: 'rgba(25, 118, 210, 0.1)',
                                    color: '#1976d2',
                                    width: 38,
                                    height: 38,
                                    borderRadius: '10px',
                                    '&:hover': {
                                        bgcolor: 'rgba(25, 118, 210, 0.2)',
                                        transform: 'scale(1.05)'
                                    },
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                <MoreVert fontSize="small" />
                            </IconButton>
                        </Tooltip>

                        {/* Chat Menu */}
                        <Menu
                            anchorEl={chatMenuAnchor}
                            open={Boolean(chatMenuAnchor)}
                            onClose={handleChatMenuClose}
                            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                            transformOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            PaperProps={{
                                sx: { 
                                    minWidth: 180,
                                    borderRadius: 2,
                                    boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    mt: -1
                                }
                            }}
                        >
                            <MenuItem onClick={generateSummary}>
                                <ListItemIcon>
                                    <Summarize fontSize="small" sx={{ color: '#1976d2' }} />
                                </ListItemIcon>
                                <ListItemText primary="Chat Summary" />
                            </MenuItem>
                            <MenuItem onClick={generateTimeline}>
                                <ListItemIcon>
                                    <Timeline fontSize="small" sx={{ color: '#1976d2' }} />
                                </ListItemIcon>
                                <ListItemText primary="Timeline View" />
                            </MenuItem>
                            <MenuItem onClick={() => { setShowHistoryDialog(true); handleChatMenuClose(); }}>
                                <ListItemIcon>
                                    <History fontSize="small" sx={{ color: '#1976d2' }} />
                                </ListItemIcon>
                                <ListItemText primary="Interaction History" />
                            </MenuItem>
                        </Menu>
                        
                        <IconButton
                            onClick={sendMessage}
                            disabled={!inputMessage.trim() || isLoading}
                            sx={{
                                bgcolor: '#1976d2',
                                color: 'white',
                                width: 38,
                                height: 38,
                                borderRadius: '10px',
                                '&:hover': {
                                    bgcolor: '#1565c0',
                                    transform: 'scale(1.05)',
                                    boxShadow: '0 4px 20px rgba(25, 118, 210, 0.4)'
                                },
                                '&:disabled': {
                                    bgcolor: '#ccc',
                                    transform: 'none'
                                },
                                transition: 'all 0.2s ease'
                            }}
                        >
                            {isLoading ? (
                                <CircularProgress size={18} sx={{ color: 'white' }} />
                            ) : (
                                <Send fontSize="small" />
                            )}
                        </IconButton>
                    </Box>
                </Paper>
            </Box>

            {/* Settings Dialog */}
            <Dialog open={showSettings} onClose={() => setShowSettings(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Chat Settings</DialogTitle>
                <DialogContent>
                    <Box sx={{ py: 2 }}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={autoSave}
                                    onChange={(e) => setAutoSave(e.target.checked)}
                                />
                            }
                            label="Auto-save conversations"
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={sqlMode}
                                    onChange={(e) => setSqlMode(e.target.checked)}
                                />
                            }
                            label="Force SQL mode for data queries"
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={analysisMode}
                                    onChange={(e) => setAnalysisMode(e.target.checked)}
                                />
                            }
                            label="Enable deep analysis mode"
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowSettings(false)}>Close</Button>
                </DialogActions>
            </Dialog>

            {/* SQL Query Dialog */}
            <Dialog
                open={!!showSQLQuery}
                onClose={() => setShowSQLQuery('')}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Code />
                        Generated SQL Query
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Paper
                        sx={{
                            p: 2,
                            bgcolor: '#263238',
                            color: '#4fc3f7',
                            fontFamily: 'monospace',
                            fontSize: '0.9rem',
                            overflow: 'auto',
                            borderRadius: '8px'
                        }}
                    >
                        {showSQLQuery}
                    </Paper>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowSQLQuery('')}>Close</Button>
                </DialogActions>
            </Dialog>

            {/* Upload Documents Dialog */}
            <Dialog open={showUploadDialog} onClose={() => setShowUploadDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CloudUpload sx={{ color: '#4caf50' }} />
                        Upload Documents
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ py: 2 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            Upload documents to enhance our conversation with relevant context.
                        </Typography>
                        
                        <input
                            type="file"
                            multiple
                            accept=".pdf,.doc,.docx,.txt,.md"
                            onChange={handleFileUpload}
                            style={{ display: 'none' }}
                            id="file-upload-input"
                        />
                        
                        <label htmlFor="file-upload-input">
                            <Paper
                                sx={{
                                    p: 4,
                                    textAlign: 'center',
                                    border: '2px dashed #4caf50',
                                    bgcolor: 'rgba(76, 175, 80, 0.05)',
                                    cursor: 'pointer',
                                    borderRadius: 2,
                                    '&:hover': {
                                        bgcolor: 'rgba(76, 175, 80, 0.1)',
                                        borderColor: '#388e3c'
                                    },
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                <CloudUpload sx={{ fontSize: 48, color: '#4caf50', mb: 2 }} />
                                <Typography variant="h6" sx={{ color: '#4caf50', mb: 1 }}>
                                    Click to upload files
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Supports PDF, DOC, DOCX, TXT, MD files
                                </Typography>
                            </Paper>
                        </label>

                        {/* Display uploaded files */}
                        {uploadedFiles.length > 0 && (
                            <Box sx={{ mt: 3 }}>
                                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                                    Uploaded Files:
                                </Typography>
                                {uploadedFiles.map((file, index) => (
                                    <Box
                                        key={index}
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            p: 2,
                                            mb: 1,
                                            bgcolor: '#f5f5f5',
                                            borderRadius: 1
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <AttachFile fontSize="small" sx={{ color: '#4caf50' }} />
                                            <Typography variant="body2">{file.name}</Typography>
                                        </Box>
                                        <IconButton
                                            size="small"
                                            onClick={() => removeFile(index)}
                                            sx={{ color: '#f44336' }}
                                        >
                                            <Close fontSize="small" />
                                        </IconButton>
                                    </Box>
                                ))}
                            </Box>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowUploadDialog(false)}>Close</Button>
                </DialogActions>
            </Dialog>

            {/* Summary Dialog */}
            <Dialog open={showSummaryDialog} onClose={() => setShowSummaryDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Summarize sx={{ color: '#1976d2' }} />
                        Chat Summary
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ py: 2 }}>
                        {chatSummary ? (
                            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                                {chatSummary}
                            </Typography>
                        ) : (
                            <Box sx={{ textAlign: 'center', py: 4 }}>
                                <CircularProgress />
                                <Typography variant="body2" sx={{ mt: 2 }}>
                                    Generating summary...
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowSummaryDialog(false)}>Close</Button>
                </DialogActions>
            </Dialog>

            {/* Timeline Dialog */}
            <Dialog open={showTimelineDialog} onClose={() => setShowTimelineDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Timeline sx={{ color: '#1976d2' }} />
                        Conversation Timeline
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ py: 2 }}>
                        {chatTimeline ? (
                            <Box>
                                {chatTimeline.split('\n').map((line, index) => (
                                    <Typography key={index} variant="body2" sx={{ mb: 1 }}>
                                        {line}
                                    </Typography>
                                ))}
                            </Box>
                        ) : (
                            <Box sx={{ textAlign: 'center', py: 4 }}>
                                <CircularProgress />
                                <Typography variant="body2" sx={{ mt: 2 }}>
                                    Generating timeline...
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowTimelineDialog(false)}>Close</Button>
                </DialogActions>
            </Dialog>

            {/* History Dialog */}
            <Dialog open={showHistoryDialog} onClose={() => setShowHistoryDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <History sx={{ color: '#1976d2' }} />
                        Interaction History
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ py: 2 }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            Conversation Statistics
                        </Typography>
                        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2, mb: 3 }}>
                            <Paper sx={{ p: 2, textAlign: 'center' }}>
                                <Typography variant="h4" sx={{ color: '#1976d2', fontWeight: 'bold' }}>
                                    {messages.length}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Total Messages
                                </Typography>
                            </Paper>
                            <Paper sx={{ p: 2, textAlign: 'center' }}>
                                <Typography variant="h4" sx={{ color: '#4caf50', fontWeight: 'bold' }}>
                                    {messages.filter(m => m.sender === 'user').length}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Your Messages
                                </Typography>
                            </Paper>
                            <Paper sx={{ p: 2, textAlign: 'center' }}>
                                <Typography variant="h4" sx={{ color: '#ff9800', fontWeight: 'bold' }}>
                                    {uploadedFiles.length}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Documents Uploaded
                                </Typography>
                            </Paper>
                        </Box>
                        
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            Recent Activity
                        </Typography>
                        <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                            {messages.slice(-10).map((message, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 2,
                                        py: 1,
                                        borderBottom: '1px solid #f0f0f0'
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 8,
                                            height: 8,
                                            borderRadius: '50%',
                                            bgcolor: message.sender === 'user' ? '#4caf50' : '#1976d2'
                                        }}
                                    />
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="body2">
                                            {message.content.length > 60 
                                                ? message.content.substring(0, 60) + '...' 
                                                : message.content
                                            }
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {new Date(message.timestamp).toLocaleTimeString()}
                                        </Typography>
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowHistoryDialog(false)}>Close</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default EnhancedChatAssistant;
