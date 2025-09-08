import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  Avatar,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Divider,
  CircularProgress,
  Tooltip,
  Fade,
  Collapse
} from '@mui/material';
import {
  Send as SendIcon,
  Chat as ChatIcon,
  Close as CloseIcon,
  SmartToy as AIIcon,
  Business as AccountIcon,
  Code as SQLIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  MinimizeOutlined as MinimizeIcon,
  OpenInFull as ExpandIcon
} from '@mui/icons-material';
import axios from 'axios';
import { BaseURL } from '../../constants/Baseurl';
import { Authorization_header } from '../../utils/helper/Constant';
import toast from 'react-hot-toast';

const HomePageChatAssistant = () => {
  // Chat State
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Mode State
  const [chatMode, setChatMode] = useState('general'); // 'general' or 'account'
  const [selectedAccount, setSelectedAccount] = useState('');
  const [accounts, setAccounts] = useState([]);
  const [projects, setProjects] = useState([]);
  
  // UI State
  const [showSQLQuery, setShowSQLQuery] = useState(false);
  const [lastSQLQuery, setLastSQLQuery] = useState('');
  
  const messagesEndRef = useRef(null);
  const chatInputRef = useRef(null);

  // Fetch accounts on component mount
  useEffect(() => {
    fetchAccounts();
  }, []);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchAccounts = async () => {
    try {
      const response = await axios.get(
        `${BaseURL}/api/v1/company/get-companies`,
        Authorization_header()
      );
      if (response.data.success) {
        setAccounts(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  };

  const fetchProjectsForAccount = async (accountId) => {
    try {
      const response = await axios.get(
        `${BaseURL}/api/v1/projects/get-projects?companyId=${accountId}`,
        Authorization_header()
      );
      if (response.data.success) {
        setProjects(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      setProjects([]);
    }
  };

  const handleAccountChange = (accountId) => {
    setSelectedAccount(accountId);
    if (accountId) {
      setChatMode('account');
      fetchProjectsForAccount(accountId);
      // Add system message about account selection
      const accountName = accounts.find(acc => acc.companyId === accountId)?.companyName || 'Selected Account';
      addSystemMessage(`🏢 Switched to Account Mode: ${accountName}. I now have access to this account's project data and can answer questions about budgets, KPIs, project status, and more.`);
    } else {
      setChatMode('general');
      setProjects([]);
      addSystemMessage('🤖 Switched to General Chat Mode. I can help with general questions about business, tax, finance, and more.');
    }
  };

  const addSystemMessage = (content) => {
    const systemMessage = {
      id: Date.now(),
      content,
      sender: 'system',
      timestamp: new Date(),
      type: 'system'
    };
    setMessages(prev => [...prev, systemMessage]);
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      content: inputMessage.trim(),
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      let endpoint = '';
      let requestBody = {
        message: userMessage.content
      };

      if (chatMode === 'account' && selectedAccount) {
        // Account-specific mode - use smart chat with auto-detection
        endpoint = `${BaseURL}/api/v1/smart-chat/test-smart-ai`;
        // Smart AI will auto-detect the account context from the message
        console.log('Account mode - Smart AI will auto-detect context');
      } else {
        // General chat mode - also use smart chat for enhanced capabilities
        endpoint = `${BaseURL}/api/v1/smart-chat/test-smart-ai`;
        console.log('General mode - using Smart AI for enhanced capabilities');
      }

      const response = await axios.post(endpoint, requestBody, Authorization_header());

      if (response.data.success) {
        const aiMessage = {
          id: Date.now() + 1,
          content: response.data.data.response,
          sender: 'ai',
          timestamp: new Date(),
          type: 'text',
          metadata: response.data.data.metadata || {},
          sqlQuery: response.data.data.sqlQuery || null,
          downloadUrl: response.data.data.downloadUrl || null
        };

        // Store SQL query if available
        if (response.data.data.sqlQuery) {
          setLastSQLQuery(response.data.data.sqlQuery);
        }

        setMessages(prev => [...prev, aiMessage]);
      } else {
        throw new Error(response.data.error || 'Failed to get AI response');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: Date.now() + 1,
        content: `Sorry, I encountered an error: ${error.response?.data?.error || error.message}. Please try again.`,
        sender: 'ai',
        timestamp: new Date(),
        type: 'error'
      };
      setMessages(prev => [...prev, errorMessage]);
      toast.error('Failed to send message');
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

  const clearChat = () => {
    setMessages([]);
    setLastSQLQuery('');
    addSystemMessage(`🔄 Chat cleared. Currently in ${chatMode === 'account' ? 'Account Mode' : 'General Chat Mode'}.`);
  };

  const downloadResponse = async (downloadUrl) => {
    try {
      const response = await axios.get(downloadUrl, {
        ...Authorization_header(),
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `chat_response_${Date.now()}.txt`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Response downloaded successfully');
    } catch (error) {
      console.error('Error downloading response:', error);
      toast.error('Failed to download response');
    }
  };

  const renderMessage = (message) => {
    const isUser = message.sender === 'user';
    const isSystem = message.sender === 'system';
    const isError = message.type === 'error';

    return (
      <Box
        key={message.id}
        sx={{
          display: 'flex',
          justifyContent: isUser ? 'flex-end' : 'flex-start',
          mb: 1,
          px: 1
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: isUser ? 'row-reverse' : 'row',
            alignItems: 'flex-start',
            maxWidth: '85%',
            gap: 1
          }}
        >
          <Avatar
            sx={{
              width: 32,
              height: 32,
              bgcolor: isUser ? '#1976d2' : isSystem ? '#ff9800' : isError ? '#f44336' : '#4caf50',
              fontSize: '0.8rem'
            }}
          >
            {isUser ? 'U' : isSystem ? '⚙️' : '🤖'}
          </Avatar>
          
          <Paper
            elevation={1}
            sx={{
              p: 1.5,
              bgcolor: isUser ? '#e3f2fd' : isSystem ? '#fff3e0' : isError ? '#ffebee' : '#f1f8e9',
              border: isSystem ? '1px dashed #ff9800' : 'none',
              borderRadius: '12px',
              borderTopLeftRadius: isUser ? '12px' : '4px',
              borderTopRightRadius: isUser ? '4px' : '12px'
            }}
          >
            <Typography
              variant="body2"
              sx={{
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                lineHeight: 1.4,
                fontSize: '0.9rem'
              }}
            >
              {message.content}
            </Typography>
            
            {/* Action buttons for AI messages */}
            {!isUser && !isSystem && (
              <Box sx={{ mt: 1, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                {message.sqlQuery && (
                  <Tooltip title="View SQL Query">
                    <IconButton
                      size="small"
                      onClick={() => {
                        setLastSQLQuery(message.sqlQuery);
                        setShowSQLQuery(true);
                      }}
                      sx={{ color: '#666', '&:hover': { color: '#1976d2' } }}
                    >
                      <SQLIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
                
                {message.downloadUrl && (
                  <Tooltip title="Download Response">
                    <IconButton
                      size="small"
                      onClick={() => downloadResponse(message.downloadUrl)}
                      sx={{ color: '#666', '&:hover': { color: '#4caf50' } }}
                    >
                      <DownloadIcon fontSize="small" />
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
                color: 'text.secondary',
                fontSize: '0.7rem'
              }}
            >
              {message.timestamp.toLocaleTimeString()}
            </Typography>
          </Paper>
        </Box>
      </Box>
    );
  };

  if (!isOpen) {
    return (
      <Tooltip title="Open AI Chat Assistant">
        <IconButton
          onClick={() => setIsOpen(true)}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            bgcolor: '#1976d2',
            color: 'white',
            width: 60,
            height: 60,
            zIndex: 1000,
            boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
            '&:hover': {
              bgcolor: '#1565c0',
              transform: 'scale(1.05)'
            },
            transition: 'all 0.2s ease-in-out'
          }}
        >
          <ChatIcon fontSize="large" />
        </IconButton>
      </Tooltip>
    );
  }

  return (
    <Fade in={isOpen}>
      <Paper
        elevation={8}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          width: isMinimized ? 300 : 450,
          height: isMinimized ? 60 : 600,
          zIndex: 1000,
          borderRadius: '16px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          transition: 'all 0.3s ease-in-out'
        }}
      >
        {/* Header */}
        <Box
          sx={{
            bgcolor: '#1976d2',
            color: 'white',
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AIIcon />
            <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600 }}>
              AI Chat Assistant
            </Typography>
            <Chip
              size="small"
              label={chatMode === 'account' ? 'Account Mode' : 'General Chat'}
              sx={{
                bgcolor: chatMode === 'account' ? '#4caf50' : '#ff9800',
                color: 'white',
                fontSize: '0.7rem'
              }}
            />
          </Box>
          
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Tooltip title={isMinimized ? "Expand" : "Minimize"}>
              <IconButton
                size="small"
                onClick={() => setIsMinimized(!isMinimized)}
                sx={{ color: 'white' }}
              >
                {isMinimized ? <ExpandIcon /> : <MinimizeIcon />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Close">
              <IconButton
                size="small"
                onClick={() => setIsOpen(false)}
                sx={{ color: 'white' }}
              >
                <CloseIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Collapse in={!isMinimized}>
          {/* Account Selection */}
          <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderBottom: '1px solid #e0e0e0' }}>
            <FormControl fullWidth size="small">
              <InputLabel>Select Account (Optional)</InputLabel>
              <Select
                value={selectedAccount}
                label="Select Account (Optional)"
                onChange={(e) => handleAccountChange(e.target.value)}
                startAdornment={<AccountIcon sx={{ mr: 1, color: '#666' }} />}
              >
                <MenuItem value="">
                  <em>General Chat Mode</em>
                </MenuItem>
                {accounts.map((account) => (
                  <MenuItem key={account.companyId} value={account.companyId}>
                    {account.companyName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            {chatMode === 'account' && projects.length > 0 && (
              <Typography variant="caption" sx={{ mt: 1, display: 'block', color: '#666' }}>
                📊 {projects.length} project(s) available for analysis
              </Typography>
            )}
          </Box>

          {/* Messages */}
          <Box
            sx={{
              flex: 1,
              overflow: 'auto',
              p: 1,
              bgcolor: '#fafafa',
              maxHeight: '400px'
            }}
          >
            {messages.length === 0 && (
              <Box sx={{ textAlign: 'center', mt: 4, color: '#666' }}>
                <AIIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
                <Typography variant="body2">
                  {chatMode === 'account' 
                    ? '🏢 Ask me about your projects, budgets, KPIs, or any business data!'
                    : '🤖 Hello! I\'m your AI assistant. Ask me anything!'
                  }
                </Typography>
                <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                  {chatMode === 'account' 
                    ? 'I can generate SQL queries and analyze your data.'
                    : 'Try selecting an account above for data-specific queries.'
                  }
                </Typography>
              </Box>
            )}
            
            {messages.map(renderMessage)}
            
            {isLoading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                <CircularProgress size={24} />
                <Typography variant="body2" sx={{ ml: 1, color: '#666' }}>
                  AI is thinking...
                </Typography>
              </Box>
            )}
            
            <div ref={messagesEndRef} />
          </Box>

          {/* SQL Query Display */}
          <Collapse in={showSQLQuery && lastSQLQuery}>
            <Box sx={{ p: 2, bgcolor: '#263238', color: '#fff' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SQLIcon fontSize="small" />
                  Generated SQL Query
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => setShowSQLQuery(false)}
                  sx={{ color: 'white' }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
              <Paper
                sx={{
                  p: 1,
                  bgcolor: '#37474f',
                  color: '#4fc3f7',
                  fontFamily: 'monospace',
                  fontSize: '0.8rem',
                  overflow: 'auto'
                }}
              >
                {lastSQLQuery}
              </Paper>
            </Box>
          </Collapse>

          {/* Input Area */}
          <Box sx={{ p: 2, bgcolor: 'white', borderTop: '1px solid #e0e0e0' }}>
            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <TextField
                ref={chatInputRef}
                fullWidth
                size="small"
                placeholder={
                  chatMode === 'account' 
                    ? "Ask about budgets, projects, KPIs..." 
                    : "Ask me anything..."
                }
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                multiline
                maxRows={3}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '20px'
                  }
                }}
              />
              <Button
                variant="contained"
                size="small"
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading}
                sx={{
                  minWidth: 'auto',
                  borderRadius: '50%',
                  width: 40,
                  height: 40
                }}
              >
                <SendIcon fontSize="small" />
              </Button>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="caption" sx={{ color: '#666' }}>
                {chatMode === 'account' ? '🏢 Account Mode' : '🤖 General Chat'} • Press Enter to send
              </Typography>
              <Button
                size="small"
                onClick={clearChat}
                startIcon={<RefreshIcon />}
                sx={{ fontSize: '0.7rem' }}
              >
                Clear
              </Button>
            </Box>
          </Box>
        </Collapse>
      </Paper>
    </Fade>
  );
};

export default HomePageChatAssistant;