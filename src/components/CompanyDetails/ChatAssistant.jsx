import React, { useState, useRef, useEffect } from 'react';
import {
    Box,
    Card,
    Typography,
    TextField,
    IconButton,
    Avatar,
    InputAdornment,
    Button,
    Grid,
    Tooltip,
    MenuItem,
    CircularProgress,
    Menu,
    Dialog,
    DialogContent,
} from '@mui/material';
import { 
    Send, 
    Person, 
    Search,
    History,
    Add,
    Assignment,
    Summarize,
    FolderOpen,
    CalendarToday,
    ArrowBack,
    Chat,
    Close,
    Download,
    MoreVert,
    Timeline,
    People,
    AttachFile,
    ChevronLeft,
    ChevronRight,
    AccountCircle,
} from '@mui/icons-material';
import aiService from '../../utils/aiService';
import apiService from '../../utils/apiService';

const styles = {
    mainContainer: {
        height: '100vh',
        display: 'flex',
        background: '#ffffff',
        overflow: 'hidden',
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
    // Sidebar styles (matching website design exactly)
    sidebar: {
        width: '280px',
        background: '#f8f9fa',
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '0 25px 25px 0',
        border: 'none',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    },
    sidebarHeader: {
        padding: '24px 20px',
        borderBottom: '1px solid #e8eaed',
        background: '#ffffff',
        borderRadius: '0 25px 0 0',
        color: '#202124',
    },
    headerTitle: {
        fontSize: '18px',
        fontWeight: 700,
        marginBottom: '8px',
        color: '#202124',
    },
    headerSubtitle: {
        fontSize: '12px',
        opacity: 0.7,
        color: '#5f6368',
    },
    actionButtons: {
        display: 'flex',
        gap: '12px',
        marginTop: '16px',
    },
    backButton: {
        backgroundColor: '#00A398',
        color: 'white',
        borderRadius: '12px',
        padding: '8px 16px',
        fontSize: '12px',
        fontWeight: 600,
        textTransform: 'none',
        minHeight: '36px',
        '&:hover': {
            backgroundColor: '#008a80',
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 12px rgba(0, 163, 152, 0.3)',
        },
        transition: 'all 0.2s ease',
    },
    newChatButton: {
        backgroundColor: '#00A398',
        color: 'white',
        borderRadius: '12px',
        padding: '8px 16px',
        fontSize: '12px',
        fontWeight: 600,
        textTransform: 'none',
        minHeight: '36px',
        '&:hover': {
            backgroundColor: '#008a80',
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 12px rgba(0, 163, 152, 0.3)',
        },
        transition: 'all 0.2s ease',
    },
    // Project selection section
    projectSection: {
        padding: '16px 20px',
        borderBottom: '1px solid #e8eaed',
    },
    sectionTitle: {
        fontSize: '13px',
        fontWeight: 600,
        color: '#5f6368',
        marginBottom: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
    },
    projectSelector: {
        backgroundColor: '#f8f9fa',
        borderRadius: '12px',
        padding: '12px 16px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        border: '1px solid #e8eaed',
        '&:hover': {
            backgroundColor: '#e8f0fe',
            borderColor: '#1976d2',
            boxShadow: '0 2px 8px rgba(25, 118, 210, 0.15)',
        },
    },
    selectedProject: {
        backgroundColor: '#e8f0fe',
        borderColor: '#1976d2',
        color: '#1976d2',
    },
    projectSelectorText: {
        fontSize: '14px',
        fontWeight: 500,
        color: '#202124',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    },
    projectName: {
        fontSize: '13px',
        color: '#5f6368',
        marginTop: '4px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    },
    // ChatGPT-style history section
    historySection: {
        flex: 1,
        padding: '16px 20px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
    },
    historyHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
    },
    historyTitle: {
        fontSize: '13px',
        fontWeight: 600,
        color: '#5f6368',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
    },
    clearHistoryButton: {
        color: '#5f6368',
        fontSize: '12px',
        padding: '4px 8px',
        minWidth: 'auto',
        '&:hover': {
            backgroundColor: '#f1f3f4',
            color: '#d93025',
        },
    },
    historyList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
    },
    historyItem: {
        backgroundColor: 'transparent',
        borderRadius: '8px',
        padding: '12px 12px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        border: 'none',
        position: 'relative',
        '&:hover': {
            backgroundColor: '#f1f3f4',
        },
        '&.active': {
            backgroundColor: '#e8f0fe',
            '&::before': {
                content: '""',
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: '3px',
                backgroundColor: '#1976d2',
                borderRadius: '0 2px 2px 0',
            },
        },
    },
    historyItemTitle: {
        fontSize: '14px',
        fontWeight: 500,
        color: '#202124',
        lineHeight: 1.3,
        marginBottom: '2px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    },
    historyItemProject: {
        fontSize: '12px',
        color: '#1976d2',
        fontWeight: 500,
        marginBottom: '2px',
    },
    historyItemTime: {
        fontSize: '11px',
        color: '#5f6368',
    },
    // Project selection modal
    projectModal: {
        '& .MuiDialog-paper': {
            borderRadius: '24px',
            maxWidth: '900px',
            width: '95%',
            maxHeight: '85vh',
            boxShadow: '0 24px 38px 3px rgba(0,0,0,0.14), 0 9px 46px 8px rgba(0,0,0,0.12), 0 11px 15px -7px rgba(0,0,0,0.20)',
        },
    },
    projectModalHeader: {
        background: '#ffffff',
        color: '#202124',
        padding: '24px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: '24px 24px 0 0',
        borderBottom: '1px solid #e8eaed',
    },
    projectModalTitle: {
        fontWeight: 700,
        fontSize: '24px',
        color: '#202124',
    },
    projectModalContent: {
        padding: '32px',
        background: '#fafbfc',
    },
    projectSearchField: {
        marginBottom: '24px',
        '& .MuiOutlinedInput-root': {
            borderRadius: '16px',
            backgroundColor: '#ffffff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            border: 'none',
            '&:hover fieldset': {
                borderColor: '#1976d2',
            },
            '&.Mui-focused fieldset': {
                borderColor: '#1976d2',
                borderWidth: '2px',
            },
        },
        '& .MuiOutlinedInput-input': {
            padding: '16px 20px',
            fontSize: '16px',
        },
    },
    projectGrid: {
        maxHeight: '500px',
        overflowY: 'auto',
        padding: '8px',
        '&::-webkit-scrollbar': {
            width: '6px',
        },
        '&::-webkit-scrollbar-track': {
            backgroundColor: '#f1f3f4',
            borderRadius: '3px',
        },
        '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#dadce0',
            borderRadius: '3px',
            '&:hover': {
                backgroundColor: '#bdc1c6',
            },
        },
    },
    projectCard: {
        borderRadius: '16px',
        padding: '20px',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        border: '1px solid #e8eaed',
        backgroundColor: '#ffffff',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        '&:hover': {
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
            transform: 'translateY(-4px)',
            borderColor: '#1976d2',
        },
        '&.selected': {
            backgroundColor: '#e8f0fe',
            borderColor: '#1976d2',
            borderWidth: '2px',
            boxShadow: '0 4px 20px rgba(25, 118, 210, 0.25)',
        },
    },
    projectCodeSmall: {
        fontSize: '12px',
        fontWeight: 700,
        color: '#1976d2',
        marginBottom: '8px',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
    },
    projectCardName: {
        fontSize: '16px',
        fontWeight: 600,
        color: '#202124',
        marginBottom: '12px',
        lineHeight: 1.4,
        flex: 1,
    },
    projectDetails: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    },
    projectDetail: {
        fontSize: '12px',
        color: '#5f6368',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontWeight: 500,
    },
    projectStatus: {
        padding: '4px 8px',
        borderRadius: '12px',
        fontSize: '10px',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        alignSelf: 'flex-start',
        marginTop: '8px',
    },
    statusActive: {
        backgroundColor: '#e8f5e8',
        color: '#137333',
    },
    statusProgress: {
        backgroundColor: '#fef7e0',
        color: '#b06000',
    },
    statusCompleted: {
        backgroundColor: '#e8f0fe',
        color: '#1976d2',
    },
    statusPlanning: {
        backgroundColor: '#f3e8ff',
        color: '#7b1fa2',
    },
    // Main chat area styles (enhanced website design)
    chatArea: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        background: '#ffffff',
        borderRadius: '25px 0 0 25px',
        margin: '0',
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)',
        overflow: 'hidden',
        position: 'relative',
    },
    chatHeader: {
        background: '#ffffff',
        padding: '24px 32px',
        color: '#202124',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: '0',
        borderBottom: '1px solid #e8eaed',
    },
    chatHeaderLeft: {
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
    },
    projectDetailsHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        marginBottom: '12px',
    },
    projectIcon: {
        backgroundColor: '#e8f0fe',
        color: '#1976d2',
        borderRadius: '12px',
        padding: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    projectHeaderInfo: {
        flex: 1,
    },
    projectTitle: {
        fontWeight: 700,
        fontSize: '20px',
        marginBottom: '4px',
        color: '#202124',
    },
    projectCode: {
        fontSize: '14px',
        color: '#FD5707',
        fontWeight: 600,
    },
    projectMetrics: {
        display: 'flex',
        gap: '24px',
        alignItems: 'center',
    },
    projectMetric: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '12px',
        color: '#5f6368',
    },
    chatTitle: {
        fontWeight: 700,
        fontSize: '28px',
        marginBottom: '4px',
    },
    chatSubtitle: {
        fontSize: '14px',
        opacity: 0.9,
    },
    selectedProjectInfo: {
        background: '#f8f9fa',
        borderRadius: '16px',
        padding: '16px 20px',
        fontSize: '12px',
        minWidth: '240px',
        border: '1px solid #e8eaed',
    },
    messagesContainer: {
        flex: 1,
        overflowY: 'auto',
        padding: '24px 32px',
        background: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        '&::-webkit-scrollbar': {
            width: '6px',
        },
        '&::-webkit-scrollbar-track': {
            backgroundColor: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#dadce0',
            borderRadius: '3px',
            '&:hover': {
                backgroundColor: '#bdc1c6',
            },
        },
    },
    messageWrapper: {
        display: 'flex',
        marginBottom: '20px',
        alignItems: 'flex-start',
    },
    userMessageWrapper: {
        justifyContent: 'flex-end',
    },
    assistantMessageWrapper: {
        justifyContent: 'flex-start',
    },
    messageCard: {
        maxWidth: '75%',
        borderRadius: '20px',
        padding: '16px 20px',
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
        position: 'relative',
    },
    userMessage: {
        background: '#ffffff',
        color: '#202124',
        marginLeft: '16px',
        borderBottomRightRadius: '8px',
        border: '1px solid #e8eaed',
    },
    assistantMessage: {
        background: '#ffffff',
        color: '#202124',
        marginRight: '16px',
        border: '1px solid #e8eaed',
        borderBottomLeftRadius: '8px',
    },
    messageText: {
        fontSize: '14px',
        lineHeight: 1.6,
        margin: 0,
        whiteSpace: 'pre-wrap',
        fontWeight: 400,
    },
    messageTime: {
        fontSize: '11px',
        opacity: 0.7,
        marginTop: '8px',
        fontWeight: 500,
    },
    inputContainer: {
        padding: '24px 32px',
        background: '#ffffff',
        borderTop: '1px solid #e8eaed',
    },
    inputWrapper: {
        display: 'flex',
        alignItems: 'flex-end',
        gap: '8px',
        maxWidth: '100%',
        position: 'relative',
    },
    inputField: {
        flex: 1,
        '& .MuiOutlinedInput-root': {
            borderRadius: '24px',
            backgroundColor: '#f8f9fa',
            minHeight: '56px',
            fontSize: '14px',
            paddingRight: '120px',
            '&:hover fieldset': {
                borderColor: '#FD5707',
            },
            '&.Mui-focused fieldset': {
                borderColor: '#FD5707',
                borderWidth: '2px',
            },
        },
        '& .MuiOutlinedInput-input': {
            padding: '16px 20px',
        },
    },
    inputActions: {
        position: 'absolute',
        right: '8px',
        bottom: '8px',
        display: 'flex',
        gap: '8px',
        zIndex: 1,
    },
    actionButton: {
        width: '40px',
        height: '40px',
        borderRadius: '20px',
        backgroundColor: 'transparent',
        color: '#5f6368',
        border: 'none',
        '&:hover': {
            backgroundColor: '#f1f3f4',
            color: '#202124',
        },
    },
    sendButton: {
        backgroundColor: '#FD5707',
        color: 'white',
        width: '40px',
        height: '40px',
        borderRadius: '20px',
        border: 'none',
        '&:hover': {
            backgroundColor: '#e64a06',
            boxShadow: '0 4px 12px rgba(253, 87, 7, 0.3)',
        },
        '&:disabled': {
            backgroundColor: '#dadce0',
            color: '#9aa0a6',
        },
    },
    projectSummaryButton: {
        backgroundColor: '#1976d2',
        color: 'white',
        width: '40px',
        height: '40px',
        borderRadius: '20px',
        border: 'none',
        '&:hover': {
            backgroundColor: '#1565c0',
            boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
        },
        '&:disabled': {
            backgroundColor: '#dadce0',
            color: '#9aa0a6',
        },
    },
    timelineSummaryButton: {
        backgroundColor: '#9c27b0',
        color: 'white',
        width: '40px',
        height: '40px',
        borderRadius: '20px',
        border: 'none',
        '&:hover': {
            backgroundColor: '#7b1fa2',
            boxShadow: '0 4px 12px rgba(156, 39, 176, 0.3)',
        },
        '&:disabled': {
            backgroundColor: '#dadce0',
            color: '#9aa0a6',
        },
    },
    interactionSummaryButton: {
        backgroundColor: '#ff9800',
        color: 'white',
        width: '40px',
        height: '40px',
        borderRadius: '20px',
        border: 'none',
        '&:hover': {
            backgroundColor: '#f57c00',
            boxShadow: '0 4px 12px rgba(255, 152, 0, 0.3)',
        },
        '&:disabled': {
            backgroundColor: '#dadce0',
            color: '#9aa0a6',
        },
    },
    uploadButton: {
        backgroundColor: '#4caf50',
        color: 'white',
        width: '40px',
        height: '40px',
        borderRadius: '20px',
        border: 'none',
        '&:hover': {
            backgroundColor: '#388e3c',
            boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)',
        },
        '&:disabled': {
            backgroundColor: '#dadce0',
            color: '#9aa0a6',
        },
    },
    summaryMenuButton: {
        backgroundColor: '#f8f9fa',
        color: '#5f6368',
        width: '40px',
        height: '40px',
        borderRadius: '20px',
        border: '1px solid #e8eaed',
        '&:hover': {
            backgroundColor: '#e8eaed',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        },
        '&:disabled': {
            backgroundColor: '#dadce0',
            color: '#9aa0a6',
        },
    },
    avatar: {
        width: 40,
        height: 40,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
    },
    userAvatar: {
        backgroundColor: '#FD5707',
    },
    assistantAvatar: {
        backgroundColor: '#667eea',
    },
    typingIndicator: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '16px 20px',
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        borderBottomLeftRadius: '8px',
        maxWidth: '75%',
        marginRight: '16px',
        border: '1px solid #e8eaed',
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
    },
    typingDots: {
        display: 'flex',
        gap: '4px',
    },
    typingDot: {
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        backgroundColor: '#5f6368',
        animation: 'typingAnimation 1.4s infinite',
        '&:nth-child(2)': {
            animationDelay: '0.2s',
        },
        '&:nth-child(3)': {
            animationDelay: '0.4s',
        },
    },
};

// Add keyframes for typing animation
const globalStyles = `
@keyframes typingAnimation {
    0%, 60%, 100% {
        transform: translateY(0);
        opacity: 0.4;
    }
    30% {
        transform: translateY(-10px);
        opacity: 1;
    }
}
`;

const ChatAssistant = ({ companyId, companyName, onBack }) => {
    // Add debugging for props
    console.log('🏢 ChatAssistant initialized with props:', { 
        companyId, 
        companyName, 
        companyIdType: typeof companyId,
        companyNameType: typeof companyName 
    });
    
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [projectSearchQuery, setProjectSearchQuery] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [currentChatId, setCurrentChatId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
    const [attachedFiles, setAttachedFiles] = useState([]);
    const [downloadMenuAnchor, setDownloadMenuAnchor] = useState(null);
    const [summaryMenuAnchor, setSummaryMenuAnchor] = useState(null);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const fileInputRef = useRef(null);

    // Enhanced chat history with intelligent title generation like ChatGPT
    const getChatHistoryTitle = (messages, projectName) => {
        if (messages.length <= 1) return 'New Chat';
        
        const firstUserMessage = messages.find(msg => msg.sender === 'user');
        if (firstUserMessage) {
            const text = firstUserMessage.text.toLowerCase();
            
            // Generate intelligent titles based on content
            if (text.includes('summary') || text.includes('summarize')) {
                return projectName ? `${projectName} Summary` : 'Project Summary';
            } else if (text.includes('timeline') || text.includes('schedule')) {
                return projectName ? `${projectName} Timeline` : 'Project Timeline';
            } else if (text.includes('budget') || text.includes('cost')) {
                return projectName ? `${projectName} Budget` : 'Budget Discussion';
            } else if (text.includes('team') || text.includes('member')) {
                return projectName ? `${projectName} Team` : 'Team Discussion';
            } else if (text.includes('risk') || text.includes('issue')) {
                return projectName ? `${projectName} Risks` : 'Risk Analysis';
            } else if (text.includes('status') || text.includes('progress')) {
                return projectName ? `${projectName} Status` : 'Progress Update';
            } else if (text.includes('help') || text.includes('how to') || text.includes('?')) {
                return 'Help & Questions';
            } else {
                // Use first few words for a natural title
                const words = firstUserMessage.text.split(' ').slice(0, 4);
                let title = words.join(' ');
                if (title.length > 30) {
                    title = title.substring(0, 30) + '...';
                }
                return title || 'New Chat';
            }
        }
        
        return projectName ? `Chat about ${projectName}` : 'New Chat';
    };

    const [projects, setProjects] = useState([]);
    const [isLoadingProjects, setIsLoadingProjects] = useState(false);

    // Filter projects based on search query
    const filteredProjects = projects.filter(project =>
        project.projectCode?.toLowerCase().includes(projectSearchQuery.toLowerCase()) ||
        project.projectName?.toLowerCase().includes(projectSearchQuery.toLowerCase()) ||
        project.projectManager?.toLowerCase().includes(projectSearchQuery.toLowerCase())
    );
    
    // Debug: Log projects state
    console.log('📊 Current projects state:', { 
        totalProjects: projects.length, 
        filteredProjects: filteredProjects.length,
        searchQuery: projectSearchQuery
    });

    // Load projects from API for selected company
    const loadProjects = async () => {
        console.log('Loading projects for company:', companyId, companyName);
        setIsLoadingProjects(true);
        try {
            let response;
            
            if (companyId) {
                // Load projects for specific company using companyId
                console.log('📡 Loading projects by companyId:', companyId);
                response = await apiService.getProjectsByCompany('default', companyId);
            } else {
                // Fallback to loading all projects if no companyId
                console.log('📡 Loading all projects (no companyId provided)');
                response = await apiService.getProjects();
            }
            
            if (response && response.success && response.data) {
                // Data is already transformed in apiService with correct field mappings
                setProjects(response.data);
                console.log('✅ Loaded projects for company:', response.data.length, 'projects');
                console.log('📊 First few projects:', response.data.slice(0, 3));
            } else {
                console.log('❌ No projects found for company:', companyName);
                setProjects([]);
            }
        } catch (error) {
            console.error('❌ Failed to load projects for company:', companyName, error);
            setProjects([]);
        } finally {
            setIsLoadingProjects(false);
        }
    };

    // Load projects from API (legacy for backward compatibility)
    const loadProjects_Legacy = async () => {
        setIsLoadingProjects(true);
        try {
            const response = await apiService.getProjects();
            if (response.success && response.data) {
                // Data is already transformed in apiService, just map to expected format
                const transformedProjects = response.data.map(project => ({
                    id: project.id,
                    projectId: project.projectId,
                    code: project.projectCode,
                    name: project.projectName,
                    teamLead: project.projectManager,
                    status: project.projectStatus,
                    lastModified: project.modifiedTime,
                    description: project.description,
                    companyName: project.s_company_name,
                    // Additional data for detailed view
                    spocEmail: project.spocEmail,
                    totalHours: project.totalHours,
                    totalCost: project.totalCost,
                    timesheetStatus: project.timesheetStatus
                }));
                setProjects(transformedProjects);
                console.log('Loaded projects from database:', transformedProjects.length, 'projects');
            }
        } catch (error) {
            console.error('Failed to load projects:', error);
            // Set fallback projects if API fails
            setProjects([
                {
                    id: 1,
                    code: 'DEMO001',
                    name: 'Demo Project - API Connection Failed',
                    teamLead: 'Demo Manager',
                    status: 'Active',
                    lastModified: '2024-08-07',
                    description: 'This is a demo project shown when API connection fails.',
                    companyName: 'Demo Company'
                }
            ]);
        } finally {
            setIsLoadingProjects(false);
        }
    };

    useEffect(() => {
        console.log('🏢 ChatAssistant props received:', { companyId, companyName });
        
        // Add global styles for typing animation
        const styleSheet = document.createElement('style');
        styleSheet.type = 'text/css';
        styleSheet.innerText = globalStyles;
        document.head.appendChild(styleSheet);

        // Load projects for the specific company
        loadProjects();

        // Don't automatically create a new chat - let user start when they want

        // Remove AI health check since we're removing AI status
        
        return () => {
            if (document.head.contains(styleSheet)) {
                document.head.removeChild(styleSheet);
            }
        };
    }, [companyId, companyName]); // Add companyId and companyName as dependencies

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const startNewChat = () => {
        const newChatId = Date.now().toString();
        const welcomeMessage = {
            id: Date.now(),
            text: `Hello! I'm here to help you with your projects. Please select a project from the list to get started.`,
            sender: 'assistant',
            timestamp: new Date().toLocaleTimeString(),
        };
        
        setCurrentChatId(newChatId);
        setMessages([welcomeMessage]);
        setSelectedProject(null);
        
        // Don't add to chat history immediately - wait for user's first message
        // This way we can create a meaningful title based on what they ask
    };

    // Generate a formatted message with projects list
    const generateProjectsListMessage = () => {
        if (projects.length === 0) {
            return "No projects found.";
        }
        
        let message = `**Available Projects** (${projects.length} projects):\n\n`;
        
        projects.slice(0, 10).forEach((project, index) => {
            message += `${index + 1}. **${project.name || project.projectName}** (${project.code || project.projectCode})\n`;
            message += `   • Manager: ${project.teamLead || project.projectManager || 'Not Assigned'}\n`;
            message += `   • Status: ${project.status || project.projectStatus || 'Active'}\n`;
            if (project.totalCost) {
                message += `   • Total Cost: $${parseFloat(project.totalCost).toLocaleString()}\n`;
            }
            if (project.totalHours) {
                message += `   • Total Hours: ${parseFloat(project.totalHours).toLocaleString()}\n`;
            }
            message += `\n`;
        });
        
        if (projects.length > 10) {
            message += `\n... and ${projects.length - 10} more projects.\n`;
        }
        
        message += `\nPlease select a project above or ask me anything about these projects!`;
        
        return message;
    };

    const selectProject = (project) => {
        setSelectedProject(project);
        setIsProjectModalOpen(false);
        const projectMessage = {
            id: Date.now(),
            text: `I've selected project "${project.name}" (${project.code}). This project is led by ${project.teamLead}. How can I help you with this project?`,
            sender: 'assistant',
            timestamp: new Date().toLocaleTimeString(),
        };
        const updatedMessages = [...messages, projectMessage];
        setMessages(updatedMessages);
        
        // Update current chat in history with project info
        setChatHistory(prev => prev.map(chat => 
            chat.id === currentChatId 
                ? { 
                    ...chat, 
                    projectName: project.name,
                    projectCode: project.code,
                    messages: updatedMessages,
                    messageCount: updatedMessages.length,
                    timestamp: Date.now(),
                    timeDisplay: 'Just now',
                }
                : chat
        ));
    };

    const selectChatHistory = (chatHistoryItem) => {
        setCurrentChatId(chatHistoryItem.id);
        setMessages(chatHistoryItem.messages);
        
        // Find selected project from the chat if any
        const projectMessage = chatHistoryItem.messages.find(msg => 
            msg.text.includes('I\'ve selected project')
        );
        if (projectMessage) {
            const projectCode = projectMessage.text.match(/\((ALLG[^)]+)\)/);
            if (projectCode) {
                const project = projects.find(p => p.code === projectCode[1]);
                setSelectedProject(project);
            }
        } else {
            setSelectedProject(null);
        }
    };

    const clearChatHistory = () => {
        setChatHistory([]);
        startNewChat();
    };

    // Filter chat history based on search term
    const filteredChatHistory = chatHistory.filter(chat => 
        chat.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (chat.projectName && chat.projectName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (chat.projectCode && chat.projectCode.toLowerCase().includes(searchTerm.toLowerCase())) ||
        chat.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSendMessage = async () => {
        if (!inputMessage.trim() || isLoading) return;

        const userMessage = {
            id: Date.now(),
            text: inputMessage,
            sender: 'user',
            timestamp: new Date().toLocaleTimeString(),
        };

        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        setInputMessage('');
        setIsLoading(true);
        setIsTyping(true);

        // Check if this is the first user message in a new chat
        const isFirstMessage = !chatHistory.find(chat => chat.id === currentChatId);
        
        if (isFirstMessage) {
            // Create new chat history entry with intelligent title
            const newChatHistory = {
                id: currentChatId,
                title: getChatHistoryTitle(updatedMessages, selectedProject?.name),
                projectName: selectedProject?.name || null,
                projectCode: selectedProject?.code || null,
                companyName: companyName,
                lastMessage: userMessage.text.substring(0, 60) + (userMessage.text.length > 60 ? '...' : ''),
                timestamp: Date.now(),
                timeDisplay: 'Just now',
                messages: updatedMessages,
                messageCount: updatedMessages.length,
            };
            setChatHistory(prev => [newChatHistory, ...prev.slice(0, 19)]); // Keep only last 20 chats
        } else {
            // Update existing chat history
            setChatHistory(prev => prev.map(chat => 
                chat.id === currentChatId 
                    ? { 
                        ...chat, 
                        title: getChatHistoryTitle(updatedMessages, selectedProject?.name),
                        lastMessage: userMessage.text.substring(0, 60) + (userMessage.text.length > 60 ? '...' : ''),
                        timestamp: Date.now(),
                        timeDisplay: 'Just now',
                        messages: updatedMessages,
                        messageCount: updatedMessages.length,
                    }
                    : chat
            ));
        }

        try {
            // Call real AI service
            const aiResponse = await aiService.callAI(
                inputMessage,
                messages, // Pass conversation history
                companyName,
                selectedProject
            );

            setIsTyping(false);
            const assistantMessage = {
                id: Date.now() + 1,
                text: aiResponse,
                sender: 'assistant',
                timestamp: new Date().toLocaleTimeString(),
            };
            const finalMessages = [...updatedMessages, assistantMessage];
            setMessages(finalMessages);
            setIsLoading(false);

            // Update chat history with assistant response
            setChatHistory(prev => prev.map(chat => 
                chat.id === currentChatId 
                    ? { 
                        ...chat, 
                        messages: finalMessages,
                        messageCount: finalMessages.length,
                        timestamp: Date.now(),
                        timeDisplay: 'Just now',
                    }
                    : chat
            ));
        } catch (error) {
            console.error('Error calling AI service:', error);
            setIsTyping(false);
            
            // Fallback error message
            const errorMessage = {
                id: Date.now() + 1,
                text: `I apologize, but I'm experiencing technical difficulties right now. Please try again in a moment, or contact support if the issue persists.`,
                sender: 'assistant',
                timestamp: new Date().toLocaleTimeString(),
            };
            const finalMessages = [...updatedMessages, errorMessage];
            setMessages(finalMessages);
            setIsLoading(false);

            // Update chat history with error response
            setChatHistory(prev => prev.map(chat => 
                chat.id === currentChatId 
                    ? { 
                        ...chat, 
                        messages: finalMessages,
                        messageCount: finalMessages.length,
                        timestamp: Date.now(),
                        timeDisplay: 'Just now',
                    }
                    : chat
            ));
        }
    };

    const handleProjectSummary = async () => {
        if (!selectedProject) {
            const message = "Please select a project from the sidebar first to generate a project summary.";
            const assistantMessage = {
                id: Date.now(),
                text: message,
                sender: 'assistant',
                timestamp: new Date().toLocaleTimeString(),
            };
            setMessages(prev => [...prev, assistantMessage]);
            return;
        }

        const summaryMessage = {
            id: Date.now(),
            text: `Generate a comprehensive project summary for ${selectedProject.name}`,
            sender: 'user',
            timestamp: new Date().toLocaleTimeString(),
        };

        const updatedMessages = [...messages, summaryMessage];
        setMessages(updatedMessages);
        setIsLoading(true);
        setIsTyping(true);

        try {
            // Call AI service for project summary
            const summaryPrompt = `Please provide a comprehensive project summary for ${selectedProject.name} (${selectedProject.code}). Include project details, current status, key metrics, recent activities, action items, and next steps. Format the response with clear sections and bullet points for easy reading.`;
            
            const aiResponse = await aiService.callAI(
                summaryPrompt,
                messages,
                companyName,
                selectedProject
            );

            setIsTyping(false);
            const assistantMessage = {
                id: Date.now() + 1,
                text: aiResponse,
                sender: 'assistant',
                timestamp: new Date().toLocaleTimeString(),
            };
            
            const finalMessages = [...updatedMessages, assistantMessage];
            setMessages(finalMessages);
            setIsLoading(false);

            // Update chat history
            setChatHistory(prev => prev.map(chat => 
                chat.id === currentChatId 
                    ? { ...chat, messages: finalMessages, messageCount: finalMessages.length }
                    : chat
            ));
        } catch (error) {
            console.error('Error generating project summary:', error);
            setIsTyping(false);
            
            // Fallback project summary
            const fallbackSummary = `**Project Summary for ${selectedProject.name}** (${selectedProject.code})

**Project Details:**
• Team Lead: ${selectedProject.teamLead}
• Status: ${selectedProject.status}
• Last Modified: ${selectedProject.lastModified}

**Note:** I'm currently unable to generate a detailed AI-powered summary due to connectivity issues. Please try again later or contact support for assistance.

**Available Actions:**
• Ask specific questions about this project
• Request team information
• Inquire about project timeline
• Check project documentation requirements`;

            const assistantMessage = {
                id: Date.now() + 1,
                text: fallbackSummary,
                sender: 'assistant',
                timestamp: new Date().toLocaleTimeString(),
            };
            
            const finalMessages = [...updatedMessages, assistantMessage];
            setMessages(finalMessages);
            setIsLoading(false);

            // Update chat history
            setChatHistory(prev => prev.map(chat => 
                chat.id === currentChatId 
                    ? { ...chat, messages: finalMessages, messageCount: finalMessages.length }
                    : chat
            ));
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSendMessage();
        }
    };

    const handleFileUpload = (event) => {
        const files = Array.from(event.target.files);
        setAttachedFiles(prev => [...prev, ...files]);
        
        // Create a message showing the uploaded files
        const fileNames = files.map(file => file.name).join(', ');
        const fileMessage = {
            id: Date.now(),
            text: `📎 Uploaded files: ${fileNames}`,
            sender: 'user',
            timestamp: new Date().toLocaleTimeString(),
            files: files
        };
        
        setMessages(prev => [...prev, fileMessage]);
        
        // Clear the file input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const downloadChatAsWord = () => {
        const chatContent = messages.map(msg => {
            const sender = msg.sender === 'user' ? 'You' : 'AI Assistant';
            return `[${msg.timestamp}] ${sender}: ${msg.text}`;
        }).join('\n\n');
        
        const projectInfo = selectedProject ? 
            `Chat for Project: ${selectedProject.name} (${selectedProject.code})\n` +
            `Team Lead: ${selectedProject.teamLead}\n` +
            `Company: ${companyName}\n\n` : 
            `Chat Session - ${companyName}\n\n`;
        
        const fullContent = projectInfo + chatContent;
        
        const blob = new Blob([fullContent], { type: 'application/msword' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `chat-${selectedProject?.code || 'session'}-${new Date().toISOString().split('T')[0]}.doc`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const downloadChatAsText = () => {
        const chatContent = messages.map(msg => {
            const sender = msg.sender === 'user' ? 'You' : 'AI Assistant';
            return `[${msg.timestamp}] ${sender}: ${msg.text}`;
        }).join('\n\n');
        
        const projectInfo = selectedProject ? 
            `Chat for Project: ${selectedProject.name} (${selectedProject.code})\n` +
            `Team Lead: ${selectedProject.teamLead}\n` +
            `Company: ${companyName}\n\n` : 
            `Chat Session - ${companyName}\n\n`;
        
        const fullContent = projectInfo + chatContent;
        
        const blob = new Blob([fullContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `chat-${selectedProject?.code || 'session'}-${new Date().toISOString().split('T')[0]}.txt`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const downloadChatAsPdf = () => {
        // Simple PDF generation using HTML and print functionality
        const chatContent = messages.map(msg => {
            const sender = msg.sender === 'user' ? 'You' : 'AI Assistant';
            const timestamp = new Date(msg.timestamp).toLocaleString();
            return `
                <div style="margin-bottom: 15px; padding: 10px; border-left: 3px solid ${msg.sender === 'user' ? '#4285f4' : '#34a853'};">
                    <div style="font-weight: bold; color: #5f6368; font-size: 12px; margin-bottom: 5px;">
                        ${sender} - ${timestamp}
                    </div>
                    <div style="color: #202124; line-height: 1.4;">
                        ${msg.text.replace(/\n/g, '<br>')}
                    </div>
                </div>
            `;
        }).join('');
        
        const projectInfo = selectedProject ? 
            `<h2>Chat for Project: ${selectedProject.name} (${selectedProject.code})</h2>
             <p><strong>Team Lead:</strong> ${selectedProject.teamLead}</p>
             <p><strong>Company:</strong> ${companyName}</p>
             <hr style="margin: 20px 0;">` : 
            `<h2>Chat Session - ${companyName}</h2><hr style="margin: 20px 0;">`;
        
        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Chat Export</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; color: #202124; }
                    h2 { color: #1a73e8; margin-bottom: 10px; }
                    hr { border: none; border-top: 1px solid #dadce0; }
                </style>
            </head>
            <body>
                ${projectInfo}
                ${chatContent}
            </body>
            </html>
        `;
        
        // Create a new window and print as PDF
        const printWindow = window.open('', '_blank');
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        printWindow.focus();
        
        // Wait for content to load then trigger print
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 500);
    };

    const handleDownloadClick = () => {
        // For simplicity, we'll download as text by default
        // You could add a menu here to choose between Word and Text
        downloadChatAsText();
    };

    const handleTimelineSummary = async () => {
        if (!selectedProject) {
            const message = "Please select a project from the sidebar first to generate a timeline summary.";
            const assistantMessage = {
                id: Date.now(),
                text: message,
                sender: 'assistant',
                timestamp: new Date().toLocaleTimeString(),
            };
            setMessages(prev => [...prev, assistantMessage]);
            return;
        }

        const timelineMessage = {
            id: Date.now(),
            text: `Generate a timeline summary for ${selectedProject.name}`,
            sender: 'user',
            timestamp: new Date().toLocaleTimeString(),
        };

        const updatedMessages = [...messages, timelineMessage];
        setMessages(updatedMessages);
        setIsLoading(true);
        setIsTyping(true);

        try {
            const timelinePrompt = `Please provide a detailed timeline summary for ${selectedProject.name} (${selectedProject.code}). Include key milestones, project phases, important dates, deliverables, and timeline progression. Format the response chronologically with clear dates and activities.`;
            
            const aiResponse = await aiService.callAI(
                timelinePrompt,
                messages,
                companyName,
                selectedProject
            );

            setIsTyping(false);
            const assistantMessage = {
                id: Date.now() + 1,
                text: aiResponse,
                sender: 'assistant',
                timestamp: new Date().toLocaleTimeString(),
            };
            
            const finalMessages = [...updatedMessages, assistantMessage];
            setMessages(finalMessages);
            setIsLoading(false);
        } catch (error) {
            console.error('Error generating timeline summary:', error);
            setIsTyping(false);
            
            const fallbackResponse = `**Timeline Summary for ${selectedProject.name}** (${selectedProject.code})

**Project Timeline:**
• Project Start: ${selectedProject.lastModified || 'Not specified'}
• Current Status: ${selectedProject.status}
• Team Lead: ${selectedProject.teamLead}

**Key Phases:**
• Planning & Setup
• Development & Implementation  
• Testing & Quality Assurance
• Deployment & Go-Live

**Note:** I'm currently unable to generate a detailed AI-powered timeline due to connectivity issues. Please try again later or contact support for assistance.`;

            const assistantMessage = {
                id: Date.now() + 1,
                text: fallbackResponse,
                sender: 'assistant',
                timestamp: new Date().toLocaleTimeString(),
            };
            
            const finalMessages = [...updatedMessages, assistantMessage];
            setMessages(finalMessages);
            setIsLoading(false);
        }
    };

    const handleInteractionSummary = async () => {
        if (!selectedProject) {
            const message = "Please select a project from the sidebar first to generate an interaction summary.";
            const assistantMessage = {
                id: Date.now(),
                text: message,
                sender: 'assistant',
                timestamp: new Date().toLocaleTimeString(),
            };
            setMessages(prev => [...prev, assistantMessage]);
            return;
        }

        const interactionMessage = {
            id: Date.now(),
            text: `Generate an interaction summary for ${selectedProject.name}`,
            sender: 'user',
            timestamp: new Date().toLocaleTimeString(),
        };

        const updatedMessages = [...messages, interactionMessage];
        setMessages(updatedMessages);
        setIsLoading(true);
        setIsTyping(true);

        try {
            const interactionPrompt = `Please provide a comprehensive interaction summary for ${selectedProject.name} (${selectedProject.code}). Include team communications, stakeholder meetings, client interactions, feedback sessions, and collaboration activities. Format the response with clear sections for different types of interactions.`;
            
            const aiResponse = await aiService.callAI(
                interactionPrompt,
                messages,
                companyName,
                selectedProject
            );

            setIsTyping(false);
            const assistantMessage = {
                id: Date.now() + 1,
                text: aiResponse,
                sender: 'assistant',
                timestamp: new Date().toLocaleTimeString(),
            };
            
            const finalMessages = [...updatedMessages, assistantMessage];
            setMessages(finalMessages);
            setIsLoading(false);
        } catch (error) {
            console.error('Error generating interaction summary:', error);
            setIsTyping(false);
            
            const fallbackResponse = `**Interaction Summary for ${selectedProject.name}** (${selectedProject.code})

**Team Interactions:**
• Team Lead: ${selectedProject.teamLead}
• Regular team meetings and standups
• Project planning sessions
• Code reviews and technical discussions

**Stakeholder Communications:**
• Client meetings and presentations
• Progress reports and updates
• Requirement gathering sessions
• Feedback and approval cycles

**Collaboration Activities:**
• Cross-functional team coordination
• Documentation and knowledge sharing
• Issue resolution and problem-solving
• Quality assurance reviews

**Note:** I'm currently unable to generate a detailed AI-powered interaction summary due to connectivity issues. Please try again later or contact support for assistance.`;

            const assistantMessage = {
                id: Date.now() + 1,
                text: fallbackResponse,
                sender: 'assistant',
                timestamp: new Date().toLocaleTimeString(),
            };
            
            const finalMessages = [...updatedMessages, assistantMessage];
            setMessages(finalMessages);
            setIsLoading(false);
        }
    };

    const handleDownloadMenuClick = (event) => {
        setDownloadMenuAnchor(event.currentTarget);
    };

    const handleDownloadMenuClose = () => {
        setDownloadMenuAnchor(null);
    };

    const handleDownloadFormat = (format) => {
        if (format === 'text') {
            downloadChatAsText();
        } else if (format === 'word') {
            downloadChatAsWord();
        } else if (format === 'pdf') {
            downloadChatAsPdf();
        }
        handleDownloadMenuClose();
    };

    const handleSummaryMenuClick = (event) => {
        setSummaryMenuAnchor(event.currentTarget);
    };

    const handleSummaryMenuClose = () => {
        setSummaryMenuAnchor(null);
    };

    const handleSummaryOption = (type) => {
        if (type === 'project') {
            handleProjectSummary();
        } else if (type === 'timeline') {
            handleTimelineSummary();
        } else if (type === 'interaction') {
            handleInteractionSummary();
        }
        handleSummaryMenuClose();
    };

    const renderMessage = (message) => (
        <Box
            key={message.id}
            sx={{
                ...styles.messageWrapper,
                ...(message.sender === 'user' ? styles.userMessageWrapper : styles.assistantMessageWrapper),
            }}
        >
            {message.sender === 'user' && (
                <Avatar
                    sx={{
                        ...styles.avatar,
                        ...styles.userAvatar,
                    }}
                >
                    <Person />
                </Avatar>
            )}
            <Card
                sx={{
                    ...styles.messageCard,
                    ...(message.sender === 'user' ? styles.userMessage : styles.assistantMessage),
                }}
            >
                <Typography sx={styles.messageText}>
                    {message.text}
                </Typography>
                <Typography sx={styles.messageTime}>
                    {message.timestamp}
                </Typography>
            </Card>
        </Box>
    );

    const renderTypingIndicator = () => (
        <Box sx={{ ...styles.messageWrapper, ...styles.assistantMessageWrapper }}>
            {/* <Avatar sx={{ ...styles.avatar, ...styles.assistantAvatar }}>
                A
            </Avatar> */}
            <Box sx={styles.typingIndicator}>
                <Typography variant="caption" sx={{ color: '#666' }}>
                    AI is typing
                </Typography>
                <Box sx={styles.typingDots}>
                    <Box sx={styles.typingDot} />
                    <Box sx={styles.typingDot} />
                    <Box sx={styles.typingDot} />
                </Box>
            </Box>
        </Box>
    );

    return (
        <Box sx={styles.mainContainer}>
            {/* Floating Sidebar Toggle Button */}
            <IconButton
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                sx={{
                    position: 'fixed',
                    top: '50%',
                    left: isSidebarOpen ? '270px' : '10px',
                    transform: 'translateY(-50%)',
                    zIndex: 1300,
                    backgroundColor: '#1976d2',
                    color: 'white',
                    width: '40px',
                    height: '40px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': { 
                        backgroundColor: '#1565c0',
                        transform: 'translateY(-50%) scale(1.1)',
                    },
                }}
            >
                {isSidebarOpen ? <ChevronLeft /> : <ChevronRight />}
            </IconButton>

            {/* ChatGPT-Style Sidebar */}
            {isSidebarOpen && (
                <Box sx={styles.sidebar}>
                    {/* Header */}
                    <Box sx={styles.sidebarHeader}>
                        <Typography sx={styles.headerTitle}>
                            Chat Assistant
                        </Typography>
                        <Typography sx={styles.headerSubtitle}>
                             {companyName}
                        </Typography>
                        
                        <Box sx={styles.actionButtons}>
                            <Button
                                sx={styles.backButton}
                                onClick={onBack}
                                startIcon={<ArrowBack />}
                            >
                                Back
                            </Button>
                            <Button
                                sx={styles.newChatButton}
                                onClick={startNewChat}
                                startIcon={<Add />}
                            >
                                New Chat
                            </Button>
                        </Box>
                    </Box>

                {/* Project Selection */}
                <Box sx={styles.projectSection}>
                    <Typography sx={styles.sectionTitle}>
                        <FolderOpen fontSize="small" />
                        Project
                    </Typography>
                    <Box
                        sx={{
                            ...styles.projectSelector,
                            ...(selectedProject ? styles.selectedProject : {})
                        }}
                        onClick={() => setIsProjectModalOpen(true)}
                    >
                        <Typography sx={styles.projectSelectorText}>
                            {selectedProject ? (
                                <>
                                    <Assignment fontSize="small" />
                                    {selectedProject.code}
                                </>
                            ) : (
                                <>
                                    <Add fontSize="small" />
                                    Select Project
                                </>
                            )}
                        </Typography>
                        {selectedProject && (
                            <Typography sx={styles.projectName}>
                                {selectedProject.name} ({selectedProject.companyName})
                            </Typography>
                        )}
                    </Box>
                </Box>

                {/* Chat History */}
                <Box sx={styles.historySection}>
                    <Box sx={styles.historyHeader}>
                        <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                            <History fontSize="small" sx={{ marginRight: '8px' }} />
                            <Typography sx={styles.historyTitle}>
                                Recent Chats
                            </Typography>
                            {/* Inline search icon */}
                            <IconButton
                                size="small"
                                onClick={() => setSearchTerm(searchTerm ? '' : 'search')}
                                sx={{ 
                                    marginLeft: 'auto',
                                    padding: '4px',
                                    color: '#5f6368',
                                    '&:hover': { backgroundColor: '#f8f9fa' }
                                }}
                            >
                                <Search fontSize="small" />
                            </IconButton>
                        </Box>
                        {chatHistory.length > 0 && (
                            <Button
                                sx={styles.clearHistoryButton}
                                onClick={clearChatHistory}
                                size="small"
                            >
                                Clear
                            </Button>
                        )}
                    </Box>
                    
                    {/* Expandable search box - only show when search icon is clicked */}
                    {searchTerm !== '' && (
                        <Box sx={{ padding: '8px 16px' }}>
                            <TextField
                                size="small"
                                placeholder="Search chat history..."
                                value={searchTerm === 'search' ? '' : searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                autoFocus
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Search fontSize="small" />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                size="small"
                                                onClick={() => setSearchTerm('')}
                                                sx={{ padding: '2px' }}
                                            >
                                                <Close fontSize="small" />
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        backgroundColor: '#f8f9fa',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                        '& fieldset': {
                                            borderColor: '#e8eaed',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: '#dadce0',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#1976d2',
                                        },
                                    },
                                }}
                            />
                        </Box>
                    )}
                    
                    <Box sx={styles.historyList}>
                        {filteredChatHistory.length > 0 ? (
                            filteredChatHistory.slice(0, 15).map((chat) => (
                                <Box
                                    key={chat.id}
                                    sx={{
                                        ...styles.historyItem,
                                        ...(currentChatId === chat.id ? { className: 'active' } : {})
                                    }}
                                    className={currentChatId === chat.id ? 'active' : ''}
                                    onClick={() => selectChatHistory(chat)}
                                >
                                    <Typography sx={styles.historyItemTitle}>
                                        {chat.title}
                                    </Typography>
                                    {chat.projectName && (
                                        <Typography sx={styles.historyItemProject}>
                                            {chat.projectCode} • {chat.projectName.substring(0, 25)}
                                            {chat.projectName.length > 25 ? '...' : ''}
                                        </Typography>
                                    )}
                                    <Typography sx={styles.historyItemTime}>
                                        {chat.timeDisplay} • {chat.messageCount} messages
                                    </Typography>
                                </Box>
                            ))
                        ) : (
                            <Typography sx={{ 
                                textAlign: 'center', 
                                color: '#9aa0a6', 
                                fontSize: '12px',
                                fontStyle: 'italic',
                                padding: '20px 0'
                            }}>
                                {searchTerm ? 'No chats found matching your search' : 'No chat history yet'}
                            </Typography>
                        )}
                    </Box>
                </Box>
                </Box>
            )}

            {/* Project Selection Modal */}
            <Dialog
                open={isProjectModalOpen}
                onClose={() => setIsProjectModalOpen(false)}
                sx={styles.projectModal}
            >
                <Box sx={styles.projectModalHeader}>
                    <Typography sx={styles.projectModalTitle}>
                        Select Project
                    </Typography>
                    <IconButton
                        onClick={() => setIsProjectModalOpen(false)}
                        sx={{ color: '#5f6368' }}
                    >
                        <Close />
                    </IconButton>
                </Box>
                
                <DialogContent sx={styles.projectModalContent}>
                    <TextField
                        fullWidth
                        placeholder="Search by project code or name..."
                        value={projectSearchQuery}
                        onChange={(e) => setProjectSearchQuery(e.target.value)}
                        sx={styles.projectSearchField}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search />
                                </InputAdornment>
                            ),
                        }}
                    />
                    
                    <Box sx={styles.projectGrid}>
                        {isLoadingProjects ? (
                            <Box sx={{ 
                                display: 'flex', 
                                justifyContent: 'center', 
                                alignItems: 'center',
                                height: '200px'
                            }}>
                                <CircularProgress />
                                <Typography sx={{ ml: 2 }}>Loading projects...</Typography>
                            </Box>
                        ) : (
                            <Grid container spacing={3}>
                                {filteredProjects.map((project) => (
                                    <Grid item xs={12} sm={6} md={4} key={project.id}>
                                        <Card
                                            sx={{
                                                ...styles.projectCard,
                                                ...(selectedProject?.id === project.id ? { className: 'selected' } : {})
                                            }}
                                            className={selectedProject?.id === project.id ? 'selected' : ''}
                                            onClick={() => selectProject(project)}
                                        >
                                            <Typography sx={styles.projectCode}>
                                                {project.code}
                                            </Typography>
                                            <Typography sx={styles.projectCardName}>
                                                {project.name}
                                            </Typography>
                                            <Box sx={styles.projectDetails}>
                                                <Typography sx={styles.projectDetail}>
                                                    <AccountCircle fontSize="inherit" />
                                                    Lead: {project.teamLead}
                                                </Typography>
                                                {project.companyName && (
                                                    <Typography sx={styles.projectDetail}>
                                                        <Assignment fontSize="inherit" />
                                                        Company: {project.companyName}
                                                    </Typography>
                                                )}
                                            </Box>
                                            <Box
                                                sx={{
                                                    ...styles.projectStatus,
                                                    ...(project.status === 'Active' ? styles.statusActive : 
                                                       project.status === 'In Progress' ? styles.statusProgress :
                                                       project.status === 'Completed' ? styles.statusCompleted :
                                                       styles.statusPlanning)
                                                }}
                                            >
                                                {project.status}
                                            </Box>
                                        </Card>
                                    </Grid>
                                ))}
                                {filteredProjects.length === 0 && !isLoadingProjects && (
                                    <Grid item xs={12}>
                                        <Typography sx={{ 
                                            textAlign: 'center', 
                                            color: '#9aa0a6', 
                                            fontSize: '14px',
                                            fontStyle: 'italic',
                                            padding: '40px 0'
                                        }}>
                                            {projectSearchQuery ? 'No projects found matching your search.' : 'No projects available.'}
                                        </Typography>
                                    </Grid>
                                )}
                            </Grid>
                        )}
                    </Box>
                </DialogContent>
            </Dialog>

            {/* Main Chat Area */}
            <Box sx={styles.chatArea}>
                {/* Chat Header */}
                <Box sx={styles.chatHeader}>
                    <Box sx={styles.chatHeaderLeft}>
                        {selectedProject ? (
                            <>
                                <Box sx={styles.projectDetailsHeader}>
                                    <Box sx={styles.projectHeaderInfo}>
                                        <Typography sx={styles.projectTitle}>
                                            {selectedProject.name}
                                        </Typography>
                                        <Typography sx={styles.projectCode}>
                                            {selectedProject.code}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Box sx={styles.projectMetrics}>
                                    <Box sx={styles.projectMetric}>
                                        <AccountCircle fontSize="small" />
                                        Team Lead: {selectedProject.teamLead}
                                    </Box>
                                    <Box sx={styles.projectMetric}>
                                        <CalendarToday fontSize="small" />
                                        Last Modified: {selectedProject.lastModified}
                                    </Box>
                                    {/* <Box sx={styles.projectMetric}>
                                        <Assignment fontSize="small" />
                                        Status: {selectedProject.status}
                                    </Box> */}
                                </Box>
                            </>
                        ) : (
                            <>
                                <Typography sx={styles.projectTitle}>
                                    {companyName || 'Company'} Assistant
                                </Typography>
                                <Typography sx={styles.projectCode}>
                                    {/* Select a project from the sidebar to get started with AI assistance */}
                                </Typography>
                            </>
                        )}
                    </Box>
                    
                    {/* Download Menu Button */}
                    {messages.length > 1 && (
                        <>
                            <Tooltip title="Chat Options">
                                <IconButton 
                                    onClick={handleDownloadMenuClick}
                                    sx={{
                                        backgroundColor: '#f8f9fa',
                                        border: '1px solid #e8eaed',
                                        borderRadius: '12px',
                                        padding: '8px',
                                        '&:hover': {
                                            backgroundColor: '#e8f0fe',
                                            borderColor: '#1976d2',
                                        },
                                    }}
                                >
                                    <MoreVert fontSize="small" />
                                </IconButton>
                            </Tooltip>
                            <Menu
                                anchorEl={downloadMenuAnchor}
                                open={Boolean(downloadMenuAnchor)}
                                onClose={handleDownloadMenuClose}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'right',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                            >
                                <MenuItem onClick={() => handleDownloadFormat('pdf')}>
                                    <Download fontSize="small" sx={{ mr: 1 }} />
                                    Download as PDF (.pdf)
                                </MenuItem>
                                <MenuItem onClick={() => handleDownloadFormat('word')}>
                                    <Download fontSize="small" sx={{ mr: 1 }} />
                                    Download as Word (.doc)
                                </MenuItem>
                            </Menu>
                        </>
                    )}
                </Box>

                {/* Messages Container */}
                <Box sx={styles.messagesContainer}>
                    {messages.length > 0 ? (
                        <>
                            {/* Messages */}
                            {messages.map(renderMessage)}
                            
                            {/* Typing Indicator */}
                            {isTyping && renderTypingIndicator()}
                        </>
                    ) : (
                        /* Welcome message when no chat is active */
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100%',
                            textAlign: 'center',
                            padding: '40px',
                        }}>
                            <Chat sx={{ fontSize: 64, color: '#9aa0a6', marginBottom: '16px' }} />
                            <Typography variant="h6" sx={{ color: '#5f6368', marginBottom: '8px' }}>
                                Welcome to Chat Assistant
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#9aa0a6', marginBottom: '16px' }}>
                                Click "New Chat" to start a conversation or select a chat from your history.
                            </Typography>
                        </Box>
                    )}
                    
                    <div ref={messagesEndRef} />
                </Box>

                {/* Input Area */}
                <Box sx={styles.inputContainer}>
                    <Box sx={styles.inputWrapper}>
                        {/* Upload button on the left */}
                        <Tooltip title="Upload Files">
                            <IconButton 
                                sx={styles.uploadButton} 
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <AttachFile />
                            </IconButton>
                        </Tooltip>
                        
                        {/* Hidden file input */}
                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            multiple
                            accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.xls,.xlsx,.ppt,.pptx"
                            onChange={handleFileUpload}
                        />
                        
                        <TextField
                            ref={inputRef}
                            fullWidth
                            multiline
                            maxRows={4}
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder={selectedProject ? `Ask about ${selectedProject.name}...` : "Type your message here..."}
                            sx={styles.inputField}
                            disabled={isLoading}
                        />
                        
                        <Box sx={styles.inputActions}>
                            {/* Summary menu button */}
                            <Tooltip title="Summary Options">
                                <IconButton 
                                    onClick={handleSummaryMenuClick}
                                    sx={styles.summaryMenuButton}
                                    disabled={!selectedProject || isLoading}
                                >
                                    <MoreVert />
                                </IconButton>
                            </Tooltip>
                            
                            <Menu
                                anchorEl={summaryMenuAnchor}
                                open={Boolean(summaryMenuAnchor)}
                                onClose={handleSummaryMenuClose}
                                PaperProps={{
                                    style: {
                                        background: '#ffffff',
                                        color: '#202124',
                                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                                        border: '1px solid #e8eaed',
                                    }
                                }}
                            >
                                <MenuItem onClick={() => handleSummaryOption('project')} style={{ color: '#202124' }}>
                                    <Summarize style={{ marginRight: '8px' }} />
                                    Project Summary
                                </MenuItem>
                                <MenuItem onClick={() => handleSummaryOption('timeline')} style={{ color: '#202124' }}>
                                    <Timeline style={{ marginRight: '8px' }} />
                                    Timeline Summary
                                </MenuItem>
                                <MenuItem onClick={() => handleSummaryOption('interaction')} style={{ color: '#202124' }}>
                                    <People style={{ marginRight: '8px' }} />
                                    Interaction Summary
                                </MenuItem>
                            </Menu>
                            
                            <Tooltip title="Send Message">
                                <IconButton
                                    onClick={handleSendMessage}
                                    sx={styles.sendButton}
                                    disabled={!inputMessage.trim() || isLoading}
                                >
                                    <Send />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default ChatAssistant;
