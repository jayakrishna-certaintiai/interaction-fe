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
    Select,
    FormControl,
    InputLabel,
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
} from '@mui/material';
import { 
    Send, 
    Person, 
    Search,
    History,
    Add,
    Delete,
    Settings,
    SmartToy,
    Business,
    Code,
    Refresh,
    Download,
    Close,
    ChatBubbleOutline,
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
    
    // Chat History State
    const [chatSessions, setChatSessions] = useState([
        {
            id: 'welcome',
            title: 'Welcome Chat',
            lastMessage: 'Welcome to AI Chat Assistant',
            timestamp: new Date(),
            messageCount: 1,
            isActive: true
        }
    ]);
    const [currentChatId, setCurrentChatId] = useState('welcome');
    const [searchHistory, setSearchHistory] = useState('');
    const [filteredSessions, setFilteredSessions] = useState(chatSessions);
    
    // Mode State
    const [chatMode, setChatMode] = useState('general'); // 'general' or 'account'
    const [selectedAccount, setSelectedAccount] = useState('');
    const [accounts, setAccounts] = useState([]);
    const [projects, setProjects] = useState([]);
    
    // UI State
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [showSQLQuery, setShowSQLQuery] = useState('');
    const [showSettings, setShowSettings] = useState(false);
    
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
            content: `Welcome to the AI Chat Assistant.

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

    const handleModeChange = async (mode, accountId = '') => {
        setChatMode(mode);
        setSelectedAccount(accountId);
        
        let projectsData = [];
        if (mode === 'account' && accountId) {
            projectsData = await fetchProjectsForAccount(accountId);
        } else {
            setProjects([]);
        }
        
        const accountName = accounts.find(acc => acc.companyId === accountId)?.companyName || 'Selected Account';
        
        const modeMessage = {
            id: Date.now(),
            type: 'system',
            content: mode === 'account' 
                ? `Account Mode Activated: ${accountName}\n\n${projectsData.length} project(s) loaded. I can now analyze your project data, generate SQL queries, and provide insights about budgets, KPIs, timesheets, and more!\n\nTry asking: "What's the total budget for active projects?" or "Show me project completion rates"`
                : `General Mode Activated\n\nI'm now in general assistant mode. Ask me anything about:\n• Business strategy and planning\n• Tax and financial concepts\n• Industry best practices\n• General knowledge questions\n\nTry asking: "Explain tax credits" or "What are KPIs?"`,
            timestamp: new Date(),
            sender: 'system',
            metadata: {
                mode: mode,
                accountId: accountId,
                projectCount: projectsData.length
            }
        };
        
        setMessages(prev => [...prev, modeMessage]);
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
                conversationHistory: conversationHistory
            };

            if (chatMode === 'account' && selectedAccount) {
                // Account-specific mode - uses optimized enhanced chat with smart context selection
                console.log('Account mode - Using optimized enhanced chat with smart context selection');
                endpoint = `${BaseURL}/api/v1/enhanced-chat/enhanced-chat`;
                
                // Enhanced chat auto-detects context and sends only relevant data to AI
                // This solves the context limit issue while maintaining all functionality
                
                // Check if this is a data query for enhanced processing
                if (sqlMode || isDataQuery(userMessage.content)) {
                    console.log('Data query detected - Enhanced chat will handle with optimized context');
                }
            } else {
                // General chat mode - also uses optimized enhanced chat for consistency
                console.log('General mode - using optimized enhanced chat for better performance');
                endpoint = `${BaseURL}/api/v1/enhanced-chat/enhanced-chat`;
            }

            console.log('Sending request to:', endpoint);
            console.log('Request body:', requestBody);

            const response = await axios.post(endpoint, requestBody, Authorization_header());
            console.log('Response received:', response.data);

            if (response.data.success) {
                const aiMessage = {
                    id: Date.now() + 1,
                    type: 'assistant',
                    content: response.data.data.response || response.data.data.explanation || 'No response received',
                    timestamp: new Date(),
                    sender: 'assistant',
                    metadata: {
                        mode: chatMode,
                        sqlQuery: response.data.data.sqlQuery,
                        resultsCount: response.data.data.resultsCount,
                        processingTime: response.data.data.metadata?.processingTime,
                        downloadAvailable: !!response.data.data.downloadContent,
                        downloadContent: response.data.data.downloadContent
                    }
                };

                setMessages(prev => [...prev, aiMessage]);
                
                // Update conversation history
                setConversationHistory(prev => [
                    ...prev,
                    { role: 'user', content: userMessage.content },
                    { role: 'assistant', content: aiMessage.content }
                ]);

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

    const isDataQuery = (message) => {
        const dataKeywords = ['budget', 'cost', 'project', 'kpi', 'metric', 'hours', 'timesheet', 'survey', 'show', 'total', 'count', 'list', 'analysis'];
        return dataKeywords.some(keyword => message.toLowerCase().includes(keyword));
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

    const renderMessage = (message) => {
        const isUser = message.sender === 'user';
        const isSystem = message.type === 'system';
        const isError = message.type === 'error';

        return (
            <Box key={message.id} sx={{ mb: 2, px: 2 }}>
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
                                width: 32,
                                height: 32,
                                fontSize: '0.875rem'
                            }}
                        >
                            {isSystem ? 'S' : isError ? '!' : 'AI'}
                        </Avatar>
                    )}
                    
                    <Paper
                        elevation={1}
                        sx={{
                            p: 2,
                            maxWidth: '75%',
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
                        
                        {/* Message metadata and actions */}
                        {message.metadata && !isUser && (
                            <Box sx={{ mt: 1.5, display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                                {message.metadata.mode && (
                                    <Chip 
                                        size="small" 
                                        label={message.metadata.mode === 'account' ? 'Account' : 'General'}
                                        color={message.metadata.mode === 'account' ? 'primary' : 'default'}
                                        variant="outlined"
                                        sx={{ fontSize: '0.75rem', height: '20px' }}
                                    />
                                )}
                                
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
                                
                                {message.metadata.resultsCount > 0 && (
                                    <Chip 
                                        size="small" 
                                        label={`${message.metadata.resultsCount} results`}
                                        color="success"
                                        variant="outlined"
                                        sx={{ fontSize: '0.75rem', height: '20px' }}
                                    />
                                )}
                            </Box>
                        )}
                        
                        <Typography
                            variant="caption"
                            sx={{
                                display: 'block',
                                mt: 1,
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
                                width: 32,
                                height: 32,
                                fontSize: '0.875rem'
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
            {/* Sidebar with Chat History */}
            <Drawer
                variant="persistent"
                anchor="left"
                open={sidebarOpen}
                sx={{
                    width: 280,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: 280,
                        boxSizing: 'border-box',
                        position: 'relative',
                        bgcolor: '#ffffff',
                        borderRight: '1px solid #e0e0e0'
                    },
                }}
            >
                {/* Sidebar Header */}
                <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#1976d2' }}>
                            Chat Assistant
                        </Typography>
                        <IconButton
                            size="small"
                            onClick={() => setSidebarOpen(false)}
                            sx={{ display: { md: 'none' } }}
                        >
                            <Close />
                        </IconButton>
                    </Box>
                    
                    <Button
                        fullWidth
                        variant="contained"
                        startIcon={<Add />}
                        onClick={createNewChat}
                        sx={{ 
                            bgcolor: '#1976d2',
                            '&:hover': { bgcolor: '#1565c0' },
                            borderRadius: '8px',
                            textTransform: 'none',
                            fontWeight: 500
                        }}
                    >
                        New Chat
                    </Button>
                </Box>

                {/* Search Chat History */}
                <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
                    <TextField
                        fullWidth
                        size="small"
                        placeholder="Search conversations..."
                        value={searchHistory}
                        onChange={(e) => setSearchHistory(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search fontSize="small" />
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '8px',
                                fontSize: '0.875rem'
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
                                    mx: 1,
                                    my: 0.5,
                                    borderRadius: '8px',
                                    '&.Mui-selected': {
                                        bgcolor: '#e3f2fd',
                                        '&:hover': { bgcolor: '#e3f2fd' }
                                    }
                                }}
                            >
                                <ListItemIcon sx={{ minWidth: 36 }}>
                                    <ChatBubbleOutline fontSize="small" color="action" />
                                </ListItemIcon>
                                <ListItemText
                                    primary={
                                        <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.875rem' }}>
                                            {session.title}
                                        </Typography>
                                    }
                                    secondary={
                                        <Box>
                                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                                                {session.lastMessage.length > 40 
                                                    ? session.lastMessage.substring(0, 40) + '...'
                                                    : session.lastMessage
                                                }
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.7rem' }}>
                                                {formatTimestamp(session.timestamp)} • {session.messageCount} messages
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
                                    sx={{ opacity: 0.6, '&:hover': { opacity: 1 } }}
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
                {/* Header */}
                <Paper 
                    elevation={0} 
                    sx={{ 
                        p: 2, 
                        borderBottom: '1px solid #e0e0e0',
                        bgcolor: 'white'
                    }}
                >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            {!sidebarOpen && (
                                <IconButton
                                    onClick={() => setSidebarOpen(true)}
                                    sx={{ display: { md: 'none' } }}
                                >
                                    <History />
                                </IconButton>
                            )}
                            
                            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1976d2' }}>
                                {chatSessions.find(s => s.id === currentChatId)?.title || 'AI Assistant'}
                            </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {/* Mode Selector */}
                            <FormControl size="small" sx={{ minWidth: 140 }}>
                                <InputLabel>Mode</InputLabel>
                                <Select
                                    value={chatMode}
                                    label="Mode"
                                    onChange={(e) => handleModeChange(e.target.value)}
                                    sx={{ fontSize: '0.875rem' }}
                                >
                                    <MenuItem value="general">
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <SmartToy fontSize="small" />
                                            General
                                        </Box>
                                    </MenuItem>
                                    <MenuItem value="account">
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Business fontSize="small" />
                                            Account
                                        </Box>
                                    </MenuItem>
                                </Select>
                            </FormControl>
                            
                            {/* Account Selector (only in account mode) */}
                            {chatMode === 'account' && (
                                <FormControl size="small" sx={{ minWidth: 200 }}>
                                    <InputLabel>Account</InputLabel>
                                    <Select
                                        value={selectedAccount}
                                        label="Account"
                                        onChange={(e) => handleModeChange('account', e.target.value)}
                                        sx={{ fontSize: '0.875rem' }}
                                    >
                                        {accounts.map((account) => (
                                            <MenuItem key={account.companyId} value={account.companyId}>
                                                {account.companyName}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            )}
                            
                            <Tooltip title="Clear Chat">
                                <IconButton onClick={clearCurrentChat} size="small">
                                    <Refresh />
                                </IconButton>
                            </Tooltip>
                            
                            <Tooltip title="Settings">
                                <IconButton onClick={() => setShowSettings(true)} size="small">
                                    <Settings />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Box>
                    
                    {/* Mode indicator */}
                    <Box sx={{ mt: 1, display: 'flex', gap: 1, alignItems: 'center' }}>
                        <Chip 
                            size="small" 
                            label={chatMode === 'account' ? 'Account Mode' : 'General Mode'}
                            color={chatMode === 'account' ? 'primary' : 'default'}
                            variant="outlined"
                        />
                        {chatMode === 'account' && projects.length > 0 && (
                            <Typography variant="caption" color="text.secondary">
                                {projects.length} project(s) available for analysis
                            </Typography>
                        )}
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
                            <SmartToy sx={{ fontSize: 64, color: '#1976d2', mb: 2 }} />
                            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                                AI Chat Assistant
                            </Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600 }}>
                                Your intelligent assistant for both general questions and data-driven insights.
                                Choose your mode above and start chatting!
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

                {/* Input Area */}
                <Paper
                    elevation={0}
                    sx={{
                        p: 2,
                        borderTop: '1px solid #e0e0e0',
                        bgcolor: 'white'
                    }}
                >
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
                        <TextField
                            ref={chatInputRef}
                            fullWidth
                            multiline
                            maxRows={4}
                            placeholder={
                                chatMode === 'account' 
                                    ? "Ask about your projects, budgets, KPIs, or generate SQL queries..." 
                                    : "Ask me anything about business, finance, or general topics..."
                            }
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            disabled={isLoading}
                            variant="outlined"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px',
                                    backgroundColor: '#f8f9fa',
                                    fontSize: '0.9rem'
                                }
                            }}
                        />
                        
                        <IconButton
                            onClick={sendMessage}
                            disabled={!inputMessage.trim() || isLoading}
                            sx={{
                                bgcolor: '#1976d2',
                                color: 'white',
                                width: 40,
                                height: 40,
                                '&:hover': {
                                    bgcolor: '#1565c0'
                                },
                                '&:disabled': {
                                    bgcolor: '#ccc'
                                }
                            }}
                        >
                            <Send fontSize="small" />
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
        </Box>
    );
};

export default EnhancedChatAssistant;
