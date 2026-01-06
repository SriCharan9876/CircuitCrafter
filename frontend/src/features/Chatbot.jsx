import { useState, useRef, useEffect } from "react";
import { Fab, Paper, IconButton, TextField, Typography, Box, CircularProgress, Avatar } from "@mui/material";
import { Chat as ChatIcon, Close as CloseIcon, Send as SendIcon, SmartToy as BotIcon, Person as UserIcon } from "@mui/icons-material";
import { useAuth } from "../contexts/authContext";
import { useTheme } from "../contexts/themeContext";
import axios from "axios";

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const { token } = useAuth();
    const { theme } = useTheme(); // Get theme from context
    const hasFetchedHistory = useRef(false);

    const isDarkMode = theme === "dark-theme";

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen && token && !hasFetchedHistory.current) {
            const fetchHistory = async () => {
                try {
                    const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/ai/history`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    const formatted = res.data.history.map(h => ({
                        sender: h.role,
                        text: h.message
                    }));

                    if (formatted.length === 0) {
                        setMessages([{ sender: "bot", text: "Hi! How can I help you regarding CircuitCrafter today?" }]);
                    } else {
                        setMessages(formatted);
                    }
                    hasFetchedHistory.current = true;
                } catch (err) {
                    console.error("Failed to fetch chat history", err);
                    setMessages([{ sender: "bot", text: "Hi! How can I help you regarding CircuitCrafter today?" }]);
                }
            };
            fetchHistory();
        }
    }, [isOpen, token]);

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSendMessage = async () => {
        if (!inputValue.trim()) return;

        const userMessage = inputValue.trim();
        setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);
        setInputValue("");

        if (!token) {
            setTimeout(() => {
                setMessages((prev) => [
                    ...prev,
                    { sender: "bot", text: "I can only assist logged-in users. Please sign in to continue." }
                ]);
            }, 500);
            return;
        }

        setIsLoading(true);

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/api/ai/chat`,
                { message: userMessage },
                {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const botReply = response.data.reply;
            setMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
        } catch (error) {
            console.error("Error sending message:", error);
            setMessages((prev) => [
                ...prev,
                { sender: "bot", text: "Sorry, I'm having trouble connecting to the server." },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div style={{ position: "fixed", bottom: "30px", right: "30px", zIndex: 1200 }}>
            {isOpen && (
                <Paper
                    elevation={6}
                    sx={{
                        width: "380px",
                        height: "550px",
                        marginBottom: "20px",
                        display: "flex",
                        flexDirection: "column",
                        overflow: "hidden",
                        borderRadius: "20px",
                        boxShadow: isDarkMode ? "0 8px 32px rgba(0,0,0,0.5)" : "0 8px 32px rgba(0,0,0,0.15)",
                        border: isDarkMode ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(255,255,255,0.2)",
                        transition: "all 0.3s ease",
                        backgroundColor: isDarkMode ? "#1e1e1e" : "#ffffff", // Dark bg for paper
                        color: isDarkMode ? "#ffffff" : "text.primary"
                    }}
                >
                    {/* Header */}
                    <Box
                        sx={{
                            background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
                            color: "white",
                            padding: "16px 20px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 32, height: 32 }}>
                                <BotIcon fontSize="small" />
                            </Avatar>
                            <Typography variant="h6" sx={{ fontSize: "1.1rem", fontWeight: 600 }}>
                                AI Assistant
                            </Typography>
                        </Box>
                        <IconButton size="small" onClick={toggleChat} sx={{ color: "white", '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    {/* Messages Area */}
                    <Box
                        sx={{
                            flex: 1,
                            padding: "20px",
                            overflowY: "auto",
                            backgroundColor: isDarkMode ? "#121212" : "#f8f9fa", // Darker bg for message area
                            display: "flex",
                            flexDirection: "column",
                            gap: "12px",
                        }}
                    >
                        {messages.map((msg, index) => (
                            <Box
                                key={index}
                                sx={{
                                    alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                                    maxWidth: "85%",
                                    display: 'flex',
                                    gap: 1,
                                    flexDirection: msg.sender === "user" ? "row-reverse" : "row",
                                }}
                            >
                                <Box
                                    sx={{
                                        backgroundColor: msg.sender === "user"
                                            ? "#1976d2"
                                            : isDarkMode ? "#2c2c2c" : "white", // Dark grey for bot in dark mode
                                        color: msg.sender === "user"
                                            ? "white"
                                            : isDarkMode ? "#e0e0e0" : "#2c3e50", // Light text for bot in dark mode
                                        padding: "12px 16px",
                                        borderRadius: msg.sender === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                                        boxShadow: msg.sender === "user"
                                            ? "0 2px 8px rgba(25, 118, 210, 0.2)"
                                            : isDarkMode ? "0 2px 4px rgba(0,0,0,0.2)" : "0 2px 8px rgba(0,0,0,0.05)",
                                        wordWrap: "break-word",
                                        "& p": { margin: 0, lineHeight: 1.5 }
                                    }}
                                >
                                    <Typography variant="body2" sx={{ fontSize: "0.95rem" }}>{msg.text}</Typography>
                                </Box>
                            </Box>
                        ))}
                        {isLoading && (
                            <Box sx={{ alignSelf: "flex-start", marginLeft: "10px", marginTop: "10px" }}>
                                <CircularProgress size={24} sx={{ color: "#1976d2" }} />
                            </Box>
                        )}
                        <div ref={messagesEndRef} />
                    </Box>

                    {/* Input Area */}
                    <Box
                        sx={{
                            padding: "16px",
                            borderTop: isDarkMode ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.08)",
                            display: "flex",
                            alignItems: "center",
                            backgroundColor: isDarkMode ? "#1e1e1e" : "white",
                            gap: 1
                        }}
                    >
                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="Type a message..."
                            size="small"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyPress}
                            InputProps={{
                                style: { color: isDarkMode ? 'white' : 'inherit' }
                            }}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: "24px",
                                    backgroundColor: isDarkMode ? "#2c2c2c" : "#f8f9fa",
                                    "& fieldset": { border: "1px solid transparent" },
                                    "&:hover fieldset": { border: isDarkMode ? "1px solid #444" : "1px solid #e0e0e0" },
                                    "&.Mui-focused fieldset": { border: "1px solid #1976d2" }
                                }
                            }}
                        />
                        <IconButton
                            onClick={handleSendMessage}
                            disabled={isLoading || !inputValue.trim()}
                            sx={{
                                bgcolor: inputValue.trim() ? '#1976d2' : isDarkMode ? '#333' : '#f0f0f0',
                                color: inputValue.trim() ? 'white' : isDarkMode ? '#666' : '#a0a0a0',
                                '&:hover': { bgcolor: inputValue.trim() ? '#1565c0' : isDarkMode ? '#333' : '#f0f0f0' },
                                padding: '10px'
                            }}
                        >
                            <SendIcon fontSize="small" />
                        </IconButton>
                    </Box>
                </Paper>
            )}

            {/* Floating Action Button */}
            {!isOpen && (
                <Fab
                    color="primary"
                    aria-label="chat"
                    onClick={toggleChat}
                    sx={{
                        width: "60px",
                        height: "60px",
                        background: isDarkMode
                            ? "#121212"
                            : "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
                        color: isDarkMode ? "#1976d2" : "white",
                        border: isDarkMode ? "2px solid #1976d2" : "none",
                        boxShadow: isDarkMode
                            ? "0 4px 12px rgba(0,0,0,0.5)"
                            : "0 4px 12px rgba(25, 118, 210, 0.4)",
                        '&:hover': {
                            transform: 'scale(1.05)',
                            background: isDarkMode ? "#1e1e1e" : undefined
                        },
                        transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                    }}
                >
                    <ChatIcon />
                </Fab>
            )}
        </div>
    );
};

export default Chatbot;
