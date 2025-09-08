// AI Service for handling chat assistant API calls
import apiService from './apiService';

class AIService {
    constructor() {
        this.callTimeout = parseInt(process.env.REACT_APP_AI_CALL_TIMEOUT) || 360000;
        this.contextMaxLength = parseInt(process.env.REACT_APP_AI_CONTEXT_MAX_LENGTH) || 20000;
        this.retryWait = parseInt(process.env.REACT_APP_AI_RETRY_WAIT) || 6000;
        this.maxRetries = 3;
    }

    // Format conversation history for AI context
    formatConversationHistory(messages, maxLength = this.contextMaxLength) {
        if (!messages || messages.length === 0) {
            return [];
        }

        let totalLength = 0;
        const formattedMessages = [];
        
        // Start from the most recent messages and work backwards
        for (let i = messages.length - 1; i >= 0; i--) {
            const message = messages[i];
            const messageLength = message.text.length;
            
            if (totalLength + messageLength > maxLength) {
                break;
            }
            
            formattedMessages.unshift({
                sender: message.sender,
                text: message.text,
                timestamp: message.timestamp
            });
            totalLength += messageLength;
        }
        
        return formattedMessages;
    }

    // Make API call to backend chat endpoint with smart context detection
    async callAI(userMessage, conversationHistory, companyName, selectedProject) {
        const formattedHistory = this.formatConversationHistory(conversationHistory);
        
        // Use simplified payload for smart chat - it will auto-detect context
        const payload = {
            message: userMessage,
            conversationHistory: formattedHistory
        };

        let lastError = null;
        
        // Retry logic
        for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), this.callTimeout);

                console.log('🚀 Sending Smart AI request:', payload);

                // Use the new smart chat endpoint that auto-detects context
                const response = await fetch(`${apiService.baseURL}/api/v1/smart-chat/test-smart-ai`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();
                console.log('🎯 Smart AI response received:', result);

                if (result && result.data && result.data.response) {
                    return result.data.response;
                } else if (result && result.message) {
                    return result.message;
                } else {
                    throw new Error('Invalid response format from AI service');
                }

            } catch (error) {
                lastError = error;
                console.error(`AI API call attempt ${attempt} failed:`, error);
                
                if (attempt < this.maxRetries && error.name !== 'AbortError') {
                    console.log(`Retrying in ${this.retryWait}ms...`);
                    await new Promise(resolve => setTimeout(resolve, this.retryWait));
                } else {
                    console.error('All AI API call attempts failed');
                    break;
                }
            }
        }

        // Return fallback response if all attempts failed
        return this.getFallbackResponse(userMessage, selectedProject, lastError);
    }

    // Fallback response when AI service is unavailable
    getFallbackResponse(userMessage, selectedProject, error) {
        const projectContext = selectedProject 
            ? `\n\n*Note: Currently working with project "${selectedProject.name}" (${selectedProject.code})*`
            : '';

        const errorInfo = error?.name === 'AbortError' 
            ? 'The request timed out.' 
            : 'The AI service is temporarily unavailable.';

        return `I apologize, but I'm having trouble connecting to the AI service right now (${errorInfo}). 

However, I can still help you with general information about:
• Project management and status tracking
• Financial data and R&D expenses  
• Team and employee information
• Document management workflows
• Survey and interaction tracking
• R&D credit calculations

${selectedProject ? `For your selected project "${selectedProject.name}", you can:
• Check project status and timeline information
• Review team member assignments
• Access budget and expense data
• View document requirements and compliance status` : '💡 Select a project from the sidebar for project-specific assistance'}

Please try your question again, or contact support if the issue persists.${projectContext}`;
    }

    // Health check for AI service
    async checkHealth() {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout for health check

            const response = await fetch(`${apiService.baseURL}/health`, {
                method: 'GET',
                signal: controller.signal
            });

            clearTimeout(timeoutId);
            
            if (!response.ok) {
                return false;
            }

            const result = await response.json();
            return result && result.success;
        } catch (error) {
            console.error('AI service health check failed:', error);
            return false;
        }
    }
}

// Export singleton instance
const aiServiceInstance = new AIService();
export default aiServiceInstance;
